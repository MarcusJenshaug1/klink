'use client'

import { usePathname } from 'next/navigation'
import { AdminNav } from '@/components/admin/admin-nav'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/logg-inn'

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-dvh bg-gray-50">
      <AdminNav />
      <main className="max-w-5xl mx-auto p-6">{children}</main>
    </div>
  )
}
