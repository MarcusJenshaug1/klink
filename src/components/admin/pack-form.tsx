'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Pipette } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useConfirm } from './confirm-modal'

interface PackFormData {
  navn: string
  beskrivelse: string
  regler: string
  farge: string
  ikon: string
  aktiv: boolean
}

interface PackFormProps {
  initialData?: PackFormData & { id: string }
}

const DEFAULT_DATA: PackFormData = {
  navn: '',
  beskrivelse: '',
  regler: '',
  farge: '#4B3FC7',
  ikon: 'default',
  aktiv: true,
}

const PRESET_COLORS = [
  '#4B3FC7', '#FF7B35', '#E8357A', '#0E9E8E', '#6B2D6B',
  '#2563EB', '#DC2626', '#059669', '#D97706', '#7C3AED',
]

export function PackForm({ initialData }: PackFormProps) {
  const router = useRouter()
  const [data, setData] = useState<PackFormData>(initialData ?? DEFAULT_DATA)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [colorCounts, setColorCounts] = useState<Record<string, number>>({})
  const colorInputRef = useRef<HTMLInputElement>(null)
  const { confirm, ConfirmDialog } = useConfirm()

  // Load color usage counts from all other packs
  useEffect(() => {
    async function loadColors() {
      const supabase = createClient()
      const { data: packs } = await supabase
        .from('spillpakker')
        .select('id, farge')
      if (!packs) return
      const counts: Record<string, number> = {}
      packs.forEach(p => {
        if (initialData?.id && p.id === initialData.id) return // skip self
        const c = p.farge.toLowerCase()
        counts[c] = (counts[c] ?? 0) + 1
      })
      setColorCounts(counts)
    }
    loadColors()
  }, [initialData?.id])

  const isEdit = !!initialData?.id

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const supabase = createClient()

    if (isEdit) {
      const { error: err } = await supabase
        .from('spillpakker')
        .update(data)
        .eq('id', initialData!.id)
      if (err) { setError(err.message); setSaving(false); return }
    } else {
      const { error: err } = await supabase.from('spillpakker').insert(data)
      if (err) { setError(err.message); setSaving(false); return }
    }

    router.push('/admin/pakker')
    router.refresh()
  }

  const handleDelete = async () => {
    if (!isEdit) return
    const ok = await confirm({ title: 'Slett spillpakken?', message: 'Alle kort i pakken slettes også. Dette kan ikke angres.', confirmLabel: 'Slett pakken', danger: true })
    if (!ok) return
    const supabase = createClient()
    await supabase.from('spillpakker').delete().eq('id', initialData!.id)
    router.push('/admin/pakker')
    router.refresh()
  }

  const update = (field: keyof PackFormData, value: string | boolean) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const label = 'block text-sm font-semibold text-forest/60 mb-1.5'
  const inputCls = 'w-full px-4 py-3 bg-white border border-cream-dark/60 rounded-2xl text-forest focus:outline-none focus:border-forest/40 transition-colors'

  return (
    <>
    {ConfirmDialog}
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">

      <div className="bg-white rounded-2xl p-6 border border-cream-dark/40 space-y-5">
        {/* Navn */}
        <div>
          <label className={label}>Navn *</label>
          <input
            type="text"
            value={data.navn}
            onChange={(e) => update('navn', e.target.value)}
            required
            className={inputCls}
            placeholder="f.eks. Snusboksen"
          />
        </div>

        {/* Beskrivelse */}
        <div>
          <label className={label}>Beskrivelse</label>
          <textarea
            value={data.beskrivelse}
            onChange={(e) => update('beskrivelse', e.target.value)}
            rows={2}
            className={inputCls + ' resize-none'}
            placeholder="Kort beskrivelse av pakken..."
          />
        </div>

        {/* Regler */}
        <div>
          <label className={label}>
            Regler <span className="font-normal text-forest/40">(Markdown)</span>
          </label>
          <textarea
            value={data.regler}
            onChange={(e) => update('regler', e.target.value)}
            rows={6}
            className={inputCls + ' resize-none font-mono text-sm'}
            placeholder={'## Slik spiller du\n\n1. Snusboksen sendes rundt...\n2. ...'}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-cream-dark/40 space-y-5">
        {/* Farge */}
        <div>
          <label className={label}>Farge</label>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESET_COLORS.map((color) => {
              const isSelected = data.farge.toLowerCase() === color.toLowerCase()
              const count = colorCounts[color.toLowerCase()] ?? 0
              return (
                <div key={color} className="relative">
                  <button
                    type="button"
                    onClick={() => update('farge', color)}
                    title={count > 0 ? `Brukes av ${count} pakke${count !== 1 ? 'r' : ''}` : color}
                    className={`w-10 h-10 rounded-xl border-2 transition-all flex items-center justify-center ${
                      isSelected
                        ? 'border-forest scale-110 shadow-md'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {isSelected && (
                      <Check className="w-4 h-4 text-white drop-shadow" strokeWidth={3} />
                    )}
                  </button>
                  {count > 0 && !isSelected && (
                    <span className="absolute -top-1.5 -right-1.5 text-[9px] font-black bg-forest text-white rounded-full w-4 h-4 flex items-center justify-center leading-none">
                      {count}
                    </span>
                  )}
                </div>
              )
            })}

            {/* Custom color picker */}
            <div className="relative">
              <button
                type="button"
                onClick={() => colorInputRef.current?.click()}
                title="Velg egendefinert farge"
                className={`w-10 h-10 rounded-xl border-2 transition-all flex items-center justify-center overflow-hidden ${
                  !PRESET_COLORS.map(c => c.toLowerCase()).includes(data.farge.toLowerCase())
                    ? 'border-forest scale-110 shadow-md'
                    : 'border-dashed border-cream-dark hover:border-forest/40'
                }`}
                style={
                  !PRESET_COLORS.map(c => c.toLowerCase()).includes(data.farge.toLowerCase())
                    ? { backgroundColor: data.farge }
                    : {}
                }
              >
                {!PRESET_COLORS.map(c => c.toLowerCase()).includes(data.farge.toLowerCase()) ? (
                  <Check className="w-4 h-4 text-white drop-shadow" strokeWidth={3} />
                ) : (
                  <Pipette className="w-4 h-4 text-forest/40" />
                )}
              </button>
              <input
                ref={colorInputRef}
                type="color"
                value={data.farge}
                onChange={(e) => update('farge', e.target.value)}
                className="sr-only"
                tabIndex={-1}
              />
            </div>
          </div>
          <p className="text-xs text-forest/40 mt-2">
            Valgt: <span className="font-mono font-semibold">{data.farge}</span>
          </p>
        </div>

        {/* Aktiv toggle */}
        <div className="flex items-center justify-between py-1">
          <div>
            <p className="font-semibold text-forest text-sm">Aktiv</p>
            <p className="text-xs text-forest/40">Synlig for spillere</p>
          </div>
          <button
            type="button"
            onClick={() => update('aktiv', !data.aktiv)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              data.aktiv ? 'bg-lime' : 'bg-cream-dark'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                data.aktiv ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm font-medium px-1">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving || !data.navn.trim()}
          className="bg-forest text-white px-6 py-3 rounded-2xl font-bold hover:bg-forest/80 active:scale-95 disabled:opacity-50 transition-all"
        >
          {saving ? 'Lagrer...' : isEdit ? 'Lagre endringer' : 'Opprett pakke'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-forest/50 hover:text-forest px-4 py-3 text-sm font-medium transition-colors"
        >
          Avbryt
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="ml-auto text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
          >
            Slett pakke
          </button>
        )}
      </div>
    </form>
    </>
  )
}
