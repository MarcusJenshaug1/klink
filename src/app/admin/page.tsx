'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface PackSummary {
  id: string
  navn: string
  farge: string
  aktiv: boolean
  card_count: number
}

export default function AdminDashboard() {
  const [packs, setPacks] = useState<PackSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: packData } = await supabase
        .from('spillpakker')
        .select('id, navn, farge, aktiv')
        .order('opprettet_at', { ascending: true })

      if (packData) {
        const summaries: PackSummary[] = await Promise.all(
          packData.map(async (p) => {
            const { count } = await supabase
              .from('kort')
              .select('*', { count: 'exact', head: true })
              .eq('spillpakke_id', p.id)
            return { ...p, card_count: count ?? 0 }
          })
        )
        setPacks(summaries)
      }
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          href="/admin/pakker/ny"
          className="bg-forest text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-forest-light"
        >
          + Ny pakke
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Laster...</p>
      ) : packs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Ingen spillpakker enda</p>
          <Link href="/admin/pakker/ny" className="text-forest underline mt-2 inline-block">
            Opprett din forste pakke
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {packs.map((pack) => (
            <Link
              key={pack.id}
              href={`/admin/pakker/${pack.id}/kort`}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: pack.farge }}
                />
                <h3 className="font-semibold">{pack.navn}</h3>
                {!pack.aktiv && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    Inaktiv
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">{pack.card_count} kort</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
