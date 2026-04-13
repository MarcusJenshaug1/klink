'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface PackRow {
  id: string
  navn: string
  farge: string
  aktiv: boolean
}

export default function PackListPage() {
  const [packs, setPacks] = useState<PackRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('spillpakker')
        .select('id, navn, farge, aktiv')
        .order('opprettet_at', { ascending: true })
      setPacks(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-black text-3xl text-forest">Spillpakker</h1>
        <Link
          href="/admin/pakker/ny"
          className="inline-flex items-center gap-2 bg-forest text-white px-4 py-2.5 rounded-2xl text-sm font-bold hover:bg-forest/80 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Ny pakke
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-16 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {packs.map((pack) => (
            <Link
              key={pack.id}
              href={`/admin/pakker/${pack.id}`}
              className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 border border-cream-dark/40 hover:shadow-sm hover:border-forest/20 transition-all"
            >
              <div
                className="w-8 h-8 rounded-xl shrink-0"
                style={{ backgroundColor: pack.farge }}
              />
              <span className="font-semibold text-forest flex-1">{pack.navn}</span>
              {!pack.aktiv && (
                <span className="text-xs bg-forest/10 text-forest/50 px-2 py-0.5 rounded-full font-semibold">
                  Inaktiv
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-forest/30" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
