'use client'

import { useEffect, useRef, useState } from 'react'

interface ScarePopProps {
  /** Trigger endres → animasjon + lyd spilles én gang */
  trigger: boolean
}

/**
 * Easter egg: dødninghode + spøkelseslyd når bruker aktiverer
 * Blackout + Drøy samtidig. Spilles kun én gang per aktivering.
 */
export function ScarePop({ trigger }: ScarePopProps) {
  const [visible, setVisible] = useState(false)
  const wasTriggered = useRef(false)

  useEffect(() => {
    if (!trigger) {
      wasTriggered.current = false
      return
    }
    if (wasTriggered.current) return
    wasTriggered.current = true
    setVisible(true)

    playGhostMoan()

    const t = setTimeout(() => setVisible(false), 1700)
    return () => clearTimeout(t)
  }, [trigger])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Dark vignette */}
      <div
        className="absolute inset-0 animate-vignette-fade"
        style={{
          background: 'radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.75) 80%)',
        }}
      />
      {/* Blood-red flash edges */}
      <div
        className="absolute inset-0 animate-vignette-fade"
        style={{
          boxShadow: 'inset 0 0 120px rgba(220,20,30,0.55)',
          animationDelay: '0.05s',
        }}
      />
      {/* Skull */}
      <div className="animate-skull-pop">
        <div
          className="animate-skull-shake text-[180px] sm:text-[260px] md:text-[320px] leading-none select-none"
          style={{
            filter: 'drop-shadow(0 0 40px rgba(255,255,255,0.55)) drop-shadow(0 0 80px rgba(220,20,30,0.6))',
          }}
        >
          💀
        </div>
      </div>
    </div>
  )
}

/** Web Audio: ghostly moan (wobble descending tone + tremolo) */
function playGhostMoan() {
  try {
    const Ctx = (window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)
    if (!Ctx) return
    const ctx = new Ctx()
    const now = ctx.currentTime

    // Master gain for envelope
    const master = ctx.createGain()
    master.gain.setValueAtTime(0, now)
    master.gain.linearRampToValueAtTime(0.35, now + 0.1)
    master.gain.linearRampToValueAtTime(0.25, now + 1.3)
    master.gain.linearRampToValueAtTime(0, now + 1.6)
    master.connect(ctx.destination)

    // Base oscillator — sawtooth with low-pass for muffled vibe
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(220, now)
    osc.frequency.exponentialRampToValueAtTime(80, now + 1.4)

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(800, now)
    filter.frequency.exponentialRampToValueAtTime(300, now + 1.5)
    filter.Q.value = 6

    osc.connect(filter)
    filter.connect(master)

    // Tremolo / wobble via LFO modulating gain
    const lfo = ctx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = 7
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 0.15
    lfo.connect(lfoGain)
    lfoGain.connect(master.gain)

    osc.start(now)
    lfo.start(now)
    osc.stop(now + 1.7)
    lfo.stop(now + 1.7)

    // Noise whisper layer
    const bufferSize = ctx.sampleRate * 1.6
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.3
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'bandpass'
    noiseFilter.frequency.value = 600
    noiseFilter.Q.value = 0.8
    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0, now)
    noiseGain.gain.linearRampToValueAtTime(0.18, now + 0.15)
    noiseGain.gain.linearRampToValueAtTime(0, now + 1.5)
    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(ctx.destination)
    noise.start(now)

    setTimeout(() => ctx.close().catch(() => {}), 2000)
  } catch {
    // Silent fallback — no sound, animation still plays
  }
}
