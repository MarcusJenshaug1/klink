'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, LayoutList } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PackForm } from '@/components/admin/pack-form'

export default function EditPackPage() {
  const params = useParams()
  const id = params.id as string
  const [pack, setPack] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('spillpakker')
        .select('*')
        .eq('id', id)
        .single()
      setPack(data)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return (
    <div className="animate-pulse">
      <div className="h-8 bg-white rounded-xl w-48 mb-8" />
      <div className="h-96 bg-white rounded-2xl" />
    </div>
  )
  if (!pack) return <p className="text-red-500">Pakke ikke funnet</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/admin/pakker" className="text-forest/40 hover:text-forest transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="font-display font-black text-3xl text-forest">
            {pack.navn}
          </h1>
        </div>
        <Link
          href={`/admin/pakker/${id}/kort`}
          className="inline-flex items-center gap-2 bg-forest text-white px-4 py-2.5 rounded-2xl text-sm font-bold hover:bg-forest/80 active:scale-95 transition-all"
        >
          <LayoutList className="w-4 h-4" />
          Administrer kort
        </Link>
      </div>
      <PackForm initialData={pack} />
    </div>
  )
}
