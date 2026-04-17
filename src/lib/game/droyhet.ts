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
    beskrivelse: 'Mild + normale kort.',
  },
  droy: {
    label: 'Drøy',
    beskrivelse: 'Alle drøyhetsnivåer.',
  },
}

/**
 * Filtreringsmatrise. 1 = inkluder kortet (én gang), 0 = ekskluder.
 *   mild   → kun mild-kort
 *   normal → mild + normal
 *   drøy   → alle
 */
export const DROYHET_BLEND: Record<Droyhet, Record<Droyhet, number>> = {
  mild:   { mild: 1, normal: 0, droy: 0 },
  normal: { mild: 1, normal: 1, droy: 0 },
  droy:   { mild: 1, normal: 1, droy: 1 },
}

export function getDroyhetCopies(valgt: Droyhet, kortDroyhet: Droyhet): number {
  return DROYHET_BLEND[valgt][kortDroyhet] ?? 0
}

/** @deprecated Erstattet av getDroyhetCopies (vektet blanding). */
export function isDroyhetAllowed(kortDroyhet: Droyhet, valgt: Droyhet): boolean {
  return DROYHET_ORDER[kortDroyhet] <= DROYHET_ORDER[valgt]
}
