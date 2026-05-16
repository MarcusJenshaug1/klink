#!/usr/bin/env bash
# Henter alle kort med type='femfingre' (id, tittel, paastander, droyhet).
# Skriver JSON-array til stdout.
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

curl -sf \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Accept: application/json" \
  -H "Range: 0-9999" \
  "${SUPABASE_URL}/rest/v1/kort?select=id,tittel,paastander,droyhet&type=eq.femfingre" \
  || echo "[]"
