const fs = require('fs')
const path = require('path')

const files = [
  'supabase/migrations/00005_kort_snusboksen_droey_20260413.sql',
  'supabase/migrations/00009_kort_pekeleken_droey_godkjent.sql',
]

const innhold = []
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8')
  // Matches: ('<uuid>', '<type>', '<tittel>', '<innhold>')
  const re = /\(\s*'[^']+'\s*,\s*'(?:snusboks|pekelek)'\s*,\s*'[^']*'\s*,\s*'((?:[^']|'')*)'\s*\)/g
  let m
  while ((m = re.exec(s))) {
    innhold.push(m[1])
  }
}
console.log('Drøy cards matched:', innhold.length)

let sql = '-- Backfill new kort-felter for existing cards\n'
sql += '-- 1. Mark drøy cards (seeded via migrations 00005 + 00009)\n'
if (innhold.length) {
  sql += "UPDATE kort SET droyhet = 'droy' WHERE innhold IN (\n"
  sql += innhold.map((x) => "  '" + x.replace(/'/g, "''") + "'").join(',\n')
  sql += '\n);\n\n'
}
sql += '-- 2. Pekelek + Snusboks cards require 3+ players (peking requires group)\n'
sql += "UPDATE kort SET min_spillere = 3 WHERE type IN ('pekelek', 'snusboks') AND min_spillere < 3;\n\n"
sql += '-- 3. All cards are active (default), normal drøyhet (default), kjonn=alle (default), vekt=vanlig (default)\n'
sql += '-- These are already applied via column defaults; no update needed.\n'

const out = 'supabase/migrations/00023_backfill_kort_felter.sql'
fs.writeFileSync(out, sql)
console.log('Wrote', out)
