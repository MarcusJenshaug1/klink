'use client'

import { usePathname } from 'next/navigation'
import { AdminNav } from '@/components/admin/admin-nav'

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

  if (isStandalonePage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-dvh bg-cream">
      <AdminNav />
      <main className="max-w-6xl mx-auto p-6">{children}</main>
    </div>
  )
}
