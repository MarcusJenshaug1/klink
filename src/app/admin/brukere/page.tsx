'use client'

import { useAdminRole } from '@/hooks/use-admin-role'
import { UserManagement } from '@/components/admin/user-management'

export default function BrukerePage() {
  const { rolle, loading, userId } = useAdminRole()

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-white rounded-xl w-48" />
        <div className="h-48 bg-white rounded-2xl" />
      </div>
    )
  }

  if (rolle !== 'super_admin') {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-forest/40">
        <p className="text-lg font-semibold">Ikke tilgang</p>
        <p className="text-sm mt-1">Kun super admins kan administrere brukere.</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-display font-black text-2xl sm:text-3xl text-forest mb-6 sm:mb-8">Brukere</h1>
      <UserManagement currentUserId={userId!} />
    </div>
  )
}
