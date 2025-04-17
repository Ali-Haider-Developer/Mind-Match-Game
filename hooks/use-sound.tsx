"use client"

import { useRef, useCallback } from "react"

interface UseSoundOptions {
  enabled: boolean
  sounds: Record<string, string>
}

export function useSound({ enabled, sounds }: UseSoundOptions) {
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({})

  // Preload sounds
  const preloadSounds = useCallback(() => {
    if (typeof window === "undefined") return

    Object.entries(sounds).forEach(([key, src]) => {
      if (!audioRefs.current[key]) {
        const audio = new Audio(src)
        audio.preload = "auto"
        audioRefs.current[key] = audio
      }
    })
  }, [sounds])

  // Play a sound
  const playSound = useCallback(
    (name: string) => {
      if (!enabled || typeof window === "undefined") return

      // Ensure sounds are preloaded
      if (!audioRefs.current[name] && sounds[name]) {
        preloadSounds()
      }

      const audio = audioRefs.current[name]
      if (audio) {
        audio.currentTime = 0
        audio.play().catch((err) => {
          // Ignore autoplay errors
          console.log("Audio play error:", err)
        })
      }
    },
    [enabled, sounds, preloadSounds],
  )

  return { playSound }
}
