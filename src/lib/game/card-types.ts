import type { KortType } from '@/types/game'
import {
  Pointer,
  Box,
  Flame,
  Scale,
  Beer,
  LayoutList,
  Zap,
  type LucideIcon,
} from 'lucide-react'

interface CardTypeMeta {
  label: string
  icon: LucideIcon
}

export const CARD_TYPE_META: Record<KortType, CardTypeMeta> = {
  pekelek: { label: 'Pekelek', icon: Pointer },
  snusboks: { label: 'Snusboks', icon: Box },
  utfordring: { label: 'Utfordring', icon: Flame },
  regel: { label: 'Regel', icon: Scale },
  alle_drikker: { label: 'Jeg har aldri', icon: Beer },
  kategori: { label: 'Kategori', icon: LayoutList },
  kaos: { label: 'Klink', icon: Zap },
}
