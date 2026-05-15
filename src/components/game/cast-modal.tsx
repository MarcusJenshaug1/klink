'use client'

import { useState, useEffect, useCallback, useId } from 'react'
import { X, Copy, Check } from 'lucide-react'
import { useAthina } from '@/context/athina-context'
import { useDialogA11y } from '@/hooks/use-dialog-a11y'
import { cn } from '@/lib/utils'

interface CastModalProps {
  open: boolean
  onClose: () => void
  castCode: string | undefined
}

export function CastModal({ open, onClose, castCode }: CastModalProps) {
  const { isActive: athina } = useAthina()
  const [tvUrl, setTvUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const titleId = useId()
  const dialogRef = useDialogA11y(open, onClose)

  useEffect(() => {
    if (castCode) setTvUrl(`${window.location.origin}/tv/${castCode}`)
  }, [castCode])

  const handleCopy = useCallback(async () => {
    if (!tvUrl) return
    try {
      await navigator.clipboard.writeText(tvUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }, [tvUrl])

  if (!open) return null

  return (
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
        onClick={onClose}
      >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          'rounded-3xl p-6 w-full max-w-xs space-y-4 shadow-2xl transition-colors',
          athina ? 'bg-[#FF69B4] text-white' : 'bg-white'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <p id={titleId} className={cn('font-black text-lg', athina ? 'text-white' : 'text-forest')}>Cast til TV</p>
          <button
            onClick={onClose}
            aria-label="Lukk"
            className={cn(
              'w-11 h-11 rounded-full flex items-center justify-center transition-colors',
              athina ? 'bg-white/15 text-white/70 hover:bg-white/25' : 'bg-black/8 text-forest/50 hover:bg-black/12'
            )}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className={cn('text-sm font-medium', athina ? 'text-white/70' : 'text-forest/50')}>Skriv inn denne adressen i nettleseren på TV-en</p>

        {/* URL — big, clear, easy to read on any screen */}
        <button
          onClick={handleCopy}
          className={cn(
            'w-full active:scale-95 transition-all rounded-2xl px-4 py-4 text-left group',
            athina ? 'bg-white/15 hover:bg-white/25' : 'bg-forest/6 hover:bg-forest/10'
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className={cn('text-[10px] font-bold uppercase tracking-widest mb-1', athina ? 'text-white/50' : 'text-forest/40')}>TV-adresse</p>
              <p className={cn('font-black text-lg leading-tight break-all', athina ? 'text-white' : 'text-forest')}>
                {tvUrl || `…/tv/${castCode}`}
              </p>
            </div>
            <div className={cn('shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors', athina ? 'bg-white/20 group-hover:bg-white/30' : 'bg-forest/10 group-hover:bg-forest/20')}>
              {copied
                ? <Check className={cn('w-4 h-4', athina ? 'text-white' : 'text-forest')} />
                : <Copy className={cn('w-3.5 h-3.5', athina ? 'text-white/70' : 'text-forest/60')} />
              }
            </div>
          </div>
        </button>

        {copied && (
          <p className={cn('text-center text-xs font-semibold', athina ? 'text-white/70' : 'text-forest/50')}>Lenke kopiert!</p>
        )}

        <button
          onClick={onClose}
          className={cn(
            'w-full min-h-[44px] rounded-2xl font-black text-base transition-all active:scale-95',
            athina ? 'bg-white/30 text-white hover:bg-white/40' : 'bg-forest text-lime'
          )}
        >
          Lukk
        </button>
      </div>
    </div>
  )
}
