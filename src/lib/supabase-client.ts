import { createClient } from '@supabase/supabase-js'

// Environment variable validation
function validateSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is required')
  }
  if (!anonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
  }

  return { url, anonKey }
}

// Safe Supabase client creation
export function createSupabaseClient() {
  try {
    const { url, anonKey } = validateSupabaseEnv()
    return createClient(url, anonKey)
  } catch (error) {
    console.error('Supabase client creation failed:', error)
    // Return null instead of throwing to prevent build failures
    return null
  }
}

// Build-time safe client creation 
export function createSupabaseClientSafe() {
  // During build, environment variables might not be available
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
    return null
  }
  return createSupabaseClient()
}