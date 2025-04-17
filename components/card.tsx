"use client"

import { motion } from "framer-motion"
import type { CardType } from "@/components/mind-match"

interface CardProps {
  card: CardType
  onClick: () => void
  showHint?: boolean
}

export function Card({ card, onClick, showHint = false }: CardProps) {
  return (
    <motion.div
      className="aspect-square relative cursor-pointer"
      onClick={onClick}
      whileHover={{ scale: card.isFlipped ? 1 : 1.05 }}
      whileTap={{ scale: 0.95 }}
      layout
    >
      <motion.div
        className={`absolute inset-0 rounded-lg flex items-center justify-center text-2xl sm:text-3xl md:text-4xl card-back text-primary-foreground shadow-lg ${
          card.isMatched ? "opacity-80" : ""
        }`}
        initial={false}
        animate={{
          rotateY: card.isFlipped || showHint ? 180 : 0,
          opacity: card.isMatched ? 0.8 : 1,
        }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
        style={{ backfaceVisibility: "hidden" }}
      >
        <span className="animate-pulse">?</span>
      </motion.div>

      <motion.div
        className={`absolute inset-0 rounded-lg flex items-center justify-center text-2xl sm:text-3xl md:text-4xl shadow-lg ${
          card.isMatched ? "card-matched" : "card-front"
        }`}
        initial={false}
        animate={{
          rotateY: card.isFlipped || showHint ? 0 : -180,
          scale: card.isMatched ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 300,
          damping: 20,
          scale: { duration: card.isMatched ? 0.5 : 0 },
        }}
        style={{ backfaceVisibility: "hidden" }}
      >
        <span className={card.isMatched ? "animate-float" : ""}>{card.value}</span>
        {card.isMatched && (
          <motion.div
            className="absolute inset-0 rounded-lg bg-shimmer"
            animate={{ x: ["100%", "-100%"] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "linear" }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}
