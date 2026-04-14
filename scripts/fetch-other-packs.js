const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '..', '.env.local')
const env = fs.readFileSync(envPath, 'utf8')
for (const line of env.split('\n')) {
  const m = line.match(/^([A-Z_]+)\s*=\s*"?([^"\n]*)"?\s*$/)
  if (m) process.env[m[1]] = m[2]
}

const { createClient } = require('@supabase/supabase-js')
const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

;(async () => {
  const { data: packs } = await supa.from('spillpakker').select('id, navn').order('navn')
  const other = packs.filter((p) => !/snusboksen/i.test(p.navn))
  const result = []
  for (const p of other) {
    const { data: cards } = await supa
      .from('kort')
      .select('id, innhold, utfordring, type, droyhet')
      .eq('spillpakke_id', p.id)
      .order('innhold')
    result.push({ pack: p, cards })
  }
  fs.writeFileSync(path.join(__dirname, 'other-packs.json'), JSON.stringify(result, null, 2))
  console.log('Packs:', other.map((p) => p.navn).join(', '))
  console.log('Total cards:', result.reduce((s, r) => s + r.cards.length, 0))
})()
