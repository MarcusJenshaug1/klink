'use client'

export function ConsentResetButton() {
  return (
    <button
      type="button"
      onClick={() => {
        localStorage.removeItem('klink-consent-v1')
        localStorage.removeItem('klink_notrack')
        localStorage.removeItem('klink_should_track')
        window.location.href = '/'
      }}
      className="inline-flex min-h-[44px] items-center rounded-2xl bg-forest px-5 py-2.5 text-sm font-black text-lime transition active:scale-95 hover:opacity-90"
    >
      Endre samtykke
    </button>
  )
}
