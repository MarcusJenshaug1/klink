'use client'

import { Info, X, Users, ChevronLeft, ChevronRight, Flag, Tv, Pause, Play } from 'lucide-react'
import { useAthina } from '@/context/athina-context'
import { cn } from '@/lib/utils'

interface GameHudProps {
  onInfo: () => void
  onClose: () => void
  onNext: () => void
  onPrev: () => void
  onPlayers: () => void
  onFlag?: () => void
  onCast?: () => void
  onPause?: () => void
  paused?: boolean
  progress: { current: number; total: number }
  isTransitioning?: boolean
}

export function GameHud({ onInfo, onClose, onNext, onPrev, onPlayers, onFlag, onCast, onPause, paused = false, progress, isTransitioning = false }: GameHudProps) {
  const { isActive: athina } = useAthina()
  const canGoBack = progress.current > 1
  const pct = (progress.current / progress.total) * 100
  const iconButtonClass = cn(
    'flex h-11 w-11 items-center justify-center rounded-full border text-white shadow-sm backdrop-blur-sm transition-all hover:bg-white/25 active:scale-90 disabled:pointer-events-none disabled:opacity-45',
    athina ? 'border-white/20 bg-white/18' : 'border-white/10 bg-white/15'
  )

  return (
    <div className="absolute inset-0 pointer-events-none z-10">

      {/* Progress bar — top of screen */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-black/10">
        <div
          className={cn('h-full transition-all duration-300', athina ? 'bg-white/70' : 'bg-white/50')}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Top bar */}
      <div
        className="absolute top-[env(safe-area-inset-top,0px)] left-0 right-0 flex justify-between items-center px-4 pt-5 pointer-events-auto"
      >
        <button
          onClick={onInfo}
          aria-label="Spilleregler"
          className={iconButtonClass}
        >
          <Info className="w-5 h-5" />
        </button>

        <span className="rounded-full bg-black/10 px-3 py-1 text-xs font-bold tabular-nums tracking-wider text-white/70 backdrop-blur-sm">
          {progress.current} / {progress.total}
        </span>

        <button
          onClick={onClose}
          aria-label="Avslutt"
          className={iconButtonClass}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-[env(safe-area-inset-bottom,0px)] left-0 right-0 flex justify-between items-center px-4 pb-6 pointer-events-auto">

        <div className="flex items-center gap-2">
          <button
            onClick={onPlayers}
            aria-label="Spillere"
            className={iconButtonClass}
          >
            <Users className="w-5 h-5" />
          </button>
          {onPause && (
            <button
              onClick={onPause}
              aria-label={paused ? 'Fortsett' : 'Pause'}
              title={paused ? 'Fortsett' : 'Pause'}
              className={cn(iconButtonClass, 'text-white/80 hover:text-white')}
            >
              {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
          )}
          {onFlag && (
            <button
              onClick={onFlag}
              aria-label="Rapporter kort"
              title="Rapporter kort"
              className={cn(iconButtonClass, 'text-white/70 hover:text-white')}
            >
              <Flag className="w-4 h-4" />
            </button>
          )}
          {onCast && (
            <button
              onClick={onCast}
              aria-label="Cast til TV"
              title="Cast til TV"
              className={cn(iconButtonClass, 'text-white/70 hover:text-white')}
            >
              <Tv className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Nav buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            aria-label="Forrige kort"
            disabled={!canGoBack || isTransitioning}
            className={iconButtonClass}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={onNext}
            aria-label="Neste kort"
            disabled={isTransitioning}
            className={cn(
              'flex h-14 min-w-28 items-center justify-center gap-1.5 rounded-full px-5 text-base font-black shadow-xl transition-all hover:opacity-95 active:scale-[0.96] disabled:pointer-events-none disabled:opacity-60',
              athina ? 'bg-white/30 text-white' : 'bg-forest text-lime'
            )}
          >
            <span>Neste</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
