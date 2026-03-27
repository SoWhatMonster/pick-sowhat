// ============================================================
// SO WHAT Pick — 今日の1本 API
// app/api/daily-featured/route.ts
// ============================================================

import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { sql } from '@/lib/db'

const client = new Anthropic()

export type DailyFeaturedResult = {
  date: string
  slug: string
  name: string
  ai_comment: string
  tags: string[]
  amazon_keyword: string
  rakuten_keyword: string
}

// ── 今日の1本をAIで選出 ──
async function generateDailyFeatured(date: string): Promise<{
  name: string
  slug: string
  ai_comment: string
  tags: string[]
  amazon_keyword: string
  rakuten_keyword: string
}> {
  const d = new Date(date)
  const weekdays = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日']
  const weekday = weekdays[d.getDay()]
  const month = d.getMonth() + 1
  const seasons: Record<number, string> = {
    1: '冬', 2: '冬', 3: '春', 4: '春', 5: '春',
    6: '初夏', 7: '夏', 8: '夏', 9: '秋', 10: '秋',
    11: '秋', 12: '冬',
  }
  const season = seasons[month] ?? '冬'

  const systemPrompt = `あなたはウイスキーと焼酎の専門家であり、言葉で酒を描く作家でもあります。
今日（${date}・${weekday}・${season}）の「今日の1本」を選んでください。

選出条件:
- 季節・曜日にゆるく関連した銘柄
- マニアックすぎず、かつ定番すぎない
- 「なぜ今日この1本なのか」のAIコメントを必ず付ける

コメントの文体（厳守）:
- ドライ・ウィット
- 断言口調
- 季節・曜日・その日の空気感とウイスキーをこじつける
- 1〜2文
- 感嘆符は使わない
- 例: 「月曜日。長い一週間の始まりに、これくらい落ち着いた甘さが必要だと思う。」
- 例: 「金曜の夜は、スモーキーじゃなくていい。むしろ、優しい方が続く。」

必ずJSON形式のみで返してください:
{
  "name": "銘柄名（正式名称・日本語）",
  "slug": "slugified-name（半角英数字・ハイフン区切り。例: glenfiddich-12, kurokirishima-imo）",
  "ai_comment": "なぜ今日この1本なのか（1〜2文）",
  "tags": ["産地またはカテゴリ", "フレーバー特徴", "価格帯"],
  "amazon_keyword": "Amazon検索用キーワード（銘柄名＋容量等）",
  "rakuten_keyword": "楽天検索用キーワード"
}`

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    temperature: 1,
    system: systemPrompt,
    messages: [{ role: 'user', content: `今日の日付: ${date}（${weekday}・${season}）\n今日の1本を選んでください。` }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('レスポンス形式が不正です')
  return JSON.parse(jsonMatch[0])
}

// ── bottle_detailsにslugが存在しなければ詳細も生成 ──
async function ensureBottleDetail(slug: string, name: string) {
  const existing = await sql`SELECT slug FROM bottle_details WHERE slug = ${slug}`
  if (existing.rows.length > 0) return

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
  if (!jsonMatch) return
  const detail = JSON.parse(jsonMatch[0])

  await sql`
    INSERT INTO bottle_details (slug, name, tasting_nose, tasting_palate, tasting_finish,
      distillery_bg, how_to_drink, pairing, amazon_keyword, rakuten_keyword, tags)
    VALUES (
      ${slug}, ${detail.name ?? name},
      ${detail.tasting_nose}, ${detail.tasting_palate}, ${detail.tasting_finish},
      ${detail.distillery_bg}, ${detail.how_to_drink}, ${detail.pairing},
      ${detail.amazon_keyword}, ${detail.rakuten_keyword},
      ${detail.tags}
    )
    ON CONFLICT (slug) DO NOTHING
  `
}

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0]

    // 今日分がすでにあればそれを返す
    const existing = await sql`
      SELECT df.date, df.slug, df.ai_comment, bd.name, bd.tags, bd.amazon_keyword, bd.rakuten_keyword
      FROM daily_featured df
      JOIN bottle_details bd ON df.slug = bd.slug
      WHERE df.date = ${today}
    `
    if (existing.rows.length > 0) {
      return NextResponse.json(existing.rows[0] as DailyFeaturedResult)
    }

    // AIで今日の1本を選出
    const featured = await generateDailyFeatured(today)

    // bottle_detailsに詳細がなければ生成・保存
    await ensureBottleDetail(featured.slug, featured.name)

    // daily_featuredに保存
    await sql`
      INSERT INTO daily_featured (date, slug, ai_comment)
      VALUES (${today}, ${featured.slug}, ${featured.ai_comment})
      ON CONFLICT (date) DO NOTHING
    `

    return NextResponse.json({
      date: today,
      slug: featured.slug,
      name: featured.name,
      ai_comment: featured.ai_comment,
      tags: featured.tags,
      amazon_keyword: featured.amazon_keyword,
      rakuten_keyword: featured.rakuten_keyword,
    } as DailyFeaturedResult)
  } catch (err) {
    console.error('[daily-featured]', err)
    return NextResponse.json({ error: '今日の1本の取得に失敗しました' }, { status: 500 })
  }
}
