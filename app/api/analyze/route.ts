import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const analyzeRequestSchema = z.object({
  normalizedResumeText: z
    .string({ required_error: "normalizedResumeText is required" })
    .min(200, "normalizedResumeText must be at least 200 characters")
    .max(20000, "normalizedResumeText must be at most 20,000 characters"),
  jobTarget: z
    .string()
    .min(2, "jobTarget must be at least 2 characters")
    .max(500, "jobTarget must be at most 500 characters")
    .optional(),
})

const analyzeResponseSchema = z.object({
  overallScore: z.number().min(0).max(100),
  strengths: z.array(z.string().min(1).max(500)).min(1).max(10),
  weaknesses: z.array(z.string().min(1).max(500)).min(1).max(10),
  suggestions: z.array(z.string().min(1).max(500)).min(1).max(10),
  keywordGaps: z.array(z.string().min(1).max(100)).max(20),
})

type AnalyzeResponse = z.infer<typeof analyzeResponseSchema>

const geminiModel = process.env.GEMINI_MODEL ?? "gemini-2.0-flash"
const geminiBaseUrl = "https://generativelanguage.googleapis.com/v1beta/models"
const geminiTimeoutMs = 20_000

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
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    )
  }

  const parsedInput = analyzeRequestSchema.safeParse(payload)

  if (!parsedInput.success) {
    return NextResponse.json(
      {
        error: "Invalid request payload.",
        details: parsedInput.error.flatten(),
      },
      { status: 422 },
    )
  }

  const { normalizedResumeText, jobTarget } = parsedInput.data
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
        systemInstruction: {
          parts: [
            {
              text: "You are a strict ATS-style resume analyzer. Evaluate resumes with evidence-based scoring only. Do not invent facts. Output JSON only and follow the provided schema exactly.",
            },
          ],
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                text: [
                  "Analyze the resume and return objective, concise feedback.",
                  `Job target: ${jobTarget ?? "Not provided"}`,
                  "Resume text:",
                  normalizedResumeText,
                ].join("\n\n"),
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              overallScore: { type: "NUMBER" },
              strengths: {
                type: "ARRAY",
                items: { type: "STRING" },
              },
              weaknesses: {
                type: "ARRAY",
                items: { type: "STRING" },
              },
              suggestions: {
                type: "ARRAY",
                items: { type: "STRING" },
              },
              keywordGaps: {
                type: "ARRAY",
                items: { type: "STRING" },
              },
            },
            required: [
              "overallScore",
              "strengths",
              "weaknesses",
              "suggestions",
              "keywordGaps",
            ],
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
            status?: string
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

      if (completionResponse.status === 400 || completionResponse.status === 422) {
        return NextResponse.json(
          {
            error: "AI service rejected the request payload.",
            detail: responseBody?.error?.message,
          },
          { status: 400 },
        )
      }

      return NextResponse.json(
        { error: "Failed to analyze resume at this time." },
        { status: 502 },
      )
    }

    const content = responseBody?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!content) {
      return NextResponse.json(
        { error: "AI service returned an empty analysis." },
        { status: 502 },
      )
    }

    let parsedContent: AnalyzeResponse

    try {
      parsedContent = analyzeResponseSchema.parse(JSON.parse(content))
    } catch {
      return NextResponse.json(
        { error: "AI service returned malformed analysis." },
        { status: 502 },
      )
    }

    return NextResponse.json(parsedContent, { status: 200 })
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { error: "AI analysis timed out. Please try again." },
        { status: 504 },
      )
    }

    return NextResponse.json(
      { error: "Unexpected server error during analysis." },
      { status: 500 },
    )
  } finally {
    clearTimeout(timeout)
  }
}
