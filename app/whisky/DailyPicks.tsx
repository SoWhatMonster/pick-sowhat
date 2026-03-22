// ============================================================
// SO WHAT Pick — Whisky & Shochu
// app/whisky/DailyPicks.tsx
// 今日のおすすめ10本（Server Component / ISR 24h）
// ============================================================

import { unstable_cache } from 'next/cache'
import Anthropic from '@anthropic-ai/sdk'
import { buildAmazonUrl, buildRakutenUrl } from '@/lib/affiliate'

export type DailyPick = {
  rank: number
  name: string
  tags: string[]
  amazonKeyword: string
  rakutenKeyword: string
}

type DailyPicksData = {
  date: string
  picks: DailyPick[]
}

// ── 日本語日付フォーマット ──
function formatJapaneseDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const weekdays = ['日', '月', '火', '水', '木', '金', '土']
  return `${year}年${month}月${day}日（${weekdays[date.getDay()]}）`
}

// ── AI生成 ──
async function fetchDailyPicks(date: string): Promise<DailyPicksData> {
  const client = new Anthropic()

  const systemPrompt = `あなたはウイスキーと焼酎の専門家です。
今日のおすすめとして、ジャンルや価格帯がバランスよく混ざった10本をリストアップしてください。
・スコッチ・バーボン・ジャパニーズ・焼酎をバランスよく含めること
・初心者向けから上級者向けまで価格帯を分散させること
・同じ銘柄の違う年数は極力避けること

必ずJSON形式のみで返してください。説明文は不要です。

{
  "date": "YYYY-MM-DD",
  "picks": [
    {
      "rank": 1,
      "name": "銘柄名（正式名称）",
      "tags": ["産地", "フレーバー特徴", "価格帯"],
      "amazonKeyword": "Amazon検索用キーワード",
      "rakutenKeyword": "楽天検索用キーワード"
    }
  ]
}`

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1200,
    temperature: 1,
    system: systemPrompt,
    messages: [{ role: 'user', content: `今日（${date}）のおすすめウイスキー・焼酎10本を選んでください。` }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('レスポンス形式が不正です')

  return JSON.parse(jsonMatch[0]) as DailyPicksData
}

// ── 24時間キャッシュ ──
const getCachedDailyPicks = unstable_cache(
  (date: string) => fetchDailyPicks(date),
  ['daily-picks'],
  { revalidate: 86400 }
)

// ── Server Component ──
export default async function DailyPicks() {
  const amazonTag = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG ?? ''
  const rakutenAfId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID ?? ''

  const today = new Date().toISOString().split('T')[0]

  let data: DailyPicksData
  try {
    data = await getCachedDailyPicks(today)
  } catch {
    return null // エラー時はセクション自体を非表示
  }

  return (
    <section className="staticSection dailyPicksSection" aria-label="今日のおすすめ">
      <div className="staticInner">
        <div className="sectionHead">
          <h2 className="sectionTitle">今日のおすすめ</h2>
          <p className="sectionSub">Today&apos;s picks. Updated daily.</p>
        </div>
        <p className="dailyPicksDate">{formatJapaneseDate(data.date)}</p>

        <div className="dailyPicksScrollWrapper">
          <div className="dailyPicksGrid">
            {data.picks.map((pick) => (
              <div key={pick.rank} className="dailyPickCard">
                <span className="dailyPickRank">{String(pick.rank).padStart(2, '0')}</span>
                <p className="dailyPickName">{pick.name}</p>
                <div className="dailyPickTags">
                  {pick.tags.map((tag) => (
                    <span key={tag} className="dailyPickTag">{tag}</span>
                  ))}
                </div>
                <div className="dailyPickBtns">
                  <a
                    href={buildAmazonUrl(pick.amazonKeyword, amazonTag)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dailyPickAmazon"
                  >Amazon</a>
                  <a
                    href={buildRakutenUrl(pick.rakutenKeyword, rakutenAfId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dailyPickRakuten"
                  >楽天</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
