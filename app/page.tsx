import { MindMatch } from "@/components/mind-match"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-background pattern-bg">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-teal-800 to-teal-500">
          Welcome, Ali Haider!
        </h1>
        <p className="text-muted-foreground">Test your memory with this custom-themed matching game</p>
      </div>
      <MindMatch />
    </main>
  )
}
