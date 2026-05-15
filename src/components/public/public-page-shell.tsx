'use client'

import type { ReactNode } from 'react'
import { useAthina } from '@/context/athina-context'
import { cn } from '@/lib/utils'

interface PublicPageShellProps {
  children: ReactNode
  className?: string
}

export function PublicPageShell({ children, className }: PublicPageShellProps) {
  const { isActive: athina } = useAthina()

  return (
    <main
      data-athina-public={athina ? 'true' : undefined}
      className={cn(
        'athina-public relative min-h-dvh transition-colors duration-700',
        athina ? 'bg-transparent text-white' : 'bg-lime text-forest',
        className
      )}
    >
      {children}
    </main>
  )
}
