"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, FileText, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hi! I'm your AI Resume Coach. I've reviewed your latest resume (Software Engineer Resume - Score: 82). How can I help you improve it today?",
  },
]

const quickPrompts = [
  "How can I improve my bullet points?",
  "What keywords am I missing?",
  "Review my summary section",
  "Help me quantify my achievements",
]

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      const responses = [
        "Great question! Looking at your resume, I'd suggest quantifying your achievements more. For example, instead of 'Improved application performance,' try 'Improved application load time by 40%, reducing bounce rate by 15%.' Numbers make your impact concrete and memorable for recruiters.",
        "Based on your current resume, I recommend adding more industry-specific keywords like 'CI/CD,' 'microservices,' and 'agile methodology.' These terms are commonly scanned by ATS systems and will help your resume pass automated screening.",
        "Your summary is solid but could be more impactful. Try leading with your years of experience and most impressive metric. For example: '7+ year software engineer with a track record of delivering scalable systems serving 1M+ users.'",
        "To strengthen your bullet points, use the STAR method: Situation, Task, Action, Result. Each bullet should start with a strong action verb and end with a measurable outcome. I can help you rewrite specific bullets if you share them.",
      ]

      const aiMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
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
                    setInput(prompt)
                    textareaRef.current?.focus()
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
                onClick={handleSend}
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
            <div>
              <p className="text-sm font-heading text-foreground">Software Engineer Resume</p>
              <p className="text-xs text-muted-foreground">Last updated: Feb 8, 2026</p>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]">
                Score: 82
              </Badge>
              <Badge variant="secondary" className="bg-accent text-accent-foreground">v3</Badge>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs font-heading text-muted-foreground uppercase tracking-wider">
                Key Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["React", "TypeScript", "Node.js", "Python", "AWS", "PostgreSQL"].map(
                  (skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  )
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs font-heading text-muted-foreground uppercase tracking-wider">
                Areas to Improve
              </p>
              <ul className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                <li className="flex items-start gap-1.5">
                  <Sparkles className="mt-0.5 h-3 w-3 flex-shrink-0 text-primary" />
                  Add metrics to achievements
                </li>
                <li className="flex items-start gap-1.5">
                  <Sparkles className="mt-0.5 h-3 w-3 flex-shrink-0 text-primary" />
                  Include portfolio link
                </li>
                <li className="flex items-start gap-1.5">
                  <Sparkles className="mt-0.5 h-3 w-3 flex-shrink-0 text-primary" />
                  Strengthen action verbs
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
