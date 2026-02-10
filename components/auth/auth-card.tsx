"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"
import { Loader2, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInWithEmail, signUpWithEmail } from "@/lib/supabase-auth"

type AuthMode = "sign-in" | "register"

interface AuthCardProps {
  mode: AuthMode
}

export function AuthCard({ mode }: AuthCardProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const isRegister = mode === "register"

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    try {
      if (isRegister) {
        const payload = await signUpWithEmail(email, password)
        const needsVerification = !payload?.session

        toast.success(
          needsVerification
            ? "Account created. Check your email to verify your account."
            : "Account created successfully.",
        )
        router.push("/sign-in")
        return
      }

      await signInWithEmail(email, password)
      try {
        localStorage.setItem("resumeai-auth", "true")
        localStorage.setItem("resumeai-email", email)
      } catch {
        // Ignore storage errors in restricted environments.
      }
      toast.success("Signed in successfully.")
      router.push("/")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border border-border/70 shadow-lg">
      <CardHeader className="space-y-2 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent">
          <ShieldCheck className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="font-heading text-2xl">
          {isRegister ? "Create your account" : "Welcome back"}
        </CardTitle>
        <CardDescription>
          {isRegister
            ? "Secure registration powered by Supabase Auth."
            : "Sign in to continue your resume optimization workflow."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              minLength={8}
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : isRegister ? (
              "Create account"
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          {isRegister ? "Already registered?" : "Don’t have an account?"}{" "}
          <Link
            href={isRegister ? "/sign-in" : "/register"}
            className="font-heading text-foreground underline-offset-4 hover:underline"
          >
            {isRegister ? "Sign in" : "Create one"}
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
