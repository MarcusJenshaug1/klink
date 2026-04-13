'use client'

import { useRef, useState, useCallback } from 'react'
import { AlertTriangle } from 'lucide-react'

interface ConfirmOptions {
  title: string
  message?: string
  confirmLabel?: string
  danger?: boolean
}

interface ConfirmState extends ConfirmOptions {
  resolve: (value: boolean) => void
}

export function useConfirm() {
  const [state, setState] = useState<ConfirmState | null>(null)

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({ ...options, resolve })
    })
  }, [])

  const handleConfirm = () => {
    state?.resolve(true)
    setState(null)
  }

  const handleCancel = () => {
    state?.resolve(false)
    setState(null)
  }

  const ConfirmDialog = state ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-forest/40 backdrop-blur-sm"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          {state.danger && (
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
          )}
          <div>
            <h3 className="font-display font-black text-lg text-forest leading-tight">
              {state.title}
            </h3>
            {state.message && (
              <p className="text-sm text-forest/50 font-medium mt-1 leading-snug">
                {state.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-xl text-sm font-bold text-forest/50 hover:text-forest hover:bg-cream transition-colors"
          >
            Avbryt
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 ${
              state.danger
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-forest text-white hover:bg-forest/80'
            }`}
          >
            {state.confirmLabel ?? 'Bekreft'}
          </button>
        </div>
      </div>
    </div>
  ) : null

  return { confirm, ConfirmDialog }
}
