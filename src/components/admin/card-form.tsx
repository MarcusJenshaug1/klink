'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { KortType } from '@/types/game'

const KORT_TYPES: { value: KortType; label: string }[] = [
  { value: 'snusboks', label: 'Snusboks' },
  { value: 'pekelek', label: 'Pekelek' },
  { value: 'alle_drikker', label: 'Jeg har aldri' },
  { value: 'kaos', label: 'Klink (Kaos)' },
  { value: 'utfordring', label: 'Utfordring' },
  { value: 'regel', label: 'Regel' },
  { value: 'kategori', label: 'Kategori' },
]

interface CardFormProps {
  packId: string
  editCard?: {
    id: string
    type: KortType
    tittel: string
    innhold: string
    utfordring?: string | null
    timer_sekunder?: number | null
    timer_synlig?: boolean
  }
  onSaved: () => void
  onCancel?: () => void
}

export function CardForm({ packId, editCard, onSaved, onCancel }: CardFormProps) {
  const [type, setType] = useState<KortType>(editCard?.type ?? 'snusboks')
  const [tittel, setTittel] = useState(editCard?.tittel ?? '')
  const [innhold, setInnhold] = useState(editCard?.innhold ?? '')
  const [utfordring, setUtfordring] = useState(editCard?.utfordring ?? '')
  const [timerSekunder, setTimerSekunder] = useState<string>(
    editCard?.timer_sekunder != null ? String(editCard.timer_sekunder) : ''
  )
  const [timerSynlig, setTimerSynlig] = useState<boolean>(editCard?.timer_synlig ?? false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const supabase = createClient()
    const payload = {
      spillpakke_id: packId,
      type,
      tittel: tittel.trim(),
      innhold: innhold.trim(),
      utfordring: utfordring.trim() || null,
      timer_sekunder: timerSekunder ? parseInt(timerSekunder, 10) : null,
      timer_synlig: timerSekunder ? timerSynlig : false,
    }

    if (editCard) {
      const { error: err } = await supabase
        .from('kort')
        .update({ type, tittel: payload.tittel, innhold: payload.innhold, utfordring: payload.utfordring, timer_sekunder: payload.timer_sekunder, timer_synlig: payload.timer_synlig })
        .eq('id', editCard.id)
      if (err) { setError(err.message); setSaving(false); return }
    } else {
      const { error: err } = await supabase.from('kort').insert(payload)
      if (err) { setError(err.message); setSaving(false); return }
    }

    setSaving(false)
    if (!editCard) {
      setTittel('')
      setInnhold('')
      setUtfordring('')
      setTimerSekunder('')
      setTimerSynlig(false)
    }
    onSaved()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Type */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as KortType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            {KORT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Tittel / subkategori */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Tittel <span className="text-gray-400">(subkategori-badge)</span>
          </label>
          <input
            type="text"
            value={tittel}
            onChange={(e) => setTittel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="f.eks. Shot or Text, Hot Seat"
          />
        </div>
      </div>

      {/* Innhold */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Spørsmål / innhold
          <span className="text-gray-400 ml-1">({'{spiller}'}, {'{spiller1}'}, {'{spiller2}'}, {'{sips}'})</span>
        </label>
        <textarea
          value={innhold}
          onChange={(e) => setInnhold(e.target.value)}
          required
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
          placeholder="Skriv spørsmål eller innhold..."
        />
      </div>

      {/* Utfordring */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Utfordring <span className="text-gray-400">(valgfritt — {'{sips}'} for antall slurker)</span>
        </label>
        <textarea
          value={utfordring}
          onChange={(e) => setUtfordring(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
          placeholder="f.eks. Den som klarer X kan dele ut {sips} slurker!"
        />
      </div>

      {/* Timer */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">
          Timer <span className="text-gray-400">(valgfritt)</span>
        </label>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={timerSekunder}
              onChange={(e) => setTimerSekunder(e.target.value)}
              min={5}
              max={600}
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="sekunder"
            />
            <span className="text-xs text-gray-400">sek</span>
          </div>

          {timerSekunder && (
            <div className="flex items-center gap-1 rounded-lg border border-gray-200 p-0.5">
              <button
                type="button"
                onClick={() => setTimerSynlig(false)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  !timerSynlig
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Skjult
              </button>
              <button
                type="button"
                onClick={() => setTimerSynlig(true)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  timerSynlig
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Synlig
              </button>
            </div>
          )}

          {timerSekunder && (
            <p className="text-xs text-gray-400 w-full">
              {timerSynlig
                ? 'Spilleren ser nedtellingen — f.eks. ramse opp ting på tid'
                : 'Ingen nedtelling synlig — spilleren gjetter selv når tiden er ute (Hot Seat)'}
            </p>
          )}
        </div>
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving || !innhold.trim()}
          className="bg-forest text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-forest-light disabled:opacity-50"
        >
          {saving ? 'Lagrer...' : editCard ? 'Oppdater' : 'Legg til kort'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-gray-500 text-sm px-4 py-2">
            Avbryt
          </button>
        )}
      </div>
    </form>
  )
}
