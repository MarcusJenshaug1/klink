'use client'

import { useState, useEffect } from 'react'
import { X, Download } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

// ─── SVG Illustrations ────────────────────────────────────────────────────────

/** Step 1: Safari bottom toolbar with share button highlighted */
function IllustrationShare() {
  return (
    <svg viewBox="0 0 220 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[220px]">
      {/* Toolbar background */}
      <rect width="220" height="64" rx="14" fill="#F2F2F7"/>
      <line x1="0" y1="1" x2="220" y2="1" stroke="#D1D1D6" strokeWidth="1"/>
      {/* Back arrow */}
      <path d="M22 32 L34 22 M22 32 L34 42" stroke="#007AFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Forward arrow (disabled) */}
      <path d="M54 22 L66 32 M66 32 L54 42" stroke="#C7C7CC" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Share button highlight */}
      <rect x="93" y="10" width="34" height="44" rx="10" fill="#007AFF" fillOpacity="0.13"/>
      {/* Share icon: box */}
      <rect x="103" y="30" width="14" height="11" rx="2.5" stroke="#007AFF" strokeWidth="2"/>
      {/* Share icon: arrow shaft */}
      <line x1="110" y1="30" x2="110" y2="20" stroke="#007AFF" strokeWidth="2" strokeLinecap="round"/>
      {/* Share icon: arrowhead */}
      <path d="M106 24 L110 19 L114 24" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Pulse ring */}
      <circle cx="110" cy="32" r="22" stroke="#007AFF" strokeWidth="1.5" strokeDasharray="4 3" strokeOpacity="0.45"/>
      {/* Bookmark icon */}
      <path d="M163 22 L163 42 M163 22 L171 22 L171 42" stroke="#C7C7CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Tabs icon */}
      <rect x="192" y="26" width="14" height="12" rx="3" stroke="#C7C7CC" strokeWidth="2" fill="none"/>
      <rect x="196" y="23" width="14" height="12" rx="3" stroke="#C7C7CC" strokeWidth="1.5" fill="#F2F2F7"/>
    </svg>
  )
}

/** Step 2: iOS share sheet — "Legg til på hjemskjerm" highlighted */
function IllustrationAddToHome() {
  return (
    <svg viewBox="0 0 220 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[220px]">
      {/* Sheet background */}
      <rect width="220" height="96" rx="14" fill="#F2F2F7"/>
      {/* Row of icons */}
      {/* Icon 1 — grayed */}
      <rect x="8" y="10" width="44" height="44" rx="12" fill="#E5E5EA"/>
      <text x="30" y="68" textAnchor="middle" fontSize="8.5" fill="#8E8E93" fontFamily="system-ui">Del</text>
      {/* Icon 2 — grayed */}
      <rect x="60" y="10" width="44" height="44" rx="12" fill="#E5E5EA"/>
      <text x="82" y="68" textAnchor="middle" fontSize="8.5" fill="#8E8E93" fontFamily="system-ui">Kopier</text>
      {/* Icon 3 — "Legg til" HIGHLIGHTED */}
      <rect x="110" y="6" width="52" height="52" rx="14" fill="#007AFF" fillOpacity="0.14"/>
      <rect x="114" y="10" width="44" height="44" rx="12" fill="white" stroke="#007AFF" strokeWidth="1.8"/>
      {/* + in circle */}
      <circle cx="136" cy="32" r="10" stroke="#007AFF" strokeWidth="2" fill="none"/>
      <line x1="136" y1="27" x2="136" y2="37" stroke="#007AFF" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="131" y1="32" x2="141" y2="32" stroke="#007AFF" strokeWidth="2.2" strokeLinecap="round"/>
      <text x="136" y="68" textAnchor="middle" fontSize="7.5" fill="#007AFF" fontFamily="system-ui" fontWeight="600">Legg til</text>
      <text x="136" y="78" textAnchor="middle" fontSize="7.5" fill="#007AFF" fontFamily="system-ui" fontWeight="600">hjemskjerm</text>
      {/* Icon 4 — grayed */}
      <rect x="170" y="10" width="44" height="44" rx="12" fill="#E5E5EA"/>
      <text x="192" y="68" textAnchor="middle" fontSize="8.5" fill="#8E8E93" fontFamily="system-ui">Mer</text>
    </svg>
  )
}

/** Step 3: iOS dialog top bar — "Legg til" button highlighted */
function IllustrationConfirm() {
  return (
    <svg viewBox="0 0 220 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[220px]">
      {/* Nav bar background */}
      <rect width="220" height="64" rx="14" fill="#F9F9F9"/>
      <line x1="0" y1="63" x2="220" y2="63" stroke="#D1D1D6" strokeWidth="1"/>
      {/* Klink app icon (preview) */}
      <rect x="16" y="10" width="44" height="44" rx="10" fill="#A8E63D"/>
      <text x="38" y="38" textAnchor="middle" fontSize="13" fill="#1A3A1A" fontFamily="Georgia, serif" fontWeight="700">K</text>
      {/* App name + url */}
      <text x="70" y="28" fontSize="12" fill="#000" fontFamily="system-ui" fontWeight="600">Klink</text>
      <text x="70" y="44" fontSize="10" fill="#8E8E93" fontFamily="system-ui">klinkn.no</text>
      {/* "Legg til" button — highlighted */}
      <rect x="152" y="14" width="56" height="36" rx="9" fill="#007AFF" fillOpacity="0.13"/>
      <text x="180" y="37" textAnchor="middle" fontSize="14" fill="#007AFF" fontFamily="system-ui" fontWeight="600">Legg til</text>
    </svg>
  )
}

// ─── Step data ─────────────────────────────────────────────────────────────────

const IOS_STEPS = [
  {
    number: 1,
    title: 'Trykk Del-knappen',
    description: 'Finn firkant-ikonet med pil opp nederst i Safari.',
    illustration: <IllustrationShare />,
  },
  {
    number: 2,
    title: 'Velg «Legg til på hjemskjerm»',
    description: 'Scroll nedover i menyen og trykk på +-ikonet.',
    illustration: <IllustrationAddToHome />,
  },
  {
    number: 3,
    title: 'Trykk «Legg til»',
    description: 'Bekreft i dialogboksen. Klink dukker opp på hjemskjermen!',
    illustration: <IllustrationConfirm />,
  },
]

// ─── iOS Guide Modal ──────────────────────────────────────────────────────────

function IosGuideModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />
      <div
        className="relative w-full max-w-lg rounded-t-3xl bg-white pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-black/10 rounded-full mx-auto mt-3 mb-5" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 mb-6">
          <div>
            <h2 className="font-display text-2xl font-black text-forest">Installer Klink</h2>
            <p className="text-sm text-forest/50 mt-0.5">Legg til på hjemskjermen i Safari</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Lukk"
            className="w-9 h-9 rounded-full bg-black/8 flex items-center justify-center text-forest/60 hover:bg-black/12 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Steps */}
        <div className="px-6 flex flex-col gap-5">
          {IOS_STEPS.map((step) => (
            <div key={step.number} className="flex gap-4 items-start">
              {/* Step number */}
              <div className="shrink-0 w-7 h-7 rounded-full bg-forest flex items-center justify-center">
                <span className="text-xs font-black text-lime">{step.number}</span>
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-forest text-sm">{step.title}</p>
                <p className="text-forest/55 text-xs mt-0.5 leading-relaxed">{step.description}</p>
                {/* Illustration */}
                <div className="mt-2.5 flex justify-center bg-[#F2F2F7] rounded-2xl p-3 overflow-hidden">
                  {step.illustration}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* iOS requirement note */}
        <p className="text-center text-[11px] text-forest/35 mt-5 px-6">
          Krever Safari på iPhone/iPad
        </p>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function InstallCta() {
  const [platform, setPlatform] = useState<'ios' | 'android' | null>(null)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showGuide, setShowGuide] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Already installed as PWA — hide CTA
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as { standalone?: boolean }).standalone === true
    if (isStandalone) return

    // Check dismissed
    if (localStorage.getItem('install-cta-dismissed') === '1') {
      setDismissed(true)
      return
    }

    // Detect platform
    const ua = navigator.userAgent
    if (/iPad|iPhone|iPod/.test(ua)) {
      setPlatform('ios')
    } else if (/Android/.test(ua)) {
      setPlatform('android')
    }

    // Android: capture beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
      setPlatform('android')
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleDismiss = () => {
    localStorage.setItem('install-cta-dismissed', '1')
    setDismissed(true)
    setShowGuide(false)
  }

  const handleAndroidInstall = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    const result = await installPrompt.userChoice
    if (result.outcome === 'accepted') handleDismiss()
  }

  if (dismissed || !platform) return null

  return (
    <>
      {/* CTA pill */}
      <div className="flex items-center gap-2">
        <button
          onClick={platform === 'ios' ? () => setShowGuide(true) : handleAndroidInstall}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-forest/12 hover:bg-forest/20 active:scale-95 transition-all"
        >
          <Download className="w-3.5 h-3.5 text-forest/70" />
          <span className="text-xs font-bold text-forest/70">Installer appen</span>
        </button>
        <button
          onClick={handleDismiss}
          aria-label="Ikke vis igjen"
          className="w-6 h-6 rounded-full hover:bg-forest/10 flex items-center justify-center transition-colors"
        >
          <X className="w-3 h-3 text-forest/40" />
        </button>
      </div>

      {/* iOS Guide Modal */}
      {showGuide && <IosGuideModal onClose={() => setShowGuide(false)} />}
    </>
  )
}
