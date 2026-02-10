"use client"

import React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Upload, FileText, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export function ResumeUploader() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }, [])

  const handleSubmit = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => {
      router.push("/results")
    }, 2000)
  }, [router])

  return (
    <Card className="w-full max-w-2xl border border-border/60 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="font-heading text-2xl text-card-foreground">Upload Your Resume</CardTitle>
        <CardDescription className="text-base">
          Upload a PDF or paste your resume text to get AI-powered feedback
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload PDF</TabsTrigger>
            <TabsTrigger value="paste">Paste Text</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all ${
                isDragging
                  ? "border-primary bg-accent"
                  : file
                    ? "border-primary/40 bg-accent/50"
                    : "border-border hover:border-primary/40 hover:bg-muted/50"
              }`}
            >
              {file ? (
                <div className="flex flex-col items-center gap-3 p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent">
                    <FileText className="h-7 w-7 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setFile(null)
                    }}
                    className="gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center gap-3 p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                    <Upload className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-foreground">
                      Drop your PDF here or click to browse
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Supports PDF files up to 10MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="sr-only"
                    aria-label="Upload PDF resume"
                  />
                </label>
              )}
            </div>
          </TabsContent>

          <TabsContent value="paste" className="mt-6">
            <Textarea
              placeholder="Paste your resume text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[240px] resize-none leading-relaxed"
            />
          </TabsContent>

          <Button
            onClick={handleSubmit}
            disabled={(!file && !text.trim()) || isLoading}
            className="mt-6 w-full gap-2"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing Resume...
              </>
            ) : (
              <>
                <span className="h-4 w-4">✨</span>
                Analyze Resume
              </>
            )}
          </Button>
        </Tabs>
      </CardContent>
    </Card>
  )
}
