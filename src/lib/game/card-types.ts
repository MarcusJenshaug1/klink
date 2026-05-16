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
  pekelek:      { label: 'Pekelek',       icon: Pointer,    farge: '#E8357A' },
  snusboks:     { label: 'Snusboks',      icon: Box,        farge: '#4B3FC7' },
  utfordring:   { label: 'Utfordring',    icon: Flame,      farge: '#FF7B35' },
  regel:        { label: 'Regel',         icon: Scale,      farge: '#6B2D6B' },
  alle_drikker: { label: 'Jeg har aldri', icon: Beer,       farge: '#2D5A2D' },
  kategori:     { label: 'Kategori',      icon: LayoutList, farge: '#0E9E8E' },
  kaos:         { label: 'Klink',         icon: Zap,        farge: '#1A3A1A' },
  femfingre:    { label: 'Fem fingre',    icon: Hand,       farge: '#1A3A1A' },
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

export function colorWithAlpha(
  color: string | undefined,
  alpha: number,
  fallback = `rgba(255, 255, 255, ${alpha})`
): string {
  if (!color?.startsWith('#')) return fallback

  const raw = color.slice(1)
  const hex = raw.length === 3
    ? raw.split('').map((ch) => `${ch}${ch}`).join('')
    : raw

  if (!/^[0-9a-f]{6}$/i.test(hex)) return fallback

  const r = Number.parseInt(hex.slice(0, 2), 16)
  const g = Number.parseInt(hex.slice(2, 4), 16)
  const b = Number.parseInt(hex.slice(4, 6), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
