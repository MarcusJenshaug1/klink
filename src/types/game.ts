// Built-in card type values (stored as strings in DB)
export type KortType = string

export interface Korttype {
  id: string
  label: string
  icon_name: string
  farge: string
  beskrivelse?: string | null
}

export interface Pack {
  id: string
  navn: string
  beskrivelse: string | null
  regler: string | null
  farge: string
  ikon: string
  aktiv: boolean
}

export interface Card {
  id: string
  spillpakke_id: string
  type: KortType
  tittel: string
  innhold: string
  utfordring?: string | null
  timer_sekunder?: number | null
  timer_synlig?: boolean
}

export type Intensitet = 'lett' | 'medium' | 'borst'

export type GamePhase = 'landing' | 'pack-selection' | 'playing' | 'deck-empty'

export interface GameState {
  players: string[]
  selectedPacks: Pack[]
  deck: Card[]
  currentCardIndex: number
  phase: GamePhase
  intensitet: Intensitet
  korttyper: Korttype[]
}
