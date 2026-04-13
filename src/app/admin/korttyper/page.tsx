import { KorttypeManager } from '@/components/admin/korttype-manager'

export default function KorttypePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-black text-3xl text-forest">Korttyper</h1>
        <p className="text-forest/50 text-sm mt-1">
          Egendefinerte korttyper er globale og kan brukes i alle spillpakker.
        </p>
      </div>
      <div className="max-w-lg">
        <KorttypeManager />
      </div>
    </div>
  )
}
