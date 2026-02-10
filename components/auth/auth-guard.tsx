"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    let authed = false
    try {
      authed = localStorage.getItem("resumeai-auth") === "true"
    } catch {
      authed = false
    }

    if (!authed) {
      router.replace("/sign-in")
      setIsAuthed(false)
      return
    }

    setIsAuthed(true)
  }, [router])

  if (!isAuthed) {
    return null
  }

  return <>{children}</>
}
