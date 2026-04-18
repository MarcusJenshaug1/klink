'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Play, Beer, QrCode, UserPlus, Tv, LogIn } from 'lucide-react'
import type { Card } from '@/types/game'
import { CastModal } from '@/components/game/cast-modal'
import { Logo } from '@/components/landing/logo'
import { PlayerForm } from '@/components/landing/player-form'
import { QrJoinMode } from '@/components/landing/qr-join-mode'
import { InstallCta } from '@/components/landing/install-cta'
import { useGame } from '@/context/game-context'
import { useAthina } from '@/context/athina-context'
import { cn } from '@/lib/utils'

type PlayerMode = 'manual' | 'qr'

export default function LandingPage() {
  const router = useRouter()
  const { state, dispatch } = useGame()
  const { isActive } = useAthina()
  const [mode, setMode] = useState<PlayerMode>('manual')
  const [castOpen, setCastOpen] = useState(false)

  const validPlayers = state.players.filter((n) => n.trim() !== '')
  const canStart = validPlayers.length >= 2

  const handleStart = () => {
    if (!canStart) return
    dispatch({ type: 'SET_PLAYERS', players: validPlayers })
    dispatch({ type: 'SET_PHASE', phase: 'pack-selection' })
    router.push('/velg-pakke')
  }

  const handleQrReady = (players: string[], customCards: Card[]) => {
    dispatch({ type: 'SET_PLAYERS', players })
    if (customCards.length > 0) dispatch({ type: 'SET_CUSTOM_CARDS', cards: customCards })
    dispatch({ type: 'SET_PHASE', phase: 'pack-selection' })
    router.push('/velg-pakke')
  }

  const tabBase = cn(
    'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-black transition-all',
  )
  const tabActive = isActive
    ? 'bg-white/30 text-white shadow-sm'
    : 'bg-forest text-lime shadow-sm'
  const tabInactive = isActive
    ? 'text-white/50 hover:text-white/80'
    : 'text-forest/50 hover:text-forest/80'

  return (
    <div
      className="min-h-dvh flex flex-col transition-colors duration-700"
      style={{ backgroundColor: isActive ? 'transparent' : '#A8E63D' }}
    >
      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-0 max-w-md mx-auto w-full">
        <Logo className="text-center mb-10" />

        <div
          className="w-full backdrop-blur-sm rounded-3xl p-6 shadow-lg transition-colors duration-700"
          style={{ backgroundColor: isActive ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.6)' }}
        >
          {/* Mode toggle */}
          <div
            className={cn(
              'flex gap-1 p-1 rounded-2xl mb-5',
              isActive ? 'bg-white/10' : 'bg-forest/8'
            )}
          >
            <button
              onClick={() => setMode('manual')}
              className={cn(tabBase, mode === 'manual' ? tabActive : tabInactive)}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Legg til selv
            </button>
            <button
              onClick={() => setMode('qr')}
              className={cn(tabBase, mode === 'qr' ? tabActive : tabInactive)}
            >
              <QrCode className="w-3.5 h-3.5" />
              Skann inn
            </button>
          </div>

          {mode === 'manual' ? (
            <PlayerForm
              players={state.players}
              onUpdate={(players) => dispatch({ type: 'SET_PLAYERS', players })}
            />
          ) : (
            <QrJoinMode onPlayersReady={handleQrReady} />
          )}
        </div>

        <div className="mt-5">
          <InstallCta />
        </div>

        <Link
          href="/join"
          className={cn(
            'mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black transition-all active:scale-95',
            isActive ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-forest/10 text-forest hover:bg-forest/15'
          )}
        >
          <LogIn className="w-4 h-4" />
          Bli med i spill
        </Link>

        <p
          className="text-center text-xs mt-3 max-w-xs inline-flex items-center gap-1.5"
          style={{ color: isActive ? 'rgba(255,255,255,0.6)' : 'rgba(26,58,26,0.4)' }}
        >
          <Beer className="w-3.5 h-3.5 shrink-0" />
          <span>
            Drikk ansvarlig. 18+.{' '}
            <Link href="/personvern" className="underline hover:opacity-80">
              Personvern
            </Link>
          </span>
        </p>

        <div className="h-4" />
      </div>

      {/* Sticky start button — only shown in manual mode */}
      {mode === 'manual' && (
        <div
          className="sticky bottom-0 p-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] backdrop-blur-sm transition-colors duration-700"
          style={{ backgroundColor: isActive ? 'rgba(233,30,140,0.55)' : 'rgba(168,230,61,0.8)' }}
        >
          <div className="max-w-md mx-auto flex gap-2">
            <button
              onClick={() => setCastOpen(true)}
              aria-label="Cast til TV"
              className={cn(
                'shrink-0 w-14 min-h-[56px] rounded-2xl flex items-center justify-center transition-all active:scale-95',
                isActive ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-forest/15 text-forest hover:bg-forest/25'
              )}
            >
              <Tv className="w-5 h-5" />
            </button>
            <button
              onClick={handleStart}
              disabled={!canStart}
              className={cn(
                'flex-1 min-h-[56px] rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-95',
                canStart
                  ? isActive ? 'bg-white/30 text-white shadow-lg hover:bg-white/40 backdrop-blur-sm' : 'bg-forest text-lime shadow-lg hover:bg-forest-light'
                  : isActive ? 'bg-white/10 text-white/30 cursor-not-allowed' : 'bg-forest/20 text-forest/40 cursor-not-allowed'
              )}
            >
              <Play className="w-5 h-5" />
              Start spill
            </button>
          </div>
        </div>
      )}

      <CastModal open={castOpen} onClose={() => setCastOpen(false)} castCode={state.castCode} />
    </div>
  )
}
