'use client'

import { useId, useState } from 'react'
import { HelpCircle, Users, Package, Play, X } from 'lucide-react'
import { useAthina } from '@/context/athina-context'
import { useDialogA11y } from '@/hooks/use-dialog-a11y'
import { cn } from '@/lib/utils'

const STEPS = [
  {
    icon: Users,
    title: 'Legg til spillere',
    body: 'Skriv navnene på alle som spiller — minst 2.',
  },
  {
    icon: Package,
    title: 'Velg pakker',
    body: 'Plukk én eller flere pakker. Juster intensitet (1 til 6 slurker) og drøyhet (snill eller vågal).',
  },
  {
    icon: Play,
    title: 'Spill kortene',
    body: 'Trykk Neste, swipe eller dobbeltrykk på skjermen. Kortet forteller hvem som drikker.',
  },
] as const

export function HowItWorks() {
  const { isActive: athina } = useAthina()
  const [open, setOpen] = useState(false)
  const titleId = useId()
  const dialogRef = useDialogA11y(open, () => setOpen(false))

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-bold transition-all active:scale-95',
          athina
            ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
            : 'bg-white/55 text-forest hover:bg-white/75'
        )}
      >
        <HelpCircle className="w-4 h-4" />
        Hvordan funker det?
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up overflow-hidden"
            style={{ backgroundColor: athina ? '#FF69B4' : '#A8E63D' }}
            onClick={(e) => e.stopPropagation()}
          >
            {athina && (
              <div className="absolute inset-0 rounded-t-3xl sm:rounded-3xl bg-[#FF1493]/30 pointer-events-none" />
            )}

            <div className="relative flex items-start justify-between gap-3 mb-5">
              <div>
                <h2
                  id={titleId}
                  className={cn(
                    'font-display font-black text-2xl leading-tight',
                    athina ? 'text-white' : 'text-forest'
                  )}
                >
                  Slik spiller du Klink
                </h2>
                <p
                  className={cn(
                    'text-sm font-medium mt-1',
                    athina ? 'text-white/70' : 'text-forest/55'
                  )}
                >
                  Tre korte steg, så er dere i gang.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Lukk"
                className={cn(
                  'shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition',
                  athina ? 'bg-white/25 text-white hover:bg-white/35' : 'bg-forest/15 text-forest hover:bg-forest/25'
                )}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ol className="relative flex flex-col gap-3">
              {STEPS.map((step, i) => {
                const Icon = step.icon
                return (
                  <li
                    key={i}
                    className={cn(
                      'flex items-start gap-3 rounded-2xl p-4',
                      athina ? 'bg-white/20' : 'bg-white/55'
                    )}
                  >
                    <div
                      className={cn(
                        'shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center',
                        athina ? 'bg-white text-[#FF1493]' : 'bg-forest text-lime'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          'font-black text-sm',
                          athina ? 'text-white' : 'text-forest'
                        )}
                      >
                        {i + 1}. {step.title}
                      </p>
                      <p
                        className={cn(
                          'text-sm leading-snug mt-0.5',
                          athina ? 'text-white/80' : 'text-forest/70'
                        )}
                      >
                        {step.body}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ol>

            <p
              className={cn(
                'mt-5 text-xs text-center',
                athina ? 'text-white/60' : 'text-forest/45'
              )}
            >
              Drikk ansvarlig. 18+.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
