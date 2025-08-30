/**
 * PayTR Webhook Handler
 * Processes payment callbacks with idempotency and security
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient, validateAdminEnv } from '../../../../server/supabaseAdmin';
import { 
  assertPayTREnv, 
  verifyWebhookHash,
  generateEventId
} from '../../../../server/paytr';

// Force Node.js runtime for crypto operations
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface WebhookPayload {
  merchant_oid: string;
  status: string;
  total_amount: string;
  hash: string;
  failed_reason_code?: string;
  failed_reason_msg?: string;
  test_mode?: string;
  payment_type?: string;
  currency?: string;
  payment_amount?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Validate environment early
    validateAdminEnv();
    assertPayTREnv();

    const supabase = getAdminClient();

    // Parse form data from PayTR
    const formData = await request.formData();
    
    const payload: WebhookPayload = {
      merchant_oid: formData.get('merchant_oid') as string,
      status: formData.get('status') as string,
      total_amount: formData.get('total_amount') as string,
      hash: formData.get('hash') as string,
      failed_reason_code: formData.get('failed_reason_code') as string || undefined,
      failed_reason_msg: formData.get('failed_reason_msg') as string || undefined,
      test_mode: formData.get('test_mode') as string || undefined,
      payment_type: formData.get('payment_type') as string || undefined,
      currency: formData.get('currency') as string || undefined,
      payment_amount: formData.get('payment_amount') as string || undefined
    };

    // Validate required fields
    if (!payload.merchant_oid || !payload.status || !payload.total_amount || !payload.hash) {
      console.error('Missing required webhook fields:', payload);
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify PayTR signature
    if (!verifyWebhookHash(payload)) {
      console.error('Webhook hash verification failed:', {
        merchant_oid: payload.merchant_oid,
        status: payload.status,
        hash: payload.hash
      });
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Optional: Log source IP for security monitoring
    const sourceIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    console.log(`PayTR webhook from IP: ${sourceIp}`);

    // Generate deterministic event ID for idempotency
    const eventId = generateEventId(payload.merchant_oid, payload.status, payload.total_amount);

    // Try to insert webhook event (idempotency check)
    const { error: webhookInsertError } = await supabase
      .from('webhook_events')
      .insert({
        event_id: eventId,
        raw_payload: payload
      });

    // If event already exists, this is a duplicate webhook
    if (webhookInsertError && webhookInsertError.code === '23505') { // unique_violation
      console.log(`Duplicate webhook ignored: ${eventId}`);
      return new NextResponse('OK', { status: 200 });
    }

    if (webhookInsertError) {
      console.error('Failed to log webhook event:', webhookInsertError);
      // Continue processing - logging failure shouldn't block payment
    }

    // Find the payment record
    const { data: payment, error: paymentFindError } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', payload.merchant_oid)
      .single();

    if (paymentFindError || !payment) {
      console.error('Payment not found:', payload.merchant_oid, paymentFindError);
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Check if payment is already completed (idempotency)
    if (payment.status === 'completed') {
      console.log(`Payment already completed: ${payload.merchant_oid}`);
      return new NextResponse('OK', { status: 200 });
    }

    // Determine payment status from PayTR response
    const paymentStatus = payload.status === '1' ? 'completed' : 'failed';
    const completedAt = paymentStatus === 'completed' ? new Date().toISOString() : null;

    // Start transaction for atomic updates
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: paymentStatus,
        completed_at: completedAt,
        payment_response: {
          ...payment.payment_response,
          webhook_data: payload,
          webhook_received_at: new Date().toISOString()
        }
      })
      .eq('order_id', payload.merchant_oid);

    if (updateError) {
      console.error('Failed to update payment:', updateError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // If payment is successful, create/update subscription
    if (paymentStatus === 'completed') {
      const startDate = new Date();
      const endDate = new Date();

      // Calculate subscription end date
      if (payment.billing_cycle === 'yearly') {
        endDate.setFullYear(startDate.getFullYear() + 1);
      } else {
        endDate.setMonth(startDate.getMonth() + 1);
      }

      // Deactivate existing subscriptions for this user
      await supabase
        .from('subscriptions')
        .update({ is_active: false })
        .eq('user_id', payment.user_id);

      // Create new subscription
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: payment.user_id,
          plan_type: payment.plan_type,
          billing_cycle: payment.billing_cycle,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          is_active: true,
          auto_renew: true,
          payment_id: payment.id
        });

      if (subscriptionError) {
        console.error('Failed to create subscription:', subscriptionError);
        // Payment succeeded but subscription failed - needs manual intervention
        // Could send alert to admin here
      } else {
        console.log(`Subscription created for user ${payment.user_id}, plan: ${payment.plan_type}`);
      }
    }

    // Log successful webhook processing
    console.log(`Webhook processed successfully: ${payload.merchant_oid} -> ${paymentStatus}`);

    // PayTR requires 'OK' response
    return new NextResponse('OK', { status: 200 });

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    // Return 500 to PayTR so it retries the webhook
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}