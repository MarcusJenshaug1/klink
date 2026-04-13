'use client'

import { useRouter } from 'next/navigation'
import { Play } from 'lucide-react'
import { Logo } from '@/components/landing/logo'
import { PlayerForm } from '@/components/landing/player-form'
import { Button } from '@/components/ui/button'
import { useGame } from '@/context/game-context'

export default function LandingPage() {
  const router = useRouter()
  const { state, dispatch } = useGame()

  const validPlayers = state.players.filter((n) => n.trim() !== '')
  const canStart = validPlayers.length >= 2

  const handleStart = () => {
    if (!canStart) return
    dispatch({ type: 'SET_PLAYERS', players: validPlayers })
    dispatch({ type: 'SET_PHASE', phase: 'pack-selection' })
    router.push('/velg-pakke')
  }

  return (
    <div className="min-h-dvh bg-lime flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto w-full">
        <Logo className="text-center mb-10" />

        <div className="w-full bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
          <PlayerForm
            players={state.players}
            onUpdate={(players) => dispatch({ type: 'SET_PLAYERS', players })}
          />
        </div>

        <div className="w-full mt-6">
          <Button size="lg" onClick={handleStart} disabled={!canStart}>
            <Play className="w-5 h-5 mr-2" />
            Start spill
          </Button>
        </div>
      </div>
    </div>
  )
}
