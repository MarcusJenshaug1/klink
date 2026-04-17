'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Copy, Check } from 'lucide-react'

interface CastModalProps {
  open: boolean
  onClose: () => void
  castCode: string | undefined
}

export function CastModal({ open, onClose, castCode }: CastModalProps) {
  const [tvUrl, setTvUrl] = useState('')
  const [copied, setCopied] = useState(false)

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
        className="bg-white rounded-3xl p-6 w-full max-w-xs space-y-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <p className="font-black text-forest text-lg">Cast til TV</p>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/8 flex items-center justify-center text-forest/50 hover:bg-black/12 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-forest/50 text-sm font-medium">Skriv inn denne adressen i nettleseren på TV-en</p>

        {/* URL — big, clear, easy to read on any screen */}
        <button
          onClick={handleCopy}
          className="w-full bg-forest/6 hover:bg-forest/10 active:scale-95 transition-all rounded-2xl px-4 py-4 text-left group"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-forest/40 text-[10px] font-bold uppercase tracking-widest mb-1">TV-adresse</p>
              <p className="text-forest font-black text-lg leading-tight break-all">
                {tvUrl || `…/tv/${castCode}`}
              </p>
            </div>
            <div className="shrink-0 w-8 h-8 rounded-full bg-forest/10 group-hover:bg-forest/20 flex items-center justify-center transition-colors">
              {copied
                ? <Check className="w-4 h-4 text-forest" />
                : <Copy className="w-3.5 h-3.5 text-forest/60" />
              }
            </div>
          </div>
        </button>

        {copied && (
          <p className="text-center text-xs font-semibold text-forest/50">Lenke kopiert!</p>
        )}

        <button
          onClick={onClose}
          className="w-full min-h-[44px] rounded-2xl bg-forest text-lime font-black text-base transition-all active:scale-95"
        >
          Lukk
        </button>
      </div>
    </div>
  )
}
