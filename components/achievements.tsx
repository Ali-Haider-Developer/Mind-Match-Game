"use client"

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import type { Achievement as AchievementType } from "@/components/mind-match"

interface AchievementsProps {
  achievements: AchievementType[]
}

export function Achievements({ achievements }: AchievementsProps) {
  // Add a special achievement for Ali Haider if it doesn't exist yet
  const hasSpecialAchievement = achievements.some((a) => a.id === "ali_special")

  const displayAchievements = hasSpecialAchievement
    ? achievements
    : [
        {
          id: "ali_special",
          title: "Ali Haider's Special",
          description: "A special achievement just for Ali Haider!",
          icon: <CheckCircle2 className="h-5 w-5 text-teal-500" />,
          unlocked: true,
        },
        ...achievements,
      ]

  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-800 to-teal-500">
        Achievements
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {displayAchievements.map((achievement) => (
          <Achievement key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  )
}

interface AchievementProps {
  achievement: AchievementType
}

function Achievement({ achievement }: AchievementProps) {
  return (
    <motion.div
      className={`p-4 rounded-lg luxury-panel ${
        achievement.unlocked ? "bg-gradient-to-br from-teal-500/10 to-teal-200/5 border-teal-500/30" : ""
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">{achievement.icon}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3
              className={`font-semibold ${achievement.unlocked ? "bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-highlight" : ""}`}
            >
              {achievement.title}
            </h3>
            {achievement.unlocked && <CheckCircle2 className="h-5 w-5 text-teal-500" />}
          </div>
          <p className="text-sm text-muted-foreground">{achievement.description}</p>

          {achievement.progress !== undefined && achievement.goal !== undefined && (
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span>
                  {achievement.progress} / {achievement.goal}
                </span>
              </div>
              <Progress
                value={(achievement.progress / achievement.goal) * 100}
                className="h-2 bg-muted"
                indicatorClassName={
                  achievement.unlocked
                    ? "bg-gradient-to-r from-teal-500 to-highlight"
                    : "bg-gradient-to-r from-teal-800 to-teal-500"
                }
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
