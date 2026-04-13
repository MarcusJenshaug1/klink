'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Spillpakker</h1>
        <Link
          href="/admin/pakker/ny"
          className="bg-forest text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-forest-light"
        >
          + Ny pakke
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Laster...</p>
      ) : (
        <div className="space-y-2">
          {packs.map((pack) => (
            <Link
              key={pack.id}
              href={`/admin/pakker/${pack.id}`}
              className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100 hover:shadow-sm transition-shadow"
            >
              <div
                className="w-4 h-4 rounded-full shrink-0"
                style={{ backgroundColor: pack.farge }}
              />
              <span className="font-medium flex-1">{pack.navn}</span>
              {!pack.aktiv && (
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  Inaktiv
                </span>
              )}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-400">
                <path d="M8 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
