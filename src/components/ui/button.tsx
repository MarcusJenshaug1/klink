'use client'

import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-2xl transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        {
          'bg-forest text-cream hover:bg-forest-light': variant === 'primary',
          'bg-cream text-forest border-2 border-forest': variant === 'secondary',
          'bg-transparent text-forest': variant === 'ghost',
          'bg-red-500 text-white': variant === 'danger',
        },
        {
          'px-4 py-2 text-sm min-h-[36px]': size === 'sm',
          'px-6 py-3 text-base min-h-[44px]': size === 'md',
          'px-8 py-4 text-lg min-h-[52px] w-full': size === 'lg',
        },
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
