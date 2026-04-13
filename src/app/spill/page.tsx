'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { GameCard } from '@/components/game/game-card'
import { GameHud } from '@/components/game/game-hud'
import { InfoModal } from '@/components/game/info-modal'
import { PlayerModal } from '@/components/game/player-modal'
import { ExitModal } from '@/components/game/exit-modal'
import { DeckEmpty } from '@/components/game/deck-empty'
import { useGame } from '@/context/game-context'
import { useSwipe } from '@/hooks/use-swipe'

type SlideDir = 'in-left' | 'out-left' | 'in-right' | 'out-right' | null

export default function GamePage() {
  const router = useRouter()
  const { state, dispatch, currentCard, currentPack, progress } = useGame()
  const [infoOpen, setInfoOpen] = useState(false)
  const [playersOpen, setPlayersOpen] = useState(false)
  const [exitOpen, setExitOpen] = useState(false)
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

  return (
    <div
      className="fixed inset-0 no-overscroll select-none"
      style={{ backgroundColor: currentPack.farge }}
      {...swipeHandlers}
    >
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
        progress={progress}
      />

      {/* Modals */}
      <InfoModal
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        pack={currentPack}
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
    </div>
  )
}
