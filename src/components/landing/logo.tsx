'use client'

import { useEffect, useState } from 'react'

export function Logo({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={className}>
      <h1 className="font-display text-6xl sm:text-7xl font-black text-forest tracking-tight leading-none">
        {/* "Kl" + dotless-i with animated dot + "nk" */}
        Kl
        <span className="relative inline-block">
          {/* Dotless i — U+0131 */}
          {'\u0131'}
          {/* Animated dot */}
          <span
            className="absolute rounded-full bg-forest"
            style={{
              width: '0.135em',
              height: '0.135em',
              top: '0.08em',
              left: '50%',
              animation: mounted ? 'dot-drop 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.25s both' : 'none',
              opacity: mounted ? undefined : 0,
            }}
          />
        </span>
        nk
      </h1>
      <p className="text-forest/60 font-medium mt-1 text-lg">Drikkespillet</p>
    </div>
  )
}
