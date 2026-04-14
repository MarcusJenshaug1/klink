'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, LogOut, KeyRound } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAdminRole } from '@/hooks/use-admin-role'
import { cn } from '@/lib/utils'

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { rolle } = useAdminRole()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { href: '/admin', label: 'Dashboard', exact: true },
    { href: '/admin/pakker', label: 'Spillpakker', exact: false },
    { href: '/admin/korttyper', label: 'Korttyper', exact: false },
    ...(rolle === 'super_admin'
      ? [
          { href: '/admin/brukere', label: 'Brukere', exact: false },
          { href: '/admin/tracking', label: 'Tracking', exact: false },
        ]
      : []),
  ]

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/logg-inn')
    router.refresh()
  }

  const isActive = (link: { href: string; exact: boolean }) =>
    link.exact ? pathname === link.href : pathname.startsWith(link.href)

  return (
    <nav className="bg-forest px-4 md:px-6 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link href="/admin" className="font-display font-black text-xl text-lime leading-none shrink-0">
          Klink
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1 flex-1 px-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap',
                isActive(link)
                  ? 'bg-white/15 text-white'
                  : 'text-white/55 hover:text-white hover:bg-white/10'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-4">
          {rolle === 'super_admin' && (
            <span className="text-xs font-bold text-lime/80 uppercase tracking-widest">
              Super Admin
            </span>
          )}
          <Link
            href="/admin/bytt-passord"
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            Bytt passord
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            Logg ut
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Meny"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden max-w-6xl mx-auto pt-2 pb-3 flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                'px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors',
                isActive(link)
                  ? 'bg-white/15 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              )}
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-1 pt-2 border-t border-white/10 flex items-center justify-between px-4">
            {rolle === 'super_admin' && (
              <span className="text-xs font-bold text-lime/70 uppercase tracking-widest">
                Super Admin
              </span>
            )}
            <div className="ml-auto flex items-center gap-3">
              <Link
                href="/admin/bytt-passord"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
              >
                <KeyRound className="w-4 h-4" />
                Bytt passord
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logg ut
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
