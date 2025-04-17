"use client"

import { Button } from "@/components/ui/button"
import type { Difficulty } from "@/components/mind-match"

interface GameControlsProps {
  onReset: () => void
  difficulty: Difficulty
  onChangeDifficulty: (difficulty: Difficulty) => void
}

export function GameControls({ onReset, difficulty, onChangeDifficulty }: GameControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 w-full">
      <Button
        onClick={onReset}
        variant="outline"
        className="flex-1 min-w-[100px] max-w-[200px] luxury-border bg-gradient-to-r from-teal-800/10 to-teal-500/10 hover:from-teal-800/20 hover:to-teal-500/20"
      >
        New Game
      </Button>

      <div className="flex gap-2 flex-1 min-w-[200px] justify-center">
        <Button
          onClick={() => onChangeDifficulty("easy")}
          variant={difficulty === "easy" ? "default" : "outline"}
          size="sm"
          className={
            difficulty === "easy" ? "bg-gradient-to-r from-teal-800 to-teal-500 hover:opacity-90" : "luxury-border"
          }
        >
          Easy
        </Button>
        <Button
          onClick={() => onChangeDifficulty("medium")}
          variant={difficulty === "medium" ? "default" : "outline"}
          size="sm"
          className={
            difficulty === "medium" ? "bg-gradient-to-r from-teal-800 to-teal-500 hover:opacity-90" : "luxury-border"
          }
        >
          Medium
        </Button>
        <Button
          onClick={() => onChangeDifficulty("hard")}
          variant={difficulty === "hard" ? "default" : "outline"}
          size="sm"
          className={
            difficulty === "hard" ? "bg-gradient-to-r from-teal-800 to-teal-500 hover:opacity-90" : "luxury-border"
          }
        >
          Hard
        </Button>
      </div>
    </div>
  )
}
