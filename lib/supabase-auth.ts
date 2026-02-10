import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

export async function signUpWithEmail(email: string, password: string) {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    throw new Error(error.message || "Unable to register account.")
  }

  return data
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    throw new Error(error.message || "Unable to sign in.")
  }

  return data
}
