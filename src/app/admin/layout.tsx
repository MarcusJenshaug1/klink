'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { AdminNav } from '@/components/admin/admin-nav'

const FOREST = '#1A3A1A'
const LIME = '#A8E63D'

/**
 * Sett html-bakgrunn + theme-color til forest når vi er på admin,
 * for at iOS safe-area / statusbar skal matche nav-baren.
 * Reset til lime når vi forlater admin.
 */
function useAdminTheme() {
  useEffect(() => {
    const html = document.documentElement
    const prevBg = html.style.backgroundColor
    html.style.backgroundColor = FOREST

    const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null
    const prevTheme = meta?.getAttribute('content') ?? LIME
    if (meta) meta.setAttribute('content', FOREST)

    return () => {
      html.style.backgroundColor = prevBg
      if (meta) meta.setAttribute('content', prevTheme)
    }
  }, [])
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isStandalonePage =
    pathname === '/admin/logg-inn' ||
    pathname === '/admin/sett-passord' ||
    pathname === '/admin/glemt-passord' ||
    pathname.startsWith('/admin/auth/')

  useAdminTheme()

  if (isStandalonePage) {
    return <div className="min-h-dvh bg-cream">{children}</div>
  }

  return (
    <div className="min-h-dvh bg-cream">
      <AdminNav />
      <main className="max-w-6xl mx-auto p-4 sm:p-6">{children}</main>
    </div>
  )
}
