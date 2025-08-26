import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Paytr konfigürasyonu
const PAYTR_CONFIG = {
  merchant_id: process.env.PAYTR_MERCHANT_ID!,
  merchant_key: process.env.PAYTR_MERCHANT_KEY!,
  merchant_salt: process.env.PAYTR_MERCHANT_SALT!,
  test_mode: process.env.PAYTR_TEST_MODE === 'true' ? '1' : '0',
  currency: 'TL'
}

interface CreateOrderRequest {
  planType: 'personal' | 'professional' | 'enterprise'
  billingCycle: 'monthly' | 'yearly'
  userEmail: string
  userName: string
  userPhone?: string
}

// Plan fiyatları (USD cinsinden)
const PLAN_PRICES = {
  personal: { monthly: 3, yearly: 2.5 },
  professional: { monthly: 8, yearly: 6.67 },
  enterprise: { monthly: 15, yearly: 12.5 }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json()
    const { planType, billingCycle, userEmail, userName, userPhone } = body

    // Kullanıcı doğrulaması
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fiyat hesaplama
    const planPrice = PLAN_PRICES[planType][billingCycle]
    const totalMonths = billingCycle === 'yearly' ? 12 : 1
    const amount = (planPrice * totalMonths * 100).toString() // Kuruş cinsinden

    // Benzersiz sipariş ID oluştur
    const orderId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Paytr için gerekli parametreler
    const merchant_oid = orderId
    const email = userEmail
    const payment_amount = amount
    const user_name = userName
    const user_phone = userPhone || '5551234567' // Paytr zorunlu alan
    
    // Success ve fail URL'leri
    const ok_url = `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`
    const fail_url = `${process.env.NEXT_PUBLIC_APP_URL}/payment/failure`

    // Kullanıcı sepeti (tek ürün)
    const user_basket = JSON.stringify([
      [`${planType} Plan (${billingCycle})`, planPrice.toString(), 1]
    ])

    // Hash oluşturma (Paytr dokümantasyonuna göre)
    const hashStr = [
      PAYTR_CONFIG.merchant_id,
      user_phone,
      merchant_oid,
      email,
      payment_amount,
      user_basket,
      '1', // no_installment
      PAYTR_CONFIG.test_mode,
      PAYTR_CONFIG.currency,
      PAYTR_CONFIG.merchant_salt
    ].join('')

    const paytr_token = crypto
      .createHmac('sha256', PAYTR_CONFIG.merchant_key)
      .update(hashStr)
      .digest('base64')

    // Ödeme kaydını veritabanına ekle
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id: orderId,
        user_id: request.headers.get('X-User-ID'), // Frontend'den gönderilecek
        amount: planPrice * totalMonths,
        plan_type: planType,
        billing_cycle: billingCycle,
        status: 'pending',
        paytr_token
      })
      .select()
      .single()

    if (paymentError) {
      console.error('Payment insert error:', paymentError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Paytr'ye gönderilecek form data
    const formData = {
      merchant_id: PAYTR_CONFIG.merchant_id,
      user_ip: request.ip || '127.0.0.1',
      merchant_oid: merchant_oid,
      email: email,
      payment_amount: payment_amount,
      paytr_token: paytr_token,
      user_name: user_name,
      user_phone: user_phone,
      user_address: 'Turkey',
      user_city: 'Istanbul',
      user_country: 'Turkey',
      merchant_ok_url: ok_url,
      merchant_fail_url: fail_url,
      user_basket: user_basket,
      debug_on: PAYTR_CONFIG.test_mode,
      test_mode: PAYTR_CONFIG.test_mode,
      no_installment: '1',
      max_installment: '0',
      currency: PAYTR_CONFIG.currency,
      lang: 'tr'
    }

    // Paytr'ye istek gönder
    const paytrResponse = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(formData).toString()
    })

    const paytrResult = await paytrResponse.json()

    if (paytrResult.status !== 'success') {
      // Ödeme kaydını hata olarak güncelle
      await supabase
        .from('payments')
        .update({ 
          status: 'failed',
          payment_response: paytrResult
        })
        .eq('order_id', orderId)

      return NextResponse.json({ 
        error: 'Payment initiation failed',
        details: paytrResult 
      }, { status: 400 })
    }

    // Başarılı token alındı
    await supabase
      .from('payments')
      .update({ 
        payment_response: paytrResult
      })
      .eq('order_id', orderId)

    return NextResponse.json({
      success: true,
      paymentToken: paytrResult.token,
      orderId: orderId,
      amount: planPrice * totalMonths,
      planType,
      billingCycle
    })

  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}