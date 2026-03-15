// ============================================================
// SO WHAT Pick — Whisky & Shochu
// lib/anthropic.ts
// Anthropic API 呼び出しロジック
// ============================================================

export type RecommendRequest = {
  mode: 'self' | 'gift'
  // 自分用
  scenes?: string[]
  // ギフト用
  giftRelation?: string[]
  giftAge?: string
  giftExperience?: string
  // 共通
  flavors: { name: string; value: number }[]
  spirit: 'ウイスキー' | '焼酎' | 'どちらでも'
  budget: string
  experience: string
  season: string   // 例: '春' | '夏' | '秋' | '冬'
  month: number    // 例: 3
}

export type RecommendResult = {
  rank: string
  name: string
  tags: string[]
  description: string
  amazonKeyword: string
  rakutenKeyword: string
}

export type RecommendResponse = {
  reason: string
  results: RecommendResult[]
}

const SYSTEM_PROMPT = `あなたはウイスキーと焼酎の専門家です。
ユーザーの条件に合う銘柄を正確にレコメンドしてください。

必ずJSON形式のみで返答してください。前置きや説明文は不要です。
マークダウンのコードブロック（\`\`\`）も使わないでください。

以下のJSON構造で返してください:
{
  "reason": "選んだ理由（1〜2文）",
  "results": [
    {
      "rank": "BEST MATCH",
      "name": "銘柄名（正式名称）",
      "tags": ["産地", "フレーバー特徴", "価格帯"],
      "description": "説明文（2〜3文）",
      "amazonKeyword": "Amazon検索用キーワード（例: グレンフィディック 12年 700ml）",
      "rakutenKeyword": "楽天検索用キーワード"
    },
    { "rank": "ALSO GREAT" },
    { "rank": "WILD CARD" }
  ]
}`

/**
 * ユーザーの入力条件からAIプロンプトを構築する
 */
export function buildUserPrompt(req: RecommendRequest): string {
  const flavorText = req.flavors
    .map((f) => `${f.name}: ${f.value}/10`)
    .join('、')

  if (req.mode === 'self') {
    const sceneText = req.scenes?.join('、') ?? 'なし'
    return `【自分用】
現在の季節: ${req.season}（${req.month}月）
シーン: ${sceneText}
好みのフレーバー: ${flavorText}
酒の種類: ${req.spirit}
予算: ${req.budget}
経験値: ${req.experience}

上記の条件でウイスキーまたは焼酎を3銘柄レコメンドしてください。`
  }

  const relationText = req.giftRelation?.join('、') ?? 'なし'
  return `【ギフト用】
贈る相手の関係性: ${relationText}
相手の年代: ${req.giftAge ?? '不明'}
相手の経験値: ${req.giftExperience ?? '不明'}
好みのフレーバー: ${flavorText}
酒の種類: ${req.spirit}
予算: ${req.budget}
贈り主の経験値: ${req.experience}
現在の季節: ${req.season}（${req.month}月）

上記の条件でギフトに最適なウイスキーまたは焼酎を3銘柄レコメンドしてください。`
}

/**
 * Anthropic API を呼び出してレコメンド結果を取得する
 * ※ この関数はサーバーサイド（API Route）専用
 */
export async function getRecommendations(
  req: RecommendRequest
): Promise<RecommendResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set')
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildUserPrompt(req) }],
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Anthropic API error: ${response.status} ${error}`)
  }

  const data = await response.json()

  // レスポンスのパース
  const text = (data.content as { type: string; text: string }[])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')

  // コードブロックが含まれる場合も念のため除去
  const clean = text.replace(/```json|```/g, '').trim()

  const parsed: RecommendResponse = JSON.parse(clean)
  return parsed
}
