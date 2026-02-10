import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AuthCard } from "@/components/auth/auth-card"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <AuthCard mode="register" />
      </main>
      <Footer />
    </div>
  )
}
