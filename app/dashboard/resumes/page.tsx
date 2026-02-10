"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { FileText, Upload, Eye } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

type ResumeRow = {
  id: string
  title: string
  score: number
  created_at: string
}

function getScoreBadge(score: number) {
  if (score >= 80)
    return <Badge className="bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]">{score}</Badge>
  if (score >= 60)
    return <Badge className="bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]">{score}</Badge>
  return <Badge variant="destructive">{score}</Badge>
}

export default function ResumesPage() {
  const [resumes, setResumes] = useState<ResumeRow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadResumes = async () => {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase
        .from("resumes")
        .select("id,title,score,created_at")
        .order("created_at", { ascending: false })

      if (!error && data) {
        setResumes(data as ResumeRow[])
      }

      setIsLoading(false)
    }

    void loadResumes()
  }, [])

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">My Resumes</h1>
          <p className="mt-1 text-muted-foreground">Manage and review your uploaded resumes</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/upload">
            <Upload className="h-4 w-4" />
            Upload New
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading your resumes...</p>
      ) : resumes.length === 0 ? (
        <Card className="border border-border/70 bg-card/90 shadow-sm">
          <CardContent className="py-10 text-center">
            <p className="font-heading text-lg text-foreground">No resumes yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Upload your first resume to start tracking improvements.
            </p>
            <Button asChild className="mt-4">
              <Link href="/upload">Upload Resume</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <Card key={resume.id} className="group border border-border/60 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  {getScoreBadge(resume.score)}
                </div>
                <CardTitle className="mt-3 font-heading text-base text-card-foreground">{resume.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  {format(new Date(resume.created_at), "MMM d, yyyy")}
                  <Badge variant="outline" className="text-xs">
                    Latest
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" size="sm" className="w-full gap-2 bg-transparent">
                  <Link href={`/results?id=${encodeURIComponent(resume.id)}`}>
                    <Eye className="h-4 w-4" />
                    View Results
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
