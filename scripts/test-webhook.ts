/**
 * PayTR Webhook Test Script
 * Simulates webhook calls for testing idempotency and validation
 */

import crypto from 'crypto';

// Test configuration
const WEBHOOK_URL = 'http://localhost:3000/api/paytr/webhook';

// Mock PayTR credentials (use your actual test values)
const TEST_CONFIG = {
  merchant_key: process.env.PAYTR_MERCHANT_KEY || 'test_key',
  merchant_salt: process.env.PAYTR_MERCHANT_SALT || 'test_salt'
};

/**
 * Generate PayTR webhook hash for testing
 */
function generateWebhookHash(merchant_oid: string, status: string, total_amount: string): string {
  const hashString = [
    merchant_oid,
    TEST_CONFIG.merchant_salt,
    status,
    total_amount
  ].join('');

  return crypto
    .createHmac('sha256', TEST_CONFIG.merchant_key)
    .update(hashString)
    .digest('base64');
}

/**
 * Send webhook to local API
 */
async function sendWebhook(payload: Record<string, string>) {
  const formData = new URLSearchParams(payload);
  
  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString()
  });

  return {
    status: response.status,
    statusText: response.statusText,
    body: await response.text()
  };
}

/**
 * Test successful payment webhook
 */
async function testSuccessfulPayment() {
  console.log('\n🧪 Testing successful payment webhook...');
  
  const merchant_oid = `user123_${Date.now()}_abc123`;
  const status = '1'; // Success
  const total_amount = '3000'; // 30.00 TRY in kuruş
  
  const hash = generateWebhookHash(merchant_oid, status, total_amount);
  
  const payload = {
    merchant_oid,
    status,
    total_amount,
    hash,
    payment_type: 'card',
    currency: 'TL',
    test_mode: '1'
  };

  const result = await sendWebhook(payload);
  console.log(`✅ Success webhook: ${result.status} ${result.statusText}`);
  console.log(`Response: ${result.body}`);
  
  return { merchant_oid, success: result.status === 200 };
}

/**
 * Test failed payment webhook
 */
async function testFailedPayment() {
  console.log('\n🧪 Testing failed payment webhook...');
  
  const merchant_oid = `user456_${Date.now()}_def456`;
  const status = '0'; // Failed
  const total_amount = '8000'; // 80.00 TRY in kuruş
  
  const hash = generateWebhookHash(merchant_oid, status, total_amount);
  
  const payload = {
    merchant_oid,
    status,
    total_amount,
    hash,
    failed_reason_code: '51',
    failed_reason_msg: 'Insufficient funds',
    payment_type: 'card',
    currency: 'TL',
    test_mode: '1'
  };

  const result = await sendWebhook(payload);
  console.log(`❌ Failed webhook: ${result.status} ${result.statusText}`);
  console.log(`Response: ${result.body}`);
  
  return { merchant_oid, success: result.status === 200 };
}

/**
 * Test invalid hash (should be rejected)
 */
async function testInvalidHash() {
  console.log('\n🧪 Testing invalid hash rejection...');
  
  const merchant_oid = `user789_${Date.now()}_ghi789`;
  const status = '1';
  const total_amount = '15000';
  
  const payload = {
    merchant_oid,
    status,
    total_amount,
    hash: 'invalid_hash_should_be_rejected', // Wrong hash
    payment_type: 'card',
    currency: 'TL',
    test_mode: '1'
  };

  const result = await sendWebhook(payload);
  console.log(`🚫 Invalid hash: ${result.status} ${result.statusText}`);
  console.log(`Response: ${result.body}`);
  
  return { merchant_oid, success: result.status === 401 }; // Should be rejected
}

/**
 * Test idempotency (duplicate webhook)
 */
async function testIdempotency(merchant_oid: string) {
  console.log('\n🧪 Testing idempotency (duplicate webhook)...');
  
  const status = '1';
  const total_amount = '3000';
  const hash = generateWebhookHash(merchant_oid, status, total_amount);
  
  const payload = {
    merchant_oid,
    status,
    total_amount,
    hash,
    payment_type: 'card',
    currency: 'TL',
    test_mode: '1'
  };

  const result = await sendWebhook(payload);
  console.log(`🔄 Duplicate webhook: ${result.status} ${result.statusText}`);
  console.log(`Response: ${result.body}`);
  
  return result.status === 200; // Should still return OK
}

/**
 * Test database state verification
 */
async function verifyDatabaseState() {
  console.log('\n🧪 Database state verification would go here...');
  console.log('In a real test, you would:');
  console.log('1. Check payments table for correct status updates');
  console.log('2. Check subscriptions table for new/updated records');  
  console.log('3. Check webhook_events table for proper logging');
  console.log('4. Verify no sensitive data is stored');
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('🚀 PayTR Webhook Test Suite Starting...');
  console.log('='.repeat(50));

  try {
    // Test 1: Successful payment
    const successTest = await testSuccessfulPayment();
    
    // Test 2: Failed payment
    const failedTest = await testFailedPayment();
    
    // Test 3: Invalid hash rejection
    const invalidHashTest = await testInvalidHash();
    
    // Test 4: Idempotency with first successful payment
    let idempotencyTest = { success: false };
    if (successTest.success) {
      idempotencyTest.success = await testIdempotency(successTest.merchant_oid);
    }
    
    // Test 5: Database verification
    await verifyDatabaseState();

    // Summary
    console.log('\n📊 Test Results Summary');
    console.log('='.repeat(50));
    console.log(`✅ Successful payment: ${successTest.success ? 'PASS' : 'FAIL'}`);
    console.log(`❌ Failed payment: ${failedTest.success ? 'PASS' : 'FAIL'}`);
    console.log(`🚫 Invalid hash rejection: ${invalidHashTest.success ? 'PASS' : 'FAIL'}`);
    console.log(`🔄 Idempotency: ${idempotencyTest.success ? 'PASS' : 'FAIL'}`);

    const allPassed = successTest.success && 
                     failedTest.success && 
                     invalidHashTest.success && 
                     idempotencyTest.success;

    console.log(`\n🎯 Overall: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

// Run tests if called directly
if (require.main === module) {
  runTests();
}

export { runTests, testSuccessfulPayment, testFailedPayment, testInvalidHash };