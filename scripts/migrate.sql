-- SO WHAT Pick — DBマイグレーション
-- Vercel Postgresのクエリエディタで実行してください

CREATE TABLE IF NOT EXISTS bottle_details (
  slug            TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  generated_at    TIMESTAMP DEFAULT NOW(),
  tasting_nose    TEXT,
  tasting_palate  TEXT,
  tasting_finish  TEXT,
  distillery_bg   TEXT,
  how_to_drink    TEXT,
  pairing         TEXT,
  amazon_keyword  TEXT,
  rakuten_keyword TEXT,
  tags            TEXT[],
  image_url       TEXT
);

-- すでにテーブルが存在する場合のカラム追加
ALTER TABLE bottle_details ADD COLUMN IF NOT EXISTS image_url TEXT;

CREATE TABLE IF NOT EXISTS bottle_columns (
  id           SERIAL PRIMARY KEY,
  slug         TEXT NOT NULL,
  date         DATE NOT NULL,
  column_text  TEXT NOT NULL,
  created_at   TIMESTAMP DEFAULT NOW(),
  title        TEXT,
  UNIQUE(slug, date)
);

-- すでにテーブルが存在する場合のカラム追加
ALTER TABLE bottle_columns ADD COLUMN IF NOT EXISTS title TEXT;

CREATE TABLE IF NOT EXISTS daily_featured (
  date        DATE PRIMARY KEY,
  slug        TEXT REFERENCES bottle_details(slug),
  ai_comment  TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);
