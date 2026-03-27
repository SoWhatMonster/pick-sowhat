// ============================================================
// SO WHAT Pick — 銘柄コラム生成 API
// app/api/bottle-column/route.ts
// DB（Vercel Postgres）はオプション。未設定でもAI生成で動作する。
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

const SYSTEM_PROMPT = `あなたは酒と人生について書くエッセイストです。
開高健のエッセイ（「私の食物誌」「オーパ！」のタッチ）と
島地勝彦のコラムを参照軸にしてください。
ただし、彼らが現代に生きる40代だったら書くであろう文体で。

文体の定義:
- 博識だが気取らない
- 食・酒・旅・人間を同列に語る
- 読者に語りかけながら、ふと深いところに落とす
- 短い文と少し長い文を混ぜる
- 「女性」とは言わない。「女」と言う
- ユーモアと少しのセクシーさ（下品になりすぎない）
- 最後の一行で軽く着地する。締めすぎない
- 感嘆符は使わない
- 「おすすめ」「ぴったり」は使わない

構成:
1. 今日の日付・季節・曜日から書き出す（その日の空気感）
2. その空気感とウイスキーを自然に結びつける
3. ウイスキーの特徴を「手口」「存在感」など人格的な言葉で描く
4. 最後に一言、ユーモアか少しのセクシーさで締める

良い例:
「三月の終わりは、いつも中途半端だ。
冬に未練があるのか、春を待ちきれないのか、
自分でもよくわからないまま夜になる。

こういう夜に重い酒を選ぶと、たいてい後悔する。
グレンモーレンジィにしたのは、そういう理由だ。
バニラと花の香りは、最初から色気を見せない。
なのに気がつけば、もう一杯注いでいる。
そういう手口を持った酒が、世の中には確かにある。

昔、似たような女がいた気がする。
思い出せないのは、酒のせいにしておく。」

必ずJSON形式のみで返してください:
{
  "column": "コラム本文（改行は\\nで表現。段落間は\\n\\n）"
}`

// ── DBキャッシュ確認 ──
async function tryDbRead(slug: string, date: string): Promise<string | null> {
  if (!process.env.POSTGRES_URL) return null
  try {
    const { sql } = await import('@/lib/db')
    const result = await sql<{ column_text: string }>`
      SELECT column_text FROM bottle_columns
      WHERE slug = ${slug} AND date = ${date}
    `
    return result.rows[0]?.column_text ?? null
  } catch {
    return null
  }
}

// ── DB書き込み ──
async function tryDbWrite(slug: string, date: string, columnText: string): Promise<void> {
  if (!process.env.POSTGRES_URL) return
  try {
    const { sql } = await import('@/lib/db')
    await sql`
      INSERT INTO bottle_columns (slug, date, column_text)
      VALUES (${slug}, ${date}, ${columnText})
      ON CONFLICT (slug, date) DO NOTHING
    `
  } catch (e) {
    console.warn('[bottle-column] DB書き込み失敗（スキップ）:', e)
  }
}

// ── AI生成 ──
async function generateColumn(name: string, date: string, tags: string[]): Promise<string> {
  const d        = new Date(date)
  const weekdays = ['日', '月', '火', '水', '木', '金', '土']
  const weekday  = weekdays[d.getDay()] + '曜日'
  const month    = d.getMonth() + 1
  const seasons: Record<number, string> = {
    1: '冬', 2: '冬', 3: '春', 4: '春', 5: '春',
    6: '初夏', 7: '夏', 8: '夏', 9: '秋', 10: '秋',
    11: '秋', 12: '冬',
  }
  const season = seasons[month] ?? '冬'

  const message = await client.messages.create({
    model:      'claude-sonnet-4-6',
    max_tokens: 1000,
    system:     SYSTEM_PROMPT,
    messages: [{
      role:    'user',
      content: `銘柄: ${name}\n今日の日付: ${date}（${weekday}）\n季節: ${season}\nこの銘柄の特徴: ${tags.join('・')}\n\n上記の情報をもとに、今日のコラムを書いてください。\n昨日と同じ書き出しにならないよう、日付・季節・曜日の切り口を変えること。`,
    }],
  })

  const text      = message.content[0].type === 'text' ? message.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('レスポンス形式が不正です')
  const parsed = JSON.parse(jsonMatch[0])
  return parsed.column as string
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  const name = searchParams.get('name')
  const tagsRaw = searchParams.get('tags') ?? ''

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'slugが不正です' }, { status: 400 })
  }
  if (!name) {
    return NextResponse.json({ error: 'nameが必要です' }, { status: 400 })
  }

  const today = new Date().toISOString().split('T')[0]
  const tags  = tagsRaw ? tagsRaw.split(',') : []

  try {
    // DBキャッシュ確認
    const cached = await tryDbRead(slug, today)
    if (cached) return NextResponse.json({ column: cached, date: today })

    // AI生成
    const column = await generateColumn(name, today, tags)

    // DB保存（失敗してもレスポンスは返す）
    await tryDbWrite(slug, today, column)

    return NextResponse.json({ column, date: today })
  } catch (err) {
    console.error('[bottle-column]', err)
    return NextResponse.json({ error: 'コラムの生成に失敗しました' }, { status: 500 })
  }
}
