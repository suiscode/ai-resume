const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function assertSupabaseConfig() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase auth is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    )
  }
}

async function parseSupabaseError(response: Response, fallback: string) {
  const body = (await response.json().catch(() => null)) as
    | { msg?: string; error_description?: string; message?: string }
    | null

  return body?.msg ?? body?.error_description ?? body?.message ?? fallback
}

export async function signUpWithEmail(email: string, password: string) {
  assertSupabaseConfig()

  const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
    method: "POST",
    headers: {
      apikey: supabaseAnonKey!,
      Authorization: `Bearer ${supabaseAnonKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error(await parseSupabaseError(response, "Unable to register account."))
  }

  return response.json()
}

export async function signInWithEmail(email: string, password: string) {
  assertSupabaseConfig()

  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: supabaseAnonKey!,
      Authorization: `Bearer ${supabaseAnonKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error(await parseSupabaseError(response, "Unable to sign in."))
  }

  return response.json()
}
