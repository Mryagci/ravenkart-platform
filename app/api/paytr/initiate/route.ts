/**
 * PayTR Payment Initiation API
 * Creates payment request and returns PayTR token for frontend
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient, validateAdminEnv } from '../../../../server/supabaseAdmin';
import { 
  assertPayTREnv, 
  generateMerchantOid, 
  generatePayTRTokenHash,
  getPlanPrice,
  convertToKurus,
  PAYTR_ENDPOINTS,
  getPayTRConfig
} from '../../../../server/paytr';

// Force Node.js runtime for crypto and external requests
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface InitiatePaymentRequest {
  planType: 'personal' | 'professional' | 'enterprise';
  billingCycle: 'monthly' | 'yearly';
  userEmail: string;
  userName: string;
  userPhone?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Validate environment early
    validateAdminEnv();
    assertPayTREnv();

    const supabase = getAdminClient();
    const body: InitiatePaymentRequest = await request.json();
    
    const { planType, billingCycle, userEmail, userName, userPhone } = body;

    // Basic input validation
    if (!planType || !billingCycle || !userEmail || !userName) {
      return NextResponse.json(
        { error: 'Missing required fields: planType, billingCycle, userEmail, userName' },
        { status: 400 }
      );
    }

    // Get user ID from auth header (simplified - in production use proper auth)
    const userId = request.headers.get('X-User-ID');
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required. Missing X-User-ID header' },
        { status: 401 }
      );
    }

    // Calculate pricing
    const planPrice = getPlanPrice(planType, billingCycle);
    const paymentAmount = convertToKurus(planPrice);

    // Generate unique merchant order ID
    const merchantOid = generateMerchantOid(userId);

    // Get user IP (with proxy support)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const userIp = forwardedFor?.split(',')[0]?.trim() || 
                   request.headers.get('x-real-ip') || 
                   '127.0.0.1';

    // Prepare PayTR request parameters
    const config = getPayTRConfig();
    const userBasket = JSON.stringify([
      [`${planType} Plan (${billingCycle})`, planPrice.toString(), 1]
    ]);

    const paytrParams = {
      merchant_id: config.merchant_id!,
      user_ip: userIp,
      merchant_oid: merchantOid,
      email: userEmail,
      payment_amount: paymentAmount,
      user_basket: userBasket,
      no_installment: '1',
      max_installment: '0',
      test_mode: config.test_mode ? '1' : '0',
      currency: config.currency
    };

    // Generate PayTR token hash
    const paytrToken = generatePayTRTokenHash(paytrParams);

    // Store payment record as pending
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        order_id: merchantOid,
        amount: planPrice,
        currency: 'TRY',
        plan_type: planType,
        billing_cycle: billingCycle,
        status: 'pending',
        paytr_token: paytrToken
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Failed to create payment record:', paymentError);
      return NextResponse.json(
        { error: 'Failed to create payment record' },
        { status: 500 }
      );
    }

    // Prepare form data for PayTR API
    const formData = new URLSearchParams({
      merchant_id: config.merchant_id!,
      user_ip: userIp,
      merchant_oid: merchantOid,
      email: userEmail,
      payment_amount: paymentAmount,
      paytr_token: paytrToken,
      user_name: userName,
      user_phone: userPhone || '5551234567', // PayTR requires phone
      user_address: 'Turkey',
      user_city: 'Istanbul', 
      user_country: 'Turkey',
      merchant_ok_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      merchant_fail_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failure`,
      user_basket: userBasket,
      debug_on: config.test_mode ? '1' : '0',
      test_mode: config.test_mode ? '1' : '0',
      no_installment: '1',
      max_installment: '0',
      currency: config.currency,
      lang: 'tr'
    });

    // Request token from PayTR
    const paytrResponse = await fetch(PAYTR_ENDPOINTS.TOKEN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    const paytrResult = await paytrResponse.json();

    if (paytrResult.status !== 'success') {
      // Update payment record with error
      await supabase
        .from('payments')
        .update({
          status: 'failed',
          payment_response: paytrResult
        })
        .eq('order_id', merchantOid);

      console.error('PayTR token request failed:', paytrResult);
      return NextResponse.json(
        { 
          error: 'Payment initiation failed', 
          details: paytrResult.reason || 'Unknown error'
        },
        { status: 400 }
      );
    }

    // Update payment record with successful token
    await supabase
      .from('payments')
      .update({
        payment_response: paytrResult
      })
      .eq('order_id', merchantOid);

    // Return success response with payment details
    return NextResponse.json({
      success: true,
      paymentToken: paytrResult.token,
      iframeUrl: `${PAYTR_ENDPOINTS.IFRAME}/${paytrResult.token}`,
      orderId: merchantOid,
      amount: planPrice,
      planType,
      billingCycle,
      paymentId: payment.id
    });

  } catch (error) {
    console.error('Payment initiation error:', error);
    
    // Return appropriate error based on type
    if (error instanceof Error) {
      if (error.message.includes('environment')) {
        return NextResponse.json(
          { error: 'Server configuration error' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}