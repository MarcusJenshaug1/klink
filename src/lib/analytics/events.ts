/* eslint-disable @typescript-eslint/no-explicit-any */

type GtagArgs = [string, string | Date, Record<string, unknown>?]

declare global {
  interface Window {
    gtag?: (...args: GtagArgs | [string, string, Record<string, unknown>?]) => void
    dataLayer?: unknown[]
  }
}

export type TrackEvent =
  | 'game_started'
  | 'deck_completed'
  | 'pack_toggled'
  | 'droyhet_changed'
  | 'intensitet_changed'
  | 'card_flagged'
  | 'share_clicked'

/** Fire-and-forget GA4 event. No-op if consent not granted / gtag missing. */
export function track(event: TrackEvent, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  try {
    if (localStorage.getItem('klink_notrack') === '1') return
    const gtag = window.gtag
    if (!gtag) return
    gtag('event', event, params ?? {})
  } catch {
    // silent
  }
}
