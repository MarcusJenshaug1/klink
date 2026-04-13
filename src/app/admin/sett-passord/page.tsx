'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { markerPassordSatt } from '@/app/admin/brukere/actions'

export default function SettPassordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passordene stemmer ikke overens')
      return
    }
    if (password.length < 8) {
      setError('Passord må være minst 8 tegn')
      return
    }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: err } = await supabase.auth.updateUser({ password })

    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      await markerPassordSatt()
      setDone(true)
      setTimeout(() => router.push('/admin'), 2000)
    }
  }

  return (
    <div className="min-h-dvh bg-forest flex flex-col items-center justify-center p-6">

      {/* Logo */}
      <div className="mb-10 text-center">
        <div className="inline-block bg-lime rounded-2xl px-7 py-3 mb-4">
          <span className="font-display font-black text-4xl text-forest leading-none">Klink</span>
        </div>
        <p className="text-white/40 text-sm font-medium">Admin</p>
      </div>

      <div className="w-full max-w-sm">
        {done ? (
          <div className="text-center space-y-3">
            <div className="text-5xl mb-2">🎉</div>
            <p className="font-display font-black text-2xl text-lime">Du er klar!</p>
            <p className="text-white/50 text-sm">Sender deg til dashbordet...</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="font-display font-black text-3xl text-white mb-2">Velkommen til Klink!</h1>
              <p className="text-white/50 text-sm leading-relaxed">
                Sett et passord for kontoen din for å komme i gang.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white/60 mb-2">
                  Passord
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoFocus
                  className="w-full px-4 py-3.5 bg-white/8 border border-white/15 rounded-2xl text-white placeholder-white/25 focus:outline-none focus:border-lime/60 focus:bg-white/12 transition-colors text-base"
                  placeholder="Minst 8 tegn"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/60 mb-2">
                  Bekreft passord
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 bg-white/8 border border-white/15 rounded-2xl text-white placeholder-white/25 focus:outline-none focus:border-lime/60 focus:bg-white/12 transition-colors text-base"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm font-medium bg-red-400/10 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !password || !confirm}
                className="w-full py-4 px-4 bg-lime text-forest rounded-2xl font-black text-base hover:bg-lime-light active:scale-95 disabled:opacity-40 transition-all mt-2"
              >
                {loading ? 'Lagrer...' : 'Kom i gang →'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
