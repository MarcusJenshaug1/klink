'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Play, Beer } from 'lucide-react'
import { Logo } from '@/components/landing/logo'
import { PlayerForm } from '@/components/landing/player-form'
import { useGame } from '@/context/game-context'
import { useAthina } from '@/context/athina-context'
import { cn } from '@/lib/utils'

export default function LandingPage() {
  const router = useRouter()
  const { state, dispatch } = useGame()
  const { isActive } = useAthina()

  const validPlayers = state.players.filter((n) => n.trim() !== '')
  const canStart = validPlayers.length >= 2

  const handleStart = () => {
    if (!canStart) return
    dispatch({ type: 'SET_PLAYERS', players: validPlayers })
    dispatch({ type: 'SET_PHASE', phase: 'pack-selection' })
    router.push('/velg-pakke')
  }

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
          <PlayerForm
            players={state.players}
            onUpdate={(players) => dispatch({ type: 'SET_PLAYERS', players })}
          />
        </div>

        <p
          className="text-center text-xs mt-6 max-w-xs inline-flex items-center gap-1.5"
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

      {/* Sticky start button */}
      <div
        className="sticky bottom-0 p-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] backdrop-blur-sm transition-colors duration-700"
        style={{ backgroundColor: isActive ? 'rgba(233,30,140,0.55)' : 'rgba(168,230,61,0.8)' }}
      >
        <div className="max-w-md mx-auto">
          <button
            onClick={handleStart}
            disabled={!canStart}
            className={cn(
              'w-full min-h-[56px] rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-95',
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
    </div>
  )
}
