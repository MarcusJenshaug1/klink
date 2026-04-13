'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })

    if (err) {
      setError('Feil e-post eller passord')
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-white/70 mb-1.5">
          E-post
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-lime focus:bg-white/15 transition-colors"
          placeholder="din@epost.no"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-white/70 mb-1.5">
          Passord
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-lime focus:bg-white/15 transition-colors"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm font-medium">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-lime text-forest rounded-2xl font-black text-base hover:bg-lime/90 active:scale-95 disabled:opacity-50 transition-all mt-2"
      >
        {loading ? 'Logger inn...' : 'Logg inn'}
      </button>

      <Link
        href="/admin/glemt-passord"
        className="block text-center text-white/40 hover:text-white text-sm transition-colors pt-1"
      >
        Glemt passord?
      </Link>
    </form>
  )
}
