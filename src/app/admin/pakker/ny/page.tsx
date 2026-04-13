import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { PackForm } from '@/components/admin/pack-form'

export default function NewPackPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/pakker" className="text-forest/40 hover:text-forest transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="font-display font-black text-3xl text-forest">Ny spillpakke</h1>
      </div>
      <PackForm />
    </div>
  )
}
