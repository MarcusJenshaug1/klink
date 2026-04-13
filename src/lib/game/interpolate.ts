/**
 * Resolves player name placeholders in card text.
 *
 * {spiller}           → random player per occurrence (distinct, no repeats per card)
 * {spiller1}, {spiller2}, {spiller3}, … → distinct random players, one per unique number
 *
 * Falls back to generic names if no players available.
 */

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function interpolate(template: string, players: string[]): string {
  if (players.length === 0) {
    return template
      .replace(/\{spiller\d+\}/g, (_, i) => `Person ${i ?? ''}`.trim())
      .replace(/\{spiller\}/g, 'Du')
  }

  let result = template
  const pool = shuffled(players)

  // Handle {spiller1}, {spiller2}, {spiller3}, …
  // Each unique number maps to one player from the shuffled pool
  const uniqueNumbers = new Set<number>()
  const numberedRegex = /\{spiller(\d+)\}/g
  let m: RegExpExecArray | null
  while ((m = numberedRegex.exec(result)) !== null) {
    uniqueNumbers.add(parseInt(m[1]))
  }

  if (uniqueNumbers.size > 0) {
    const sorted = [...uniqueNumbers].sort((a, b) => a - b)
    const map: Record<number, string> = {}
    sorted.forEach((n, i) => { map[n] = pool[i % pool.length] })
    result = result.replace(/\{spiller(\d+)\}/g, (_, num) => map[parseInt(num)])
  }

  // Handle {spiller} — each occurrence gets the next player in shuffled pool
  const count = (result.match(/\{spiller\}/g) || []).length
  if (count > 0) {
    let idx = 0
    result = result.replace(/\{spiller\}/g, () => pool[idx++ % pool.length])
  }

  return result
}
