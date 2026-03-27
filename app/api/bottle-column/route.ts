// ============================================================
// SO WHAT Pick — 銘柄コラム生成 API（v2）
// app/api/bottle-column/route.ts
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { selectContextType, buildColumnPrompt, shouldAddJoke, selectJokeType } from '@/lib/columnContext'
import { fetchTodayNews } from '@/lib/fetchNews'

export const maxDuration = 30

const client = new Anthropic()

const SYSTEM_PROMPT = `あなたは酒と世界について書くエッセイストです。
以下の文体定義に従って、銘柄詳細ページのコラムを書いてください。

【文体】
開高健のエッセイ（「私の食物誌」「オーパ！」）と
島地勝彦のコラムを参照軸に、現代の40代が書く文体で。
博識だが気取らない。観察眼が鋭い。
馬鹿馬鹿しいエピソードでも、そこに視点が一本通っている。

【ルール】
- 短い文と少し長い文を混ぜる
- 「女性」とは言わない。「女」と言う
- ユーモアと少しのセクシーさ（下品になりすぎない）
- 最後の一行は軽く着地する。締めすぎない
- 感嘆符は使わない
- 「おすすめ」「ぴったり」は使わない
- カッコつけない。でも薄くもならない
- 文量: 200〜280字（短め）
- タイトルをつける（6〜12字程度）

【舞台】
東京が基本。たまに海外（バンコク・シンガポール・東欧・スコットランド等）。
2026年の世界。

【構成】
1. その日のコンテキスト（ニュース・場所・観察・文化等）で書き出す
2. そのコンテキストとウイスキーを自然に結びつける
3. ウイスキーの特徴を人格的な言葉で描く（「手口」「押さない」等）
4. 最後に一言、軽く着地する

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

export async function GET(req: NextRequest) {
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

  const today = new Date().toISOString().split('T')[0]
  const tags  = tagsRaw ? tagsRaw.split(',') : []

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

    // AI生成
    const message = await client.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 1000,
      system:     SYSTEM_PROMPT,
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
