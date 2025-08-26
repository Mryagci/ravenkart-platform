/**
 * PayTR Integration Utilities
 * Handles token generation, hash validation, and merchant operations
 */

import crypto from 'crypto';

// PayTR Configuration
const PAYTR_CONFIG = {
  merchant_id: process.env.PAYTR_MERCHANT_ID,
  merchant_key: process.env.PAYTR_MERCHANT_KEY,
  merchant_salt: process.env.PAYTR_MERCHANT_SALT,
  test_mode: process.env.PAYTR_TEST_MODE === 'true',
  currency: 'TL'
} as const;

/**
 * Validate PayTR environment variables
 * Call this early to fail fast if credentials are missing
 */
export function assertPayTREnv(): void {
  const { merchant_id, merchant_key, merchant_salt } = PAYTR_CONFIG;
  
  if (!merchant_id) {
    throw new Error('PAYTR_MERCHANT_ID environment variable is required');
  }
  
  if (!merchant_key) {
    throw new Error('PAYTR_MERCHANT_KEY environment variable is required');
  }
  
  if (!merchant_salt) {
    throw new Error('PAYTR_MERCHANT_SALT environment variable is required');
  }

  // Basic format validation
  if (merchant_id.length < 5) {
    throw new Error('PAYTR_MERCHANT_ID appears to be too short');
  }

  if (merchant_key.length < 10) {
    throw new Error('PAYTR_MERCHANT_KEY appears to be too short');
  }

  if (merchant_salt.length < 10) {
    throw new Error('PAYTR_MERCHANT_SALT appears to be too short');
  }
}

/**
 * Generate deterministic merchant order ID
 * Format: userId_timestamp_randomHex
 */
export function generateMerchantOid(userId: string): string {
  const timestamp = Date.now();
  const randomHex = crypto.randomBytes(6).toString('hex');
  return `${userId}_${timestamp}_${randomHex}`;
}

/**
 * Generate PayTR payment token hash
 * According to PayTR documentation: https://www.paytr.com/entegrasyon
 */
export function generatePayTRTokenHash(params: {
  merchant_id: string;
  user_ip: string;
  merchant_oid: string;
  email: string;
  payment_amount: string;
  user_basket: string;
  no_installment: string;
  max_installment: string;
  test_mode: string;
  currency: string;
}): string {
  const {
    merchant_id,
    user_ip, 
    merchant_oid,
    email,
    payment_amount,
    user_basket,
    no_installment,
    max_installment,
    test_mode,
    currency
  } = params;

  // PayTR hash string construction (exact order matters!)
  const hashString = [
    merchant_id,
    user_ip,
    merchant_oid,
    email,
    payment_amount,
    user_basket,
    no_installment,
    max_installment,
    test_mode,
    currency,
    PAYTR_CONFIG.merchant_salt
  ].join('');

  // Generate HMAC-SHA256 hash with merchant key
  return crypto
    .createHmac('sha256', PAYTR_CONFIG.merchant_key!)
    .update(hashString)
    .digest('base64');
}

/**
 * Verify PayTR webhook signature
 * According to PayTR callback documentation
 */
export function verifyWebhookHash(payload: {
  merchant_oid: string;
  status: string;
  total_amount: string;
  hash: string;
}): boolean {
  try {
    const { merchant_oid, status, total_amount, hash } = payload;

    // PayTR webhook hash construction
    const hashString = [
      merchant_oid,
      PAYTR_CONFIG.merchant_salt,
      status,
      total_amount
    ].join('');

    // Calculate expected hash
    const expectedHash = crypto
      .createHmac('sha256', PAYTR_CONFIG.merchant_key!)
      .update(hashString)
      .digest('base64');

    return expectedHash === hash;
  } catch (error) {
    console.error('Webhook hash verification error:', error);
    return false;
  }
}

/**
 * Generate deterministic event ID for webhook idempotency
 * Format: merchant_oid-status-amount
 */
export function generateEventId(merchant_oid: string, status: string, total_amount: string): string {
  return `${merchant_oid}-${status}-${total_amount}`;
}

/**
 * Get PayTR configuration (safe for logging)
 */
export function getPayTRConfig() {
  return {
    merchant_id: PAYTR_CONFIG.merchant_id,
    test_mode: PAYTR_CONFIG.test_mode,
    currency: PAYTR_CONFIG.currency,
    // Never expose sensitive keys
    has_merchant_key: !!PAYTR_CONFIG.merchant_key,
    has_merchant_salt: !!PAYTR_CONFIG.merchant_salt
  };
}

/**
 * PayTR API endpoints
 */
export const PAYTR_ENDPOINTS = {
  TOKEN: 'https://www.paytr.com/odeme/api/get-token',
  IFRAME: 'https://www.paytr.com/odeme/guvenli'
} as const;

/**
 * Plan pricing configuration (in TRY)
 * Note: PayTR expects amounts in kuruş (multiply by 100)
 */
export const PLAN_PRICES = {
  personal: { 
    monthly: 30.00,  // 30 TL 
    yearly: 300.00   // 300 TL (17% discount)
  },
  professional: { 
    monthly: 80.00,  // 80 TL
    yearly: 800.00   // 800 TL (17% discount) 
  },
  enterprise: {
    monthly: 150.00, // 150 TL
    yearly: 1500.00  // 1500 TL (17% discount)
  }
} as const;

/**
 * Convert TRY amount to kuruş for PayTR
 */
export function convertToKurus(amount: number): string {
  return Math.round(amount * 100).toString();
}

/**
 * Get plan price in TRY
 */
export function getPlanPrice(planType: keyof typeof PLAN_PRICES, billingCycle: 'monthly' | 'yearly'): number {
  const planPrices = PLAN_PRICES[planType];
  if (!planPrices) {
    throw new Error(`Invalid plan type: ${planType}`);
  }
  
  return planPrices[billingCycle];
}