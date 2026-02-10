import Link from "next/link"
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.12),transparent_55%)]" />
      <div className="absolute -top-32 right-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,hsl(var(--ring)/0.28),transparent_70%)] blur-2xl" />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-6 pb-20 pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pb-28 lg:pt-28">
        <div>
          <Badge
            variant="secondary"
            className="mb-6 inline-flex gap-1.5 border border-primary/15 bg-accent px-4 py-1.5 text-accent-foreground"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI-powered resume intelligence
          </Badge>

          <h1 className="text-balance font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Make your resume{" "}
            <span className="text-foreground/90">look like a top performer</span>{" "}
            before recruiters ever see it.
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Upload your resume and get a polished, ATS-ready review with ranked
            improvements, quantified bullet rewrites, and interview-ready insights.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
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

          <div className="mt-8 grid max-w-xl gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Tailored ATS score and match map
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Actionable improvements in minutes
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Secure processing, delete anytime
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Built for modern hiring systems
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-xl backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resume score</p>
                <p className="mt-2 text-4xl font-bold text-foreground">86</p>
              </div>
              <div className="rounded-2xl border border-primary/20 bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground">
                +14 points
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Keyword alignment</span>
                  <span>88%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div className="h-full w-[88%] rounded-full bg-primary" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Impact metrics</span>
                  <span>74%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div className="h-full w-[74%] rounded-full bg-primary/80" />
                </div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Next best action
                </p>
                <p className="mt-2 text-sm font-medium text-foreground">
                  Quantify impact in your last two role summaries.
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-12 -left-12 hidden rounded-2xl border border-border/70 bg-background/90 p-4 shadow-lg lg:block">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Trusted by</p>
            <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-muted-foreground">
              <span>Northwind</span>
              <span>Vantage</span>
              <span>Orbit</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
