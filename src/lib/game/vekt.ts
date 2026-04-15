import type { Vekt } from '@/types/game'

export const VEKT_MULTIPLIER: Record<Vekt, number> = {
  sjelden: 1,
  vanlig: 1,
  ofte: 1,
}

export const VEKT_META: Record<Vekt, { label: string; beskrivelse: string }> = {
  sjelden: { label: 'Sjelden', beskrivelse: 'Engangs-opplevelse' },
  vanlig: { label: 'Vanlig', beskrivelse: 'Standard frekvens' },
  ofte: { label: 'Ofte', beskrivelse: 'Dukker opp hyppig' },
}
