'use client'

import { useEffect } from 'react'
import { useAthina } from '@/context/athina-context'

const LIME = '#A8E63D'
const ATHINA = '#FF69B4'

/**
 * Synkroniserer iOS safe-area/status-bar (meta[name=theme-color] +
 * html-bakgrunn) med en gitt farge for siden. Når komponenten unmountes
 * eller fargen endres, resettes til Athina-rosa eller lime avhengig av
 * Athina-modus, slik at fargen ikke "henger igjen" fra forrige side/kort.
 */
export function useThemeColor(color: string | null | undefined) {
  const { isActive: athina } = useAthina()

  useEffect(() => {
    const fallback = athina ? ATHINA : LIME
    const target = color ?? fallback
    const html = document.documentElement
    html.style.backgroundColor = target
    const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null
    if (meta) meta.setAttribute('content', target)

    return () => {
      html.style.backgroundColor = fallback
      if (meta) meta.setAttribute('content', fallback)
    }
  }, [color, athina])
}
