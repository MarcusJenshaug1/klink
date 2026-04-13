import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  className?: string
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full',
        'text-sm font-extrabold uppercase tracking-wider',
        'bg-white/20 text-white backdrop-blur-sm',
        className
      )}
    >
      {children}
    </span>
  )
}
