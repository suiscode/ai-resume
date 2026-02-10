import { NextRequest, NextResponse } from "next/server"

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

function normalizeResumeText(input: string) {
  return input.replace(/\s+/g, " ").trim()
}

function extractTextFromPdfBuffer(buffer: Buffer) {
  const decoded = buffer.toString("latin1")
  const textSegments = Array.from(decoded.matchAll(/\(([^()]*)\)\s*Tj/g), (match) => match[1])

  return normalizeResumeText(textSegments.join(" "))
}

export async function POST(request: NextRequest) {
  const formData = await request.formData().catch(() => null)

  if (!formData) {
    return NextResponse.json({ error: "Invalid multipart form data." }, { status: 400 })
  }

  const file = formData.get("file")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "A PDF file is required." }, { status: 400 })
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF files are supported." }, { status: 400 })
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ error: "PDF must be 10MB or smaller." }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const normalizedResumeText = extractTextFromPdfBuffer(Buffer.from(bytes))

  if (normalizedResumeText.length < 200) {
    return NextResponse.json(
      {
        error:
          "Could not extract enough text from the PDF. Try copying and pasting the resume text instead.",
      },
      { status: 422 },
    )
  }

  return NextResponse.json({ normalizedResumeText }, { status: 200 })
}
