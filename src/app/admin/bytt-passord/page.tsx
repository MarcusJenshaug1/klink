'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Check } from 'lucide-react'

export default function ByttPassordPage() {
  const router = useRouter()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirm) {
      setError('De nye passordene stemmer ikke overens')
      return
    }
    if (newPassword.length < 8) {
      setError('Nytt passord må være minst 8 tegn')
      return
    }
    setLoading(true)
    setError('')

    const supabase = createClient()

    // Re-authenticate with old password first
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) {
      setError('Kunne ikke hente brukerinfo')
      setLoading(false)
      return
    }

    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: oldPassword,
    })

    if (signInErr) {
      setError('Gammelt passord er feil')
      setLoading(false)
      return
    }

    const { error: updateErr } = await supabase.auth.updateUser({ password: newPassword })

    if (updateErr) {
      setError(updateErr.message)
      setLoading(false)
    } else {
      setDone(true)
      setTimeout(() => router.push('/admin'), 2000)
    }
  }

  const inputCls = 'w-full px-4 py-3 bg-cream border border-cream-dark/60 rounded-2xl text-forest text-sm focus:outline-none focus:border-forest/40 transition-colors'
  const label = 'block text-sm font-semibold text-forest/60 mb-1.5'

  return (
    <div className="max-w-md">
      <h1 className="font-display font-black text-3xl text-forest mb-8">Bytt passord</h1>

      {done ? (
        <div className="bg-white rounded-2xl p-8 border border-cream-dark/40 text-center space-y-3">
          <div className="w-12 h-12 bg-lime rounded-2xl flex items-center justify-center mx-auto">
            <Check className="w-6 h-6 text-forest" strokeWidth={3} />
          </div>
          <p className="font-semibold text-forest">Passord oppdatert!</p>
          <p className="text-forest/50 text-sm">Sender deg tilbake til dashbordet...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-cream-dark/40 space-y-5">
          <div>
            <label className={label}>Gammelt passord</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              autoFocus
              className={inputCls}
              placeholder="Ditt nåværende passord"
            />
          </div>

          <hr className="border-cream-dark/60" />

          <div>
            <label className={label}>Nytt passord</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className={inputCls}
              placeholder="Minst 8 tegn"
            />
          </div>

          <div>
            <label className={label}>Bekreft nytt passord</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className={inputCls}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium bg-red-50 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={loading || !oldPassword || !newPassword || !confirm}
              className="bg-forest text-white px-6 py-3 rounded-2xl font-bold hover:bg-forest/80 active:scale-95 disabled:opacity-50 transition-all"
            >
              {loading ? 'Lagrer...' : 'Oppdater passord'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="text-forest/50 hover:text-forest px-4 py-3 text-sm font-medium transition-colors"
            >
              Avbryt
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
