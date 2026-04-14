'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import QRCode from 'react-qr-code'
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
import { useTvBroadcast } from '@/hooks/use-tv-cast'
import { interpolateToSegments } from '@/lib/game/interpolate'
import { getSips, replaceSips } from '@/lib/game/sips'
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
  const [castOpen, setCastOpen] = useState(false)
  const [tvUrl, setTvUrl] = useState('')
  const [animating, setAnimating] = useState(false)
  const [slideDir, setSlideDir] = useState<SlideDir>(null)

  const { broadcast } = useTvBroadcast(state.castCode)

  // Redirect if no deck loaded
  useEffect(() => {
    if (state.phase !== 'playing' && state.phase !== 'deck-empty') {
      router.push('/')
    }
  }, [state.phase, router])

  // Build TV URL client-side to avoid SSR mismatch
  useEffect(() => {
    if (state.castCode) setTvUrl(`${window.location.origin}/tv/${state.castCode}`)
  }, [state.castCode])

  // Broadcast current card to TV whenever it changes
  useEffect(() => {
    if (!currentCard || !currentPack || !state.castCode) return

    const override =
      state.intensitet === 'lett' ? currentCard.slurker_lett
      : state.intensitet === 'medium' ? currentCard.slurker_medium
      : currentCard.slurker_borst
    const sips = override != null ? override : getSips(state.intensitet)

    const raw = interpolateToSegments(currentCard.innhold, state.players)
    const segments = raw.map((s) =>
      s.type === 'text' ? { ...s, text: replaceSips(s.text, sips) } : s
    )

    const rawU = currentCard.utfordring
      ? interpolateToSegments(currentCard.utfordring, state.players)
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

  // Keyboard navigation
  useEffect(() => {
    if (state.phase !== 'playing') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (infoOpen) { setInfoOpen(false); return }
        if (playersOpen) { setPlayersOpen(false); return }
        if (flagOpen) { setFlagOpen(false); return }
        if (castOpen) { setCastOpen(false); return }
        if (exitOpen) { setExitOpen(false); return }
        return
      }
      if (infoOpen || playersOpen || exitOpen || flagOpen || castOpen) return
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
  }, [state.phase, infoOpen, playersOpen, exitOpen, flagOpen, castOpen, nextCard, prevCard])

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

      {/* HUD */}
      <GameHud
        onInfo={() => setInfoOpen(true)}
        onClose={handleClose}
        onNext={nextCard}
        onPrev={prevCard}
        onPlayers={() => setPlayersOpen(true)}
        onFlag={() => setFlagOpen(true)}
        onCast={() => setCastOpen(true)}
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

      {/* Cast to TV modal */}
      {castOpen && (
        <div
          className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setCastOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 w-full max-w-xs space-y-4 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-black text-forest text-lg">Cast til TV</p>
            <p className="text-forest/50 text-sm font-medium">Åpne denne adressen i nettleseren på TV-en</p>
            <div className="inline-block bg-white rounded-2xl p-3 shadow-sm">
              {tvUrl && <QRCode value={tvUrl} size={180} />}
            </div>
            <p className="text-forest/40 text-xs font-semibold break-all">{tvUrl}</p>
            <button
              onClick={() => setCastOpen(false)}
              className="w-full min-h-[44px] rounded-2xl bg-forest text-lime font-black text-base transition-all active:scale-95"
            >
              Lukk
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
