import Link from "next/link"
import { FileText, Upload, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const resumes = [
  {
    id: 1,
    name: "Software Engineer Resume",
    date: "Feb 8, 2026",
    score: 82,
    version: "v3",
  },
  {
    id: 2,
    name: "Product Manager Resume",
    date: "Feb 5, 2026",
    score: 74,
    version: "v1",
  },
  {
    id: 3,
    name: "Data Analyst Resume",
    date: "Jan 30, 2026",
    score: 68,
    version: "v2",
  },
  {
    id: 4,
    name: "UX Designer Resume",
    date: "Jan 25, 2026",
    score: 71,
    version: "v1",
  },
  {
    id: 5,
    name: "Frontend Developer Resume",
    date: "Jan 18, 2026",
    score: 85,
    version: "v2",
  },
  {
    id: 6,
    name: "Backend Engineer Resume",
    date: "Jan 10, 2026",
    score: 63,
    version: "v1",
  },
]

function getScoreBadge(score: number) {
  if (score >= 80)
    return <Badge className="bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]">{score}</Badge>
  if (score >= 60)
    return <Badge className="bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]">{score}</Badge>
  return <Badge variant="destructive">{score}</Badge>
}

export default function ResumesPage() {
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
              <CardTitle className="mt-3 font-heading text-base text-card-foreground">{resume.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                {resume.date}
                <Badge variant="outline" className="text-xs">
                  {resume.version}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" size="sm" className="w-full gap-2 bg-transparent">
                <Link href="/results">
                  <Eye className="h-4 w-4" />
                  View Results
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
