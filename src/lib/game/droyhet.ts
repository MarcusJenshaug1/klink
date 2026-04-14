import type { Droyhet } from '@/types/game'

export const DROYHET_ORDER: Record<Droyhet, number> = {
  mild: 0,
  normal: 1,
  droy: 2,
}

export const DROYHET_META: Record<Droyhet, { label: string; beskrivelse: string }> = {
  mild: {
    label: 'Mild',
    beskrivelse: 'Trygge kort. Passer alle.',
  },
  normal: {
    label: 'Normal',
    beskrivelse: 'Standard innhold. Vanlig vorspiel.',
  },
  droy: {
    label: 'Drøy',
    beskrivelse: 'Alt med. Frekt og personlig.',
  },
}

/**
 * Kumulativ: Mild = kun mild. Normal = mild+normal. Drøy = alt.
 */
export function isDroyhetAllowed(kortDroyhet: Droyhet, valgt: Droyhet): boolean {
  return DROYHET_ORDER[kortDroyhet] <= DROYHET_ORDER[valgt]
}
