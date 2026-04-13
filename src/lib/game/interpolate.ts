/**
 * Resolves player name placeholders in card text.
 * {spiller}  → random player (multiple occurrences = distinct players, no repeats per card)
 * {spiller1}, {spiller2} → two distinct random players
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
      .replace(/\{spiller1\}/g, 'Person 1')
      .replace(/\{spiller2\}/g, 'Person 2')
      .replace(/\{spiller\}/g, 'Du')
  }

  let result = template

  // {spiller1} og {spiller2} — alltid distinkte
  if (result.includes('{spiller1}') || result.includes('{spiller2}')) {
    const pool = shuffled(players)
    const p1 = pool[0]
    const p2 = pool.length > 1 ? pool[1] : pool[0]
    result = result.replace(/\{spiller1\}/g, p1)
    result = result.replace(/\{spiller2\}/g, p2)
  }

  // {spiller} — flere forekomster = distinkte spillere (ingen gjenbruk per kort)
  const count = (result.match(/\{spiller\}/g) || []).length
  if (count > 0) {
    const pool = shuffled(players)
    let idx = 0
    result = result.replace(/\{spiller\}/g, () => pool[idx++ % pool.length])
  }

  return result
}
