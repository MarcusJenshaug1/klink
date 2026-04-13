'use client'

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from 'react'
import type { Card, Pack, GamePhase, GameState, Intensitet, Korttype } from '@/types/game'
import { shuffle } from '@/lib/game/shuffle'

type GameAction =
  | { type: 'SET_PLAYERS'; players: string[] }
  | { type: 'ADD_PLAYER'; name: string }
  | { type: 'REMOVE_PLAYER'; index: number }
  | { type: 'SELECT_PACKS'; packs: Pack[] }
  | { type: 'START_GAME'; cards: Card[] }
  | { type: 'NEXT_CARD' }
  | { type: 'PREV_CARD' }
  | { type: 'RESHUFFLE' }
  | { type: 'SET_PHASE'; phase: GamePhase }
  | { type: 'SET_INTENSITET'; intensitet: Intensitet }
  | { type: 'SET_KORTTYPER'; korttyper: Korttype[] }
  | { type: 'RESET' }
  | { type: 'RESTORE_STATE'; state: GameState }

const initialState: GameState = {
  players: [],
  selectedPacks: [],
  deck: [],
  currentCardIndex: 0,
  phase: 'landing',
  intensitet: 'medium',
  korttyper: [],
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PLAYERS':
      return { ...state, players: action.players }

    case 'ADD_PLAYER':
      return { ...state, players: [...state.players, action.name] }

    case 'REMOVE_PLAYER':
      return {
        ...state,
        players: state.players.filter((_, i) => i !== action.index),
      }

    case 'SELECT_PACKS':
      return { ...state, selectedPacks: action.packs }

    case 'START_GAME':
      return {
        ...state,
        deck: shuffle(action.cards),
        currentCardIndex: 0,
        phase: 'playing',
      }

    case 'NEXT_CARD': {
      const nextIndex = state.currentCardIndex + 1
      if (nextIndex >= state.deck.length) {
        return { ...state, currentCardIndex: nextIndex, phase: 'deck-empty' }
      }
      return { ...state, currentCardIndex: nextIndex }
    }

    case 'PREV_CARD': {
      const prevIndex = state.currentCardIndex - 1
      if (prevIndex < 0) return state
      return { ...state, currentCardIndex: prevIndex, phase: 'playing' }
    }

    case 'RESHUFFLE':
      return {
        ...state,
        deck: shuffle(state.deck),
        currentCardIndex: 0,
        phase: 'playing',
      }

    case 'SET_PHASE':
      return { ...state, phase: action.phase }

    case 'SET_INTENSITET':
      return { ...state, intensitet: action.intensitet }

    case 'SET_KORTTYPER':
      return { ...state, korttyper: action.korttyper }

    case 'RESET':
      return initialState

    case 'RESTORE_STATE':
      return { ...initialState, ...action.state }

    default:
      return state
  }
}

interface GameContextValue {
  state: GameState
  dispatch: React.Dispatch<GameAction>
  currentCard: Card | null
  currentPack: Pack | null
  progress: { current: number; total: number }
}

const GameContext = createContext<GameContextValue | null>(null)

const SESSION_KEY = 'klink-game-state'
const PLAYERS_KEY = 'klink-players'

function loadInitialState(): GameState {
  try {
    // 1. Try full session state first (survives refresh)
    const session = sessionStorage.getItem(SESSION_KEY)
    if (session) {
      const parsed = JSON.parse(session) as GameState
      return { ...initialState, ...parsed }
    }
  } catch { /* ignore */ }

  try {
    // 2. Fall back: restore just players from localStorage (survives tab close)
    const players = localStorage.getItem(PLAYERS_KEY)
    if (players) {
      return { ...initialState, players: JSON.parse(players) as string[] }
    }
  } catch { /* ignore */ }

  return initialState
}

export function GameProvider({ children }: { children: ReactNode }) {
  // Always start with initialState (same on server and client) to avoid hydration mismatch.
  // Load persisted state client-side after mount.
  const [state, dispatch] = useReducer(gameReducer, initialState)

  useEffect(() => {
    const loaded = loadInitialState()
    if (loaded !== initialState) {
      dispatch({ type: 'RESTORE_STATE', state: loaded })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync full state to sessionStorage, players to localStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(state))
    } catch { /* ignore */ }
    try {
      localStorage.setItem(PLAYERS_KEY, JSON.stringify(state.players))
    } catch { /* ignore */ }
  }, [state])

  const currentCard =
    state.phase === 'playing' && state.currentCardIndex < state.deck.length
      ? state.deck[state.currentCardIndex]
      : null

  const currentPack = currentCard
    ? state.selectedPacks.find((p) => p.id === currentCard.spillpakke_id) ?? null
    : null

  const progress = {
    current: Math.min(state.currentCardIndex + 1, state.deck.length),
    total: state.deck.length,
  }

  return (
    <GameContext.Provider
      value={{ state, dispatch, currentCard, currentPack, progress }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
