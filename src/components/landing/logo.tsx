'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAthina } from '@/context/athina-context'
import { useAdminRole } from '@/hooks/use-admin-role'

const LONG_PRESS_MS = 1500

export function Logo({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false)
  const { isActive, tap, toast } = useAthina()
  const { rolle } = useAdminRole()
  const router = useRouter()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firedRef = useRef(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const onPointerDown = () => {
    firedRef.current = false
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      firedRef.current = true
      try { if (navigator.vibrate) navigator.vibrate(25) } catch {}
      router.push(rolle ? '/admin' : '/admin/logg-inn')
    }, LONG_PRESS_MS)
  }

  const cancelLongPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const handleClick = () => {
    // Ikke tell tap mot Athina når long-press nettopp fyrte
    if (firedRef.current) {
      firedRef.current = false
      return
    }
    tap()
  }

  return (
    <div className={className}>
      <div
        onClick={handleClick}
        onPointerDown={onPointerDown}
        onPointerUp={cancelLongPress}
        onPointerLeave={cancelLongPress}
        onPointerCancel={cancelLongPress}
        className="select-none touch-manipulation"
      >
        <div
          className="inline-block px-6 py-4 rounded-3xl transition-all duration-500"
          style={isActive ? { backgroundColor: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(10px)' } : {}}
        >
          <h1
            className="font-display text-6xl sm:text-7xl font-black tracking-tight leading-none transition-colors duration-500"
            style={{ color: isActive ? '#ffffff' : '#1A3A1A' }}
          >
            Kl
            <span className="relative inline-block">
              {'\u0131'}
              <span
                className="absolute rounded-full transition-colors duration-500"
                style={{
                  backgroundColor: isActive ? '#ffffff' : '#1A3A1A',
                  width: '0.135em',
                  height: '0.135em',
                  top: '0.08em',
                  left: '50%',
                  animation: mounted ? 'dot-drop 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.25s both' : 'none',
                  opacity: mounted ? undefined : 0,
                }}
              />
            </span>
            nk
          </h1>
          <p
            className="font-medium mt-1 text-lg transition-colors duration-500"
            style={{ color: isActive ? 'rgba(255,255,255,0.75)' : 'rgba(26,58,26,0.6)' }}
          >
            Drikkespillet
          </p>
        </div>
      </div>

      {/* Activation toast */}
      {toast && (
        <div
          className="fixed inset-x-0 top-20 flex justify-center z-50 pointer-events-none animate-bounce-in"
        >
          <div
            className="px-6 py-3 rounded-2xl text-white text-sm font-bold shadow-xl"
            style={{ backgroundColor: '#E91E8C' }}
          >
            {toast}
          </div>
        </div>
      )}
    </div>
  )
}
