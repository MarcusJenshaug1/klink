'use client'
import { useState, useRef, useEffect } from 'react'

export function usePwaUpdate() {
  const [needsUpdate, setNeedsUpdate] = useState(false)
  const regRef = useRef<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker.ready.then((reg) => {
      regRef.current = reg

      const onInstalled = () => {
        if (reg.waiting && navigator.serviceWorker.controller) {
          setNeedsUpdate(true)
        }
      }

      // Allerede venter ved mount
      onInstalled()

      // Ny SW funnet under sesjonen
      reg.addEventListener('updatefound', () => {
        reg.installing?.addEventListener('statechange', onInstalled)
      })
    })
  }, [])

  const triggerUpdate = () => {
    const reg = regRef.current
    if (!reg?.waiting) return
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload()
    }, { once: true })
    reg.waiting.postMessage({ type: 'SKIP_WAITING' })
  }

  const dismiss = () => setNeedsUpdate(false)

  return { needsUpdate, triggerUpdate, dismiss }
}
