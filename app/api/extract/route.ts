import { NextRequest, NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";
import { GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

function normalizeResumeText(input: string) {
  return input.replace(/\s+/g, " ").trim();
}

export async function POST(request: NextRequest) {
  const formData = await request.formData().catch(() => null);

  if (!formData) {
    return NextResponse.json(
      { error: "Invalid multipart form data." },
      { status: 400 },
    );
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "A PDF file is required." },
      { status: 400 },
    );
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json(
      { error: "Only PDF files are supported." },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: "PDF must be 10MB or smaller." },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const parser = new PDFParse({
    data: buffer,
  });

  const result = await parser.getText();

  if (result.text.length < 200) {
    return NextResponse.json(
      {
        error:
          "Could not extract enough text from the PDF. Try copying and pasting the resume text instead.",
      },
      { status: 422 },
    );
  }

  return NextResponse.json(
    { normalizedResumeText: result.text },
    { status: 200 },
  );
}
