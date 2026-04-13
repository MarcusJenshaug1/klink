'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export type AdminRolle = 'admin' | 'super_admin'

interface AdminRoleState {
  rolle: AdminRolle | null
  loading: boolean
  userId: string | null
}

export function useAdminRole(): AdminRoleState {
  const [state, setState] = useState<AdminRoleState>({
    rolle: null,
    loading: true,
    userId: null,
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user ?? null
      if (!user) {
        setState({ rolle: null, loading: false, userId: null })
        return
      }

      const { data } = await supabase
        .from('admin_brukere')
        .select('rolle')
        .eq('user_id', user.id)
        .single()

      setState({
        rolle: (data?.rolle as AdminRolle) ?? null,
        loading: false,
        userId: user.id,
      })
    }
    load()
  }, [])

  return state
}
