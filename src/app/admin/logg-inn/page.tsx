'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { LoginForm } from '@/components/admin/login-form'

const LONG_PRESS_MS = 1500

export default function AdminLoginPage() {
  const router = useRouter()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const start = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      try { if (navigator.vibrate) navigator.vibrate(25) } catch {}
      router.push('/')
    }, LONG_PRESS_MS)
  }

  const cancel = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  return (
    <div className="min-h-dvh bg-forest flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div
          className="text-center mb-8 select-none touch-manipulation cursor-pointer"
          onPointerDown={start}
          onPointerUp={cancel}
          onPointerLeave={cancel}
          onPointerCancel={cancel}
          title="Hold for å gå tilbake"
        >
          <h1 className="font-display font-black text-5xl text-lime leading-none mb-2">
            Klink
          </h1>
          <p className="text-white/50 text-sm font-medium">Admin</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
