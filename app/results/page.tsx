import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ResultsContent } from "@/components/results/results-content";
import { Suspense } from "react";

export default function ResultsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-6 py-16">
        <Suspense fallback={<div>Loading...</div>}>
          <ResultsContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
