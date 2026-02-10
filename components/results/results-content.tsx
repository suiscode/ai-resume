"use client"

import { useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, AlertCircle, Lightbulb, PenLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScoreGauge } from "@/components/results/score-gauge"

type AnalyzeResponse = {
  overallScore: number
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  keywordGaps: string[]
}

const ANALYSIS_STORAGE_PREFIX = "resume-analysis:"

const fallbackResult: AnalyzeResponse = {
  overallScore: 74,
  strengths: [
    "Strong quantified achievements in work experience",
    "Clean, ATS-friendly formatting with standard sections",
    "Relevant skills section with industry keywords",
    "Professional summary is concise and impactful",
  ],
  weaknesses: [
    "Missing action verbs in 3 bullet points",
    "Education section lacks relevant coursework",
    "No LinkedIn or portfolio link included",
    "Some bullet points exceed recommended length",
  ],
  suggestions: [
    "Add metrics to your project management bullet points (e.g., budget size, team size)",
    "Include 2-3 more industry-specific keywords from the job description",
    "Move your skills section above work experience for better ATS parsing",
    "Add a dedicated certifications section to highlight your PMP credential",
    "Shorten the professional summary to 2-3 lines for better readability",
  ],
  keywordGaps: ["System Design", "Kubernetes", "Stakeholder Management"],
}

function getStoredAnalysis(id: string | null) {
  if (!id) {
    return null
  }

  try {
    const raw = sessionStorage.getItem(`${ANALYSIS_STORAGE_PREFIX}${id}`)

    if (!raw) {
      return null
    }

    return JSON.parse(raw) as AnalyzeResponse
  } catch {
    return null
  }
}

export function ResultsContent() {
  const searchParams = useSearchParams()

  const result = useMemo(() => {
    const id = searchParams.get("id")

    return getStoredAnalysis(id) ?? fallbackResult
  }, [searchParams])

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Resume Analysis Results
        </h1>
        <p className="mt-2 text-muted-foreground">
          Here is your detailed AI-powered resume review
        </p>
      </div>

      <div className="mb-8 flex justify-center">
        <Card className="w-full max-w-sm border border-border/60 shadow-sm">
          <CardContent className="flex flex-col items-center py-8">
            <ScoreGauge score={result.overallScore} />
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                Strengths: {result.strengths.length}
              </Badge>
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                Weaknesses: {result.weaknesses.length}
              </Badge>
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                Keyword Gaps: {result.keywordGaps.length}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 font-heading text-lg text-card-foreground">
              <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))]" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {result.strengths.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-card-foreground">
                  <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[hsl(var(--success))]" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 font-heading text-lg text-card-foreground">
              <AlertCircle className="h-5 w-5 text-[hsl(var(--warning))]" />
              Weaknesses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {result.weaknesses.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-card-foreground">
                  <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[hsl(var(--warning))]" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 font-heading text-lg text-card-foreground">
            <Lightbulb className="h-5 w-5 text-primary" />
            Improvement Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-3">
            {result.suggestions.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-card-foreground">
                <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-center">
        <Button size="lg" className="gap-2 px-8">
          <PenLine className="h-4 w-4" />
          Rewrite Bullet Points with AI
        </Button>
      </div>
    </div>
  )
}
