#!/usr/bin/env python3
"""
build_insert_migration.py
Bygger SQL INSERT-migrasjon for Fem fingre-kort i Klink.

Bruk:
  python3 build_insert_migration.py \
    --input /tmp/klink_femfingre_ok.json \
    --pack-id <uuid> \
    --batch-name femfingre_20260501_blandet \
    --output supabase/migrations/00030_kort_femfingre_blandet.sql
"""

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

VALID_DROYHET = {"mild", "normal", "droy"}


def sql_escape(s: str) -> str:
    return s.replace("'", "''")


def validate_item(item: dict, index: int) -> list:
    errors = []
    paa = item.get("paastander") or []
    if not isinstance(paa, list) or len(paa) != 5:
        errors.append(f"  #{index}: paastander må være array med 5 strenger (fant {len(paa)})")
    else:
        for j, p in enumerate(paa, 1):
            if not isinstance(p, str) or not p.strip():
                errors.append(f"  #{index}: paastand #{j} er tom")
            if isinstance(p, str) and len(p) > 200:
                errors.append(f"  #{index}: paastand #{j} for lang ({len(p)} tegn)")
    if not item.get("tittel", "").strip():
        errors.append(f"  #{index}: tittel mangler")
    droy = item.get("droyhet", "normal")
    if droy not in VALID_DROYHET:
        errors.append(f"  #{index}: ugyldig droyhet '{droy}'")
    return errors


def build_migration(items: list, pack_id: str, batch_name: str, output_path: Path) -> None:
    now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    header = f"""\
-- ============================================================
-- Klink: Fem fingre insert-migrasjon
-- Batch:    {batch_name}
-- Antall:   {len(items)}
-- Generert: {now_str}
-- ============================================================

BEGIN;

INSERT INTO kort (spillpakke_id, type, tittel, innhold, paastander, droyhet)
VALUES
"""

    rows = []
    for item in items:
        tittel = sql_escape(item.get("tittel", "").strip())
        droyhet = item.get("droyhet", "normal")
        paa = item["paastander"]
        paa_sql = ", ".join(f"'{sql_escape(p.strip())}'" for p in paa)
        rows.append(
            f"  ('{sql_escape(pack_id)}', 'femfingre', '{tittel}', '', "
            f"ARRAY[{paa_sql}]::TEXT[], '{droyhet}')"
        )

    sql = header + ",\n".join(rows) + "\nON CONFLICT DO NOTHING;\n\nCOMMIT;\n"

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(sql, encoding="utf-8")
    print(f"Migrasjon skrevet: {output_path}", file=sys.stderr)
    print(f"Antall rader:      {len(items)}", file=sys.stderr)
    print(str(output_path))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input",      required=True)
    parser.add_argument("--pack-id",    required=True)
    parser.add_argument("--batch-name", required=True)
    parser.add_argument("--output",     required=True)
    args = parser.parse_args()

    input_path = Path(args.input)
    if not input_path.exists():
        print(f"FEIL: inputfil ikke funnet: {input_path}", file=sys.stderr)
        sys.exit(1)

    with open(input_path, encoding="utf-8") as f:
        items = json.load(f)

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
        pack_id=args.pack_id,
        batch_name=args.batch_name,
        output_path=Path(args.output),
    )


if __name__ == "__main__":
    main()
