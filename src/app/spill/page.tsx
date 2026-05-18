'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Pause } from 'lucide-react'
import { GameCard } from '@/components/game/game-card'
import { CardTypeIntro } from '@/components/game/card-type-intro'
import { CastModal } from '@/components/game/cast-modal'
import { GameHud } from '@/components/game/game-hud'
import { InfoModal } from '@/components/game/info-modal'
import { PlayerModal } from '@/components/game/player-modal'
import { ExitModal } from '@/components/game/exit-modal'
import { DeckEmpty } from '@/components/game/deck-empty'
import { FlagModal } from '@/components/game/flag-modal'
import { useGame } from '@/context/game-context'
import { useAthina } from '@/context/athina-context'
import { useSwipe } from '@/hooks/use-swipe'
import { useTvBroadcast } from '@/hooks/use-tv-cast'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { interpolateToSegments } from '@/lib/game/interpolate'
import { getSips, replaceSips } from '@/lib/game/sips'
import { track } from '@/lib/analytics/events'
import { cn } from '@/lib/utils'

type SlideDir = 'in-left' | 'out-left' | 'in-right' | 'out-right' | null

const NAV_HINT_KEY = 'klink-nav-hint-seen'

export default function GamePage() {
  const router = useRouter()
  const { state, dispatch, currentCard, currentPack, progress } = useGame()
  const { isActive: athina } = useAthina()
  const [infoOpen, setInfoOpen] = useState(false)
  const [playersOpen, setPlayersOpen] = useState(false)
  const [exitOpen, setExitOpen] = useState(false)
  const [flagOpen, setFlagOpen] = useState(false)
  const [castOpen, setCastOpen] = useState(false)
  const [animating, setAnimating] = useState(false)
  const [slideDir, setSlideDir] = useState<SlideDir>(null)
  const [paused, setPaused] = useState(false)
  const [showNavHint, setShowNavHint] = useState(false)
  const reducedMotion = useReducedMotion()

  const { broadcast } = useTvBroadcast(state.castCode)

  useThemeColor(currentPack?.farge ?? null)

  useEffect(() => {
    if (state.phase !== 'playing' && state.phase !== 'deck-empty') {
      router.push('/')
    }
  }, [state.phase, router])

  // Vis nav-hint én gang per session.
  useEffect(() => {
    if (state.phase !== 'playing') return
    try {
      if (!sessionStorage.getItem(NAV_HINT_KEY)) {
        setShowNavHint(true)
        sessionStorage.setItem(NAV_HINT_KEY, '1')
        const t = setTimeout(() => setShowNavHint(false), 4500)
        return () => clearTimeout(t)
      }
    } catch { /* ignore */ }
  }, [state.phase])

  // Broadcast current card to TV whenever it changes
  useEffect(() => {
    if (!currentCard || !currentPack || !state.castCode) return

    const override =
      state.intensitet === 'lett' ? currentCard.slurker_lett
      : state.intensitet === 'medium' ? currentCard.slurker_medium
      : currentCard.slurker_borst
    const sips = override != null ? override : getSips(state.intensitet)

    const seed = state.deckPlayerSeeds?.[state.currentCardIndex]
    const raw = interpolateToSegments(currentCard.innhold, state.players, seed)
    const segments = raw.map((s) =>
      s.type === 'text' ? { ...s, text: replaceSips(s.text, sips) } : s
    )

    const rawU = currentCard.utfordring
      ? interpolateToSegments(currentCard.utfordring, state.players, seed)
      : null
    const utfordringSegments =
      rawU?.map((s) => (s.type === 'text' ? { ...s, text: replaceSips(s.text, sips) } : s)) ?? null

    broadcast({
      segments,
      utfordringSegments,
      type: currentCard.type,
      tittel: currentCard.tittel,
      custom_author: currentCard.custom_author,
      hasTimer: !!currentCard.timer_sekunder,
      timerSekunder: currentCard.timer_sekunder,
      packFarge: currentPack.farge,
      packNavn: currentPack.navn,
      players: state.players,
      sips,
      cardIndex: progress.current,
      total: progress.total,
    })
  }, [state.currentCardIndex, state.castCode]) // eslint-disable-line react-hooks/exhaustive-deps

  const animateTransition = useCallback(
    (direction: 'forward' | 'back', action: () => void) => {
      if (animating) return
      if (reducedMotion) {
        action()
        return
      }
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
        }, 220)
      }, 160)
    },
    [animating, reducedMotion]
  )

  const nextCard = useCallback(() => {
    if (paused) return
    if (showNavHint) setShowNavHint(false)
    if (!reducedMotion) {
      try { if (navigator.vibrate) navigator.vibrate(10) } catch {}
    }
    animateTransition('forward', () => dispatch({ type: 'NEXT_CARD' }))
  }, [animateTransition, dispatch, reducedMotion, paused, showNavHint])

  const prevCard = useCallback(() => {
    if (paused) return
    if (state.currentCardIndex <= 0) return
    animateTransition('back', () => dispatch({ type: 'PREV_CARD' }))
  }, [animateTransition, dispatch, state.currentCardIndex, paused])

  const swipeHandlers = useSwipe({
    onSwipeLeft: paused ? () => {} : nextCard,
    onSwipeRight: paused ? () => {} : prevCard,
  })

  useEffect(() => {
    if (state.phase !== 'playing') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (infoOpen) { setInfoOpen(false); return }
        if (playersOpen) { setPlayersOpen(false); return }
        if (flagOpen) { setFlagOpen(false); return }
        if (castOpen) { setCastOpen(false); return }
        if (exitOpen) { setExitOpen(false); return }
        setExitOpen(true)
        return
      }
      if (infoOpen || playersOpen || exitOpen || flagOpen || castOpen) return
      if (paused) return
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
  }, [state.phase, infoOpen, playersOpen, exitOpen, flagOpen, castOpen, paused, nextCard, prevCard])

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

  const slideClass =
    slideDir === 'out-left'  ? 'animate-slide-out' :
    slideDir === 'out-right' ? 'animate-slide-out-right' :
    slideDir === 'in-right'  ? 'animate-slide-in' :
    slideDir === 'in-left'   ? 'animate-slide-in-left' :
    ''

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

      {/* Tydelig "ny korttype"-overlay når kort-typen endrer seg */}
      <CardTypeIntro type={currentCard.type} korttyper={state.korttyper} />

      {/* Nav-hint — vises én gang. Skjules i landscape for å ikke dekke kortinnhold. */}
      {showNavHint && (
        <div className="pointer-events-none absolute inset-x-0 bottom-32 z-[40] hidden justify-center px-4 animate-fade-in portrait:flex">
          <span
            className={cn(
              'rounded-full px-4 py-2 text-xs font-bold tracking-wide shadow-xl backdrop-blur-sm',
              athina ? 'bg-white/30 text-white' : 'bg-black/55 text-white'
            )}
          >
            Trykk Neste eller swipe ← → for å bla
          </span>
        </div>
      )}

      {/* Pause-overlay */}
      {paused && (
        <button
          type="button"
          onClick={() => setPaused(false)}
          className="absolute inset-0 z-[45] flex flex-col items-center justify-center gap-4 bg-black/55 backdrop-blur-md text-white"
        >
          <Pause className="w-14 h-14 opacity-75" />
          <p className="font-display text-3xl font-black">Pause</p>
          <p className="text-sm text-white/70">Trykk for å fortsette</p>
        </button>
      )}

      {/* HUD */}
      <GameHud
        onInfo={() => setInfoOpen(true)}
        onClose={handleClose}
        onNext={nextCard}
        onPrev={prevCard}
        onPlayers={() => setPlayersOpen(true)}
        onFlag={() => setFlagOpen(true)}
        onCast={() => setCastOpen(true)}
        onPause={() => setPaused((p) => !p)}
        paused={paused}
        progress={progress}
        isTransitioning={animating}
      />

      {/* Modals */}
      <InfoModal
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        packs={state.selectedPacks}
        currentCardType={currentCard.type}
        korttyper={state.korttyper}
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

      <CastModal open={castOpen} onClose={() => setCastOpen(false)} castCode={state.castCode} />
    </div>
  )
}
