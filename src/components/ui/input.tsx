'use client'

import { cn } from '@/lib/utils'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full px-4 py-3 min-h-[44px] rounded-2xl bg-white border-2 border-cream-dark',
        'text-charcoal placeholder:text-charcoal/40 font-medium',
        'focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20',
        'transition-colors',
        className
      )}
      {...props}
    />
  )
}
