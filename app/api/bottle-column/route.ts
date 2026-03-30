// ============================================================
// SO WHAT Pick — 銘柄コラム生成 API（v2）
// app/api/bottle-column/route.ts
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { selectContextType, buildColumnPrompt, shouldAddJoke, selectJokeType } from '@/lib/columnContext'
import { fetchTodayNews } from '@/lib/fetchNews'
import { checkRateLimit } from '@/lib/rateLimit'

export const maxDuration = 30

const client = new Anthropic()

const SYSTEM_PROMPT = `あなたは孤独のグルメの主人公・井の頭五郎の語り口でウイスキー・焼酎のコラムを書きます。
食への純粋な集中と好奇心をそのまま酒に向ける。一人称の独り言。狙わない。

【ペルソナ】
- 一人でグラスに向き合う男の独白
- 純粋な集中。飽くなき好奇心。余計な比喩・色気・ナルシシズムは一切なし
- 「うん、悪くない」「まったく、〜というやつは」的な口調
- 予想以上だった時の素直な高揚: 「やられた。」「これは、くる。」「思っていたより、ずっといい。」

【ルール】
- 短文の積み重ね
- 感嘆符は使わない
- 「おすすめ」「ぴったり」は使わない
- 地名は出したい時だけ出す。毎回出す必要なし
- 文量: 200〜280字
- タイトルをつける（6〜12字）
- 締め（「乾杯。ではまた明日。」）はUIが追加するので、本文には含めない

【構成】
1. その日のコンテキスト（ニュース・場所・日常の観察・文化等）で書き出す
2. グラスに向かい、この酒と静かに対話する
3. 味・香り・余韻を五郎の言葉で描く（専門用語より感覚・独白）
4. 素直に着地する。締めすぎない

必ずJSON形式のみで返してください:
{
  "title": "コラムタイトル（6〜12字）",
  "column": "コラム本文（改行は\\nで表現。段落間は\\n\\n）"
}`

// ── DBキャッシュ確認 ──
async function tryDbRead(slug: string, date: string): Promise<{ title: string; column_text: string } | null> {
  if (!process.env.POSTGRES_URL) return null
  try {
    const { sql } = await import('@/lib/db')
    const result = await sql<{ title: string; column_text: string }>`
      SELECT title, column_text FROM bottle_columns
      WHERE slug = ${slug} AND date = ${date}
    `
    return result.rows[0] ?? null
  } catch {
    return null
  }
}

// ── DB書き込み ──
async function tryDbWrite(slug: string, date: string, title: string, columnText: string): Promise<void> {
  if (!process.env.POSTGRES_URL) return
  try {
    const { sql } = await import('@/lib/db')
    await sql`
      INSERT INTO bottle_columns (slug, date, title, column_text)
      VALUES (${slug}, ${date}, ${title}, ${columnText})
      ON CONFLICT (slug, date) DO NOTHING
    `
  } catch (e) {
    console.warn('[bottle-column] DB書き込み失敗（スキップ）:', e)
  }
}

// 1IPあたり 5回/分（コラム生成はコストが高いので厳しめ）
const LIMIT  = 5
const WINDOW = 60 * 1000

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const { allowed } = checkRateLimit(ip, LIMIT, WINDOW)
  if (!allowed) {
    return NextResponse.json({ error: 'リクエストが多すぎます' }, { status: 429 })
  }

  const { searchParams } = new URL(req.url)
  const slug    = searchParams.get('slug')
  const name    = searchParams.get('name')
  const tagsRaw = searchParams.get('tags') ?? ''

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'slugが不正です' }, { status: 400 })
  }
  if (!name) {
    return NextResponse.json({ error: 'nameが必要です' }, { status: 400 })
  }
  if (name.length > 200) {
    return NextResponse.json({ error: 'nameが長すぎます' }, { status: 400 })
  }

  const today = new Date().toISOString().split('T')[0]
  const tags  = tagsRaw
    ? tagsRaw.split(',').slice(0, 10).map((t) => t.slice(0, 50))
    : []

  try {
    // DBキャッシュ確認
    const cached = await tryDbRead(slug, today)
    if (cached) {
      return NextResponse.json({
        title:  cached.title,
        column: cached.column_text,
        date:   today,
      })
    }

    // コンテキスト選択（日付シードで固定）
    let contextType = selectContextType(today)

    // ニュース取得（newsタイプの場合のみ）
    let news: string[] = []
    if (contextType === 'news') {
      news = await fetchTodayNews()
      if (news.length === 0) contextType = 'place' // 取得失敗時はplaceに切り替え
    }

    // 日付情報
    const d        = new Date(today)
    const weekdays = ['日', '月', '火', '水', '木', '金', '土']
    const weekday  = weekdays[d.getDay()] + '曜日'
    const month    = d.getMonth() + 1
    const seasons: Record<number, string> = {
      1: '冬', 2: '冬', 3: '春', 4: '春', 5: '春',
      6: '初夏', 7: '夏', 8: '夏', 9: '秋', 10: '秋',
      11: '秋', 12: '冬',
    }
    const season = seasons[month] ?? '冬'

    // ジョーク判定
    const jokeType = shouldAddJoke(today) ? selectJokeType(today) : undefined

    // プロンプト生成
    const userPrompt = buildColumnPrompt({
      name, tags, date: today, weekday, season, contextType, news, jokeType,
    })

    // AI生成（システムプロンプトキャッシュ有効）
    const message = await client.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 1000,
      system:     [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      messages:   [{ role: 'user', content: userPrompt }],
    })

    const text      = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('レスポンス形式が不正です')
    const parsed = JSON.parse(jsonMatch[0])
    const { title, column } = parsed as { title: string; column: string }

    // DB保存
    await tryDbWrite(slug, today, title, column)

    return NextResponse.json({ title, column, date: today })
  } catch (err) {
    console.error('[bottle-column]', err)
    return NextResponse.json({ error: 'コラムの生成に失敗しました' }, { status: 500 })
  }
}
