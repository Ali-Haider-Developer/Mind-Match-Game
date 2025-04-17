"use client"

import type React from "react"

import { motion } from "framer-motion"
import { BarChart, Clock, Award, Zap } from "lucide-react"
import type { GameStats as GameStatsType } from "@/components/mind-match"

interface GameStatsProps {
  stats: GameStatsType
}

export function GameStats({ stats }: GameStatsProps) {
  const formatTime = (seconds: number) => {
    if (seconds === Number.POSITIVE_INFINITY) return "N/A"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatNumber = (num: number) => {
    return num === Number.POSITIVE_INFINITY ? "N/A" : num.toString()
  }

  return (
    <div className="w-full space-y-6">
      <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-800 to-teal-500">
        Game Statistics
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Games Played"
          value={stats.gamesPlayed.toString()}
          icon={<BarChart className="h-5 w-5 text-teal-800" />}
        />
        <StatCard
          title="Games Won"
          value={stats.gamesWon.toString()}
          icon={<Award className="h-5 w-5 text-terracotta-500" />}
        />
        <StatCard
          title="Total Matches"
          value={stats.totalMatches.toString()}
          icon={<Zap className="h-5 w-5 text-teal-500" />}
        />
        <StatCard
          title="Total Moves"
          value={stats.totalMoves.toString()}
          icon={<Clock className="h-5 w-5 text-accent" />}
        />
      </div>

      <h3 className="text-xl font-semibold mt-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-800 to-teal-500">
        Best Scores
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2 font-medium text-sm">
          <div>Difficulty</div>
          <div>Best Moves</div>
          <div>Best Time</div>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2 p-3 rounded-lg luxury-panel">
            <div className="font-medium">Easy</div>
            <div>{formatNumber(stats.bestMoves.easy)}</div>
            <div>{formatTime(stats.bestTime.easy)}</div>
          </div>

          <div className="grid grid-cols-3 gap-2 p-3 rounded-lg luxury-panel">
            <div className="font-medium">Medium</div>
            <div>{formatNumber(stats.bestMoves.medium)}</div>
            <div>{formatTime(stats.bestTime.medium)}</div>
          </div>

          <div className="grid grid-cols-3 gap-2 p-3 rounded-lg luxury-panel">
            <div className="font-medium">Hard</div>
            <div>{formatNumber(stats.bestMoves.hard)}</div>
            <div>{formatTime(stats.bestTime.hard)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <motion.div
      className="p-4 rounded-lg luxury-panel"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <p className="text-2xl font-bold animate-shine bg-clip-text text-transparent bg-gradient-to-r from-foreground via-teal-500 to-foreground bg-[length:200%_auto]">
        {value}
      </p>
    </motion.div>
  )
}
