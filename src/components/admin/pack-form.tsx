'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

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
      const { error: err } = await supabase
        .from('spillpakker')
        .insert(data)
      if (err) { setError(err.message); setSaving(false); return }
    }

    router.push('/admin/pakker')
    router.refresh()
  }

  const handleDelete = async () => {
    if (!isEdit || !confirm('Er du sikker? Alle kort i pakken slettes ogsa.')) return
    const supabase = createClient()
    await supabase.from('spillpakker').delete().eq('id', initialData!.id)
    router.push('/admin/pakker')
    router.refresh()
  }

  const update = (field: keyof PackFormData, value: string | boolean) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Navn */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Navn *</label>
        <input
          type="text"
          value={data.navn}
          onChange={(e) => update('navn', e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Beskrivelse */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Beskrivelse</label>
        <textarea
          value={data.beskrivelse}
          onChange={(e) => update('beskrivelse', e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Regler (markdown) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Regler (Markdown)
        </label>
        <textarea
          value={data.regler}
          onChange={(e) => update('regler', e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
          placeholder="## Slik spiller du&#10;&#10;1. Snusboksen sendes rundt...&#10;2. ..."
        />
      </div>

      {/* Farge */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Farge</label>
        <div className="flex items-center gap-3 flex-wrap">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => update('farge', color)}
              className={`w-10 h-10 rounded-full border-2 transition-transform ${
                data.farge === color ? 'border-gray-900 scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
          <input
            type="color"
            value={data.farge}
            onChange={(e) => update('farge', e.target.value)}
            className="w-10 h-10 rounded-full cursor-pointer"
          />
        </div>
      </div>

      {/* Ikon */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ikon (navn)</label>
        <input
          type="text"
          value={data.ikon}
          onChange={(e) => update('ikon', e.target.value)}
          className="w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          placeholder="default"
        />
      </div>

      {/* Aktiv */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="aktiv"
          checked={data.aktiv}
          onChange={(e) => update('aktiv', e.target.checked)}
          className="w-5 h-5"
        />
        <label htmlFor="aktiv" className="text-sm font-medium text-gray-700">
          Aktiv (synlig for spillere)
        </label>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t">
        <button
          type="submit"
          disabled={saving || !data.navn.trim()}
          className="bg-forest text-white px-6 py-2 rounded-lg font-medium hover:bg-forest-light disabled:opacity-50"
        >
          {saving ? 'Lagrer...' : isEdit ? 'Lagre endringer' : 'Opprett pakke'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-gray-500 hover:text-gray-700 px-4 py-2"
        >
          Avbryt
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="ml-auto text-red-500 hover:text-red-700 text-sm"
          >
            Slett pakke
          </button>
        )}
      </div>
    </form>
  )
}
