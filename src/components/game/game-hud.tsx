'use client'

import { Info, X, Users, ChevronLeft, ChevronRight, Flag, Tv } from 'lucide-react'

interface GameHudProps {
  onInfo: () => void
  onClose: () => void
  onNext: () => void
  onPrev: () => void
  onPlayers: () => void
  onFlag?: () => void
  onCast?: () => void
  progress: { current: number; total: number }
}

export function GameHud({ onInfo, onClose, onNext, onPrev, onPlayers, onFlag, onCast, progress }: GameHudProps) {
  const canGoBack = progress.current > 1
  const pct = (progress.current / progress.total) * 100

  return (
    <div className="absolute inset-0 pointer-events-none z-10">

      {/* Progress bar — top of screen */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-black/10">
        <div
          className="h-full bg-white/50 transition-all duration-300"
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
          className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 active:scale-90 transition-all"
        >
          <Info className="w-5 h-5" />
        </button>

        <span className="text-white/40 text-xs font-bold tabular-nums tracking-wider">
          {progress.current} / {progress.total}
        </span>

        <button
          onClick={onClose}
          aria-label="Avslutt"
          className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 active:scale-90 transition-all"
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
            className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 active:scale-90 transition-all"
          >
            <Users className="w-5 h-5" />
          </button>
          {onFlag && (
            <button
              onClick={onFlag}
              aria-label="Rapporter kort"
              title="Rapporter kort"
              className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-white/25 active:scale-90 transition-all"
            >
              <Flag className="w-4 h-4" />
            </button>
          )}
          {onCast && (
            <button
              onClick={onCast}
              aria-label="Cast til TV"
              title="Cast til TV"
              className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-white/25 active:scale-90 transition-all"
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
            className={`w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 active:scale-90 transition-all ${
              canGoBack ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={onNext}
            aria-label="Neste kort"
            className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 active:scale-90 transition-all shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  )
}
