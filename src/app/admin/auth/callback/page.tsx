'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()

    async function handleCallback() {
      try {
        const code = searchParams.get('code')

        if (code) {
          // PKCE flow
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
          router.replace('/admin/sett-passord')
          return
        }

        // Implicit flow — parse hash manually since @supabase/ssr uses cookies, not localStorage
        const hash = window.location.hash.substring(1)
        const params = new URLSearchParams(hash)
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          if (error) throw error
          router.replace('/admin/sett-passord')
          return
        }

        setError('Lenken er utløpt eller ugyldig. Be om en ny invitasjon.')
      } catch {
        setError('Noe gikk galt. Be om en ny invitasjon.')
      }
    }

    handleCallback()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-dvh bg-forest flex flex-col items-center justify-center gap-4">
      {error ? (
        <div className="text-center space-y-3">
          <p className="text-red-400 font-medium max-w-xs">{error}</p>
          <a
            href="/admin/logg-inn"
            className="block text-white/40 hover:text-white text-sm transition-colors"
          >
            ← Gå til innlogging
          </a>
        </div>
      ) : (
        <>
          <div className="w-6 h-6 border-2 border-lime/40 border-t-lime rounded-full animate-spin" />
          <p className="text-white/40 text-sm">Logger inn...</p>
        </>
      )}
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-forest flex flex-col items-center justify-center gap-4">
          <div className="w-6 h-6 border-2 border-lime/40 border-t-lime rounded-full animate-spin" />
          <p className="text-white/40 text-sm">Logger inn...</p>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  )
}
