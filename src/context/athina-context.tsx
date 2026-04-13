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

  // Keep html background in sync (transparent in Athina mode — fixed bg div handles it)
  useEffect(() => {
    document.documentElement.style.backgroundColor = isActive ? 'transparent' : '#A8E63D'
  }, [isActive])

  // Swap favicon — update ALL icon links (including ones Next.js adds after hydration)
  const originalIconsRef = useRef<Map<HTMLLinkElement, { href: string; type: string }>>(new Map())
  useEffect(() => {
    function updateLink(link: HTMLLinkElement) {
      if (!originalIconsRef.current.has(link)) {
        originalIconsRef.current.set(link, { href: link.href, type: link.type })
      }
      if (isActive) {
        link.href = '/favicon-athina.svg'
        link.type = 'image/svg+xml'
      } else {
        const orig = originalIconsRef.current.get(link)
        if (orig) {
          link.href = orig.href
          link.type = orig.type
        }
      }
    }

    // Update existing icon links
    document.querySelectorAll<HTMLLinkElement>("link[rel='icon']").forEach(updateLink)

    // Watch for new icon links added by Next.js after hydration
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node instanceof HTMLLinkElement && node.rel === 'icon') {
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
