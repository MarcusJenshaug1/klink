'use client'

import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  variant?: 'overlay' | 'default'
}

export function IconButton({
  label,
  variant = 'default',
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={cn(
        'inline-flex items-center justify-center rounded-full transition-transform active:scale-95',
        'min-w-[44px] min-h-[44px]',
        {
          'bg-white/20 text-white backdrop-blur-sm hover:bg-white/30':
            variant === 'overlay',
          'bg-cream-dark text-charcoal hover:bg-cream-dark/80':
            variant === 'default',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
