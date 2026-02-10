import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ResumeUploader } from "@/components/upload/resume-uploader"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function UploadPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <AuthGuard>
          <ResumeUploader />
        </AuthGuard>
      </main>
      <Footer />
    </div>
  )
}
