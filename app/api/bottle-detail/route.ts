// ============================================================
// SO WHAT Pick — 銘柄詳細 API
// app/api/bottle-detail/route.ts
// DB（Vercel Postgres）はオプション。未設定でもAI生成で動作する。
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export type BottleDetail = {
  slug: string
  name: string
  generated_at?: string
  tasting_nose: string
  tasting_palate: string
  tasting_finish: string
  distillery_bg: string
  how_to_drink: string
  pairing: string
  amazon_keyword: string
  rakuten_keyword: string
  tags: string[]
}

// ── DBキャッシュ確認（Postgres任意） ──
async function tryDbRead(slug: string): Promise<BottleDetail | null> {
  if (!process.env.POSTGRES_URL) return null
  try {
    const { sql } = await import('@/lib/db')
    const result = await sql<BottleDetail>`SELECT * FROM bottle_details WHERE slug = ${slug}`
    return result.rows[0] ?? null
  } catch {
    return null
  }
}

// ── DB書き込み（Postgres任意） ──
async function tryDbWrite(slug: string, detail: BottleDetail): Promise<void> {
  if (!process.env.POSTGRES_URL) return
  try {
    const { sql } = await import('@/lib/db')
    await sql`
      INSERT INTO bottle_details (slug, name, tasting_nose, tasting_palate, tasting_finish,
        distillery_bg, how_to_drink, pairing, amazon_keyword, rakuten_keyword, tags)
      VALUES (
        ${slug}, ${detail.name},
        ${detail.tasting_nose}, ${detail.tasting_palate}, ${detail.tasting_finish},
        ${detail.distillery_bg}, ${detail.how_to_drink}, ${detail.pairing},
        ${detail.amazon_keyword}, ${detail.rakuten_keyword},
        ${detail.tags as unknown as string}
      )
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        tasting_nose = EXCLUDED.tasting_nose,
        tasting_palate = EXCLUDED.tasting_palate,
        tasting_finish = EXCLUDED.tasting_finish,
        distillery_bg = EXCLUDED.distillery_bg,
        how_to_drink = EXCLUDED.how_to_drink,
        pairing = EXCLUDED.pairing,
        amazon_keyword = EXCLUDED.amazon_keyword,
        rakuten_keyword = EXCLUDED.rakuten_keyword,
        tags = EXCLUDED.tags,
        generated_at = NOW()
    `
  } catch (e) {
    console.warn('[bottle-detail] DB書き込み失敗（スキップ）:', e)
  }
}

// ── AI生成 ──
async function generateDetail(slug: string, nameHint?: string): Promise<BottleDetail> {
  const name = nameHint ?? slug

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
  "name": "正式な銘柄名",
  "tags": ["産地", "フレーバー特徴", "価格帯", "レベル"],
  "tasting_nose": "香りの描写（2〜3文）",
  "tasting_palate": "味わいの描写（2〜3文）",
  "tasting_finish": "余韻の描写（1〜2文）",
  "distillery_bg": "産地・蒸留所の背景（3〜4文。歴史・地理・製法の個性）",
  "how_to_drink": "飲み方提案（2〜3文。ストレート・ロック・ハイボール等）",
  "pairing": "ペアリング提案（料理・シーン、2〜3文）",
  "amazon_keyword": "Amazon検索用キーワード",
  "rakuten_keyword": "楽天検索用キーワード"
}`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1200,
    system: systemPrompt,
    messages: [{ role: 'user', content: `銘柄: ${name}\n上記の銘柄について詳細コンテンツを生成してください。` }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('レスポンス形式が不正です')
  const parsed = JSON.parse(jsonMatch[0])

  return {
    slug,
    name: parsed.name ?? name,
    tasting_nose: parsed.tasting_nose,
    tasting_palate: parsed.tasting_palate,
    tasting_finish: parsed.tasting_finish,
    distillery_bg: parsed.distillery_bg,
    how_to_drink: parsed.how_to_drink,
    pairing: parsed.pairing,
    amazon_keyword: parsed.amazon_keyword,
    rakuten_keyword: parsed.rakuten_keyword,
    tags: parsed.tags ?? [],
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  const name = searchParams.get('name') ?? undefined

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'slugが不正です' }, { status: 400 })
  }

  try {
    // DBキャッシュ確認
    const cached = await tryDbRead(slug)
    if (cached) return NextResponse.json(cached)

    // AI生成
    const detail = await generateDetail(slug, name)

    // DB保存（失敗してもレスポンスは返す）
    await tryDbWrite(slug, detail)

    return NextResponse.json(detail)
  } catch (err) {
    console.error('[bottle-detail]', err)
    return NextResponse.json({ error: '銘柄詳細の取得に失敗しました' }, { status: 500 })
  }
}
