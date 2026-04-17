'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { CARD_TYPE_META, ICON_MAP } from '@/lib/game/card-types'
import { DROYHET_META } from '@/lib/game/droyhet'
import { VEKT_META } from '@/lib/game/vekt'
import { CardPreview } from './card-preview'
import { TokenInput, type TokenInputHandle } from './token-input'
import type { KortType, Korttype, Droyhet, Kjonn, Vekt } from '@/types/game'

const BUILT_IN_TYPES: KortType[] = [
  'snusboks', 'pekelek', 'alle_drikker', 'kaos', 'femfingre', 'utfordring', 'regel', 'kategori',
]

const EMPTY_PAASTANDER: [string, string, string, string, string] = ['', '', '', '', '']

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
    slurker_lett?: number | null
    slurker_medium?: number | null
    slurker_borst?: number | null
    notater?: string | null
    kjonn?: Kjonn
    vekt?: Vekt
    paastander?: string[] | null
  }
  onSaved: () => void
  onCancel?: () => void
  /** Render in modal mode: no live preview sidebar, stacked layout */
  compact?: boolean
}

const btnCls = 'text-xs font-semibold px-2 py-1 rounded-md bg-forest/8 text-forest/80 hover:bg-forest/15 transition-colors'

function TokenInsertBar({ onInsert }: { onInsert: (token: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-1.5 items-center">
      <span className="text-[10px] font-bold text-forest/40 uppercase tracking-wider">Sett inn:</span>
      <span className="flex gap-1">
        <button type="button" onClick={() => onInsert('{spiller}')}   className={btnCls} title="Tilfeldig spiller">Tilfeldig spiller</button>
        <button type="button" onClick={() => onInsert('{spiller1}')}  className={btnCls} title="Spiller-slot #1 — samme person om du bruker #1 flere ganger">#1</button>
        <button type="button" onClick={() => onInsert('{spiller2}')}  className={btnCls} title="Spiller-slot #2">#2</button>
        <button type="button" onClick={() => onInsert('{spiller3}')}  className={btnCls} title="Spiller-slot #3">#3</button>
      </span>
      <button type="button" onClick={() => onInsert('{sips}')} className={btnCls} title="Antall slurker basert på intensitet">{'{sips}'}</button>
    </div>
  )
}

const KJONN_META: Record<Kjonn, string> = {
  alle: 'Alle',
  mann: 'Menn',
  kvinne: 'Kvinner',
}

const label = 'block text-xs font-bold text-forest/50 uppercase tracking-wider mb-1.5'
const inputCls = 'w-full px-3 py-2 bg-cream border border-cream-dark/60 rounded-xl text-forest text-sm focus:outline-none focus:border-forest/40 transition-colors'

export function CardForm({ packId, packColor, initialKorttyper, editCard, onSaved, onCancel, compact = false }: CardFormProps) {
  const [type, setType] = useState<KortType>(editCard?.type ?? 'snusboks')
  const [tittel, setTittel] = useState(editCard?.tittel ?? '')
  const [innhold, setInnhold] = useState(editCard?.innhold ?? '')
  const [paastander, setPaastander] = useState<string[]>(() => {
    const src = editCard?.paastander ?? []
    return [0, 1, 2, 3, 4].map((i) => src[i] ?? '')
  })
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
  const [slurkerLett, setSlurkerLett] = useState<string>(
    editCard?.slurker_lett != null ? String(editCard.slurker_lett) : ''
  )
  const [slurkerMedium, setSlurkerMedium] = useState<string>(
    editCard?.slurker_medium != null ? String(editCard.slurker_medium) : ''
  )
  const [slurkerBorst, setSlurkerBorst] = useState<string>(
    editCard?.slurker_borst != null ? String(editCard.slurker_borst) : ''
  )
  const [kjonn, setKjonn] = useState<Kjonn>(editCard?.kjonn ?? 'alle')
  const [vekt, setVekt] = useState<Vekt>(editCard?.vekt ?? 'vanlig')
  const [notater, setNotater] = useState(editCard?.notater ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [korttyper, setKorttyper] = useState<Korttype[]>(initialKorttyper ?? [])
  const [advancedOpen, setAdvancedOpen] = useState(!!editCard)
  const innholdRef = useRef<TokenInputHandle>(null)
  const utfordringRef = useRef<TokenInputHandle>(null)

  const insertToken = useCallback((token: string, target: 'innhold' | 'utfordring') => {
    if (target === 'innhold') innholdRef.current?.insertToken(token)
    else utfordringRef.current?.insertToken(token)
  }, [])

  useEffect(() => {
    if (initialKorttyper) return
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
    setPaastander([...EMPTY_PAASTANDER])
    setUtfordring('')
    setTimerSekunder('')
    setTimerSynlig(false)
    setAktiv(true)
    setDroyhet('normal')
    setMinSpillere('2')
    setSlurkerLett('')
    setSlurkerMedium('')
    setSlurkerBorst('')
    setKjonn('alle')
    setVekt('vanlig')
    setNotater('')
    setError('')
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const isFemFingre = type === 'femfingre'
    const trimmedPaastander = paastander.map((p) => p.trim())
    if (isFemFingre) {
      if (trimmedPaastander.some((p) => !p)) {
        setError('Alle 5 påstander må fylles ut')
        return
      }
    } else if (!innhold.trim()) {
      setError('Innhold er påkrevd')
      return
    }
    setSaving(true)
    setError('')

    const supabase = createClient()
    const payload = {
      spillpakke_id: packId,
      type,
      tittel: tittel.trim(),
      innhold: isFemFingre ? '' : innhold.trim(),
      paastander: isFemFingre ? trimmedPaastander : null,
      utfordring: isFemFingre ? null : (utfordring.trim() || null),
      timer_sekunder: isFemFingre ? null : (timerSekunder ? parseInt(timerSekunder, 10) : null),
      timer_synlig: isFemFingre ? false : (timerSekunder ? timerSynlig : false),
      aktiv,
      droyhet,
      min_spillere: minSpillere ? Math.max(1, parseInt(minSpillere, 10)) : 2,
      slurker_lett: slurkerLett ? parseInt(slurkerLett, 10) : null,
      slurker_medium: slurkerMedium ? parseInt(slurkerMedium, 10) : null,
      slurker_borst: slurkerBorst ? parseInt(slurkerBorst, 10) : null,
      notater: notater.trim() || null,
      kjonn,
      vekt,
    }

    if (editCard) {
      const { spillpakke_id: _s, ...updatePayload } = payload
      void _s
      const { error: err } = await supabase.from('kort').update(updatePayload).eq('id', editCard.id)
      if (err) { setError(err.message); setSaving(false); return }
    } else {
      const { error: err } = await supabase.from('kort').insert(payload)
      if (err) { setError(err.message); setSaving(false); return }
    }

    setSaving(false)
    if (!editCard) {
      setTittel('')
      setInnhold('')
      setPaastander([...EMPTY_PAASTANDER])
      setUtfordring('')
      setTimerSekunder('')
      setTimerSynlig(false)
      setSlurkerLett('')
      setSlurkerMedium('')
      setSlurkerBorst('')
      setNotater('')
    }
    onSaved()
  }

  const isFemFingre = type === 'femfingre'

  const FormFields = (
    <>
      {/* Type selector */}
      <div>
        <p className={label}>Korttype</p>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {BUILT_IN_TYPES.map((t) => {
            const meta = CARD_TYPE_META[t]
            const Icon = meta.icon
            const selected = type === t
            return (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                title={meta.label}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all text-center ${
                  selected ? 'border-forest bg-forest text-white' : 'border-cream-dark/40 bg-cream text-forest/60 hover:border-forest/30'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-[9px] font-bold leading-tight">{meta.label}</span>
              </button>
            )
          })}
        </div>
        {korttyper.length > 0 && (
          <>
            <p className="text-[10px] font-bold text-forest/30 uppercase tracking-wider mt-3 mb-1.5">Egendefinerte</p>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {korttyper.map((kt) => {
                const Icon = ICON_MAP[kt.icon_name]
                const selected = type === kt.id
                return (
                  <button
                    key={kt.id}
                    type="button"
                    onClick={() => setType(kt.id)}
                    title={kt.label}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all text-center ${
                      selected ? 'border-forest bg-forest text-white' : 'border-cream-dark/40 bg-cream text-forest/60 hover:border-forest/30'
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

      {/* Innhold eller påstander (fem fingre) */}
      {isFemFingre ? (
        <div>
          <label className={label}>Påstander * <span className="font-normal normal-case text-forest/30">(nøyaktig 5)</span></label>
          <div className="space-y-2">
            {paastander.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="shrink-0 w-6 h-6 rounded-full bg-forest/10 text-forest/60 flex items-center justify-center text-[11px] font-black">
                  {i + 1}
                </span>
                <input
                  type="text"
                  value={p}
                  onChange={(e) => {
                    const next = [...paastander]
                    next[i] = e.target.value
                    setPaastander(next)
                  }}
                  autoFocus={!editCard && i === 0}
                  className={inputCls}
                  placeholder={`Påstand ${i + 1} …`}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <label className={label}>Innhold *</label>
          <TokenInput
            ref={innholdRef}
            value={innhold}
            onChange={setInnhold}
            rows={3}
            autoFocus={!editCard}
            placeholder="Skriv spørsmål eller innhold..."
          />
          <TokenInsertBar onInsert={(t) => insertToken(t, 'innhold')} />
        </div>
      )}

      {/* Drøyhet — front-and-center as most impactful field */}
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
                className={`p-2.5 rounded-xl border-2 transition-all ${
                  selected ? 'border-forest bg-forest text-white' : 'border-cream-dark/40 bg-cream text-forest/60 hover:border-forest/30'
                }`}
              >
                <div className="text-xs font-black">{m.label}</div>
                <div className={`text-[10px] leading-tight mt-0.5 ${selected ? 'text-white/70' : 'text-forest/40'}`}>
                  {m.beskrivelse}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Advanced toggle */}
      <button
        type="button"
        onClick={() => setAdvancedOpen((v) => !v)}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed border-forest/25 text-sm font-bold text-forest/70 hover:border-forest/50 hover:text-forest hover:bg-forest/5 transition-colors"
      >
        {advancedOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        {advancedOpen ? 'Skjul avanserte innstillinger' : 'Vis avanserte innstillinger'}
      </button>

      {advancedOpen && (
        <div className="space-y-4 pt-1">
          {/* Tittel */}
          <div>
            <label className={label}>
              Tittel <span className="font-normal normal-case text-forest/30">(subkategori-badge, valgfritt)</span>
            </label>
            <input
              type="text"
              value={tittel}
              onChange={(e) => setTittel(e.target.value)}
              className={inputCls}
              placeholder="f.eks. Shot or Text, Hot Seat"
            />
          </div>

          {/* Utfordring */}
          {!isFemFingre && (
            <div>
              <label className={label}>Utfordring <span className="font-normal normal-case text-forest/30">(valgfritt)</span></label>
              <TokenInput
                ref={utfordringRef}
                value={utfordring ?? ''}
                onChange={setUtfordring}
                rows={2}
                placeholder="f.eks. Den som klarer X kan dele ut {sips} slurker!"
              />
              <TokenInsertBar onInsert={(t) => insertToken(t, 'utfordring')} />
            </div>
          )}

          {/* Per-intensitet slurker */}
          <div>
            <label className={label}>
              Fast slurker-antall per intensitet <span className="font-normal normal-case text-forest/30">(valgfritt — tom = bruk tilfeldig)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { k: 'lett', label: 'Lett', val: slurkerLett, set: setSlurkerLett, ph: '1–2' },
                { k: 'medium', label: 'Medium', val: slurkerMedium, set: setSlurkerMedium, ph: '3–5' },
                { k: 'borst', label: 'Børst', val: slurkerBorst, set: setSlurkerBorst, ph: '7–10' },
              ].map(({ k, label: lab, val, set, ph }) => (
                <div key={k}>
                  <p className="text-[10px] font-bold text-forest/40 uppercase mb-1">{lab}</p>
                  <input
                    type="number"
                    value={val}
                    onChange={(e) => set(e.target.value)}
                    min={0}
                    max={50}
                    className={inputCls}
                    placeholder={ph}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Timer */}
          {!isFemFingre && (
          <div>
            <label className={label}>Timer <span className="font-normal normal-case text-forest/30">(valgfritt, 5–600 sek)</span></label>
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="number"
                value={timerSekunder}
                onChange={(e) => setTimerSekunder(e.target.value)}
                min={5}
                max={600}
                className="w-24 px-3 py-2 bg-cream border border-cream-dark/60 rounded-xl text-forest text-sm focus:outline-none focus:border-forest/40"
                placeholder="sek"
              />
              {timerSekunder && (
                <div className="flex items-center gap-1 rounded-xl border border-cream-dark/60 bg-cream p-0.5">
                  <button type="button" onClick={() => setTimerSynlig(false)} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${!timerSynlig ? 'bg-forest text-white' : 'text-forest/50'}`}>Skjult</button>
                  <button type="button" onClick={() => setTimerSynlig(true)} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${timerSynlig ? 'bg-forest text-white' : 'text-forest/50'}`}>Synlig</button>
                </div>
              )}
            </div>
          </div>
          )}

          {/* Vekt + Min spillere in one row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className={label}>Vekt (hyppighet)</p>
              <div className="flex gap-1">
                {(Object.keys(VEKT_META) as Vekt[]).map((v) => {
                  const selected = vekt === v
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVekt(v)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${selected ? 'bg-forest text-white' : 'bg-cream text-forest/60 hover:bg-cream-dark/40'}`}
                    >
                      {VEKT_META[v].label}
                    </button>
                  )
                })}
              </div>
            </div>
            <div>
              <label className={label}>Min. spillere</label>
              <input
                type="number"
                value={minSpillere}
                onChange={(e) => setMinSpillere(e.target.value)}
                min={1}
                max={20}
                className={inputCls}
              />
            </div>
          </div>

          {/* Kjønn */}
          <div>
            <p className={label}>Kjønn <span className="font-normal normal-case text-forest/30">(tagg for senere bruk)</span></p>
            <div className="flex gap-1">
              {(Object.keys(KJONN_META) as Kjonn[]).map((k) => {
                const selected = kjonn === k
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKjonn(k)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${selected ? 'bg-forest text-white' : 'bg-cream text-forest/60 hover:bg-cream-dark/40'}`}
                  >
                    {KJONN_META[k]}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Notater */}
          <div>
            <label className={label}>Notater <span className="font-normal normal-case text-forest/30">(kun admin)</span></label>
            <textarea
              value={notater}
              onChange={(e) => setNotater(e.target.value)}
              rows={2}
              className={inputCls + ' resize-none'}
              placeholder="Interne kommentarer ..."
            />
          </div>

          {/* Aktiv */}
          <div className="flex items-center justify-between bg-cream rounded-xl px-4 py-3">
            <div>
              <p className="text-sm font-bold text-forest">Publisert</p>
              <p className="text-xs text-forest/50">{aktiv ? 'Vises i spillet' : 'Skjult (utkast)'}</p>
            </div>
            <button
              type="button"
              onClick={() => setAktiv((v) => !v)}
              className={`relative w-12 h-6 rounded-full transition-colors ${aktiv ? 'bg-lime' : 'bg-cream-dark'}`}
              aria-label={aktiv ? 'Skjul' : 'Publiser'}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${aktiv ? 'translate-x-6' : ''}`} />
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={saving || (isFemFingre ? paastander.some((p) => !p.trim()) : !innhold.trim())}
          className="bg-forest text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-forest/80 active:scale-95 disabled:opacity-50 transition-all"
        >
          {saving ? 'Lagrer...' : editCard ? 'Oppdater' : 'Legg til kort'}
        </button>
        {!editCard && !compact && (
          <button type="button" onClick={handleReset} className="text-forest/50 hover:text-forest text-sm px-3 py-2.5 font-medium">
            Nullstill
          </button>
        )}
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-forest/50 hover:text-forest text-sm px-3 py-2.5 font-medium ml-auto">
            Avbryt
          </button>
        )}
      </div>
    </>
  )

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {FormFields}
      </form>
    )
  }

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 border border-cream-dark/40 space-y-4">
        {FormFields}
      </form>
      <div className="sticky top-6">
        <p className="text-xs font-bold text-forest/40 uppercase tracking-wider mb-2 px-1">Forhåndsvisning</p>
        <CardPreview
          type={type}
          tittel={tittel}
          innhold={innhold}
          utfordring={utfordring || undefined}
          timerSekunder={timerSekunder ? parseInt(timerSekunder, 10) : null}
          timerSynlig={timerSynlig}
          paastander={paastander}
          packColor={packColor}
          korttyper={korttyper}
        />
      </div>
    </div>
  )
}
