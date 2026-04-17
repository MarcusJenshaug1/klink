ALTER TABLE kort
  ADD COLUMN timer_auto_start BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN timer_forsinkelse INT DEFAULT NULL
    CHECK (timer_forsinkelse IS NULL OR (timer_forsinkelse >= 1 AND timer_forsinkelse <= 60));
