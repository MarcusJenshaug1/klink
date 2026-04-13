'use client'

import { useRef, useCallback } from 'react'

interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent) => void
  onTouchEnd: (e: React.TouchEvent) => void
}

interface UseSwipeOptions {
  onSwipeLeft: () => void
  onSwipeRight: () => void
  threshold?: number
}

function vibrate(ms: number) {
  try { navigator.vibrate?.(ms) } catch { /* unsupported */ }
}

export function useSwipe(
  { onSwipeLeft, onSwipeRight, threshold = 50 }: UseSwipeOptions
): SwipeHandlers {
  const startX = useRef(0)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }, [])

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const deltaX = startX.current - e.changedTouches[0].clientX
      if (deltaX > threshold) {
        vibrate(30)
        onSwipeLeft()
      } else if (deltaX < -threshold) {
        vibrate(30)
        onSwipeRight()
      }
    },
    [onSwipeLeft, onSwipeRight, threshold]
  )

  return { onTouchStart, onTouchEnd }
}
