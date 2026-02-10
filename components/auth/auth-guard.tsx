"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()

    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error || !data.session) {
        router.replace("/sign-in")
        setIsAuthed(false)
        return
      }

      setIsAuthed(true)
    }

    void checkSession()

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/sign-in")
        setIsAuthed(false)
        return
      }

      setIsAuthed(true)
    })

    return () => {
      subscription.subscription.unsubscribe()
    }
  }, [router])

  if (!isAuthed) {
    return null
  }

  return <>{children}</>
}
