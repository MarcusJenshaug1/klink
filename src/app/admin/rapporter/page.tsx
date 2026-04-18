'use client'

import { useEffect, useState, useCallback } from 'react'
import { Trash2, Flag, Clock, Package, Pencil, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAdminRole } from '@/hooks/use-admin-role'
import { useConfirm } from '@/components/admin/confirm-modal'

interface ReportRow {
  id: string
  kort_id: string
  grunn: string
  kommentar: string | null
  created_at: string
  kort: {
    innhold: string
    tittel: string | null
    droyhet: string | null
    aktiv: boolean | null
    spillpakke_id: string
    spillpakker: { navn: string; farge: string } | null
  } | null
}

const GRUNN_LABEL: Record<string, string> = {
  darlig_skrevet: 'Dårlig skrevet',
  for_krenkende: 'For krenkende',
  ikke_morsomt: 'Ikke morsomt',
  feil_kategori: 'Feil kategori',
  annet: 'Annet',
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('no-NO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export default function RapporterPage() {
  const { rolle, loading: roleLoading } = useAdminRole()
  const [rows, setRows] = useState<ReportRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { confirm, ConfirmDialog } = useConfirm()

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data, error: err } = await supabase
      .from('kort_rapporter')
      .select('id, kort_id, grunn, kommentar, created_at, kort:kort_id (innhold, tittel, droyhet, aktiv, spillpakke_id, spillpakker:spillpakke_id (navn, farge))')
      .order('created_at', { ascending: false })

    if (err) setError(err.message)
    else setRows((data as unknown as ReportRow[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function dismissReport(id: string) {
    const supabase = createClient()
    await supabase.from('kort_rapporter').delete().eq('id', id)
    await load()
  }

  async function deactivateCard(cardId: string) {
    const ok = await confirm({
      title: 'Deaktiver kortet?',
      message: 'Kortet vil ikke vises i spillet lenger, men kan aktiveres igjen fra admin.',
      confirmLabel: 'Deaktiver',
      danger: true,
    })
    if (!ok) return
    const supabase = createClient()
    await supabase.from('kort').update({ aktiv: false }).eq('id', cardId)
    await supabase.from('kort_rapporter').delete().eq('kort_id', cardId)
    await load()
  }

  async function deleteCard(cardId: string) {
    const ok = await confirm({
      title: 'Slett kortet permanent?',
      message: 'Kortet og alle rapporter på det fjernes. Dette kan ikke angres.',
      confirmLabel: 'Slett',
      danger: true,
    })
    if (!ok) return
    const supabase = createClient()
    await supabase.from('kort').delete().eq('id', cardId)
    await load()
  }

  if (roleLoading) {
    return <div className="text-forest/40">Laster ...</div>
  }

  if (rolle !== 'super_admin') {
    return (
      <div className="bg-white rounded-2xl p-6 border border-cream-dark/40">
        <p className="font-semibold text-forest">Kun super_admin har tilgang.</p>
      </div>
    )
  }

  return (
    <div>
      {ConfirmDialog}
      <div className="flex items-center gap-3 mb-2">
        <Flag className="w-7 h-7 text-forest" />
        <h1 className="font-display font-black text-3xl text-forest">Rapporterte kort</h1>
        {rows.length > 0 && (
          <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {rows.length}
          </span>
        )}
      </div>
      <p className="text-forest/60 mb-8">
        Spillere kan rapportere dårlige kort fra spillet. Håndter dem her.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 mb-6 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-24 animate-pulse" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-cream-dark/40">
          <CheckCircle2 className="w-12 h-12 mx-auto text-forest/50 mb-3" />
          <p className="font-bold text-forest">Ingen rapporter akkurat nå</p>
          <p className="text-forest/50 text-sm mt-1">Alle kort har gode tilbakemeldinger.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-cream-dark/40 p-5">
              {/* Card preview */}
              {r.kort ? (
                <>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {r.kort.spillpakker && (
                      <span
                        className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: r.kort.spillpakker.farge }}
                      >
                        <Package className="w-3 h-3" />
                        {r.kort.spillpakker.navn}
                      </span>
                    )}
                    {r.kort.droyhet && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest/8 text-forest/70 uppercase">
                        {r.kort.droyhet}
                      </span>
                    )}
                    {r.kort.aktiv === false && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700">
                        Inaktiv
                      </span>
                    )}
                    {r.kort.tittel && (
                      <span className="text-xs text-forest/40 font-medium">— {r.kort.tittel}</span>
                    )}
                  </div>
                  <p className="text-forest font-medium mb-3">{r.kort.innhold}</p>
                </>
              ) : (
                <p className="text-forest/40 italic mb-3">Kortet er slettet.</p>
              )}

              {/* Report details */}
              <div className="flex flex-wrap items-start gap-2 mb-4">
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700">
                  <Flag className="w-3 h-3" />
                  {GRUNN_LABEL[r.grunn] ?? r.grunn}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-forest/40">
                  <Clock className="w-3 h-3" />
                  {formatDate(r.created_at)}
                </span>
              </div>

              {r.kommentar && (
                <p className="text-sm text-forest/70 bg-cream rounded-lg px-3 py-2 mb-4 italic">
                  &ldquo;{r.kommentar}&rdquo;
                </p>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => dismissReport(r.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-forest/10 text-forest hover:bg-forest/15 transition"
                >
                  Avvis rapport
                </button>
                {r.kort && (
                  <>
                    <Link
                      href={`/admin/pakker/${r.kort.spillpakke_id}/kort?kortId=${r.kort_id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-forest/10 text-forest hover:bg-forest/15 transition"
                    >
                      <Pencil className="w-3 h-3" />
                      Rediger kort
                    </Link>
                    {r.kort.aktiv !== false && (
                      <button
                        onClick={() => deactivateCard(r.kort_id)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition"
                      >
                        Deaktiver kort
                      </button>
                    )}
                    <button
                      onClick={() => deleteCard(r.kort_id)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                      Slett kort
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
