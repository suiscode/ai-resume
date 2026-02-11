"use client"

import { useEffect, useMemo, useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

export default function SettingsPage() {
  const [fullName, setFullName] = useState("")
  const [initialFullName, setInitialFullName] = useState("")
  const [email, setEmail] = useState("")
  const [initialEmail, setInitialEmail] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [initialJobTitle, setInitialJobTitle] = useState("")
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const isDirty = useMemo(() => {
    return (
      email.trim() !== initialEmail.trim() ||
      fullName.trim() !== initialFullName.trim() ||
      jobTitle.trim() !== initialJobTitle.trim()
    )
  }, [email, fullName, jobTitle, initialEmail, initialFullName, initialJobTitle])

  useEffect(() => {
    const loadSettings = async () => {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session?.user) {
        toast.error("Please sign in again to manage settings.")
        setLoading(false)
        return
      }

      const user = data.session.user
      setUserId(user.id)
      setEmail(user.email ?? "")
      setInitialEmail(user.email ?? "")

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name,job_title")
        .eq("user_id", user.id)
        .maybeSingle()

      if (profileError) {
        toast.error("Could not load profile details.")
      } else {
        const loadedFullName = profile?.full_name ?? ""
        const loadedJobTitle = profile?.job_title ?? ""
        setFullName(loadedFullName)
        setInitialFullName(loadedFullName)
        setJobTitle(loadedJobTitle)
        setInitialJobTitle(loadedJobTitle)
      }

      setLoading(false)
    }

    void loadSettings()
  }, [])

  const handleSave = async () => {
    if (!userId) {
      toast.error("You must be signed in to update settings.")
      return
    }

    setSaving(true)
    const supabase = getSupabaseBrowserClient()
    const nextEmail = email.trim()
    const nextFullName = fullName.trim()
    const nextJobTitle = jobTitle.trim()
    const emailChanged = nextEmail !== initialEmail.trim()

    try {
      if (emailChanged) {
        const { error: updateEmailError } = await supabase.auth.updateUser({ email: nextEmail })
        if (updateEmailError) {
          throw new Error(updateEmailError.message || "Unable to update email.")
        }
      }

      const { error: profileSaveError } = await supabase.from("profiles").upsert(
        {
          user_id: userId,
          full_name: nextFullName || null,
          job_title: nextJobTitle || null,
        },
        { onConflict: "user_id" },
      )

      if (profileSaveError) {
        throw new Error(profileSaveError.message || "Unable to save profile.")
      }

      if (emailChanged) {
        setInitialEmail(nextEmail)
      }

      setInitialFullName(nextFullName)
      setInitialJobTitle(nextJobTitle)
      toast.success(
        emailChanged
          ? "Settings saved. Check your inbox to confirm your new email."
          : "Settings saved.",
      )
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save settings.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="border border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading text-lg text-card-foreground">Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  disabled={loading || saving}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={loading || saving}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={jobTitle}
                onChange={(event) => setJobTitle(event.target.value)}
                disabled={loading || saving}
              />
            </div>
            <Button
              className="self-start"
              onClick={handleSave}
              disabled={loading || saving || !isDirty}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : loading ? (
                "Loading..."
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardContent>
        </Card>

   
      </div>
    </div>
  )
}
