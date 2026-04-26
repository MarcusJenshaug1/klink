import type { Intensitet } from '@/types/game'

const SIP_RANGES: Record<Intensitet, [number, number]> = {
  lett: [1, 1],
  medium: [1, 4],
  borst: [1, 6],
}

export function getSips(intensitet: Intensitet): number {
  const [min, max] = SIP_RANGES[intensitet]
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const CHUG_THRESHOLD = 16

/**
 * Format a sip count for display.
 * >= 16 sips → "CHUG!" (chug the drink)
 */
export function formatSips(n: number): string {
  if (n >= CHUG_THRESHOLD) return 'CHUG!'
  return `${n} ${n === 1 ? 'slurk' : 'slurker'}`
}

export function isChugging(n: number): boolean {
  return n >= CHUG_THRESHOLD
}

/**
 * Replace {sips} placeholder in card text.
 * Handles "{sips} slurker", "{sips} slurk" and bare "{sips}".
 * When chugging, strips the trailing sip word.
 */
export function replaceSips(text: string, sips: number): string {
  if (sips >= CHUG_THRESHOLD) {
    // Replace "{sips} slurker" / "{sips} slurk" → "CHUG!"
    return text
      .replace(/\{sips\}\s+slurker/g, 'CHUG!')
      .replace(/\{sips\}\s+slurk\b/g, 'CHUG!')
      .replace(/\{sips\}/g, 'CHUG!')
  }
  return text.replace(/\{sips\}/g, String(sips))
}

export const INTENSITET_META: Record<Intensitet, { label: string; beskrivelse: string }> = {
  lett: {
    label: 'Pils',
    beskrivelse: 'Rolig runde. 1 slurk.',
  },
  medium: {
    label: 'Party',
    beskrivelse: 'Full stemning. 1–4 slurker.',
  },
  borst: {
    label: 'Blackout',
    beskrivelse: 'Ingen vei tilbake. 1–6 slurker.',
  },
}
