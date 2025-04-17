"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { Card } from "@/components/card"
import { GameControls } from "@/components/game-controls"
import { StatsDisplay } from "@/components/stats-display"
import { Settings } from "@/components/settings"
import { ThemeToggle } from "@/components/theme-toggle"
import { Achievements } from "@/components/achievements"
import { GameStats as GameStatsComponent } from "@/components/game-stats"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useSound } from "@/hooks/use-sound"
import { shuffleArray } from "@/lib/utils"
import { themes } from "@/lib/themes"
import { Trophy, Clock, Lightbulb, BarChart3, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type Difficulty = "easy" | "medium" | "hard"
export type Theme = "emoji" | "fruits" | "animals" | "space" | "sports"
export type TimerMode = "stopwatch" | "countdown" | "none"

export type CardType = {
  id: number
  value: string
  isFlipped: boolean
  isMatched: boolean
}

export type GameStats = {
  gamesPlayed: number
  gamesWon: number
  bestTime: Record<Difficulty, number>
  bestMoves: Record<Difficulty, number>
  totalMatches: number
  totalMoves: number
  totalTime: number
}

export type Achievement = {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  unlocked: boolean
  progress?: number
  goal?: number
}

const INITIAL_STATS: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  bestTime: { easy: Number.POSITIVE_INFINITY, medium: Number.POSITIVE_INFINITY, hard: Number.POSITIVE_INFINITY },
  bestMoves: { easy: Number.POSITIVE_INFINITY, medium: Number.POSITIVE_INFINITY, hard: Number.POSITIVE_INFINITY },
  totalMatches: 0,
  totalMoves: 0,
  totalTime: 0,
}

const COUNTDOWN_TIMES = {
  easy: 60,
  medium: 120,
  hard: 240,
}

export function MindMatch() {
  // Game state
  const [cards, setCards] = useState<CardType[]>([])
  const [flippedCards, setFlippedCards] = useState<CardType[]>([])
  const [moves, setMoves] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isGameComplete, setIsGameComplete] = useState(false)
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [hintsRemaining, setHintsRemaining] = useState(3)
  const [showHint, setShowHint] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [activeTab, setActiveTab] = useState("game")
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null)

  // Settings
  const [difficulty, setDifficulty] = useLocalStorage<Difficulty>("mindmatch-difficulty", "easy")
  const [theme, setTheme] = useLocalStorage<Theme>("mindmatch-theme", "emoji")
  const [timerMode, setTimerMode] = useLocalStorage<TimerMode>("mindmatch-timer-mode", "stopwatch")
  const [soundEnabled, setSoundEnabled] = useLocalStorage<boolean>("mindmatch-sound-enabled", true)
  const [bestScores, setBestScores] = useLocalStorage<Record<string, { moves: number; time: number }>>(
    "mindmatch-best-scores",
    {},
  )
  const [gameStats, setGameStats] = useLocalStorage<GameStats>("mindmatch-stats", INITIAL_STATS)
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>("mindmatch-achievements", [
    {
      id: "first_win",
      title: "First Victory",
      description: "Complete your first game",
      icon: <Trophy className="h-5 w-5 text-teal-500" />,
      unlocked: false,
    },
    {
      id: "speed_demon",
      title: "Speed Demon",
      description: "Complete an easy game in under 30 seconds",
      icon: <Clock className="h-5 w-5 text-accent" />,
      unlocked: false,
    },
    {
      id: "memory_master",
      title: "Memory Master",
      description: "Complete a hard game with less than 40 moves",
      icon: <Trophy className="h-5 w-5 text-primary" />,
      unlocked: false,
    },
    {
      id: "persistent",
      title: "Persistent",
      description: "Play 10 games",
      icon: <BarChart3 className="h-5 w-5 text-terracotta-500" />,
      unlocked: false,
      progress: 0,
      goal: 10,
    },
    {
      id: "no_hints",
      title: "Pure Memory",
      description: "Win a game without using hints",
      icon: <Lightbulb className="h-5 w-5 text-amber-500" />,
      unlocked: false,
    },
  ])

  // Sound effects
  const { playSound } = useSound({
    enabled: soundEnabled,
    sounds: {
      flip: "/sounds/card-flip.mp3",
      match: "/sounds/match.mp3",
      victory: "/sounds/victory.mp3",
      wrong: "/sounds/wrong.mp3",
      hint: "/sounds/hint.mp3",
      click: "/sounds/click.mp3",
      gameOver: "/sounds/game-over.mp3",
    },
  })

  // Get grid size based on difficulty
  const getGridSize = () => {
    switch (difficulty) {
      case "easy":
        return 4 // 4x4 = 16 cards (8 pairs)
      case "medium":
        return 6 // 6x6 = 36 cards (18 pairs)
      case "hard":
        return 8 // 8x8 = 64 cards (32 pairs)
      default:
        return 4
    }
  }

  // Initialize game
  const initializeGame = () => {
    const gridSize = getGridSize()
    const pairsCount = (gridSize * gridSize) / 2
    const themeItems = themes[theme].slice(0, pairsCount)

    const cardPairs = themeItems.flatMap((item, index) => [
      { id: index * 2, value: item, isFlipped: false, isMatched: false },
      { id: index * 2 + 1, value: item, isFlipped: false, isMatched: false },
    ])

    setCards(shuffleArray(cardPairs))
    setFlippedCards([])
    setMoves(0)
    setStartTime(null)
    setElapsedTime(timerMode === "countdown" ? COUNTDOWN_TIMES[difficulty] : 0)
    setIsGameComplete(false)
    setIsGameStarted(false)
    setHintsUsed(0)
    setHintsRemaining(3)
    setShowHint(false)
    setGameOver(false)
  }

  // Initialize game on mount and when difficulty/theme changes
  useEffect(() => {
    initializeGame()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty, theme, timerMode])

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (startTime && !isGameComplete && !gameOver) {
      interval = setInterval(() => {
        if (timerMode === "countdown") {
          setElapsedTime((prev) => {
            const newTime = prev - 1
            if (newTime <= 0) {
              setGameOver(true)
              playSound("gameOver")
              clearInterval(interval!)
              return 0
            }
            return newTime
          })
        } else if (timerMode === "stopwatch") {
          setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
        }
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [startTime, isGameComplete, gameOver, timerMode, playSound])

  // Check if game is complete
  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.isMatched) && !isGameComplete) {
      setIsGameComplete(true)

      // Play victory sound and trigger confetti
      playSound("victory")
      triggerConfetti()

      // Update best score
      const currentScore = { moves, time: elapsedTime }
      const key = `${difficulty}-${theme}`

      if (
        !bestScores[key] ||
        moves < bestScores[key].moves ||
        (moves === bestScores[key].moves && elapsedTime < bestScores[key].time)
      ) {
        setBestScores({
          ...bestScores,
          [key]: currentScore,
        })
      }

      // Update game stats
      const newStats = {
        ...gameStats,
        gamesPlayed: gameStats.gamesPlayed + 1,
        gamesWon: gameStats.gamesWon + 1,
        bestTime: {
          ...gameStats.bestTime,
          [difficulty]: Math.min(
            timerMode === "countdown" ? COUNTDOWN_TIMES[difficulty] - elapsedTime : elapsedTime,
            gameStats.bestTime[difficulty],
          ),
        },
        bestMoves: {
          ...gameStats.bestMoves,
          [difficulty]: Math.min(
            moves,
            gameStats.bestMoves[difficulty] === Number.POSITIVE_INFINITY ? moves : gameStats.bestMoves[difficulty],
          ),
        },
        totalMatches: gameStats.totalMatches + cards.length / 2,
        totalMoves: gameStats.totalMoves + moves,
        totalTime:
          gameStats.totalTime + (timerMode === "countdown" ? COUNTDOWN_TIMES[difficulty] - elapsedTime : elapsedTime),
      }
      setGameStats(newStats)

      // Check for achievements
      checkAchievements(newStats)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards, moves, elapsedTime])

  // Handle card click
  const handleCardClick = (clickedCard: CardType) => {
    // Start the game and timer on first card click
    if (!isGameStarted) {
      setIsGameStarted(true)
      setStartTime(Date.now())
    }

    // Ignore click if game is over or complete
    if (gameOver || isGameComplete) {
      return
    }

    // Ignore click if card is already flipped or matched
    if (clickedCard.isFlipped || clickedCard.isMatched || flippedCards.length >= 2) {
      return
    }

    // Play flip sound
    playSound("flip")

    // Flip the card
    const updatedCards = cards.map((card) => (card.id === clickedCard.id ? { ...card, isFlipped: true } : card))
    setCards(updatedCards)

    // Add to flipped cards
    const newFlippedCards = [...flippedCards, clickedCard]
    setFlippedCards(newFlippedCards)

    // If two cards are flipped, check for a match
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1)

      // Check if the cards match
      if (newFlippedCards[0].value === newFlippedCards[1].value) {
        // Play match sound
        playSound("match")

        // Mark cards as matched
        setTimeout(() => {
          setCards(
            cards.map((card) =>
              card.id === newFlippedCards[0].id || card.id === newFlippedCards[1].id
                ? { ...card, isFlipped: true, isMatched: true }
                : card,
            ),
          )
          setFlippedCards([])
        }, 500)
      } else {
        // Play wrong sound
        playSound("wrong")

        // Flip cards back
        setTimeout(() => {
          setCards(
            cards.map((card) =>
              card.id === newFlippedCards[0].id || card.id === newFlippedCards[1].id
                ? { ...card, isFlipped: false }
                : card,
            ),
          )
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  // Reset game
  const resetGame = () => {
    playSound("click")
    initializeGame()
  }

  // Change difficulty
  const changeDifficulty = (newDifficulty: Difficulty) => {
    playSound("click")
    setDifficulty(newDifficulty)
  }

  // Change theme
  const changeTheme = (newTheme: Theme) => {
    playSound("click")
    setTheme(newTheme)
  }

  // Change timer mode
  const changeTimerMode = (newTimerMode: TimerMode) => {
    playSound("click")
    setTimerMode(newTimerMode)
  }

  // Toggle sound
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
  }

  // Use hint
  const useHint = () => {
    if (hintsRemaining <= 0 || isGameComplete || gameOver || !isGameStarted) return

    playSound("hint")
    setHintsUsed(hintsUsed + 1)
    setHintsRemaining(hintsRemaining - 1)

    // Show all cards briefly
    setShowHint(true)
    setTimeout(() => {
      setShowHint(false)
    }, 1000)
  }

  // Check for achievements
  const checkAchievements = (stats: GameStats) => {
    const newAchievements = [...achievements]

    // First Victory
    if (!newAchievements.find((a) => a.id === "first_win")?.unlocked) {
      newAchievements.find((a) => a.id === "first_win")!.unlocked = true
    }

    // Speed Demon
    if (
      !newAchievements.find((a) => a.id === "speed_demon")?.unlocked &&
      difficulty === "easy" &&
      (timerMode === "stopwatch" ? elapsedTime < 30 : COUNTDOWN_TIMES.easy - elapsedTime < 30)
    ) {
      newAchievements.find((a) => a.id === "speed_demon")!.unlocked = true
    }

    // Memory Master
    if (!newAchievements.find((a) => a.id === "memory_master")?.unlocked && difficulty === "hard" && moves < 40) {
      newAchievements.find((a) => a.id === "memory_master")!.unlocked = true
    }

    // Persistent
    const persistentAchievement = newAchievements.find((a) => a.id === "persistent")!
    persistentAchievement.progress = stats.gamesPlayed
    if (stats.gamesPlayed >= 10) {
      persistentAchievement.unlocked = true
    }

    // Pure Memory
    if (!newAchievements.find((a) => a.id === "no_hints")?.unlocked && hintsUsed === 0) {
      newAchievements.find((a) => a.id === "no_hints")!.unlocked = true
    }

    setAchievements(newAchievements)
  }

  // Trigger confetti animation
  const triggerConfetti = () => {
    if (confettiCanvasRef.current) {
      const myConfetti = confetti.create(confettiCanvasRef.current, {
        resize: true,
        useWorker: true,
      })

      // Teal and terracotta confetti
      myConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#0FA4AF", "#AFD0E5", "#964734"],
      })
    }
  }

  // Get best score for current difficulty and theme
  const getBestScore = () => {
    const key = `${difficulty}-${theme}`
    return bestScores[key]
  }

  const gridSize = getGridSize()
  const bestScore = getBestScore()

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6">
      <motion.div
        className="w-full flex flex-col sm:flex-row justify-between items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold luxury-text-shadow bg-clip-text text-transparent bg-gradient-to-r from-teal-800 to-teal-500">
          Ali Haider's Mind Match
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSound}
            title={soundEnabled ? "Mute sounds" : "Enable sounds"}
            className="luxury-border"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Settings
            difficulty={difficulty}
            theme={theme}
            timerMode={timerMode}
            onChangeDifficulty={changeDifficulty}
            onChangeTheme={changeTheme}
            onChangeTimerMode={changeTimerMode}
          />
          <ThemeToggle />
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 luxury-border">
          <TabsTrigger
            value="game"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500/20 data-[state=active]:to-teal-800/20"
          >
            Game
          </TabsTrigger>
          <TabsTrigger
            value="stats"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500/20 data-[state=active]:to-teal-800/20"
          >
            Statistics
          </TabsTrigger>
          <TabsTrigger
            value="achievements"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500/20 data-[state=active]:to-teal-800/20"
          >
            Achievements
          </TabsTrigger>
        </TabsList>
        <TabsContent value="game" className="w-full">
          <div className="flex flex-col gap-6">
            <StatsDisplay
              moves={moves}
              time={elapsedTime}
              bestScore={bestScore}
              isGameComplete={isGameComplete}
              timerMode={timerMode}
              hintsRemaining={hintsRemaining}
              onUseHint={useHint}
            />

            <GameControls onReset={resetGame} difficulty={difficulty} onChangeDifficulty={changeDifficulty} />

            <motion.div
              className={`grid gap-2 sm:gap-4 w-full max-w-[90vh] relative`}
              style={{
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <AnimatePresence>
                {cards.map((card) => (
                  <Card key={card.id} card={card} onClick={() => handleCardClick(card)} showHint={showHint} />
                ))}
              </AnimatePresence>
            </motion.div>

            {isGameComplete && (
              <motion.div
                className="mt-6 p-6 luxury-panel rounded-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-highlight">
                  Congratulations, Ali Haider!
                </h2>
                <p className="mb-4">
                  You completed the game in {moves} moves and {formatTime(elapsedTime)}.
                </p>
                <button
                  onClick={resetGame}
                  className="px-6 py-3 bg-gradient-to-r from-teal-800 to-teal-500 text-primary-foreground rounded-md hover:opacity-90 transition-all shadow-md"
                >
                  Play Again
                </button>
              </motion.div>
            )}

            {gameOver && !isGameComplete && (
              <motion.div
                className="mt-6 p-6 luxury-panel rounded-lg text-center border-destructive/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-destructive mb-2">Time's Up!</h2>
                <p className="mb-4">You ran out of time. Try again!</p>
                <button
                  onClick={resetGame}
                  className="px-6 py-3 bg-gradient-to-r from-teal-800 to-teal-500 text-primary-foreground rounded-md hover:opacity-90 transition-all shadow-md"
                >
                  Try Again
                </button>
              </motion.div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="stats">
          <GameStatsComponent stats={gameStats} />
        </TabsContent>
        <TabsContent value="achievements">
          <Achievements achievements={achievements} />
        </TabsContent>
      </Tabs>

      {/* Personal signature */}
      <div className="w-full text-center mt-4 text-sm text-muted-foreground">
        <p>Created for Ali Haider | {new Date().getFullYear()}</p>
      </div>

      {/* Hidden canvas for confetti */}
      <canvas
        ref={confettiCanvasRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  )
}
