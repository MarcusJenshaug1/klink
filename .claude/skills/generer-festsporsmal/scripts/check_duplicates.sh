#!/usr/bin/env bash
# ============================================================
# check_duplicates.sh
# Duplikatsjekk mot Klink sin kort-tabell i Supabase.
#
# Modi:
#   --fetch-existing-kort <pack_id>   Hent eksisterende kort for en pakke
#   --check-table                     Sjekk om kort-tabellen finnes
#   --check-batch <fil> [--existing <fil>] [--recheck]
#                                     Sjekk en batch mot eksisterende
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.env.local"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "FEIL: .env.local ikke funnet i $PROJECT_ROOT" >&2
  exit 1
fi

SUPABASE_URL=$(grep -E "^NEXT_PUBLIC_SUPABASE_URL=" "$ENV_FILE" | cut -d'=' -f2- | tr -d '"' | tr -d "'")
ANON_KEY=$(grep -E "^NEXT_PUBLIC_SUPABASE_ANON_KEY=" "$ENV_FILE" | cut -d'=' -f2- | tr -d '"' | tr -d "'")

if [[ -z "$SUPABASE_URL" || -z "$ANON_KEY" ]]; then
  echo "FEIL: SUPABASE_URL eller ANON_KEY mangler i .env.local" >&2
  exit 1
fi

REST_BASE="${SUPABASE_URL}/rest/v1"

# ── --check-table ────────────────────────────────────────────
if [[ "${1:-}" == "--check-table" ]]; then
  HTTP_STATUS=$(curl -so /dev/null -w "%{http_code}" \
    -H "apikey: $ANON_KEY" \
    -H "Authorization: Bearer $ANON_KEY" \
    "${REST_BASE}/kort?limit=1")

  if [[ "$HTTP_STATUS" == "200" || "$HTTP_STATUS" == "206" ]]; then
    echo "TABLE_EXISTS"
  else
    echo "TABLE_MISSING (HTTP $HTTP_STATUS)"
  fi
  exit 0
fi

# ── --fetch-existing-kort <pack_id> ─────────────────────────
if [[ "${1:-}" == "--fetch-existing-kort" ]]; then
  PACK_ID="${2:-}"
  if [[ -z "$PACK_ID" ]]; then
    echo "FEIL: --fetch-existing-kort krever en pack_id" >&2
    exit 1
  fi

  OUTPUT="/tmp/klink_existing_kort.json"
  echo "Henter eksisterende kort for pakke $PACK_ID ..." >&2

  RESULT=$(curl -sf \
    -H "apikey: $ANON_KEY" \
    -H "Authorization: Bearer $ANON_KEY" \
    -H "Accept: application/json" \
    -H "Range: 0-9999" \
    "${REST_BASE}/kort?select=id,type,tittel,innhold&spillpakke_id=eq.${PACK_ID}")

  if [[ -z "$RESULT" || "$RESULT" == "[]" ]]; then
    echo "[]" > "$OUTPUT"
    echo "INFO: Ingen eksisterende kort (pakken er tom)" >&2
  else
    echo "$RESULT" > "$OUTPUT"
    COUNT=$(echo "$RESULT" | py -c "import sys,json; print(len(json.load(sys.stdin)))" 2>/dev/null || echo "?")
    echo "Hentet $COUNT eksisterende kort → $OUTPUT" >&2
  fi

  echo "$OUTPUT"
  exit 0
fi

# ── --check-batch ────────────────────────────────────────────
if [[ "${1:-}" == "--check-batch" ]]; then
  BATCH_FILE=""
  EXISTING_FILE="/tmp/klink_existing_kort.json"
  RECHECK=false

  shift
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --existing) EXISTING_FILE="$2"; shift 2 ;;
      --recheck)  RECHECK=true; shift ;;
      *)          BATCH_FILE="$1"; shift ;;
    esac
  done

  if [[ -z "$BATCH_FILE" || ! -f "$BATCH_FILE" ]]; then
    echo "FEIL: --check-batch krever en gyldig JSON-fil" >&2
    exit 1
  fi

  if [[ ! -f "$EXISTING_FILE" ]]; then
    echo "[]" > "$EXISTING_FILE"
  fi

  py - "$BATCH_FILE" "$EXISTING_FILE" "$RECHECK" <<'PYEOF'
import sys, json, re

batch_file    = sys.argv[1]
existing_file = sys.argv[2]
recheck       = sys.argv[3].lower() == "true"

def normalize(text: str) -> str:
    t = text.lower().strip()
    t = re.sub(r'\s+', ' ', t)
    t = re.sub(r'[?.!,;]+$', '', t)
    return t

def trigrams(s: str) -> set:
    s = f"  {s}  "
    return set(s[i:i+3] for i in range(len(s) - 2))

def jaccard(a: str, b: str) -> float:
    ta, tb = trigrams(a), trigrams(b)
    if not ta and not tb: return 1.0
    if not ta or not tb:  return 0.0
    return len(ta & tb) / len(ta | tb)

SEMANTIC_THRESHOLD = 0.55

with open(batch_file,    encoding="utf-8") as f: batch    = json.load(f)
with open(existing_file, encoding="utf-8") as f: existing = json.load(f)

# Bygg eksisterende-indeks på normalisert innhold
ex_index = {}
for q in existing:
    norm = normalize(q.get("innhold", ""))
    ex_index[norm] = q.get("innhold", "")

ex_list = [(normalize(q.get("innhold", "")), q.get("innhold", "")) for q in existing]

results = []
batch_seen = {}  # intern dedup

for item in batch:
    innhold = item.get("innhold", "")
    norm    = normalize(innhold)

    # Nivå 1+2: eksakt/normalisert match mot DB
    if norm in ex_index:
        results.append({**item, "duplicate_status": "EKSAKT_DUPLIKAT",
                        "nearest_match": ex_index[norm], "similarity": 1.0, "include": False})
        continue

    # Intern batch-dedup
    if norm in batch_seen:
        results.append({**item, "duplicate_status": "INTERN_DUPLIKAT",
                        "nearest_match": batch_seen[norm], "similarity": 1.0, "include": False})
        continue

    # Nivå 3: semantisk
    best_sim, best_match = 0.0, ""
    for ex_norm, ex_orig in ex_list:
        sim = jaccard(norm, ex_norm)
        if sim > best_sim:
            best_sim, best_match = sim, ex_orig

    if best_sim >= SEMANTIC_THRESHOLD:
        results.append({**item, "duplicate_status": "NESTEN_DUPLIKAT",
                        "nearest_match": best_match, "similarity": round(best_sim, 3), "include": False})
        continue

    batch_seen[norm] = innhold
    results.append({**item, "duplicate_status": "OK",
                    "nearest_match": None, "similarity": round(best_sim, 3), "include": True})

ok       = [r for r in results if r["include"]]
rejected = [r for r in results if not r["include"]]

print(json.dumps({
    "ok": ok, "rejected": rejected,
    "stats": {"total": len(results), "ok": len(ok), "rejected": len(rejected), "recheck": recheck}
}, ensure_ascii=False, indent=2))
PYEOF

  exit 0
fi

echo "Bruk: $0 [--check-table | --fetch-existing-kort <id> | --check-batch <fil> [--existing <fil>] [--recheck]]" >&2
exit 1
