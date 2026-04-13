'use client'

import { useEffect, useRef, useState } from 'react'
import { Pencil, Trash2, Plus, Check, X, Pipette } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ICON_MAP } from '@/lib/game/card-types'
import { IconPicker } from './icon-picker'
import { useConfirm } from './confirm-modal'
import type { Korttype } from '@/types/game'

const inputCls = 'w-full px-4 py-2.5 bg-cream border border-cream-dark/60 rounded-xl text-forest text-sm focus:outline-none focus:border-forest/40 transition-colors'

const COLOR_PRESETS = [
  '#C0392B', '#E67E22', '#F1C40F', '#27AE60', '#1A3A1A',
  '#2980B9', '#8E44AD', '#E91E8C', '#00BCD4', '#FF5722',
  '#607D8B', '#795548',
]

function ColorPickerField({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {COLOR_PRESETS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className="w-7 h-7 rounded-lg border-2 transition-all active:scale-95 relative"
            style={{
              backgroundColor: c,
              borderColor: value === c ? '#fff' : 'transparent',
              boxShadow: value === c ? `0 0 0 2px ${c}` : undefined,
            }}
          >
            {value === c && (
              <Check className="w-3 h-3 text-white absolute inset-0 m-auto" strokeWidth={3} />
            )}
          </button>
        ))}

        {/* Custom color */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-7 h-7 rounded-lg border-2 border-cream-dark/60 bg-cream flex items-center justify-center text-forest/50 hover:text-forest hover:border-forest/30 transition-colors"
          title="Egendefinert farge"
        >
          <Pipette className="w-3.5 h-3.5" />
        </button>
        <input
          ref={inputRef}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
        />
      </div>
      <p className="text-[11px] text-forest/40 font-mono">{value}</p>
    </div>
  )
}

const DEFAULT_FARGE = '#1A3A1A'

export function KorttypeManager() {
  const [korttyper, setKorttyper] = useState<Korttype[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState('')
  const [editIcon, setEditIcon] = useState('Star')
  const [editFarge, setEditFarge] = useState(DEFAULT_FARGE)
  const [editBeskrivelse, setEditBeskrivelse] = useState('')

  // New type form
  const [newLabel, setNewLabel] = useState('')
  const [newIcon, setNewIcon] = useState('Star')
  const [newFarge, setNewFarge] = useState(DEFAULT_FARGE)
  const [newBeskrivelse, setNewBeskrivelse] = useState('')
  const [showNewForm, setShowNewForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const { confirm, ConfirmDialog } = useConfirm()

  async function load() {
    const supabase = createClient()
    const { data } = await supabase
      .from('korttyper')
      .select('id, label, icon_name, farge, beskrivelse')
      .order('opprettet_at', { ascending: true })
    setKorttyper((data as Korttype[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newLabel.trim()) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('korttyper').insert({ label: newLabel.trim(), icon_name: newIcon, farge: newFarge, beskrivelse: newBeskrivelse.trim() || null })
    setNewLabel('')
    setNewIcon('Star')
    setNewFarge(DEFAULT_FARGE)
    setNewBeskrivelse('')
    setShowNewForm(false)
    setSaving(false)
    await load()
  }

  async function handleUpdate(id: string) {
    if (!editLabel.trim()) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('korttyper').update({ label: editLabel.trim(), icon_name: editIcon, farge: editFarge, beskrivelse: editBeskrivelse.trim() || null }).eq('id', id)
    setEditingId(null)
    setSaving(false)
    await load()
  }

  async function handleDelete(id: string) {
    const ok = await confirm({ title: 'Slett korttype?', message: 'Kort som bruker den vil miste sin type-visning.', confirmLabel: 'Slett', danger: true })
    if (!ok) return
    const supabase = createClient()
    await supabase.from('korttyper').delete().eq('id', id)
    await load()
  }

  function startEdit(kt: Korttype) {
    setEditingId(kt.id)
    setEditLabel(kt.label)
    setEditIcon(kt.icon_name)
    setEditFarge(kt.farge)
    setEditBeskrivelse(kt.beskrivelse ?? '')
  }

  return (
    <div className="space-y-4">
      {ConfirmDialog}
      {/* Existing korttyper */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => <div key={i} className="h-14 bg-white rounded-2xl animate-pulse" />)}
        </div>
      ) : korttyper.length === 0 && !showNewForm ? (
        <p className="text-forest/40 text-sm text-center py-6">
          Ingen egendefinerte korttyper enda.
        </p>
      ) : (
        <div className="space-y-2">
          {korttyper.map((kt) => {
            const Icon = ICON_MAP[kt.icon_name]
            const isEditing = editingId === kt.id

            return (
              <div key={kt.id} className="bg-white rounded-2xl border border-cream-dark/40">
                {isEditing ? (
                  <div className="p-4 space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-forest/50 uppercase tracking-wider mb-1.5">Navn</label>
                      <input
                        type="text"
                        value={editLabel}
                        onChange={e => setEditLabel(e.target.value)}
                        className={inputCls}
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-forest/50 uppercase tracking-wider mb-1.5">Farge</label>
                      <ColorPickerField value={editFarge} onChange={setEditFarge} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-forest/50 uppercase tracking-wider mb-1.5">Ikon</label>
                      <IconPicker value={editIcon} onChange={setEditIcon} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-forest/50 uppercase tracking-wider mb-1.5">Forklaring <span className="normal-case font-normal">(vises som tooltip i spillet)</span></label>
                      <textarea
                        value={editBeskrivelse}
                        onChange={e => setEditBeskrivelse(e.target.value)}
                        className={`${inputCls} resize-none`}
                        rows={2}
                        placeholder="Beskriv hva denne korttypen handler om…"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(kt.id)}
                        disabled={saving || !editLabel.trim()}
                        className="inline-flex items-center gap-1.5 bg-forest text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-forest/80 disabled:opacity-50 transition-all active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Lagre
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="inline-flex items-center gap-1.5 text-forest/50 hover:text-forest px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        Avbryt
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: kt.farge }}
                    >
                      {Icon && <Icon className="w-4 h-4 text-white/90" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-forest">{kt.label}</p>
                      {kt.beskrivelse && (
                        <p className="text-xs text-forest/40 truncate">{kt.beskrivelse}</p>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => startEdit(kt)}
                        className="p-2 rounded-lg text-forest/40 hover:text-forest hover:bg-cream transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(kt.id)}
                        className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* New korttype form */}
      {showNewForm ? (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-cream-dark/40 p-4 space-y-3">
          <div>
            <label className="block text-xs font-bold text-forest/50 uppercase tracking-wider mb-1.5">Navn *</label>
            <input
              type="text"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              className={inputCls}
              placeholder="f.eks. Sannhet eller Tør"
              autoFocus
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-forest/50 uppercase tracking-wider mb-1.5">Farge</label>
            <ColorPickerField value={newFarge} onChange={setNewFarge} />
          </div>
          <div>
            <label className="block text-xs font-bold text-forest/50 uppercase tracking-wider mb-1.5">Ikon</label>
            <IconPicker value={newIcon} onChange={setNewIcon} />
          </div>
          <div>
            <label className="block text-xs font-bold text-forest/50 uppercase tracking-wider mb-1.5">Forklaring <span className="normal-case font-normal">(vises som tooltip i spillet)</span></label>
            <textarea
              value={newBeskrivelse}
              onChange={e => setNewBeskrivelse(e.target.value)}
              className={`${inputCls} resize-none`}
              rows={2}
              placeholder="Beskriv hva denne korttypen handler om…"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving || !newLabel.trim()}
              className="inline-flex items-center gap-1.5 bg-forest text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-forest/80 disabled:opacity-50 transition-all active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              {saving ? 'Lagrer...' : 'Opprett'}
            </button>
            <button
              type="button"
              onClick={() => { setShowNewForm(false); setNewLabel(''); setNewIcon('Star'); setNewFarge(DEFAULT_FARGE); setNewBeskrivelse('') }}
              className="text-forest/50 hover:text-forest px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              Avbryt
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowNewForm(true)}
          className="inline-flex items-center gap-2 bg-forest text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-forest/80 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Ny korttype
        </button>
      )}
    </div>
  )
}
