'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function GlemtPassordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/auth/callback`,
    })

    setLoading(false)
    if (err) {
      setError(err.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-dvh bg-forest flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display font-black text-5xl text-lime leading-none mb-2">
            Klink
          </h1>
          <p className="text-white/50 text-sm font-medium">Glemt passord</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
          {sent ? (
            <div className="text-center space-y-3">
              <p className="text-lime font-semibold">Sjekk e-posten din!</p>
              <p className="text-white/60 text-sm">
                Vi har sendt deg en lenke for å tilbakestille passordet. Sjekk spam-mappen hvis du ikke finner den.
              </p>
              <Link
                href="/admin/logg-inn"
                className="block text-white/40 hover:text-white text-sm transition-colors mt-4"
              >
                ← Tilbake til innlogging
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-white/60 text-sm">
                Skriv inn e-postadressen din, så sender vi deg en lenke for å sette nytt passord.
              </p>
              <div>
                <label className="block text-sm font-semibold text-white/70 mb-1.5">
                  E-post
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-lime focus:bg-white/15 transition-colors"
                  placeholder="din@epost.no"
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
                {loading ? 'Sender...' : 'Send tilbakestillingslenke'}
              </button>

              <Link
                href="/admin/logg-inn"
                className="block text-center text-white/40 hover:text-white text-sm transition-colors"
              >
                ← Tilbake til innlogging
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
