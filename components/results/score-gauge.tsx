"use client"

import { useEffect, useState } from "react"

interface ScoreGaugeProps {
  score: number
  label?: string
}

export function ScoreGauge({ score, label = "ATS Score" }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 200)
    return () => clearTimeout(timer)
  }, [score])

  const circumference = 2 * Math.PI * 54
  const offset = circumference - (animatedScore / 100) * circumference

  const getColor = (s: number) => {
    if (s >= 80) return "hsl(var(--success))"
    if (s >= 60) return "hsl(var(--warning))"
    return "hsl(var(--destructive))"
  }

  const getLabel = (s: number) => {
    if (s >= 80) return "Excellent"
    if (s >= 60) return "Good"
    if (s >= 40) return "Fair"
    return "Needs Work"
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-36 w-36">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={getColor(animatedScore)}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-3xl font-bold text-foreground">
            {animatedScore}
          </span>
          <span className="text-xs text-muted-foreground">{getLabel(animatedScore)}</span>
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  )
}
