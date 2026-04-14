'use client'

import { useEffect, useState } from 'react'
import { Trash2, Shield, Globe, Monitor } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAdminRole } from '@/hooks/use-admin-role'

interface BlocklistRow {
  id: string
  ip: string
  label: string | null
  created_at: string
}

export default function TrackingPage() {
  const { rolle, loading: roleLoading } = useAdminRole()
  const [myIp, setMyIp] = useState<string>('...')
  const [rows, setRows] = useState<BlocklistRow[]>([])
  const [loading, setLoading] = useState(true)
  const [newIp, setNewIp] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [browserBlocked, setBrowserBlocked] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/tracking/my-ip')
      .then((r) => r.json())
      .then((d) => setMyIp(d.ip))
      .catch(() => setMyIp('ukjent'))
    setBrowserBlocked(localStorage.getItem('klink_notrack') === '1')
    loadList()
  }, [])

  async function loadList() {
    setLoading(true)
    const supa = createClient()
    const { data, error } = await supa
      .from('tracking_blocklist')
      .select('id, ip, label, created_at')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setRows(data ?? [])
    setLoading(false)
  }

  async function addIp(ip: string, label: string) {
    setError(null)
    const supa = createClient()
    const { data: { user } } = await supa.auth.getUser()
    const { error } = await supa.from('tracking_blocklist').insert({
      ip: ip.trim(),
      label: label.trim() || null,
      created_by: user?.id,
    })
    if (error) {
      setError(error.message)
      return
    }
    setNewIp('')
    setNewLabel('')
    await loadList()
    // Clear cached decision so this browser re-checks
    localStorage.removeItem('klink_should_track')
  }

  async function removeIp(id: string) {
    const supa = createClient()
    const { error } = await supa.from('tracking_blocklist').delete().eq('id', id)
    if (error) setError(error.message)
    else await loadList()
    localStorage.removeItem('klink_should_track')
  }

  function toggleBrowserBlock() {
    if (browserBlocked) {
      localStorage.removeItem('klink_notrack')
      setBrowserBlocked(false)
    } else {
      localStorage.setItem('klink_notrack', '1')
      setBrowserBlocked(true)
    }
    localStorage.removeItem('klink_should_track')
  }

  if (roleLoading) {
    return <div className="text-forest/40">Laster ...</div>
  }

  if (rolle !== 'super_admin') {
    return (
      <div className="bg-white rounded-2xl p-6 border border-cream-dark/40">
        <p className="font-semibold text-forest">
          Kun super_admin har tilgang til denne siden.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-display font-black text-3xl text-forest mb-2">Tracking-kontroll</h1>
      <p className="text-forest/60 mb-8">
        Blokker spesifikke IP-er fra å bli trackert av GA4 og Vercel Analytics.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Current IP + this-network block */}
      <div className="bg-white rounded-2xl p-5 border border-cream-dark/40 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-5 h-5 text-forest/60" />
          <h2 className="font-display font-black text-lg text-forest">Din nåværende IP</h2>
        </div>
        <p className="font-mono text-xl text-forest mb-4">{myIp}</p>
        <button
          onClick={() => addIp(myIp, 'Denne IP-en')}
          disabled={myIp === 'ukjent' || myIp === '...' || rows.some((r) => r.ip === myIp)}
          className="bg-forest text-white font-bold px-4 py-2 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-forest/80 transition text-sm"
        >
          {rows.some((r) => r.ip === myIp) ? 'Allerede blokkert' : 'Blokker dette nettverket'}
        </button>
        <p className="text-xs text-forest/40 mt-2">
          Merk: hjemme-IP kan rotere (dynamisk ISP). Du må blokkere på nytt når den endres.
        </p>
      </div>

      {/* Browser block */}
      <div className="bg-white rounded-2xl p-5 border border-cream-dark/40 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Monitor className="w-5 h-5 text-forest/60" />
          <h2 className="font-display font-black text-lg text-forest">Denne nettleseren</h2>
        </div>
        <p className="text-sm text-forest/70 mb-4">
          Blokkerer kun denne nettleseren (lagres i localStorage). Må settes per enhet + nettleser.
        </p>
        <button
          onClick={toggleBrowserBlock}
          className={
            browserBlocked
              ? 'bg-red-600 text-white font-bold px-4 py-2 rounded-xl hover:bg-red-700 transition text-sm'
              : 'bg-forest text-white font-bold px-4 py-2 rounded-xl hover:bg-forest/80 transition text-sm'
          }
        >
          {browserBlocked ? 'Skru PÅ tracking i denne nettleseren' : 'Skru AV tracking i denne nettleseren'}
        </button>
        <p className="text-xs text-forest/40 mt-2">
          Shortcut: <code className="font-mono">?notrack=1</code> i URL skrur av, <code className="font-mono">?notrack=0</code> skrur på.
        </p>
      </div>

      {/* Add custom IP */}
      <div className="bg-white rounded-2xl p-5 border border-cream-dark/40 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-forest/60" />
          <h2 className="font-display font-black text-lg text-forest">Legg til IP manuelt</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newIp}
            onChange={(e) => setNewIp(e.target.value)}
            placeholder="f.eks. 81.27.64.12"
            className="flex-1 border border-cream-dark rounded-xl px-3 py-2 font-mono text-sm focus:outline-none focus:border-forest"
          />
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Label (f.eks. Kontor)"
            className="flex-1 border border-cream-dark rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-forest"
          />
          <button
            onClick={() => newIp.trim() && addIp(newIp, newLabel)}
            disabled={!newIp.trim()}
            className="bg-forest text-white font-bold px-5 py-2 rounded-xl disabled:opacity-40 hover:bg-forest/80 transition text-sm"
          >
            Legg til
          </button>
        </div>
      </div>

      {/* Blocklist */}
      <div className="bg-white rounded-2xl p-5 border border-cream-dark/40">
        <h2 className="font-display font-black text-lg text-forest mb-4">
          Blokkerte IP-er ({rows.length})
        </h2>
        {loading ? (
          <p className="text-forest/40 text-sm">Laster ...</p>
        ) : rows.length === 0 ? (
          <p className="text-forest/40 text-sm">Ingen blokkerte IP-er enda.</p>
        ) : (
          <ul className="divide-y divide-cream-dark/40">
            {rows.map((r) => (
              <li key={r.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-mono text-sm text-forest">{r.ip}</p>
                  {r.label && <p className="text-xs text-forest/50">{r.label}</p>}
                </div>
                <button
                  onClick={() => removeIp(r.id)}
                  className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition"
                  aria-label="Slett"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
