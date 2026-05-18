'use client'

import { useId, useState } from 'react'
import { X } from 'lucide-react'
import Markdown from 'react-markdown'
import { useAthina } from '@/context/athina-context'
import { useDialogA11y } from '@/hooks/use-dialog-a11y'
import { getCardTypeMeta } from '@/lib/game/card-types'
import { cn } from '@/lib/utils'
import type { Korttype, Pack } from '@/types/game'

interface InfoModalProps {
  open: boolean
  onClose: () => void
  packs: Pack[]
  currentCardType?: string
  korttyper?: Korttype[]
}

type Tab = 'type' | 'packs'

export function InfoModal({ open, onClose, packs, currentCardType, korttyper }: InfoModalProps) {
  const { isActive: athina } = useAthina()
  const titleId = useId()
  const dialogRef = useDialogA11y(open, onClose)
  const [activePackIdx, setActivePackIdx] = useState(0)
  const [tab, setTab] = useState<Tab>(currentCardType ? 'type' : 'packs')

  if (!open || packs.length === 0) return null

  const pack = packs[Math.min(activePackIdx, packs.length - 1)]
  const typeMeta = currentCardType ? getCardTypeMeta(currentCardType, korttyper ?? []) : null
  const TypeIcon = typeMeta?.icon

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative w-full max-w-lg rounded-t-3xl pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl animate-slide-up max-h-[85vh] flex flex-col transition-colors duration-500"
        style={{ backgroundColor: athina ? '#FF69B4' : '#A8E63D' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="pt-4 pb-2 flex justify-center shrink-0">
          <div className={cn('w-10 h-1 rounded-full', athina ? 'bg-white/25' : 'bg-forest/20')} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-3 shrink-0">
          <h2 id={titleId} className={cn('font-display text-2xl font-black', athina ? 'text-white' : 'text-forest')}>
            Hjelp
          </h2>
          <button
            onClick={onClose}
            aria-label="Lukk"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors shrink-0 ${athina ? 'bg-[#E91E8C]/15 text-[#E91E8C] hover:bg-[#E91E8C]/25' : 'bg-forest/10 text-forest hover:bg-forest/20'}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs: korttype + pakker */}
        {typeMeta && (
          <div className="flex gap-1 px-6 pb-3 shrink-0">
            <button
              onClick={() => setTab('type')}
              className={cn(
                'flex-1 py-2 rounded-xl text-xs font-black transition-colors',
                tab === 'type'
                  ? athina ? 'bg-[#E91E8C] text-white' : 'bg-forest text-lime'
                  : athina ? 'bg-[#E91E8C]/10 text-[#E91E8C]/70 hover:bg-[#E91E8C]/20' : 'bg-forest/10 text-forest/60 hover:bg-forest/20'
              )}
            >
              Dette kortet
            </button>
            <button
              onClick={() => setTab('packs')}
              className={cn(
                'flex-1 py-2 rounded-xl text-xs font-black transition-colors',
                tab === 'packs'
                  ? athina ? 'bg-[#E91E8C] text-white' : 'bg-forest text-lime'
                  : athina ? 'bg-[#E91E8C]/10 text-[#E91E8C]/70 hover:bg-[#E91E8C]/20' : 'bg-forest/10 text-forest/60 hover:bg-forest/20'
              )}
            >
              Pakker
            </button>
          </div>
        )}

        {/* Innhold */}
        <div className="px-6 overflow-y-auto pb-2">
          {tab === 'type' && typeMeta ? (
            <div className={cn(
              'rounded-2xl p-4',
              athina ? 'bg-white/18 text-white/90' : 'bg-white/60 text-forest/85'
            )}>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: typeMeta.farge ?? '#1A3A1A' }}
                >
                  {TypeIcon && <TypeIcon className="w-5 h-5" />}
                </div>
                <h3 className={cn('font-display text-xl font-black', athina ? 'text-white' : 'text-forest')}>
                  {typeMeta.label}
                </h3>
              </div>
              <p className="text-sm leading-relaxed">
                {typeMeta.beskrivelse ?? 'Ingen beskrivelse tilgjengelig.'}
              </p>
            </div>
          ) : (
            <>
              {/* Pack tabs — only shown when multiple packs */}
              {packs.length > 1 && (
                <div className="flex gap-2 pb-3 shrink-0 overflow-x-auto">
                  {packs.map((p, i) => (
                    <button
                      key={p.id}
                      onClick={() => setActivePackIdx(i)}
                      className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        i === activePackIdx
                          ? athina ? 'bg-[#E91E8C] text-white' : 'bg-forest text-lime'
                          : athina ? 'bg-[#E91E8C]/15 text-[#E91E8C]/70 hover:bg-[#E91E8C]/25' : 'bg-forest/10 text-forest/60 hover:bg-forest/20'
                      }`}
                    >
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle"
                        style={{ backgroundColor: p.farge }}
                      />
                      {p.navn}
                    </button>
                  ))}
                </div>
              )}

              {pack.regler ? (
                <div className={cn(
                  'backdrop-blur-sm rounded-2xl p-4 prose prose-sm max-w-none',
                  athina
                    ? 'bg-white/18 text-white/85 [&_strong]:text-white [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white'
                    : 'bg-white/60 text-forest/80 [&_strong]:text-forest [&_h1]:text-forest [&_h2]:text-forest [&_h3]:text-forest'
                )}>
                  <Markdown>{pack.regler}</Markdown>
                </div>
              ) : (
                <p className={cn('text-sm font-medium', athina ? 'text-white/50' : 'text-forest/40')}>
                  Ingen ekstra regler — bare følg kortene.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
