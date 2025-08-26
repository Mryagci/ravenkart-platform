/**
 * Supabase Admin Client - Server-side only
 * Uses service role key for bypassing RLS when needed
 */

import { createClient } from '@supabase/supabase-js';

let adminClient: ReturnType<typeof createClient> | null = null;

export function getAdminClient() {
  // Cache the client to avoid recreating
  if (adminClient) {
    return adminClient;
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    throw new Error(
      'Missing Supabase admin environment variables. ' +
      'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.'
    );
  }

  adminClient = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  return adminClient;
}

/**
 * Validate that admin credentials are available
 * Call this early to fail fast if env is missing
 */
export function validateAdminEnv(): void {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url) {
    throw new Error('SUPABASE_URL environment variable is required');
  }
  
  if (!key) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  }

  // Basic format validation
  if (!url.startsWith('https://') || !url.includes('.supabase.co')) {
    throw new Error('SUPABASE_URL appears to be invalid format');
  }

  if (!key.startsWith('eyJ')) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY appears to be invalid JWT format');
  }
}