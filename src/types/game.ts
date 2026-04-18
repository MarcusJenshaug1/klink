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
  droyhet?: Droyhet
}

export type Droyhet = 'mild' | 'normal' | 'droy'
export type Kjonn = 'alle' | 'mann' | 'kvinne'
export type Vekt = 'sjelden' | 'vanlig' | 'ofte'

export interface Card {
  id: string
  spillpakke_id: string
  type: KortType
  tittel: string
  innhold: string
  utfordring?: string | null
  timer_sekunder?: number | null
  timer_synlig?: boolean
  timer_auto_start?: boolean
  timer_forsinkelse?: number | null
  aktiv?: boolean
  droyhet?: Droyhet
  min_spillere?: number
  slurker_lett?: number | null
  slurker_medium?: number | null
  slurker_borst?: number | null
  notater?: string | null
  kjonn?: Kjonn
  vekt?: Vekt
  custom_author?: string
  paastander?: string[] | null
}

export type Intensitet = 'lett' | 'medium' | 'borst'

export type GamePhase = 'landing' | 'pack-selection' | 'playing' | 'deck-empty'

export interface GameState {
  players: string[]
  selectedPacks: Pack[]
  cards: Card[]   // original unweighted cards — used for reshuffle
  deck: Card[]
  currentCardIndex: number
  phase: GamePhase
  intensitet: Intensitet
  droyhet: Droyhet
  korttyper: Korttype[]
  customCards: Card[]
  castCode?: string
  deckPlayerSeeds: string[][]
}
