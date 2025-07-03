import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!url || !key || url.includes('your-supabase') || key.includes('your-supabase')) {
    throw new Error('Supabase environment variables not configured')
  }
  
  return createBrowserClient(url, key)
}