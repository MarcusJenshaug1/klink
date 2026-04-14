'use client'

import { useState, useEffect, useCallback } from 'react'
import { RotateCcw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { CARD_TYPE_META, ICON_MAP } from '@/lib/game/card-types'
import { DROYHET_META } from '@/lib/game/droyhet'
import { VEKT_META } from '@/lib/game/vekt'
import { CardPreview } from './card-preview'
import type { KortType, Korttype, Droyhet, Kjonn, Vekt } from '@/types/game'

const BUILT_IN_TYPES: KortType[] = [
  'snusboks', 'pekelek', 'alle_drikker', 'kaos', 'utfordring', 'regel', 'kategori',
]

interface CardFormProps {
  packId: string
  packColor?: string
  initialKorttyper?: Korttype[]
  editCard?: {
    id: string
    type: KortType
    tittel: string
    innhold: string
    utfordring?: string | null
    timer_sekunder?: number | null
    timer_synlig?: boolean
    aktiv?: boolean
    droyhet?: Droyhet
    min_spillere?: number
    standard_slurker?: number | null
    notater?: string | null
    kjonn?: Kjonn
    vekt?: Vekt
  }
  onSaved: () => void
  onCancel?: () => void
}

const KJONN_META: Record<Kjonn, { label: string; beskrivelse: string }> = {
  alle: { label: 'Alle', beskrivelse: 'Rettet mot alle' },
  mann: { label: 'Mann', beskrivelse: 'Menn i fokus' },
  kvinne: { label: 'Kvinne', beskrivelse: 'Kvinner i fokus' },
}

const label = 'block text-xs font-bold text-forest/50 uppercase tracking-wider mb-1.5'
const inputCls = 'w-full px-4 py-2.5 bg-cream border border-cream-dark/60 rounded-xl text-forest text-sm focus:outline-none focus:border-forest/40 transition-colors'

export function CardForm({ packId, packColor, initialKorttyper, editCard, onSaved, onCancel }: CardFormProps) {
  const [type, setType] = useState<KortType>(editCard?.type ?? 'snusboks')
  const [tittel, setTittel] = useState(editCard?.tittel ?? '')
  const [innhold, setInnhold] = useState(editCard?.innhold ?? '')
  const [utfordring, setUtfordring] = useState(editCard?.utfordring ?? '')
  const [timerSekunder, setTimerSekunder] = useState<string>(
    editCard?.timer_sekunder != null ? String(editCard.timer_sekunder) : ''
  )
  const [timerSynlig, setTimerSynlig] = useState<boolean>(editCard?.timer_synlig ?? false)
  const [aktiv, setAktiv] = useState<boolean>(editCard?.aktiv ?? true)
  const [droyhet, setDroyhet] = useState<Droyhet>(editCard?.droyhet ?? 'normal')
  const [minSpillere, setMinSpillere] = useState<string>(
    editCard?.min_spillere != null ? String(editCard.min_spillere) : '2'
  )
  const [standardSlurker, setStandardSlurker] = useState<string>(
    editCard?.standard_slurker != null ? String(editCard.standard_slurker) : ''
  )
  const [kjonn, setKjonn] = useState<Kjonn>(editCard?.kjonn ?? 'alle')
  const [vekt, setVekt] = useState<Vekt>(editCard?.vekt ?? 'vanlig')
  const [notater, setNotater] = useState(editCard?.notater ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [korttyper, setKorttyper] = useState<Korttype[]>(initialKorttyper ?? [])

  useEffect(() => {
    if (initialKorttyper) return // already provided
    async function loadKorttyper() {
      const supabase = createClient()
      const { data } = await supabase
        .from('korttyper')
        .select('id, label, icon_name, farge')
        .order('opprettet_at', { ascending: true })
      setKorttyper((data as Korttype[]) ?? [])
    }
    loadKorttyper()
  }, [initialKorttyper])

  const handleReset = useCallback(() => {
    setType('snusboks')
    setTittel('')
    setInnhold('')
    setUtfordring('')
    setTimerSekunder('')
    setTimerSynlig(false)
    setAktiv(true)
    setDroyhet('normal')
    setMinSpillere('2')
    setStandardSlurker('')
    setKjonn('alle')
    setVekt('vanlig')
    setNotater('')
    setError('')
  }, [])

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
      aktiv,
      droyhet,
      min_spillere: minSpillere ? Math.max(1, parseInt(minSpillere, 10)) : 2,
      standard_slurker: standardSlurker ? parseInt(standardSlurker, 10) : null,
      notater: notater.trim() || null,
      kjonn,
      vekt,
    }

    if (editCard) {
      const { spillpakke_id: _s, ...updatePayload } = payload
      void _s
      const { error: err } = await supabase
        .from('kort')
        .update(updatePayload)
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
      setStandardSlurker('')
      setNotater('')
      // keep aktiv/droyhet/min_spillere/kjonn/vekt as "sticky" defaults for batch entry
    }
    onSaved()
  }

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 border border-cream-dark/40 space-y-5">

        {/* Type selector — icon grid */}
        <div>
          <p className={label}>Korttype</p>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {BUILT_IN_TYPES.map((t) => {
              const meta = CARD_TYPE_META[t]
              const Icon = meta.icon
              const isSelected = type === t
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  title={meta.label}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all text-center ${
                    isSelected
                      ? 'border-forest bg-forest text-white'
                      : 'border-cream-dark/40 bg-cream text-forest/60 hover:border-forest/30 hover:text-forest'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-[9px] font-bold leading-tight">{meta.label}</span>
                </button>
              )
            })}
          </div>

          {/* Custom korttyper */}
          {korttyper.length > 0 && (
            <>
              <p className="text-[10px] font-bold text-forest/30 uppercase tracking-wider mt-3 mb-1.5">
                Egendefinerte
              </p>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {korttyper.map((kt) => {
                  const Icon = ICON_MAP[kt.icon_name]
                  const isSelected = type === kt.id
                  return (
                    <button
                      key={kt.id}
                      type="button"
                      onClick={() => setType(kt.id)}
                      title={kt.label}
                      className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all text-center ${
                        isSelected
                          ? 'border-forest bg-forest text-white'
                          : 'border-cream-dark/40 bg-cream text-forest/60 hover:border-forest/30 hover:text-forest'
                      }`}
                    >
                      {Icon ? <Icon className="w-4 h-4 shrink-0" /> : <span className="w-4 h-4" />}
                      <span className="text-[9px] font-bold leading-tight">{kt.label}</span>
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* Tittel */}
        <div>
          <label className={label}>
            Tittel <span className="font-normal normal-case text-forest/30">(subkategori-badge)</span>
          </label>
          <input
            type="text"
            value={tittel}
            onChange={(e) => setTittel(e.target.value)}
            className={inputCls}
            placeholder="f.eks. Shot or Text, Hot Seat"
          />
        </div>

        {/* Innhold */}
        <div>
          <label className={label}>
            Innhold *{' '}
            <span className="font-normal normal-case text-forest/30">
              ({'{spiller}'}, {'{spiller1}'}, {'{spiller2}'}, {'{sips}'})
            </span>
          </label>
          <textarea
            value={innhold}
            onChange={(e) => setInnhold(e.target.value)}
            required
            rows={3}
            className={inputCls + ' resize-none'}
            placeholder="Skriv spørsmål eller innhold..."
          />
        </div>

        {/* Utfordring */}
        <div>
          <label className={label}>
            Utfordring <span className="font-normal normal-case text-forest/30">(valgfritt)</span>
          </label>
          <textarea
            value={utfordring}
            onChange={(e) => setUtfordring(e.target.value)}
            rows={2}
            className={inputCls + ' resize-none'}
            placeholder="f.eks. Den som klarer X kan dele ut {sips} slurker!"
          />
        </div>

        {/* Timer */}
        <div>
          <label className={label}>
            Timer <span className="font-normal normal-case text-forest/30">(valgfritt, 5–600 sek)</span>
          </label>
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="number"
              value={timerSekunder}
              onChange={(e) => setTimerSekunder(e.target.value)}
              min={5}
              max={600}
              className="w-28 px-4 py-2.5 bg-cream border border-cream-dark/60 rounded-xl text-forest text-sm focus:outline-none focus:border-forest/40 transition-colors"
              placeholder="sekunder"
            />

            {timerSekunder && (
              <div className="flex items-center gap-1 rounded-xl border border-cream-dark/60 bg-cream p-0.5">
                <button
                  type="button"
                  onClick={() => setTimerSynlig(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    !timerSynlig ? 'bg-forest text-white' : 'text-forest/50 hover:text-forest'
                  }`}
                >
                  Skjult
                </button>
                <button
                  type="button"
                  onClick={() => setTimerSynlig(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    timerSynlig ? 'bg-forest text-white' : 'text-forest/50 hover:text-forest'
                  }`}
                >
                  Synlig
                </button>
              </div>
            )}
          </div>
          {timerSekunder && (
            <p className="text-xs text-forest/40 mt-1.5">
              {timerSynlig
                ? 'Spilleren ser nedtellingen — f.eks. ramse opp ting på tid'
                : 'Ingen nedtelling synlig — spilleren gjetter selv (Hot Seat)'}
            </p>
          )}
        </div>

        {/* Drøyhet */}
        <div>
          <p className={label}>Drøyhet</p>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(DROYHET_META) as Droyhet[]).map((k) => {
              const m = DROYHET_META[k]
              const selected = droyhet === k
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setDroyhet(k)}
                  className={`flex flex-col items-start gap-0.5 p-2.5 rounded-xl border-2 transition-all text-left ${
                    selected
                      ? 'border-forest bg-forest text-white'
                      : 'border-cream-dark/40 bg-cream text-forest/60 hover:border-forest/30'
                  }`}
                >
                  <span className="text-xs font-black">{m.label}</span>
                  <span className={`text-[10px] leading-tight ${selected ? 'text-white/70' : 'text-forest/40'}`}>
                    {m.beskrivelse}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Vekt */}
        <div>
          <label className={label}>
            Vekt <span className="font-normal normal-case text-forest/30">(hvor ofte kortet dukker opp)</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(VEKT_META) as Vekt[]).map((v) => {
              const m = VEKT_META[v]
              const selected = vekt === v
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVekt(v)}
                  className={`flex flex-col items-start gap-0.5 p-2.5 rounded-xl border-2 transition-all text-left ${
                    selected
                      ? 'border-forest bg-forest text-white'
                      : 'border-cream-dark/40 bg-cream text-forest/60 hover:border-forest/30'
                  }`}
                >
                  <span className="text-xs font-black">{m.label}</span>
                  <span className={`text-[10px] leading-tight ${selected ? 'text-white/70' : 'text-forest/40'}`}>
                    {m.beskrivelse}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Min spillere + standard slurker */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>Min. spillere</label>
            <input
              type="number"
              value={minSpillere}
              onChange={(e) => setMinSpillere(e.target.value)}
              min={1}
              max={20}
              className={inputCls}
              placeholder="2"
            />
          </div>
          <div>
            <label className={label}>
              Standard slurker <span className="font-normal normal-case text-forest/30">(valgfritt)</span>
            </label>
            <input
              type="number"
              value={standardSlurker}
              onChange={(e) => setStandardSlurker(e.target.value)}
              min={0}
              max={50}
              className={inputCls}
              placeholder="Overstyr intensitet"
            />
          </div>
        </div>
        {standardSlurker && (
          <p className="text-xs text-forest/40 -mt-2">
            Dette kortet bruker alltid {standardSlurker} slurker — uavhengig av valgt intensitet.
          </p>
        )}

        {/* Kjønn */}
        <div>
          <label className={label}>
            Kjønn <span className="font-normal normal-case text-forest/30">(tagg for senere filtrering)</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(KJONN_META) as Kjonn[]).map((k) => {
              const m = KJONN_META[k]
              const selected = kjonn === k
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKjonn(k)}
                  className={`flex flex-col items-start gap-0.5 p-2.5 rounded-xl border-2 transition-all text-left ${
                    selected
                      ? 'border-forest bg-forest text-white'
                      : 'border-cream-dark/40 bg-cream text-forest/60 hover:border-forest/30'
                  }`}
                >
                  <span className="text-xs font-black">{m.label}</span>
                  <span className={`text-[10px] leading-tight ${selected ? 'text-white/70' : 'text-forest/40'}`}>
                    {m.beskrivelse}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Notater */}
        <div>
          <label className={label}>
            Notater <span className="font-normal normal-case text-forest/30">(kun synlig i admin)</span>
          </label>
          <textarea
            value={notater}
            onChange={(e) => setNotater(e.target.value)}
            rows={2}
            className={inputCls + ' resize-none'}
            placeholder="Interne kommentarer, ideer, foreslått av ..."
          />
        </div>

        {/* Aktiv-toggle */}
        <div className="flex items-center justify-between bg-cream rounded-xl px-4 py-3">
          <div>
            <p className="text-sm font-bold text-forest">Publisert</p>
            <p className="text-xs text-forest/50">
              {aktiv ? 'Kortet vises i spillet' : 'Kortet er skjult (utkast)'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAktiv((v) => !v)}
            className={`relative w-12 h-6 rounded-full transition-colors ${aktiv ? 'bg-lime' : 'bg-cream-dark'}`}
            aria-label={aktiv ? 'Skjul kort' : 'Publiser kort'}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                aktiv ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </div>

        {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={saving || !innhold.trim()}
            className="bg-forest text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-forest/80 active:scale-95 disabled:opacity-50 transition-all"
          >
            {saving ? 'Lagrer...' : editCard ? 'Oppdater' : 'Legg til kort'}
          </button>
          {!editCard && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-forest/50 hover:text-forest text-sm px-4 py-2.5 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Nullstill
            </button>
          )}
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-forest/50 hover:text-forest text-sm px-4 py-2.5 font-medium transition-colors"
            >
              Avbryt
            </button>
          )}
        </div>
      </form>

      {/* Live preview */}
      <div className="sticky top-6">
        <p className="text-xs font-bold text-forest/40 uppercase tracking-wider mb-2 px-1">
          Forhåndsvisning
        </p>
        <CardPreview
          type={type}
          tittel={tittel}
          innhold={innhold}
          utfordring={utfordring || undefined}
          timerSekunder={timerSekunder ? parseInt(timerSekunder, 10) : null}
          timerSynlig={timerSynlig}
          packColor={packColor}
          korttyper={korttyper}
        />
      </div>
    </div>
  )
}
