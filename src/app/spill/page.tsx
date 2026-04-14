'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { GameCard } from '@/components/game/game-card'
import { GameHud } from '@/components/game/game-hud'
import { InfoModal } from '@/components/game/info-modal'
import { PlayerModal } from '@/components/game/player-modal'
import { ExitModal } from '@/components/game/exit-modal'
import { DeckEmpty } from '@/components/game/deck-empty'
import { FlagModal } from '@/components/game/flag-modal'
import { useGame } from '@/context/game-context'
import { useAthina } from '@/context/athina-context'
import { useSwipe } from '@/hooks/use-swipe'
import { track } from '@/lib/analytics/events'

type SlideDir = 'in-left' | 'out-left' | 'in-right' | 'out-right' | null

export default function GamePage() {
  const router = useRouter()
  const { state, dispatch, currentCard, currentPack, progress } = useGame()
  const { isActive: athina } = useAthina()
  const [infoOpen, setInfoOpen] = useState(false)
  const [playersOpen, setPlayersOpen] = useState(false)
  const [exitOpen, setExitOpen] = useState(false)
  const [flagOpen, setFlagOpen] = useState(false)
  const [animating, setAnimating] = useState(false)
  const [slideDir, setSlideDir] = useState<SlideDir>(null)

  // Redirect if no deck loaded
  useEffect(() => {
    if (state.phase !== 'playing' && state.phase !== 'deck-empty') {
      router.push('/')
    }
  }, [state.phase, router])

  const animateTransition = useCallback(
    (direction: 'forward' | 'back', action: () => void) => {
      if (animating) return
      setAnimating(true)

      const outDir: SlideDir = direction === 'forward' ? 'out-left' : 'out-right'
      const inDir: SlideDir  = direction === 'forward' ? 'in-right' : 'in-left'

      setSlideDir(outDir)
      setTimeout(() => {
        action()
        setSlideDir(inDir)
        setTimeout(() => {
          setSlideDir(null)
          setAnimating(false)
        }, 300)
      }, 250)
    },
    [animating]
  )

  const nextCard = useCallback(() => {
    // Haptic feedback on mobile (best-effort, silent no-op on desktop/unsupported)
    try { if (navigator.vibrate) navigator.vibrate(10) } catch {}
    animateTransition('forward', () => dispatch({ type: 'NEXT_CARD' }))
  }, [animateTransition, dispatch])

  const prevCard = useCallback(() => {
    if (state.currentCardIndex <= 0) return
    animateTransition('back', () => dispatch({ type: 'PREV_CARD' }))
  }, [animateTransition, dispatch, state.currentCardIndex])

  const swipeHandlers = useSwipe({
    onSwipeLeft: nextCard,
    onSwipeRight: prevCard,
  })

  // Keyboard navigation (desktop): ← → for prev/next, space = next, ESC = close modals
  useEffect(() => {
    if (state.phase !== 'playing') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (infoOpen) { setInfoOpen(false); return }
        if (playersOpen) { setPlayersOpen(false); return }
        if (flagOpen) { setFlagOpen(false); return }
        if (exitOpen) { setExitOpen(false); return }
        return
      }
      if (infoOpen || playersOpen || exitOpen || flagOpen) return
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        nextCard()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevCard()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state.phase, infoOpen, playersOpen, exitOpen, flagOpen, nextCard, prevCard])

  // Track deck_completed once when we enter deck-empty
  useEffect(() => {
    if (state.phase === 'deck-empty') {
      track('deck_completed', { cards: state.deck.length, players: state.players.length })
    }
  }, [state.phase, state.deck.length, state.players.length])

  const handleClose = () => setExitOpen(true)

  const handleNewPacks = () => {
    setExitOpen(false)
    router.push('/velg-pakke')
  }

  const handleReset = () => {
    setExitOpen(false)
    dispatch({ type: 'RESET' })
    router.push('/')
  }

  const handleReshuffle = () => {
    dispatch({ type: 'RESHUFFLE' })
  }

  const handleDeckNewPacks = () => {
    router.push('/velg-pakke')
  }

  // Slide animation class
  const slideClass =
    slideDir === 'out-left'  ? 'animate-slide-out' :
    slideDir === 'out-right' ? 'animate-slide-out-right' :
    slideDir === 'in-right'  ? 'animate-slide-in' :
    slideDir === 'in-left'   ? 'animate-slide-in-left' :
    ''

  // Deck empty screen
  if (state.phase === 'deck-empty') {
    return (
      <DeckEmpty
        onReshuffle={handleReshuffle}
        onNewPacks={handleDeckNewPacks}
        onReset={handleReset}
      />
    )
  }

  if (!currentCard || !currentPack) return null

  const scareActive = state.intensitet === 'borst' && state.droyhet === 'droy'

  return (
    <div
      className="fixed inset-0 no-overscroll select-none"
      style={{ backgroundColor: athina ? 'transparent' : currentPack.farge }}
      {...swipeHandlers}
    >
      {scareActive && (
        <div
          className="pointer-events-none fixed inset-0 z-[50] animate-blood-pulse"
          aria-hidden
        />
      )}
      {/* Card */}
      <div
        className={slideClass}
        style={{ position: 'absolute', inset: 0 }}
      >
        <GameCard
          card={currentCard}
          pack={currentPack}
          players={state.players}
          intensitet={state.intensitet}
          korttyper={state.korttyper}
          onNext={nextCard}
        />
      </div>

      {/* HUD */}
      <GameHud
        onInfo={() => setInfoOpen(true)}
        onClose={handleClose}
        onNext={nextCard}
        onPrev={prevCard}
        onPlayers={() => setPlayersOpen(true)}
        onFlag={() => setFlagOpen(true)}
        progress={progress}
      />

      {/* Modals */}
      <InfoModal
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        packs={state.selectedPacks}
      />

      <PlayerModal
        open={playersOpen}
        onClose={() => setPlayersOpen(false)}
        players={state.players}
        onAddPlayer={(name) => dispatch({ type: 'ADD_PLAYER', name })}
        onRemovePlayer={(index) => dispatch({ type: 'REMOVE_PLAYER', index })}
      />

      <ExitModal
        open={exitOpen}
        onClose={() => setExitOpen(false)}
        onNewPacks={handleNewPacks}
        onReset={handleReset}
      />

      <FlagModal
        open={flagOpen}
        cardId={currentCard?.id ?? null}
        onClose={() => setFlagOpen(false)}
      />
    </div>
  )
}
