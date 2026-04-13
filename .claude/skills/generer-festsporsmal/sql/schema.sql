-- ============================================================
-- Klink: festsporsmal table
-- Migrasjon: kjøres som del av supabase db push
-- Idempotent: bruker IF NOT EXISTS og CREATE OR REPLACE
-- ============================================================

-- Trigram-støtte for semantisk likhetssøk
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================
-- Normaliseringsfunksjon
-- Brukes for canonical_text og duplikatsjekk
-- ============================================================
CREATE OR REPLACE FUNCTION normalize_question(input TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
STRICT
AS $$
BEGIN
  -- 1. Lowercase
  -- 2. Trim whitespace
  -- 3. Kollaps doble mellomrom
  -- 4. Fjern avsluttende tegnsetting
  RETURN regexp_replace(
    trim(regexp_replace(lower(input), '\s+', ' ', 'g')),
    '[?.!,;]+$',
    ''
  );
END;
$$;

-- ============================================================
-- Enums
-- ============================================================

DO $$ BEGIN
  CREATE TYPE festsporsmal_mode AS ENUM (
    'rolig',
    'blandet',
    'drøy',
    'student',
    'generic'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE festsporsmal_status AS ENUM (
    'draft',
    'approved',
    'published',
    'rejected'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE festsporsmal_source_style AS ENUM (
    'generic',
    'student',
    'drøy',
    'rimete',
    'mixed'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE festsporsmal_category AS ENUM (
    'fest_og_alkohol',
    'flort_og_dating',
    'personlighet_og_vane',
    'status_og_stil',
    'vennskap_og_gruppe',
    'fremtidsantakelser',
    'lett_drøy_humor',
    'handlingskort',
    'skaal'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- Tabell
-- ============================================================

CREATE TABLE IF NOT EXISTS festsporsmal (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Innhold
  question_text    TEXT NOT NULL,
  canonical_text   TEXT NOT NULL
                     GENERATED ALWAYS AS (normalize_question(question_text)) STORED,

  -- Klassifisering
  mode             festsporsmal_mode NOT NULL DEFAULT 'blandet',
  category         festsporsmal_category NOT NULL,
  spice_level      SMALLINT NOT NULL DEFAULT 2
                     CHECK (spice_level BETWEEN 1 AND 5),
  is_action        BOOLEAN NOT NULL DEFAULT false,
  is_cheers        BOOLEAN NOT NULL DEFAULT false,

  -- Kilde og batch
  source_style     festsporsmal_source_style NOT NULL DEFAULT 'generic',
  generation_batch TEXT,

  -- Arbeidsflyt
  status           festsporsmal_status NOT NULL DEFAULT 'draft',
  approved_by      TEXT,

  -- Tidsstempler
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at      TIMESTAMPTZ,
  published_at     TIMESTAMPTZ
);

-- ============================================================
-- Indekser
-- ============================================================

-- Unik duplikatbeskyttelse på normalisert tekst
CREATE UNIQUE INDEX IF NOT EXISTS festsporsmal_canonical_text_uniq
  ON festsporsmal (canonical_text);

-- Trigram-indeks for semantisk søk
CREATE INDEX IF NOT EXISTS festsporsmal_question_trgm
  ON festsporsmal USING GIN (question_text gin_trgm_ops);

CREATE INDEX IF NOT EXISTS festsporsmal_canonical_trgm
  ON festsporsmal USING GIN (canonical_text gin_trgm_ops);

-- Filtreringsindekser
CREATE INDEX IF NOT EXISTS festsporsmal_status_idx
  ON festsporsmal (status);

CREATE INDEX IF NOT EXISTS festsporsmal_mode_idx
  ON festsporsmal (mode);

CREATE INDEX IF NOT EXISTS festsporsmal_batch_idx
  ON festsporsmal (generation_batch);

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE festsporsmal ENABLE ROW LEVEL SECURITY;

-- Alle kan lese publiserte spørsmål
CREATE POLICY "Alle kan lese publiserte festsporsmal"
  ON festsporsmal FOR SELECT
  USING (status = 'published');

-- Authenticated (admin) har full tilgang
CREATE POLICY "Admin full tilgang festsporsmal"
  ON festsporsmal FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- Hjelpefunksjon: finn semantiske duplikater
-- Returnerer rader med similarity > threshold
-- ============================================================
CREATE OR REPLACE FUNCTION find_similar_questions(
  input_text TEXT,
  threshold  FLOAT DEFAULT 0.6
)
RETURNS TABLE (
  id             UUID,
  question_text  TEXT,
  similarity     FLOAT
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    id,
    question_text,
    similarity(normalize_question(input_text), canonical_text) AS similarity
  FROM festsporsmal
  WHERE
    status != 'rejected'
    AND similarity(normalize_question(input_text), canonical_text) > threshold
  ORDER BY similarity DESC
  LIMIT 10;
$$;
