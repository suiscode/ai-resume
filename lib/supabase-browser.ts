import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let browserClient: SupabaseClient | null = null

function assertSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase auth is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    )
  }

  return { supabaseUrl, supabaseAnonKey }
}

export function getSupabaseBrowserClient() {
  if (browserClient) {
    return browserClient
  }

  const { supabaseUrl, supabaseAnonKey } = assertSupabaseConfig()
  browserClient = createClient(supabaseUrl, supabaseAnonKey)

  return browserClient
}
