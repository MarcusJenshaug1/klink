#!/usr/bin/env bash
# ============================================================
# check_duplicates.sh
# Sjekker Fem fingre-kandidater mot eksisterende kort.
# Et kandidat-kort duplisereres hvis ≥3 av 5 påstander matcher
# (normalisert) et eksisterende kort.
#
# Bruk:
#   bash check_duplicates.sh \
#     --candidates /tmp/klink_femfingre_candidates.json \
#     --existing   /tmp/klink_femfingre_existing.json \
#     --output     /tmp/klink_femfingre_ok.json
# ============================================================
set -euo pipefail

CANDIDATES=""
EXISTING=""
OUTPUT=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --candidates) CANDIDATES="$2"; shift 2 ;;
    --existing)   EXISTING="$2";   shift 2 ;;
    --output)     OUTPUT="$2";     shift 2 ;;
    *) echo "Ukjent argument: $1" >&2; exit 1 ;;
  esac
done

if [[ -z "$CANDIDATES" || ! -f "$CANDIDATES" ]]; then
  echo "FEIL: --candidates kreves og må peke på gyldig fil" >&2
  exit 1
fi
if [[ -z "$OUTPUT" ]]; then
  echo "FEIL: --output kreves" >&2
  exit 1
fi
if [[ -z "$EXISTING" || ! -f "$EXISTING" ]]; then
  EXISTING="/dev/null"
fi

python3 - "$CANDIDATES" "$EXISTING" "$OUTPUT" <<'PYEOF'
import sys, json, re

cand_path, ex_path, out_path = sys.argv[1], sys.argv[2], sys.argv[3]

def normalize(s: str) -> str:
    s = s.lower().strip()
    s = re.sub(r'\s+', ' ', s)
    s = re.sub(r'[?.!,;]+$', '', s)
    return s

with open(cand_path, encoding="utf-8") as f:
    candidates = json.load(f)

existing = []
if ex_path != "/dev/null":
    try:
        with open(ex_path, encoding="utf-8") as f:
            existing = json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        existing = []

existing_norm = []
for e in existing:
    paa = e.get("paastander") or []
    existing_norm.append(set(normalize(p) for p in paa))

ok, rejected = [], []
batch_seen = []

def overlap_with(paas_norm, corpus_sets):
    for s in corpus_sets:
        if len(paas_norm & s) >= 3:
            return True
    return False

for item in candidates:
    paa = item.get("paastander") or []
    if len(paa) != 5 or any(not p.strip() for p in paa):
        rejected.append({**item, "reason": "ugyldig paastander-array"})
        continue

    paas_norm = set(normalize(p) for p in paa)

    if overlap_with(paas_norm, existing_norm):
        rejected.append({**item, "reason": "duplikat mot db"})
        continue
    if overlap_with(paas_norm, batch_seen):
        rejected.append({**item, "reason": "intern duplikat"})
        continue

    batch_seen.append(paas_norm)
    ok.append(item)

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(ok, f, ensure_ascii=False, indent=2)

print(json.dumps({
    "stats": {
        "total":    len(candidates),
        "ok":       len(ok),
        "rejected": len(rejected),
    },
    "rejected_samples": rejected[:5],
    "output": out_path,
}, ensure_ascii=False, indent=2))
PYEOF
