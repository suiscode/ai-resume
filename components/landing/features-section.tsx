import { BarChart3, Brain, PenLine, History } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: BarChart3,
    title: "ATS Score Analysis",
    description:
      "Get a detailed ATS compatibility score with keyword matching and formatting checks to ensure your resume passes automated screening.",
  },
  {
    icon: Brain,
    title: "AI Suggestions",
    description:
      "Receive intelligent, context-aware suggestions to strengthen your experience descriptions, skills section, and overall structure.",
  },
  {
    icon: PenLine,
    title: "Bullet Point Rewriting",
    description:
      "Transform weak bullet points into impactful, quantified achievements with our AI-powered rewriting engine.",
  },
  {
    icon: History,
    title: "Resume History Dashboard",
    description:
      "Track your progress over time with a comprehensive dashboard showing score trends and improvements across submissions.",
  },
]

export function FeaturesSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--secondary)/0.4)_100%)]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-balance font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to perfect your resume
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Our AI-powered tools analyze every aspect of your resume and provide
            actionable feedback to help you stand out.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group border border-border/70 bg-card/90 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
            >
              <CardHeader className="pb-3">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-accent">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="font-heading text-lg text-card-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
