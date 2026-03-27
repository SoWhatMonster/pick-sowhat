// ============================================================
// SO WHAT Pick — DB接続ユーティリティ（Vercel Postgres）
// ============================================================

import { sql } from '@vercel/postgres'

export { sql }

// bottle_details + daily_featured テーブルの初期化
// Vercelダッシュボードでも実行できるが、コード管理のためここに記載
export const MIGRATION_SQL = `
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
  tags            TEXT[]
);

CREATE TABLE IF NOT EXISTS daily_featured (
  date        DATE PRIMARY KEY,
  slug        TEXT REFERENCES bottle_details(slug),
  ai_comment  TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);
`
