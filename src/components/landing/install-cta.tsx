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

/** Step 3 (eldre iOS): confirm dialog — "Legg til" button highlighted */
function IllustrationConfirmLegacy() {
  return (
    <svg viewBox="0 0 220 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[220px]">
      {/* Nav bar background */}
      <rect width="220" height="64" rx="14" fill="#F9F9F9"/>
      <line x1="0" y1="63" x2="220" y2="63" stroke="#D1D1D6" strokeWidth="1"/>
      {/* Klink app icon */}
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

/** Step 3 (iOS 26+): new confirm dialog with "Åpne som nettapp" toggle */
function IllustrationConfirmIOS26() {
  return (
    <svg viewBox="0 0 220 108" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[220px]">
      {/* Background */}
      <rect width="220" height="108" rx="14" fill="#F9F9F9"/>

      {/* Header bar */}
      <line x1="0" y1="44" x2="220" y2="44" stroke="#D1D1D6" strokeWidth="0.6"/>
      {/* X button */}
      <circle cx="24" cy="22" r="11" fill="#E5E5EA"/>
      <path d="M20 18 L28 26 M28 18 L20 26" stroke="#636366" strokeWidth="1.8" strokeLinecap="round"/>
      {/* "Hjem-skjerm" title */}
      <text x="110" y="26" textAnchor="middle" fontSize="11" fill="#000" fontFamily="system-ui" fontWeight="600">Hjem-skjerm</text>
      {/* "Legg til" button — highlighted */}
      <rect x="156" y="11" width="52" height="22" rx="7" fill="#007AFF" fillOpacity="0.13"/>
      <text x="182" y="26" textAnchor="middle" fontSize="12" fill="#007AFF" fontFamily="system-ui" fontWeight="600">Legg til</text>

      {/* App icon + name row */}
      <rect x="14" y="52" width="28" height="28" rx="7" fill="#A8E63D"/>
      <text x="28" y="71" textAnchor="middle" fontSize="12" fill="#1A3A1A" fontFamily="Georgia, serif" fontWeight="700">K</text>
      <text x="50" y="63" fontSize="10.5" fill="#000" fontFamily="system-ui" fontWeight="600">Klink</text>
      <text x="50" y="75" fontSize="8.5" fill="#8E8E93" fontFamily="system-ui">klinkn.no</text>

      {/* Separator */}
      <line x1="14" y1="87" x2="206" y2="87" stroke="#D1D1D6" strokeWidth="0.6"/>

      {/* "Åpne som nettapp" row — highlighted */}
      <rect x="10" y="91" width="200" height="14" rx="4" fill="#34C759" fillOpacity="0.10"/>
      <text x="16" y="101" fontSize="9.5" fill="#000" fontFamily="system-ui" fontWeight="500">Åpne som nettapp</text>
      {/* Toggle (on = green) */}
      <rect x="172" y="92" width="32" height="18" rx="9" fill="#34C759"/>
      <circle cx="195" cy="101" r="7" fill="white"/>
    </svg>
  )
}

// ─── Step data ─────────────────────────────────────────────────────────────────

const STEP_1 = {
  number: 1,
  title: 'Trykk Del-knappen',
  description: 'Finn firkant-ikonet med pil opp nederst i Safari.',
  illustration: <IllustrationShare />,
}

const STEP_2 = {
  number: 2,
  title: 'Velg «Legg til på Hjem-skjerm»',
  description: 'Scroll i menyen og trykk på +-ikonet.',
  illustration: <IllustrationAddToHome />,
}

const IOS26_STEPS = [
  STEP_1,
  STEP_2,
  {
    number: 3,
    title: 'Trykk «Legg til»',
    description: 'Pass på at «Åpne som nettapp» er slått på, og trykk «Legg til».',
    illustration: <IllustrationConfirmIOS26 />,
  },
]

const IOS_LEGACY_STEPS = [
  STEP_1,
  STEP_2,
  {
    number: 3,
    title: 'Trykk «Legg til»',
    description: 'Bekreft i dialogboksen. Klink dukker opp på hjemskjermen!',
    illustration: <IllustrationConfirmLegacy />,
  },
]

// ─── iOS version detection ─────────────────────────────────────────────────────

function getIosVersion(): number | null {
  if (typeof navigator === 'undefined') return null
  const match = navigator.userAgent.match(/OS (\d+)_/)
  return match ? parseInt(match[1], 10) : null
}

// ─── iOS Guide Modal ──────────────────────────────────────────────────────────

function IosGuideModal({ onClose }: { onClose: () => void }) {
  const [isIOS26, setIsIOS26] = useState<boolean>(() => {
    const ver = getIosVersion()
    return ver === null ? true : ver >= 26
  })

  const steps = isIOS26 ? IOS26_STEPS : IOS_LEGACY_STEPS

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="relative w-full max-w-lg rounded-t-3xl bg-white pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-black/10 rounded-full mx-auto mt-3 mb-5" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 mb-4">
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

        {/* iOS version toggle */}
        <div className="mx-6 mb-5 flex gap-0.5 bg-black/6 rounded-xl p-1">
          <button
            onClick={() => setIsIOS26(true)}
            className={`flex-1 text-xs font-black py-1.5 rounded-lg transition-all ${isIOS26 ? 'bg-white text-forest shadow-sm' : 'text-forest/45 hover:text-forest/70'}`}
          >
            iOS 26+
          </button>
          <button
            onClick={() => setIsIOS26(false)}
            className={`flex-1 text-xs font-black py-1.5 rounded-lg transition-all ${!isIOS26 ? 'bg-white text-forest shadow-sm' : 'text-forest/45 hover:text-forest/70'}`}
          >
            Eldre iOS
          </button>
        </div>

        {/* Steps */}
        <div className="px-6 flex flex-col gap-5">
          {steps.map((step) => (
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

        {/* Footer note */}
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
