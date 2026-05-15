'use client'

import { useId } from 'react'
import { cn } from '@/lib/utils'
import { useDialogA11y } from '@/hooks/use-dialog-a11y'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  title?: string
}

export function Modal({ open, onClose, children, className, title }: ModalProps) {
  const titleId = useId()
  const dialogRef = useDialogA11y(open, onClose)

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
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={cn(
          'relative w-full max-w-lg max-h-[85vh] overflow-y-auto',
          'bg-white/90 backdrop-blur-xl rounded-t-3xl sm:rounded-3xl',
          'p-6 shadow-2xl animate-slide-up',
          className
        )}
      >
        {title && <h2 id={titleId} className="sr-only">{title}</h2>}
        {children}
      </div>
    </div>
  )
}
