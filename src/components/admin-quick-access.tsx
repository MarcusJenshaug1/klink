'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { useAdminRole } from '@/hooks/use-admin-role'

/**
 * Global hurtig-tilgang for admins:
 * - Tastatur-snarvei Ctrl/Cmd + Shift + A = gå til admin
 *   (hvis innlogget: /admin, ellers: /admin/logg-inn)
 * - Flytende pille i hjørnet på public-flater når innlogget som admin
 *   — gir 1-klikks vei tilbake til admin-panelet
 */
export function AdminQuickAccess() {
  const router = useRouter()
  const pathname = usePathname()
  const { rolle, loading } = useAdminRole()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // Global keyboard shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault()
        const target = rolle ? '/admin' : '/admin/logg-inn'
        router.push(target)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [rolle, router])

  if (!mounted || loading) return null

  // Skjul badgen på admin-flater og på /spill (ville blokkert spillkortet)
  const isAdminPath = pathname.startsWith('/admin')
  const isGamePath = pathname === '/spill'
  if (isAdminPath || isGamePath) return null

  // Kun vis flytende badge når innlogget som admin
  if (!rolle) return null

  return (
    <Link
      href="/admin"
      aria-label="Åpne admin"
      title="Åpne admin (Ctrl+Shift+A)"
      className="fixed bottom-4 right-4 z-[70] inline-flex items-center gap-2 bg-forest text-lime rounded-full pl-3 pr-4 py-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
    >
      <ShieldCheck className="w-4 h-4" />
      <span className="text-xs font-black">Admin</span>
    </Link>
  )
}
