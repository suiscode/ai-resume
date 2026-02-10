"use client"

import Link from "next/link"
import { FileText, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useEffect, useState } from "react"

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isAuthed, setIsAuthed] = useState(false)

  const handleLogout = () => {
    try {
      localStorage.removeItem("resumeai-auth")
      localStorage.removeItem("resumeai-email")
    } catch {
      // Ignore storage errors in restricted environments.
    }
    setIsAuthed(false)
  }

  useEffect(() => {
    const readAuth = () => {
      try {
        return localStorage.getItem("resumeai-auth") === "true"
      } catch {
        return false
      }
    }

    setIsAuthed(readAuth())

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "resumeai-auth") {
        setIsAuthed(event.newValue === "true")
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-bold tracking-tight text-foreground">
            ResumeAI
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-heading text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/upload"
            className="text-sm font-heading text-muted-foreground transition-colors hover:text-foreground"
          >
            Upload
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-heading text-muted-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {isAuthed ? (
            <>
              <Button asChild size="sm">
                <Link href="/dashboard">Profile</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="text-sm font-heading text-muted-foreground"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/upload"
              className="text-sm font-heading text-muted-foreground"
              onClick={() => setMobileOpen(false)}
            >
              Upload
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-heading text-muted-foreground"
              onClick={() => setMobileOpen(false)}
            >
              Dashboard
            </Link>
            <div className="flex flex-col gap-2 pt-2">
              {isAuthed ? (
                <>
                  <Button asChild size="sm">
                    <Link href="/dashboard">Profile</Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
