// ============================================================
// SO WHAT Pick — 銘柄詳細取得ロジック（API・ページ共通）
// lib/getBottleDetail.ts
// ============================================================

import Anthropic from '@anthropic-ai/sdk'
import { unstable_cache } from 'next/cache'
import { fetchAmazonProductImage } from './amazonPA'

const client = new Anthropic()

export type BottleDetail = {
  slug:            string
  name:            string
  generated_at?:   string
  tasting_nose:    string
  tasting_palate:  string
  tasting_finish:  string
  distillery_bg:   string
  how_to_drink:    string
  pairing:         string
  amazon_keyword:  string
  rakuten_keyword: string
  tags:            string[]
  image_url?:      string | null
}

// ── DBキャッシュ確認 ──
async function tryDbRead(slug: string): Promise<BottleDetail | null> {
  if (!process.env.POSTGRES_URL) return null
  try {
    const { sql } = await import('./db')
    const result = await sql<BottleDetail>`SELECT * FROM bottle_details WHERE slug = ${slug}`
    return result.rows[0] ?? null
  } catch {
    return null
  }
}

// ── DB書き込み ──
async function tryDbWrite(detail: BottleDetail): Promise<void> {
  if (!process.env.POSTGRES_URL) return
  try {
    const { sql } = await import('./db')
    await sql`
      INSERT INTO bottle_details (slug, name, tasting_nose, tasting_palate, tasting_finish,
        distillery_bg, how_to_drink, pairing, amazon_keyword, rakuten_keyword, tags, image_url)
      VALUES (
        ${detail.slug}, ${detail.name},
        ${detail.tasting_nose}, ${detail.tasting_palate}, ${detail.tasting_finish},
        ${detail.distillery_bg}, ${detail.how_to_drink}, ${detail.pairing},
        ${detail.amazon_keyword}, ${detail.rakuten_keyword},
        ${detail.tags as unknown as string},
        ${detail.image_url ?? null}
      )
      ON CONFLICT (slug) DO UPDATE SET
        name             = EXCLUDED.name,
        tasting_nose     = EXCLUDED.tasting_nose,
        tasting_palate   = EXCLUDED.tasting_palate,
        tasting_finish   = EXCLUDED.tasting_finish,
        distillery_bg    = EXCLUDED.distillery_bg,
        how_to_drink     = EXCLUDED.how_to_drink,
        pairing          = EXCLUDED.pairing,
        amazon_keyword   = EXCLUDED.amazon_keyword,
        rakuten_keyword  = EXCLUDED.rakuten_keyword,
        tags             = EXCLUDED.tags,
        image_url        = EXCLUDED.image_url,
        generated_at     = NOW()
    `
  } catch (e) {
    console.warn('[getBottleDetail] DB書き込み失敗（スキップ）:', e)
  }
}

// ── AI生成（unstable_cacheでサーバーキャッシュ24h） ──
const generateDetailCached = unstable_cache(
  async (slug: string, name: string): Promise<BottleDetail> => {
    const systemPrompt = `あなたはウイスキー・焼酎の専門家であり、言葉で酒を描く作家でもあります。
指定された銘柄について、詳細なコンテンツを生成してください。

文体ルール:
- 断言口調。短い文で切る。
- テイスティングノートは専門用語を使いつつ、情景や記憶に触れる
- 「おすすめ」「ぴったり」は使わない
- ユーモアは描写に紛れ込ませる
- 感嘆符は使わない

必ずJSON形式のみで返してください:
{
  "name": "銘柄名は必ず日本語カタカナ表記で。例: グレンフィディック 12年、グレンモーレンジィ オリジナル 10年、ラフロイグ 10年",
  "tags": ["産地またはカテゴリ（スコッチ/バーボン/ジャパニーズ等）", "フレーバー特徴", "価格帯"],
  "tasting_nose": "香りの描写（2〜3文）",
  "tasting_palate": "味わいの描写（2〜3文）",
  "tasting_finish": "余韻の描写（1〜2文）",
  "distillery_bg": "産地・蒸留所の背景（3〜4文。歴史・地理・製法の個性）",
  "how_to_drink": "飲み方提案（2〜3文。ストレート・ロック・ハイボール等）",
  "pairing": "ペアリング提案（料理・シーン、2〜3文）",
  "amazon_keyword": "Amazon検索用キーワード（銘柄名＋容量等）",
  "rakuten_keyword": "楽天検索用キーワード"
}`

    const message = await client.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 1200,
      system:     systemPrompt,
      messages:   [{ role: 'user', content: `銘柄: ${name}\n上記の銘柄について詳細コンテンツを生成してください。` }],
    })

    const text      = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('レスポンス形式が不正です')
    const parsed = JSON.parse(jsonMatch[0])

    // Amazon PA-API で商品画像取得（失敗しても続行）
    const imageUrl = await fetchAmazonProductImage(parsed.amazon_keyword ?? name).catch(() => null)

    return {
      slug,
      name:            parsed.name            ?? name,
      tasting_nose:    parsed.tasting_nose     ?? '',
      tasting_palate:  parsed.tasting_palate   ?? '',
      tasting_finish:  parsed.tasting_finish   ?? '',
      distillery_bg:   parsed.distillery_bg    ?? '',
      how_to_drink:    parsed.how_to_drink     ?? '',
      pairing:         parsed.pairing          ?? '',
      amazon_keyword:  parsed.amazon_keyword   ?? name,
      rakuten_keyword: parsed.rakuten_keyword  ?? name,
      tags:            parsed.tags             ?? [],
      image_url:       imageUrl,
    }
  },
  ['bottle-detail-v1'],
  { revalidate: 86400 } // 24時間キャッシュ
)

/**
 * 銘柄詳細を取得する。
 * 優先順位: DB → Next.jsサーバーキャッシュ → AI生成
 * Postgres未設定でもNext.jsキャッシュで高速化される。
 */
export async function getBottleDetail(
  slug: string,
  nameHint?: string,
): Promise<BottleDetail | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) return null

  // 1. DBキャッシュ（最速）
  const cached = await tryDbRead(slug)
  if (cached) return cached

  // 2. AI生成（Next.jsサーバーキャッシュ24h付き）
  try {
    const detail = await generateDetailCached(slug, nameHint ?? slug)
    // 3. DBへも保存（次回以降さらに高速化）
    await tryDbWrite(detail)
    return detail
  } catch (e) {
    console.error('[getBottleDetail] 生成失敗:', e)
    return null
  }
}
