'use client'

import { ICON_MAP, PICKER_ICONS } from '@/lib/game/card-types'
import { cn } from '@/lib/utils'

interface IconPickerProps {
  value: string
  onChange: (name: string) => void
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <div className="grid grid-cols-8 gap-1.5">
      {PICKER_ICONS.map((name) => {
        const Icon = ICON_MAP[name]
        if (!Icon) return null
        const selected = value === name
        return (
          <button
            key={name}
            type="button"
            title={name}
            onClick={() => onChange(name)}
            className={cn(
              'flex items-center justify-center w-9 h-9 rounded-xl border-2 transition-all',
              selected
                ? 'border-forest bg-forest text-white'
                : 'border-cream-dark/40 bg-cream text-forest/50 hover:border-forest/30 hover:text-forest'
            )}
          >
            <Icon className="w-4 h-4" />
          </button>
        )
      })}
    </div>
  )
}
