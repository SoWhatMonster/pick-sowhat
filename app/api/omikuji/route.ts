// ============================================================
// SO WHAT Pick — Whisky & Shochu
// app/api/omikuji/route.ts
// おみくじワンタップ診断 API
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export type OmikujiResult = {
  name: string
  tags: string[]
  comment: string
  amazonKeyword: string
  rakutenKeyword: string
}

const SYSTEM_PROMPT = `あなたはウイスキーと焼酎の専門家です。
今日のおみくじとして、ランダムに1本レコメンドしてください。
毎回異なる銘柄を返すようにしてください。

必ずJSON形式のみで返してください。説明文は不要です。

{
  "name": "銘柄名（正式名称）",
  "tags": ["産地", "フレーバー特徴", "価格帯"],
  "comment": "今日この1本を引いたあなたへの一言（1文・軽いトーンで）",
  "amazonKeyword": "Amazon検索用キーワード",
  "rakutenKeyword": "楽天検索用キーワード"
}`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { date, seed } = body as { date: string; seed?: string }

    if (!date) {
      return NextResponse.json({ error: '日付が必要です' }, { status: 400 })
    }

    const userPrompt = seed
      ? `今日（${date}）のおみくじとして、ウイスキーまたは焼酎を1本ランダムにレコメンドしてください。バリエーション: ${seed}`
      : `今日（${date}）のおみくじとして、ウイスキーまたは焼酎を1本ランダムにレコメンドしてください。`

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('レスポンスの形式が不正です')

    const result: OmikujiResult = JSON.parse(jsonMatch[0])
    return NextResponse.json(result)
  } catch (err) {
    console.error('[omikuji]', err)
    return NextResponse.json({ error: 'おみくじに失敗しました。もう一度お試しください。' }, { status: 500 })
  }
}
