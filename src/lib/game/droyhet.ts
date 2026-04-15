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
    beskrivelse: 'Flest normale, litt mild.',
  },
  droy: {
    label: 'Drøy',
    beskrivelse: 'Flest drøye, noen normal og mild.',
  },
}

/**
 * Vektet blanding. Antall kopier-multiplikator per kort basert på valgt drøyhet.
 *   mild  → kun mild-kort
 *   normal → flest normal, noen mild
 *   drøy  → flest drøy, noen normal, noen mild
 */
export const DROYHET_BLEND: Record<Droyhet, Record<Droyhet, number>> = {
  mild:   { mild: 2, normal: 0, droy: 0 },
  normal: { mild: 1, normal: 2, droy: 0 },
  droy:   { mild: 1, normal: 1, droy: 2 },
}

export function getDroyhetCopies(valgt: Droyhet, kortDroyhet: Droyhet): number {
  return DROYHET_BLEND[valgt][kortDroyhet] ?? 0
}

/** @deprecated Erstattet av getDroyhetCopies (vektet blanding). */
export function isDroyhetAllowed(kortDroyhet: Droyhet, valgt: Droyhet): boolean {
  return DROYHET_ORDER[kortDroyhet] <= DROYHET_ORDER[valgt]
}
