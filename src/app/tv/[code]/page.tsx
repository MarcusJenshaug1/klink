'use client'

import { use } from 'react'
import { useTvReceive } from '@/hooks/use-tv-cast'
import { Trophy } from 'lucide-react'
import type { TvCardPayload } from '@/hooks/use-tv-cast'
import type { Segment } from '@/lib/game/interpolate'

function SegmentText({ segments }: { segments: Segment[] }) {
  return (
    <>
      {segments.map((seg, i) =>
        seg.type === 'player' ? (
          <mark
            key={i}
            className="inline-block not-italic bg-white/30 text-white font-black px-3 py-0.5 rounded-full mx-1 text-[0.9em]"
          >
            {seg.name}
          </mark>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </>
  )
}

function WaitingScreen({ code, connected }: { code: string; connected: boolean }) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-[#A8E63D] p-8 text-center">
      <p className="font-display text-8xl font-black text-forest tracking-tight leading-none">
        Klink
      </p>
      <p className="text-forest/60 font-bold text-2xl mt-3">TV-modus</p>

      <div className="mt-10 px-8 py-5 bg-forest/10 rounded-3xl">
        <p className="text-forest/40 text-sm font-bold uppercase tracking-widest mb-2">Kode</p>
        <p className="text-forest font-black text-5xl tracking-[0.2em]">{code}</p>
      </div>

      <p className="text-forest/50 font-semibold mt-8 text-xl">
        {connected ? 'Venter på at spillet starter…' : 'Kobler til…'}
      </p>
    </div>
  )
}

function PlayingScreen({ payload }: { payload: TvCardPayload }) {
  return (
    <div
      className="min-h-dvh flex flex-col p-8 lg:p-14 transition-colors duration-500"
      style={{ backgroundColor: payload.packFarge }}
    >
      {/* Top bar */}
      <div className="flex justify-between items-center">
        <span className="text-white/60 font-black text-xl uppercase tracking-widest">
          {payload.packNavn}
        </span>
        <span className="text-white/40 font-bold text-lg tabular-nums">
          {payload.cardIndex} / {payload.total}
        </span>
      </div>

      {/* Card content — vertically centered */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 py-10 max-w-5xl mx-auto w-full text-center">
        <p className="text-white text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-relaxed">
          <SegmentText segments={payload.segments} />
        </p>

        {payload.utfordringSegments && (
          <div className="w-full max-w-3xl rounded-3xl bg-black/20 px-8 py-6 flex items-start gap-5">
            <Trophy className="w-7 h-7 text-white/60 shrink-0 mt-1" />
            <p className="text-white/85 text-xl lg:text-2xl font-semibold leading-snug text-left">
              <SegmentText segments={payload.utfordringSegments} />
            </p>
          </div>
        )}

        {payload.custom_author && (
          <p className="text-white/35 text-lg font-medium">— {payload.custom_author}</p>
        )}
      </div>

      {/* Bottom: player chips */}
      <div className="flex flex-wrap justify-center gap-3">
        {payload.players.map((p) => (
          <span
            key={p}
            className="px-5 py-2 rounded-full bg-white/15 text-white font-semibold text-lg"
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function TvPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const { payload, connected } = useTvReceive(code.toUpperCase())

  if (!payload) {
    return <WaitingScreen code={code.toUpperCase()} connected={connected} />
  }

  return <PlayingScreen payload={payload} />
}
