"use client"

import Link from "next/link"
import { FileText, TrendingUp, Target, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

const analyticsCards = [
  {
    title: "Average Score",
    value: "76",
    change: "+12 from last month",
    icon: Target,
  },
  {
    title: "Resumes Reviewed",
    value: "8",
    change: "3 this month",
    icon: FileText,
  },
  {
    title: "Improvement Rate",
    value: "92%",
    change: "Across all submissions",
    icon: TrendingUp,
  },
  {
    title: "Last Review",
    value: "2d ago",
    change: "Software Engineer Resume",
    icon: Clock,
  },
]

const recentResumes = [
  {
    id: 1,
    name: "Software Engineer Resume",
    date: "Feb 8, 2026",
    score: 82,
    status: "Reviewed",
  },
  {
    id: 2,
    name: "Product Manager Resume",
    date: "Feb 5, 2026",
    score: 74,
    status: "Reviewed",
  },
  {
    id: 3,
    name: "Data Analyst Resume v2",
    date: "Jan 30, 2026",
    score: 68,
    status: "Reviewed",
  },
  {
    id: 4,
    name: "UX Designer Resume",
    date: "Jan 25, 2026",
    score: 71,
    status: "Reviewed",
  },
  {
    id: 5,
    name: "Frontend Developer Resume",
    date: "Jan 18, 2026",
    score: 85,
    status: "Reviewed",
  },
]

function getScoreColor(score: number) {
  if (score >= 80) return "text-[hsl(var(--success))]"
  if (score >= 60) return "text-[hsl(var(--warning))]"
  return "text-destructive"
}

function getProgressColor(score: number) {
  if (score >= 80) return "[&>div]:bg-[hsl(var(--success))]"
  if (score >= 60) return "[&>div]:bg-[hsl(var(--warning))]"
  return "[&>div]:bg-destructive"
}

export function DashboardOverview() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Track your resume performance and improvements
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {analyticsCards.map((card) => (
          <Card key={card.title} className="border border-border/60 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-heading text-2xl font-bold text-card-foreground">{card.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">{card.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-lg text-card-foreground">Recent Resumes</CardTitle>
          <CardDescription>Your latest resume submissions and scores</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resume</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Score</TableHead>
                <TableHead className="hidden sm:table-cell">Progress</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentResumes.map((resume) => (
                <TableRow key={resume.id}>
                  <TableCell>
                    <Link href="/results" className="font-medium text-foreground hover:text-primary">
                      {resume.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{resume.date}</TableCell>
                  <TableCell>
                    <span className={`font-heading font-bold ${getScoreColor(resume.score)}`}>
                      {resume.score}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Progress
                      value={resume.score}
                      className={`h-2 w-20 ${getProgressColor(resume.score)}`}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-accent text-accent-foreground">
                      {resume.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
