#!/usr/bin/env bash
# Henter UUID-en til "Fem fingre"-spillpakken via Supabase REST.
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

RESULT=$(curl -sf \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY" \
  "${SUPABASE_URL}/rest/v1/spillpakker?select=id,navn&navn=eq.Fem%20fingre" \
  || echo "[]")

PACK_ID=$(echo "$RESULT" | python3 -c "import sys,json
d=json.load(sys.stdin)
print(d[0]['id'] if d else '')" 2>/dev/null || echo "")

if [[ -z "$PACK_ID" ]]; then
  echo "PACK_MISSING"
  exit 0
fi

echo "FEM_FINGRE_PACK_ID=$PACK_ID"
