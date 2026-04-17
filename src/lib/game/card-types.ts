import type { Korttype } from '@/types/game'
import {
  Pointer, Box, Flame, Scale, Beer, LayoutList, Zap,
  Star, Heart, Music, Laugh, Wine, PartyPopper, Gamepad2,
  Dices, Target, Award, Gift, Sparkles, Users, MessageCircle,
  ThumbsUp, Crown, Swords, Ghost, Rocket, Eye, Pizza,
  Coffee, Globe, Puzzle, Timer, Smile, Trophy, Hand,
  type LucideIcon,
} from 'lucide-react'

export interface CardTypeMeta {
  label: string
  icon: LucideIcon
  farge?: string
  beskrivelse?: string | null
}

// Built-in card types
export const CARD_TYPE_META: Record<string, CardTypeMeta> = {
  pekelek:     { label: 'Pekelek',      icon: Pointer    },
  snusboks:    { label: 'Snusboks',     icon: Box        },
  utfordring:  { label: 'Utfordring',   icon: Flame      },
  regel:       { label: 'Regel',        icon: Scale      },
  alle_drikker:{ label: 'Jeg har aldri',icon: Beer       },
  kategori:    { label: 'Kategori',     icon: LayoutList },
  kaos:        { label: 'Klink',        icon: Zap        },
  femfingre:   { label: 'Fem fingre',   icon: Hand       },
}

// Icon map: PascalCase name → LucideIcon component
// Used by the icon picker and custom korttype rendering
export const ICON_MAP: Record<string, LucideIcon> = {
  // Built-in reprisals
  Pointer, Box, Flame, Scale, Beer, LayoutList, Zap, Hand,
  // Custom-type icons
  Star, Heart, Music, Laugh, Wine, PartyPopper, Gamepad2,
  Dices, Target, Award, Gift, Sparkles, Users, MessageCircle,
  ThumbsUp, Crown, Swords, Ghost, Rocket, Eye, Pizza,
  Coffee, Globe, Puzzle, Timer, Smile, Trophy,
}

// All icon names available for the icon picker (excludes built-in-only icons)
export const PICKER_ICONS: string[] = [
  'Star', 'Heart', 'Music', 'Laugh', 'Wine', 'PartyPopper', 'Gamepad2',
  'Dices', 'Target', 'Award', 'Gift', 'Sparkles', 'Users', 'MessageCircle',
  'ThumbsUp', 'Crown', 'Swords', 'Ghost', 'Rocket', 'Eye', 'Pizza',
  'Coffee', 'Globe', 'Puzzle', 'Timer', 'Smile', 'Trophy',
  'Flame', 'Zap', 'Beer', 'Box', 'Pointer', 'Hand',
]

/**
 * Get display metadata for any card type — built-in or custom.
 * @param type   The kort.type value (built-in key or custom korttype UUID)
 * @param korttyper  Custom korttyper from the DB (optional)
 */
export function getCardTypeMeta(
  type: string,
  korttyper: Korttype[] = []
): CardTypeMeta {
  // 1. Built-in type
  if (type in CARD_TYPE_META) return CARD_TYPE_META[type]

  // 2. Custom type (UUID matches a korttype)
  const custom = korttyper.find((k) => k.id === type)
  if (custom) {
    return {
      label: custom.label,
      icon: ICON_MAP[custom.icon_name] ?? Star,
      farge: custom.farge,
      beskrivelse: custom.beskrivelse,
    }
  }

  // 3. Fallback
  return { label: type, icon: Star }
}
