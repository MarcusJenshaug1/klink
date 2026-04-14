/**
 * Simple "ding-ding" når synlig timer er ute.
 * To korte high-pitch beeps via Web Audio — ingen audio-fil nødvendig.
 * Brukes KUN når timer_synlig=true. Skjulte timere skal spillerne gjette på.
 */
export async function playTimerDing() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    if (ctx.state === 'suspended') {
      try { await ctx.resume() } catch {}
    }
    const now = ctx.currentTime

    function beep(startAt: number, freq: number) {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, startAt)

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0, startAt)
      gain.gain.linearRampToValueAtTime(0.25, startAt + 0.02)
      gain.gain.linearRampToValueAtTime(0, startAt + 0.22)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(startAt)
      osc.stop(startAt + 0.25)
    }

    beep(now, 880)
    beep(now + 0.25, 1175)

    setTimeout(() => ctx.close().catch(() => {}), 1000)
  } catch {
    // silent
  }
}
