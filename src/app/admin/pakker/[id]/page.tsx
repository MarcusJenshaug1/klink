'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
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

  if (loading) return <p className="text-gray-500">Laster...</p>
  if (!pack) return <p className="text-red-500">Pakke ikke funnet</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Rediger: {pack.navn}</h1>
        <Link
          href={`/admin/pakker/${id}/kort`}
          className="bg-forest text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-forest-light"
        >
          Administrer kort
        </Link>
      </div>
      <PackForm initialData={pack} />
    </div>
  )
}
