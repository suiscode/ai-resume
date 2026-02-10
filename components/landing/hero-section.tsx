import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)]" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 pb-20 pt-24 text-center lg:pb-32 lg:pt-36">
        <Badge
          variant="secondary"
          className="mb-6 gap-1.5 border border-primary/20 bg-accent px-4 py-1.5 text-accent-foreground"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Powered by Advanced AI
        </Badge>

        <h1 className="max-w-4xl text-balance font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          AI Resume Reviewer{" "}
          <span className="text-primary">
            Get Instant Feedback
          </span>{" "}
          on Your Resume
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Upload your resume and let our AI analyze it in seconds. Get an ATS compatibility
          score, actionable suggestions, and AI-powered bullet point rewrites to help you
          land more interviews.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="gap-2 px-8">
            <Link href="/upload">
              Upload Resume
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2 px-8 bg-transparent">
            <Link href="/results">Try Demo</Link>
          </Button>
        </div>

        <div className="mt-16 grid w-full max-w-3xl grid-cols-3 gap-8">
          <div className="flex flex-col items-center gap-1">
            <span className="font-heading text-3xl font-bold text-foreground">50K+</span>
            <span className="text-sm text-muted-foreground">Resumes Reviewed</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-heading text-3xl font-bold text-foreground">92%</span>
            <span className="text-sm text-muted-foreground">Score Improvement</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-heading text-3xl font-bold text-foreground">4.9/5</span>
            <span className="text-sm text-muted-foreground">User Rating</span>
          </div>
        </div>
      </div>
    </section>
  )
}
