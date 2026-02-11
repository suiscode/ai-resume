"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, FileText, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"
import { cn } from "@/lib/utils"

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
}

interface StoredAnalysis {
  suggestions?: string[]
  weaknesses?: string[]
}

interface ResumeContext {
  title: string
  score: number
  createdAt: string
  suggestions: string[]
  weaknesses: string[]
  resumeText: string
}

function buildWelcomeMessage(resumeContext: ResumeContext | null) {
  if (!resumeContext) {
    return "Hi! I'm your AI Resume Coach. Upload or review a resume to get tailored advice."
  }

  return `Hi! I'm your AI Resume Coach. I've reviewed your latest resume (${resumeContext.title} - Score: ${resumeContext.score}). How can I help you improve it today?`
}

const quickPrompts = [
  "How can I improve my bullet points?",
  "What keywords am I missing?",
  "Review my summary section",
  "Help me quantify my achievements",
]

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: buildWelcomeMessage(null),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isLoadingContext, setIsLoadingContext] = useState(true)
  const [resumeContext, setResumeContext] = useState<ResumeContext | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  useEffect(() => {
    const loadLatestResumeContext = async () => {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase
        .from("resumes")
        .select("title,score,created_at,analysis,resume_text")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!error && data) {
        const analysis = (data.analysis as StoredAnalysis | null) ?? null
        const nextContext: ResumeContext = {
          title: data.title ?? "Latest Resume",
          score: typeof data.score === "number" ? data.score : 0,
          createdAt: data.created_at ?? "",
          suggestions: Array.isArray(analysis?.suggestions) ? analysis.suggestions.slice(0, 3) : [],
          weaknesses: Array.isArray(analysis?.weaknesses) ? analysis.weaknesses.slice(0, 3) : [],
          resumeText:
            typeof data.resume_text === "string" ? data.resume_text.slice(0, 4000) : "",
        }

        setResumeContext(nextContext)
        setMessages([
          {
            id: 1,
            role: "assistant",
            content: buildWelcomeMessage(nextContext),
          },
        ])
      }

      setIsLoadingContext(false)
    }

    void loadLatestResumeContext()
  }, [])

  const handleSend = async (prefill?: string) => {
    if (isTyping) return

    const value = (prefill ?? input).trim()
    if (!value) return

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: value,
    }

    const conversation = [...messages, userMessage]
    setMessages(conversation)
    setInput("")
    setIsTyping(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversation.map((message) => ({
            role: message.role,
            content: message.content,
          })),
          resumeContext: resumeContext
            ? {
                title: resumeContext.title,
                score: resumeContext.score,
                suggestions: resumeContext.suggestions,
                weaknesses: resumeContext.weaknesses,
                resumeText: resumeContext.resumeText,
              }
            : undefined,
        }),
      })

      const payload = (await response.json().catch(() => null)) as
        | { reply?: string; error?: string }
        | null

      if (!response.ok || !payload?.reply) {
        throw new Error(payload?.error || "Unable to get a response right now.")
      }

      const aiMessage: Message = {
        id: conversation.length + 1,
        role: "assistant",
        content: payload.reply,
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      const aiMessage: Message = {
        id: conversation.length + 1,
        role: "assistant",
        content:
          error instanceof Error
            ? `I ran into an issue: ${error.message}`
            : "I ran into an issue while generating a response.",
      }

      setMessages((prev) => [...prev, aiMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col gap-6 lg:flex-row">
      {/* Chat area */}
      <div className="flex flex-1 flex-col">
        <div className="mb-4">
          <h1 className="font-heading text-2xl font-bold text-foreground">AI Coach Chat</h1>
          <p className="mt-1 text-muted-foreground">
            Get personalized advice to improve your resume
          </p>
        </div>

        <Card className="flex flex-1 flex-col border border-border/60 shadow-sm">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="flex flex-col gap-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
                      message.role === "user"
                        ? "bg-primary"
                        : "bg-accent"
                    )}
                  >
                    {message.role === "user" ? (
                      <User className="h-4 w-4 text-primary-foreground" />
                    ) : (
                      <Bot className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
                    <span className="inline-flex gap-1">
                      <span className="animate-bounce">.</span>
                      <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t border-border p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => {
                    void handleSend(prompt)
                  }}
                  className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                placeholder="Ask about your resume..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[44px] max-h-32 resize-none"
                rows={1}
              />
              <Button
                onClick={() => void handleSend()}
                disabled={!input.trim() || isTyping}
                size="icon"
                className="h-11 w-11 flex-shrink-0"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Resume context panel */}
      <div className="w-full lg:w-80">
        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 font-heading text-base text-card-foreground">
              <FileText className="h-4 w-4 text-primary" />
              Resume Context
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {isLoadingContext ? (
              <p className="text-sm text-muted-foreground">Loading latest resume context...</p>
            ) : resumeContext ? (
              <>
                <div>
                  <p className="text-sm font-heading text-foreground">{resumeContext.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Last updated: {new Date(resumeContext.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className="bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]">
                    Score: {resumeContext.score}
                  </Badge>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-xs font-heading text-muted-foreground uppercase tracking-wider">
                    Areas to Improve
                  </p>
                  <ul className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                    {(resumeContext.suggestions.length > 0
                      ? resumeContext.suggestions
                      : resumeContext.weaknesses
                    ).map((item) => (
                      <li key={item} className="flex items-start gap-1.5">
                        <Sparkles className="mt-0.5 h-3 w-3 flex-shrink-0 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No resume found yet. Upload one to get personalized coaching context.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
