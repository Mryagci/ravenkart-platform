import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const PAYTR_CONFIG = {
  merchant_key: process.env.PAYTR_MERCHANT_KEY!,
  merchant_salt: process.env.PAYTR_MERCHANT_SALT!
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const merchant_oid = formData.get('merchant_oid') as string
    const status = formData.get('status') as string
    const total_amount = formData.get('total_amount') as string
    const hash = formData.get('hash') as string
    const failed_reason_code = formData.get('failed_reason_code') as string
    const failed_reason_msg = formData.get('failed_reason_msg') as string
    const test_mode = formData.get('test_mode') as string
    const payment_type = formData.get('payment_type') as string
    const currency = formData.get('currency') as string
    const payment_amount = formData.get('payment_amount') as string

    // Hash doğrulama
    const hashStr = [
      merchant_oid,
      PAYTR_CONFIG.merchant_salt,
      status,
      total_amount
    ].join('')

    const calculatedHash = crypto
      .createHmac('sha256', PAYTR_CONFIG.merchant_key)
      .update(hashStr)
      .digest('base64')

    if (calculatedHash !== hash) {
      console.error('Hash verification failed')
      return NextResponse.json({ error: 'Invalid hash' }, { status: 400 })
    }

    // Ödeme kaydını bul
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', merchant_oid)
      .single()

    if (paymentError || !payment) {
      console.error('Payment not found:', merchant_oid)
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    // Ödeme durumunu güncelle
    let paymentStatus = 'failed'
    if (status === '1') {
      paymentStatus = 'completed'
    }

    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: paymentStatus,
        completed_at: paymentStatus === 'completed' ? new Date().toISOString() : null,
        payment_response: {
          status,
          total_amount,
          failed_reason_code,
          failed_reason_msg,
          test_mode,
          payment_type,
          currency,
          payment_amount,
          callback_received_at: new Date().toISOString()
        }
      })
      .eq('order_id', merchant_oid)

    if (updateError) {
      console.error('Payment update error:', updateError)
      return NextResponse.json({ error: 'Update failed' }, { status: 500 })
    }

    // Başarılı ödeme ise aboneliği oluştur/güncelle
    if (paymentStatus === 'completed') {
      const startDate = new Date()
      const endDate = new Date()
      
      // Fatura dönemine göre bitiş tarihi hesapla
      if (payment.billing_cycle === 'yearly') {
        endDate.setFullYear(startDate.getFullYear() + 1)
      } else {
        endDate.setMonth(startDate.getMonth() + 1)
      }

      // Mevcut aboneliği pasif yap
      await supabase
        .from('subscriptions')
        .update({ is_active: false })
        .eq('user_id', payment.user_id)

      // Yeni abonelik oluştur
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: payment.user_id,
          plan_type: payment.plan_type,
          billing_cycle: payment.billing_cycle,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          is_active: true,
          payment_id: payment.id
        })

      if (subscriptionError) {
        console.error('Subscription create error:', subscriptionError)
        // Ödeme başarılı ama abonelik oluşturulamadı, manuel müdahale gerekebilir
      }
    }

    // Paytr'ye OK yanıt ver (zorunlu)
    return new NextResponse('OK', { status: 200 })

  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
