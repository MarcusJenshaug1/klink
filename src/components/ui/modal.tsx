'use client'

import { useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export function Modal({ open, onClose, children, className }: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, handleKeyDown])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      {/* Content */}
      <div
        className={cn(
          'relative w-full max-w-lg max-h-[85vh] overflow-y-auto',
          'bg-white/90 backdrop-blur-xl rounded-t-3xl sm:rounded-3xl',
          'p-6 shadow-2xl animate-slide-up',
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}
