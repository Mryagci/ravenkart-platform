/**
 * Environment Variables Validation Script
 * Checks if all required environment variables are properly set
 */

require('dotenv').config({ path: '.env.local' });

console.log('🔍 Environment Variables Validation');
console.log('='.repeat(50));

/**
 * Check Supabase Environment
 */
function validateSupabase() {
  console.log('\n📊 Supabase Configuration');
  
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let supabaseValid = true;

  // Check URL
  if (!url) {
    console.log('   ❌ SUPABASE_URL: Missing');
    supabaseValid = false;
  } else if (!url.includes('.supabase.co')) {
    console.log('   ⚠️  SUPABASE_URL: Invalid format');
    supabaseValid = false;
  } else {
    console.log('   ✅ SUPABASE_URL: Valid');
  }

  // Check Service Role Key  
  if (!serviceKey) {
    console.log('   ❌ SUPABASE_SERVICE_ROLE_KEY: Missing');
    supabaseValid = false;
  } else if (!serviceKey.startsWith('eyJ')) {
    console.log('   ⚠️  SUPABASE_SERVICE_ROLE_KEY: Invalid JWT format');
    supabaseValid = false;
  } else {
    // Try to decode JWT
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.decode(serviceKey);
      if (decoded && decoded.role === 'service_role') {
        console.log('   ✅ SUPABASE_SERVICE_ROLE_KEY: Valid service role');
      } else {
        console.log('   ⚠️  SUPABASE_SERVICE_ROLE_KEY: Not service_role JWT');
        supabaseValid = false;
      }
    } catch (error) {
      console.log('   ❌ SUPABASE_SERVICE_ROLE_KEY: Invalid JWT');
      supabaseValid = false;
    }
  }

  // Check Public Keys
  if (!publicUrl || !anonKey) {
    console.log('   ⚠️  Public keys missing (needed for frontend)');
  } else {
    console.log('   ✅ Public keys: Present');
  }

  return supabaseValid;
}

/**
 * Check PayTR Environment
 */  
function validatePayTR() {
  console.log('\n💳 PayTR Configuration');
  
  const merchantId = process.env.PAYTR_MERCHANT_ID;
  const merchantKey = process.env.PAYTR_MERCHANT_KEY; 
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT;
  const testMode = process.env.PAYTR_TEST_MODE;

  let paytrValid = true;

  // Check Merchant ID
  if (!merchantId) {
    console.log('   ❌ PAYTR_MERCHANT_ID: Missing');
    paytrValid = false;
  } else if (merchantId.length < 3) {
    console.log('   ⚠️  PAYTR_MERCHANT_ID: Too short');
    paytrValid = false;
  } else {
    console.log('   ✅ PAYTR_MERCHANT_ID: Present');
  }

  // Check Merchant Key
  if (!merchantKey) {
    console.log('   ❌ PAYTR_MERCHANT_KEY: Missing');
    paytrValid = false;
  } else if (merchantKey.length < 10) {
    console.log('   ⚠️  PAYTR_MERCHANT_KEY: Too short');
    paytrValid = false;
  } else {
    console.log('   ✅ PAYTR_MERCHANT_KEY: Present');
  }

  // Check Merchant Salt
  if (!merchantSalt) {
    console.log('   ❌ PAYTR_MERCHANT_SALT: Missing');
    paytrValid = false;
  } else if (merchantSalt.length < 10) {
    console.log('   ⚠️  PAYTR_MERCHANT_SALT: Too short');
    paytrValid = false;
  } else {
    console.log('   ✅ PAYTR_MERCHANT_SALT: Present');
  }

  // Check Test Mode
  console.log(`   📋 Test Mode: ${testMode === 'true' ? '✅ Enabled' : '⚠️  Disabled'}`);

  return paytrValid;
}

/**
 * Check App Configuration
 */
function validateApp() {
  console.log('\n🏠 App Configuration');
  
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const nextAuthSecret = process.env.NEXTAUTH_SECRET;

  let appValid = true;

  if (!appUrl) {
    console.log('   ❌ NEXT_PUBLIC_APP_URL: Missing');
    appValid = false;
  } else {
    console.log('   ✅ NEXT_PUBLIC_APP_URL:', appUrl);
  }

  if (!nextAuthSecret) {
    console.log('   ⚠️  NEXTAUTH_SECRET: Missing (optional)');
  } else {
    console.log('   ✅ NEXTAUTH_SECRET: Present');
  }

  return appValid;
}

/**
 * Test Hash Generation
 */
function testHashGeneration() {
  console.log('\n🔐 Hash Generation Test');
  
  try {
    const crypto = require('crypto');
    const testString = 'test_hash_generation';
    const testKey = process.env.PAYTR_MERCHANT_KEY || 'test_key';
    
    const hash = crypto
      .createHmac('sha256', testKey)
      .update(testString)
      .digest('base64');
    
    console.log('   ✅ Hash generation: Working');
    console.log(`   📋 Sample hash: ${hash.substring(0, 20)}...`);
    return true;
  } catch (error) {
    console.log('   ❌ Hash generation: Failed -', error.message);
    return false;
  }
}

/**
 * Main validation
 */
function runValidation() {
  const results = {
    supabase: validateSupabase(),
    paytr: validatePayTR(),
    app: validateApp(),
    hash: testHashGeneration()
  };

  console.log('\n📊 Validation Summary');
  console.log('='.repeat(50));
  
  console.log(`📊 Supabase: ${results.supabase ? '✅ READY' : '❌ NEEDS SETUP'}`);
  console.log(`💳 PayTR: ${results.paytr ? '✅ READY' : '❌ NEEDS SETUP'}`);
  console.log(`🏠 App Config: ${results.app ? '✅ READY' : '❌ NEEDS SETUP'}`);
  console.log(`🔐 Crypto: ${results.hash ? '✅ WORKING' : '❌ BROKEN'}`);

  const allReady = results.supabase && results.paytr && results.app && results.hash;
  
  console.log(`\n🎯 Overall Status: ${allReady ? '✅ PRODUCTION READY' : '⚠️  NEEDS CONFIGURATION'}`);

  if (!allReady) {
    console.log('\n📋 Next Steps:');
    if (!results.supabase) {
      console.log('1. Get Supabase Service Role Key from Dashboard');
    }
    if (!results.paytr) {
      console.log('2. Get PayTR credentials from Dashboard');  
    }
    if (!results.app) {
      console.log('3. Set app configuration variables');
    }
    console.log('4. Run validation again');
  } else {
    console.log('\n🚀 Ready to test PayTR integration!');
    console.log('   Run: npm run dev');
    console.log('   Test: curl -X POST http://localhost:3000/api/paytr/initiate -d \'{"planType":"personal","billingCycle":"monthly","userEmail":"test@test.com","userName":"Test"}\'');
  }

  return allReady;
}

// Install jsonwebtoken if not available
try {
  require('jsonwebtoken');
} catch (error) {
  console.log('📦 Installing jsonwebtoken for JWT validation...');
  require('child_process').execSync('npm install jsonwebtoken --save-dev', { stdio: 'inherit' });
}

runValidation();