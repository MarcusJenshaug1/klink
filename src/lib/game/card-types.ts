import type { Korttype } from '@/types/game'
import {
  Pointer, Box, Flame, Scale, Beer, LayoutList, Zap,
  Star, Heart, Music, Laugh, Wine, PartyPopper, Gamepad2,
  Dices, Target, Award, Gift, Sparkles, Users, MessageCircle,
  ThumbsUp, Crown, Swords, Ghost, Rocket, Eye, Pizza,
  Coffee, Globe, Puzzle, Timer, Smile, Trophy, Hand, Bomb,
  Crosshair, Bus, EyeOff, HelpCircle,
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
  pekelek:      { label: 'Pekelek',       icon: Pointer,    farge: '#E8357A', beskrivelse: 'Alle peker på den personen påstanden passer best på. Flest pek drikker.' },
  snusboks:     { label: 'Snusboks',      icon: Box,        farge: '#4B3FC7', beskrivelse: 'Holder kaster gjenstanden til den de mener påstanden passer på. Den som mottar drikker.' },
  utfordring:   { label: 'Utfordring',    icon: Flame,      farge: '#FF7B35', beskrivelse: 'En spiller må fullføre utfordringen – klarer de det ikke, drikker de.' },
  regel:        { label: 'Regel',         icon: Scale,      farge: '#6B2D6B', beskrivelse: 'Ny regel gjelder til neste regelkort. Den som bryter regelen drikker.' },
  alle_drikker: { label: 'Jeg har aldri', icon: Beer,       farge: '#2D5A2D', beskrivelse: 'De som HAR gjort det som står på kortet, drikker.' },
  kategori:     { label: 'Kategori',      icon: LayoutList, farge: '#0E9E8E', beskrivelse: 'Si ting i kategorien på tur. Den som ikke klarer det drikker.' },
  kaos:         { label: 'Klink',         icon: Zap,        farge: '#1A3A1A', beskrivelse: 'Alle drikker – eller en spesiell regel gjelder for denne runden.' },
  femfingre:    { label: 'Fem fingre',    icon: Hand,       farge: '#1A3A1A', beskrivelse: 'Start med 5 fingre oppe. Legg ned én for hver påstand som gjelder deg. Tom hånd = drikk!' },
  bomba:        { label: 'Bomba',         icon: Bomb,       farge: '#B91C1C', beskrivelse: 'Send bomba videre! Den som holder den når den skjulte timeren går ut, drikker.' },
  duell:        { label: 'Duell',         icon: Swords,     farge: '#7C3AED', beskrivelse: 'To spillere spiller stein-saks-papir med pass-the-phone. Taperen drikker.' },
  reaksjon:     { label: 'Reaksjon',      icon: Target,     farge: '#D97706', beskrivelse: 'To spillere tester reaksjonsevnen på delt skjerm. Den som er senest, drikker.' },
  trekning:     { label: 'Trekning',      icon: Dices,      farge: '#0F766E', beskrivelse: 'Hjulet spinner og velger tilfeldig én spiller.' },
  roulette:     { label: 'Roulette',      icon: Crosshair,  farge: '#991B1B', beskrivelse: '6 kamre – spillere velger ett om gangen. Den som treffer kulen, drikker!' },
  bussen:       { label: 'Bussen',        icon: Bus,        farge: '#92400E', beskrivelse: '4 gjetterunder med spillkort: rød/sort → høyere/lavere → innenfor/utenfor → farge. Feil = slurker!' },
  oppdrag:      { label: 'Hemmelig oppdrag', icon: EyeOff,  farge: '#1E3A5F', beskrivelse: 'Én spiller ser oppdraget i 8 sek, gjennomfører det skjult. Lykkes de, drikker de andre – avsløres de, drikker de dobbelt.' },
  sannhet:      { label: 'Sannhet eller drikk', icon: HelpCircle, farge: '#065F46', beskrivelse: 'Svar ærlig – eller drikk. De andre stemmer om de tror på svaret. Tror ingen deg, drikker du uansett.' },
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
