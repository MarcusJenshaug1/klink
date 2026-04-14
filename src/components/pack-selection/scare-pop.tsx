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

    // Fire-and-forget
    playGhostMoan().catch(() => {})

    const t = setTimeout(() => setVisible(false), 1900)
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

/**
 * Web Audio: "WhoooOOOoooo" — classic ghost moan.
 * Triangle + sine chorus m/ vibrato + "aaa"-formant filter + echo-tail.
 */
async function playGhostMoan() {
  try {
    const Ctx = (window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)
    if (!Ctx) return
    const ctx = new Ctx()
    if (ctx.state === 'suspended') {
      try { await ctx.resume() } catch {}
    }
    const now = ctx.currentTime
    const DUR = 1.8

    // --- Echo/delay bus (spooky tail) ---
    const delay = ctx.createDelay(1.0)
    delay.delayTime.value = 0.32
    const feedback = ctx.createGain()
    feedback.gain.value = 0.45
    const wet = ctx.createGain()
    wet.gain.value = 0.5
    delay.connect(feedback)
    feedback.connect(delay)
    delay.connect(wet)
    wet.connect(ctx.destination)

    // --- Master with slow swell ---
    const master = ctx.createGain()
    master.gain.setValueAtTime(0, now)
    master.gain.linearRampToValueAtTime(0.35, now + 0.35)
    master.gain.setValueAtTime(0.35, now + 1.1)
    master.gain.linearRampToValueAtTime(0, now + DUR)
    master.connect(ctx.destination)
    master.connect(delay)

    // --- "Ooo"-formant: lowpass m/ resonans rundt 700Hz (simulerer vokal) ---
    const formant = ctx.createBiquadFilter()
    formant.type = 'lowpass'
    formant.frequency.setValueAtTime(900, now)
    formant.frequency.linearRampToValueAtTime(600, now + DUR)
    formant.Q.value = 8
    formant.connect(master)

    // --- Pitch-kontur: klassisk "wOOOOOoo" — opp, topp, ned ---
    const baseFreq = (t: number, base: number) => {
      // Bueformet: start lav, topp midt, ender lav
      const rise = Math.sin((Math.PI * t) / DUR)
      return base + rise * base * 0.35
    }

    // --- LFO for vibrato (subtile pitch-wobble) ---
    const vibrato = ctx.createOscillator()
    vibrato.type = 'sine'
    vibrato.frequency.value = 5.5
    const vibratoGain = ctx.createGain()
    vibratoGain.gain.value = 4 // ±4Hz
    vibrato.connect(vibratoGain)

    // --- 3 detuned oscillators = chorus/ghost layering ---
    const voices: { freq: number; type: OscillatorType; detune: number }[] = [
      { freq: 185, type: 'triangle', detune: 0 },
      { freq: 185, type: 'sine', detune: -14 },
      { freq: 185, type: 'sine', detune: +12 },
    ]

    for (const v of voices) {
      const osc = ctx.createOscillator()
      osc.type = v.type
      osc.detune.value = v.detune
      // Sample pitch-kontur for et par punkter
      const steps = 20
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * DUR
        osc.frequency.setValueAtTime(baseFreq(t, v.freq), now + t)
      }
      vibratoGain.connect(osc.frequency)
      osc.connect(formant)
      osc.start(now)
      osc.stop(now + DUR + 0.05)
    }
    vibrato.start(now)
    vibrato.stop(now + DUR + 0.05)

    // --- Bandpass-hviskende noise layer (lav i miksen) ---
    const bufferSize = ctx.sampleRate * DUR
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1)
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'bandpass'
    noiseFilter.frequency.value = 700
    noiseFilter.Q.value = 1.2
    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0, now)
    noiseGain.gain.linearRampToValueAtTime(0.06, now + 0.4)
    noiseGain.gain.linearRampToValueAtTime(0, now + DUR)
    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(master)
    noiseGain.connect(delay)
    noise.start(now)
    noise.stop(now + DUR)

    setTimeout(() => ctx.close().catch(() => {}), (DUR + 1.5) * 1000)
  } catch (err) {
    console.warn('[scare-pop] Audio failed:', err)
  }
}
