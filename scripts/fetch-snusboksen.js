const fs = require('fs')
const path = require('path')

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local')
const env = fs.readFileSync(envPath, 'utf8')
for (const line of env.split('\n')) {
  const m = line.match(/^([A-Z_]+)\s*=\s*"?([^"\n]*)"?\s*$/)
  if (m) process.env[m[1]] = m[2]
}

const { createClient } = require('@supabase/supabase-js')
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
const supa = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })

;(async () => {
  const { data: pack } = await supa
    .from('spillpakker')
    .select('id, navn')
    .ilike('navn', 'snusboksen')
    .single()
  if (!pack) {
    console.error('Snusboksen pack not found')
    process.exit(1)
  }
  const { data: cards } = await supa
    .from('kort')
    .select('id, innhold, droyhet')
    .eq('spillpakke_id', pack.id)
    .order('innhold')
  fs.writeFileSync(
    path.join(__dirname, 'snusboksen-cards.json'),
    JSON.stringify(cards, null, 2),
  )
  console.log(`Fetched ${cards.length} cards → snusboksen-cards.json`)
})()
