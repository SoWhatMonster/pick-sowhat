// ============================================================
// SO WHAT Pick — Whisky & Shochu
// app/api/search/route.ts
// 銘柄指定キーワード検索 API
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export type SearchResultItem = {
  name: string
  tags: string[]
  description: string
  amazonKeyword: string
  rakutenKeyword: string
}

export type SearchResponse = {
  query: string
  results: SearchResultItem[]
}

const SYSTEM_PROMPT = `あなたはウイスキーと焼酎の専門家です。
ユーザーが入力したキーワード（銘柄名・ブランド名・カテゴリなど）に関連するウイスキーまたは焼酎を最大5件返してください。

ルール:
- ウイスキーと焼酎のみ。日本酒・ビール・ワイン等は含めない
- キーワードが特定の銘柄名なら、その銘柄と関連・類似する銘柄も含める
- キーワードがカテゴリ（「アイラ」「芋焼酎」等）なら、代表的な銘柄を返す
- amazonKeyword と rakutenKeyword は「銘柄名＋容量」など具体的な商品名で返す
- descriptionは1〜2文で簡潔に

必ずJSON形式のみで返してください。説明文・コードブロック不要。

{
  "query": "入力されたキーワード",
  "results": [
    {
      "name": "銘柄名（正式名称）",
      "tags": ["産地", "フレーバー特徴", "価格帯"],
      "description": "この銘柄の特徴（1〜2文）",
      "amazonKeyword": "Amazon検索用キーワード（例: グレンフィディック 12年 700ml）",
      "rakutenKeyword": "楽天検索用キーワード（例: グレンフィディック 12年）"
    }
  ]
}`

export async function POST(req: NextRequest) {
  let query: string
  try {
    const body = await req.json()
    query = typeof body.query === 'string' ? body.query.trim().slice(0, 100) : ''
  } catch {
    return NextResponse.json({ error: 'リクエスト形式が正しくありません' }, { status: 400 })
  }

  if (!query) {
    return NextResponse.json({ error: 'キーワードを入力してください' }, { status: 400 })
  }

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1200,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `キーワード: ${query}` }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('レスポンス形式が不正です')

    const result: SearchResponse = JSON.parse(jsonMatch[0])
    return NextResponse.json(result)
  } catch (err) {
    console.error('[search]', err)
    return NextResponse.json(
      { error: '検索に失敗しました。しばらくしてからお試しください。' },
      { status: 500 }
    )
  }
}
