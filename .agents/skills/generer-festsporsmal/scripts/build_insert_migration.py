#!/usr/bin/env python3
"""
build_insert_migration.py
Bygger SQL INSERT-migrasjon for Klink sin kort-tabell.

Bruk:
  python3 build_insert_migration.py \
    --input /tmp/klink_approved.json \
    --batch-name snusboksen_droey_20260413 \
    --pack-name "Snusboksen" \
    --mode drøy \
    --next-migration-number 5 \
    --output supabase/migrations/00005_kort_snusboksen_droey_20260413.sql
"""

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

VALID_TYPES = {"utfordring", "alle_drikker", "pekelek", "regel", "kategori", "snusboks"}
VALID_MODES = {"rolig", "blandet", "drøy", "student", "generic"}


def sql_escape(s: str) -> str:
    return s.replace("'", "''")


def validate_item(item: dict, index: int) -> list:
    errors = []
    if not item.get("spillpakke_id", "").strip():
        errors.append(f"  #{index}: spillpakke_id mangler")
    if not item.get("innhold", "").strip():
        errors.append(f"  #{index}: innhold er tomt")
    if len(item.get("innhold", "")) > 500:
        errors.append(f"  #{index}: innhold for langt ({len(item['innhold'])} tegn)")
    if item.get("type", "") not in VALID_TYPES:
        errors.append(f"  #{index}: ugyldig type '{item.get('type')}'")
    return errors


def build_migration(items: list, batch_name: str, pack_name: str, mode: str, output_path: Path) -> None:
    now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    header = f"""\
-- ============================================================
-- Klink: kort insert-migrasjon
-- Pakke:    {pack_name}
-- Batch:    {batch_name}
-- Modus:    {mode}
-- Antall:   {len(items)}
-- Generert: {now_str}
-- ============================================================

BEGIN;

INSERT INTO kort (spillpakke_id, type, tittel, innhold)
VALUES
"""

    rows = []
    for item in items:
        pack_id = sql_escape(item["spillpakke_id"])
        typ     = sql_escape(item["type"])
        tittel  = sql_escape(item.get("tittel", ""))
        innhold = sql_escape(item["innhold"])
        rows.append(f"  ('{pack_id}', '{typ}', '{tittel}', '{innhold}')")

    sql = header + ",\n".join(rows) + "\nON CONFLICT DO NOTHING;\n\nCOMMIT;\n"

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(sql, encoding="utf-8")
    print(f"Migrasjon skrevet: {output_path}", file=sys.stderr)
    print(f"Antall rader:      {len(items)}", file=sys.stderr)
    print(str(output_path))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input",                  required=True)
    parser.add_argument("--batch-name",             required=True)
    parser.add_argument("--pack-name",              required=True)
    parser.add_argument("--mode",                   required=True, choices=list(VALID_MODES))
    parser.add_argument("--next-migration-number",  required=True, type=int)
    parser.add_argument("--output",                 required=True)
    args = parser.parse_args()

    input_path = Path(args.input)
    if not input_path.exists():
        print(f"FEIL: inputfil ikke funnet: {input_path}", file=sys.stderr)
        sys.exit(1)

    with open(input_path, encoding="utf-8") as f:
        data = json.load(f)

    items = data["ok"] if isinstance(data, dict) and "ok" in data else data
    items = [i for i in items if i.get("include", True)]

    if not items:
        print("ADVARSEL: Ingen kort å inserere.", file=sys.stderr)
        sys.exit(0)

    errors = []
    for idx, item in enumerate(items, 1):
        errors.extend(validate_item(item, idx))
    if errors:
        print("VALIDERINGSFEIL:", file=sys.stderr)
        for e in errors:
            print(e, file=sys.stderr)
        sys.exit(1)

    build_migration(
        items=items,
        batch_name=args.batch_name,
        pack_name=args.pack_name,
        mode=args.mode,
        output_path=Path(args.output),
    )


if __name__ == "__main__":
    main()
