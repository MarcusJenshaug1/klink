/**
 * Resolves player name placeholders in card text.
 *
 * {spiller}           → random player per occurrence (distinct, no repeats per card)
 * {spiller1}, {spiller2}, {spiller3}, … → distinct random players, one per unique number
 *
 * Falls back to generic names if no players available.
 */

export type TextSegment   = { type: 'text';   text: string }
export type PlayerSegment = { type: 'player'; name: string }
export type Segment = TextSegment | PlayerSegment

export function shuffled<T>(arr: T[]): T[] {
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

/**
 * Same as interpolate() but returns typed segments so the caller can render
 * player names differently (e.g. as highlighted badge spans).
 */
export function interpolateToSegments(template: string, players: string[], playerPool?: string[]): Segment[] {
  const MARK = (name: string) => `\x00player:${name}\x00`

  let result: string
  if (players.length === 0) {
    result = template
      .replace(/\{spiller(\d+)\}/g, (_, i) => MARK(`Person ${i}`))
      .replace(/\{spiller\}/g, () => MARK('Du'))
  } else {
    const pool = playerPool ?? shuffled(players)
    let tmp = template

    // {spiller1}, {spiller2}, …
    const uniqueNumbers = new Set<number>()
    const nr = /\{spiller(\d+)\}/g
    let m: RegExpExecArray | null
    while ((m = nr.exec(tmp)) !== null) uniqueNumbers.add(parseInt(m[1]))
    if (uniqueNumbers.size > 0) {
      const map: Record<number, string> = {}
      ;[...uniqueNumbers].sort((a, b) => a - b).forEach((n, i) => { map[n] = pool[i % pool.length] })
      tmp = tmp.replace(/\{spiller(\d+)\}/g, (_, num) => MARK(map[parseInt(num)]))
    }

    // {spiller}
    let idx = 0
    tmp = tmp.replace(/\{spiller\}/g, () => MARK(pool[idx++ % pool.length]))
    result = tmp
  }

  // Split on NUL markers → typed segments
  const parts = result.split(/\x00player:(.*?)\x00/)
  const segments: Segment[] = []
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) { if (parts[i]) segments.push({ type: 'text',   text: parts[i] }) }
    else             {               segments.push({ type: 'player', name: parts[i] }) }
  }
  return segments
}
