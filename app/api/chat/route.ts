import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
})

const chatRequestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(20),
  resumeContext: z
    .object({
      title: z.string().min(1).max(200).optional(),
      score: z.number().int().min(0).max(100).nullable().optional(),
      suggestions: z.array(z.string().min(1).max(500)).max(10).optional(),
      weaknesses: z.array(z.string().min(1).max(500)).max(10).optional(),
      resumeText: z.string().max(8000).optional(),
    })
    .optional(),
})

const chatResponseSchema = z.object({
  reply: z.string().min(1).max(4000),
})

const geminiModel = process.env.GEMINI_MODEL ?? "gemini-2.5-flash"
const geminiBaseUrl = "https://generativelanguage.googleapis.com/v1beta/models"
const geminiTimeoutMs = 20_000

function buildPrompt(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  resumeContext?: {
    title?: string
    score?: number | null
    suggestions?: string[]
    weaknesses?: string[]
    resumeText?: string
  },
) {
  const contextParts: string[] = []

  if (resumeContext?.title) {
    contextParts.push(`Resume title: ${resumeContext.title}`)
  }

  if (typeof resumeContext?.score === "number") {
    contextParts.push(`Latest score: ${resumeContext.score}/100`)
  }

  if (resumeContext?.weaknesses?.length) {
    contextParts.push(`Known weaknesses:\n- ${resumeContext.weaknesses.join("\n- ")}`)
  }

  if (resumeContext?.suggestions?.length) {
    contextParts.push(`Known suggestions:\n- ${resumeContext.suggestions.join("\n- ")}`)
  }

  if (resumeContext?.resumeText) {
    contextParts.push(`Resume text excerpt:\n${resumeContext.resumeText}`)
  }

  const transcript = messages
    .map((message) => `${message.role === "user" ? "User" : "Assistant"}: ${message.content}`)
    .join("\n")

  return [
    "You are an expert resume coach.",
    "Give practical, specific, concise guidance.",
    "Prefer rewrite-ready suggestions and measurable outcomes.",
    "If asked to rewrite content, provide improved examples.",
    contextParts.length > 0 ? `Resume context:\n${contextParts.join("\n\n")}` : "Resume context: none provided.",
    "Conversation transcript:",
    transcript,
    "Now provide your next assistant reply only.",
  ].join("\n\n")
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: "Server configuration error. Please contact support." },
      { status: 500 },
    )
  }

  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const parsedInput = chatRequestSchema.safeParse(payload)

  if (!parsedInput.success) {
    return NextResponse.json(
      {
        error: "Invalid request payload.",
        details: parsedInput.error.flatten(),
      },
      { status: 422 },
    )
  }

  const { messages, resumeContext } = parsedInput.data
  const geminiUrl = `${geminiBaseUrl}/${geminiModel}:generateContent?key=${encodeURIComponent(apiKey)}`
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), geminiTimeoutMs)

  try {
    const completionResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: buildPrompt(messages, resumeContext),
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 700,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              reply: { type: "STRING" },
            },
            required: ["reply"],
          },
        },
      }),
      signal: controller.signal,
    })

    const responseBody = (await completionResponse.json().catch(() => null)) as
      | {
          candidates?: Array<{
            content?: {
              parts?: Array<{
                text?: string
              }>
            }
          }>
          error?: {
            message?: string
          }
        }
      | null

    if (!completionResponse.ok) {
      if (completionResponse.status === 429) {
        return NextResponse.json(
          { error: "AI service rate limit reached. Please retry shortly." },
          { status: 429 },
        )
      }

      return NextResponse.json(
        {
          error: responseBody?.error?.message || "Unable to generate chat response right now.",
        },
        { status: 502 },
      )
    }

    const content = responseBody?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!content) {
      return NextResponse.json({ error: "AI service returned an empty response." }, { status: 502 })
    }

    let parsedContent: z.infer<typeof chatResponseSchema>

    try {
      parsedContent = chatResponseSchema.parse(JSON.parse(content))
    } catch {
      return NextResponse.json(
        { error: "AI service returned malformed chat output." },
        { status: 502 },
      )
    }

    return NextResponse.json(parsedContent, { status: 200 })
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { error: "AI chat timed out. Please try again." },
        { status: 504 },
      )
    }

    return NextResponse.json(
      { error: "Unexpected server error during chat." },
      { status: 500 },
    )
  } finally {
    clearTimeout(timeout)
  }
}
