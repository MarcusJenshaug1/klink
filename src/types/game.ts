export type KortType =
  | 'pekelek'
  | 'snusboks'
  | 'utfordring'
  | 'regel'
  | 'alle_drikker'
  | 'kategori'
  | 'kaos'

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
}
