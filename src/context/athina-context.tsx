'use client'

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react'

interface AthinaCtx {
  isActive: boolean
  tap: () => void
  toast: string | null
}

const AthinaContext = createContext<AthinaCtx>({ isActive: false, tap: () => {}, toast: null })

export function AthinaProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const countRef = useRef(0)
  const isActiveRef = useRef(false)

  useEffect(() => {
    const stored = localStorage.getItem('athina') === '1'
    setIsActive(stored)
    isActiveRef.current = stored
  }, [])

  // Keep html background + theme-color in sync with Athina mode
  useEffect(() => {
    const LIME = '#A8E63D'
    const ATHINA = '#FF69B4'
    document.documentElement.style.backgroundColor = isActive ? ATHINA : LIME
    const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null
    if (meta) meta.setAttribute('content', isActive ? ATHINA : LIME)
  }, [isActive])

  // Swap favicon, apple-touch-icon and manifest — update ALL relevant links
  // (including ones Next.js adds after hydration) so PWA install picks up the
  // Athina-variant icons + manifest.
  const originalLinksRef = useRef<Map<HTMLLinkElement, { href: string; type: string }>>(new Map())
  useEffect(() => {
    function athinaHrefFor(link: HTMLLinkElement): { href: string; type: string } | null {
      if (link.rel === 'manifest') return { href: '/manifest-athina.json', type: link.type }
      if (link.rel === 'apple-touch-icon') return { href: '/apple-icon-athina', type: link.type }
      if (link.rel === 'icon') {
        const sizes = link.getAttribute('sizes') ?? ''
        if (sizes.includes('192')) return { href: '/icon-192-athina', type: 'image/png' }
        if (sizes.includes('512')) return { href: '/icon-512-athina', type: 'image/png' }
        return { href: '/favicon-athina.svg', type: 'image/svg+xml' }
      }
      return null
    }

    function updateLink(link: HTMLLinkElement) {
      const target = athinaHrefFor(link)
      if (!target) return
      if (!originalLinksRef.current.has(link)) {
        originalLinksRef.current.set(link, { href: link.href, type: link.type })
      }
      if (isActive) {
        link.href = target.href
        link.type = target.type
      } else {
        const orig = originalLinksRef.current.get(link)
        if (orig) {
          link.href = orig.href
          link.type = orig.type
        }
      }
    }

    const selector = "link[rel='icon'], link[rel='apple-touch-icon'], link[rel='manifest']"
    document.querySelectorAll<HTMLLinkElement>(selector).forEach(updateLink)

    // Watch for new relevant links added by Next.js after hydration
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node instanceof HTMLLinkElement && (node.rel === 'icon' || node.rel === 'apple-touch-icon' || node.rel === 'manifest')) {
            updateLink(node)
          }
        }
      }
    })
    observer.observe(document.head, { childList: true })
    return () => observer.disconnect()
  }, [isActive])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }, [])

  const tap = useCallback(() => {
    countRef.current += 1
    if (countRef.current >= 10) {
      countRef.current = 0
      const newVal = !isActiveRef.current
      isActiveRef.current = newVal
      localStorage.setItem('athina', newVal ? '1' : '0')
      setIsActive(newVal)
      showToast(newVal ? '✨ Athina modus aktivert! ✨' : 'Athina modus deaktivert')
    }
  }, [showToast])

  return (
    <AthinaContext.Provider value={{ isActive, tap, toast }}>
      {/* Fixed leopard background — rendered first so all page content sits on top */}
      {isActive && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundImage: "url('/leopard-bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(233, 30, 140, 0.38)' }} />
        </div>
      )}
      {children}
    </AthinaContext.Provider>
  )
}

export const useAthina = () => useContext(AthinaContext)
