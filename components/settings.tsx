"use client"

import { useState } from "react"
import { SettingsIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { Difficulty, Theme, TimerMode } from "@/components/mind-match"

interface SettingsProps {
  difficulty: Difficulty
  theme: Theme
  timerMode: TimerMode
  onChangeDifficulty: (difficulty: Difficulty) => void
  onChangeTheme: (theme: Theme) => void
  onChangeTimerMode: (timerMode: TimerMode) => void
}

export function Settings({
  difficulty,
  theme,
  timerMode,
  onChangeDifficulty,
  onChangeTheme,
  onChangeTimerMode,
}: SettingsProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="luxury-border">
          <SettingsIcon className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] luxury-panel">
        <DialogHeader>
          <DialogTitle className="bg-clip-text text-transparent bg-gradient-to-r from-teal-800 to-teal-500">
            Game Settings
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="difficulty" className="w-full">
          <TabsList className="grid w-full grid-cols-3 luxury-border">
            <TabsTrigger
              value="difficulty"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500/20 data-[state=active]:to-teal-800/20"
            >
              Difficulty
            </TabsTrigger>
            <TabsTrigger
              value="theme"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500/20 data-[state=active]:to-teal-800/20"
            >
              Theme
            </TabsTrigger>
            <TabsTrigger
              value="timer"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500/20 data-[state=active]:to-teal-800/20"
            >
              Timer
            </TabsTrigger>
          </TabsList>
          <TabsContent value="difficulty" className="space-y-4 pt-4">
            <RadioGroup
              value={difficulty}
              onValueChange={(value) => {
                onChangeDifficulty(value as Difficulty)
                setOpen(false)
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="easy" id="easy" />
                <Label htmlFor="easy">Easy (4x4)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">Medium (6x6)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hard" id="hard" />
                <Label htmlFor="hard">Hard (8x8)</Label>
              </div>
            </RadioGroup>
          </TabsContent>
          <TabsContent value="theme" className="space-y-4 pt-4">
            <RadioGroup
              value={theme}
              onValueChange={(value) => {
                onChangeTheme(value as Theme)
                setOpen(false)
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="emoji" id="emoji" />
                <Label htmlFor="emoji">Emoji</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fruits" id="fruits" />
                <Label htmlFor="fruits">Fruits</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="animals" id="animals" />
                <Label htmlFor="animals">Animals</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="space" id="space" />
                <Label htmlFor="space">Space</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sports" id="sports" />
                <Label htmlFor="sports">Sports</Label>
              </div>
            </RadioGroup>
          </TabsContent>
          <TabsContent value="timer" className="space-y-4 pt-4">
            <RadioGroup
              value={timerMode}
              onValueChange={(value) => {
                onChangeTimerMode(value as TimerMode)
                setOpen(false)
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="stopwatch" id="stopwatch" />
                <Label htmlFor="stopwatch">Stopwatch (Count Up)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="countdown" id="countdown" />
                <Label htmlFor="countdown">Countdown Timer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none">No Timer</Label>
              </div>
            </RadioGroup>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
