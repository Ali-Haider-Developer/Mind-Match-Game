"use client"

import { motion } from "framer-motion"
import { Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { TimerMode } from "@/components/mind-match"

interface StatsDisplayProps {
  moves: number
  time: number
  bestScore?: { moves: number; time: number }
  isGameComplete: boolean
  timerMode: TimerMode
  hintsRemaining: number
  onUseHint: () => void
}

export function StatsDisplay({
  moves,
  time,
  bestScore,
  isGameComplete,
  timerMode,
  hintsRemaining,
  onUseHint,
}: StatsDisplayProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
      <StatCard title="Moves" value={moves.toString()} />

      <StatCard
        title={timerMode === "countdown" ? "Time Left" : "Time"}
        value={formatTime(time)}
        highlight={timerMode === "countdown" && time < 10 && time > 0}
        danger={timerMode === "countdown" && time < 10 && time > 0}
      />

      {bestScore && (
        <>
          <StatCard
            title="Best Moves"
            value={bestScore.moves.toString()}
            highlight={isGameComplete && moves <= bestScore.moves}
          />
          <div className="relative">
            <StatCard
              title="Best Time"
              value={formatTime(bestScore.time)}
              highlight={isGameComplete && time <= bestScore.time}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-accent text-accent-foreground hover:opacity-90 shadow-md"
                    onClick={onUseHint}
                    disabled={hintsRemaining <= 0}
                  >
                    <Lightbulb className="h-4 w-4" />
                    <span className="sr-only">Use hint</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Hints remaining: {hintsRemaining}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </>
      )}
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  highlight?: boolean
  danger?: boolean
}

function StatCard({ title, value, highlight = false, danger = false }: StatCardProps) {
  return (
    <motion.div
      className={`p-4 rounded-lg text-center luxury-panel ${
        highlight
          ? "bg-gradient-to-br from-teal-500/10 to-teal-200/5 border-teal-500/30"
          : danger
            ? "bg-gradient-to-br from-destructive/10 to-red-500/5 border-destructive/30"
            : ""
      }`}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      animate={danger ? { scale: [1, 1.05, 1] } : {}}
    >
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p
        className={`text-xl font-bold ${
          highlight
            ? "bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-highlight"
            : danger
              ? "text-destructive"
              : ""
        }`}
      >
        {value}
      </p>
    </motion.div>
  )
}
