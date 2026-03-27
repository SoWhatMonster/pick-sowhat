// ============================================================
// SO WHAT Pick — Whisky & Shochu
// app/whisky/DailyPicks.tsx
// 今日のおすすめ10本（Server Component / ISR 24h）
// ============================================================

import { unstable_cache } from 'next/cache'
import Anthropic from '@anthropic-ai/sdk'
import { buildAmazonUrl, buildRakutenUrl } from '@/lib/affiliate'
import DailyPickImage from './DailyPickImage'

export type DailyPick = {
  rank: number
  name: string
  tags: string[]
  copy?: string
  amazonKeyword: string
  rakutenKeyword: string
  bottleSlug: string | null
}

type DailyPicksData = {
  date: string
  picks: DailyPick[]
}

// ── ボトル画像カタログ ──
const BOTTLE_CATALOG = [
  { slug: 'dewars',          name: 'デュワーズ' },
  { slug: 'dewars12',        name: 'デュワーズ 12年' },
  { slug: 'from-the-barrel', name: 'ニッカ フロム・ザ・バレル' },
  { slug: 'glenfiddich',     name: 'グレンフィディック' },
  { slug: 'glenfiddich12',   name: 'グレンフィディック 12年' },
  { slug: 'glenfiddich18',   name: 'グレンフィディック 18年' },
  { slug: 'macallan12',      name: 'マッカラン 12年' },
  { slug: 'macallan12dc',    name: 'マッカラン 12年 ダブルカスク' },
  { slug: 'macallan15dc',    name: 'マッカラン 15年 ダブルカスク' },
  { slug: 'macallan18dc',    name: 'マッカラン 18年 ダブルカスク' },
  { slug: 'macallanharmony', name: 'マッカラン ハーモニー' },
  { slug: 'macallannight',   name: 'マッカラン ナイト オン アース' },
  { slug: 'woodford-reserve', name: 'ウッドフォード リザーブ' },
  { slug: 'chita',           name: '知多' },
]

const BOTTLE_CATALOG_TEXT = BOTTLE_CATALOG
  .map(b => `  - ${b.name} → bottleSlug: "${b.slug}"`)
  .join('\n')

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
以下の制約を必ず守り、今日のおすすめ10本を選んでください。

【構成ルール（厳守）】
- スコッチ: 2本（うち1本は知名度の低いシングルモルト蒸留所から選ぶ）
- バーボン・アメリカン: 1本
- ジャパニーズウイスキー: 1本
- アイリッシュ: 1本
- 焼酎（芋・麦・米・黒糖からバランスよく）: 3本
- ワールドウイスキー（インド・台湾・スウェーデン等）: 1本
- 自由枠（上記以外で面白い1本）: 1本

【知名度の分散ルール（厳守）】
- 有名銘柄（グレンフィディック・マッカラン・山崎・白州）は10本中2本まで。それ以上は選ばない。
- 「知る人ぞ知る」「マニアックな」銘柄を積極的に選ぶこと
- 焼酎は大手メーカー以外の地方蔵を優先すること

【価格帯の分散ルール】
- 〜2,000円: 2本
- 2,001〜5,000円: 5本
- 5,001円〜: 3本

・同じ銘柄の違う年数は極力避けること

以下の銘柄はボトル画像があります。これらをレコメンドする場合は "bottleSlug" に該当スラッグを設定してください。それ以外は null にしてください:
${BOTTLE_CATALOG_TEXT}

必ずJSON形式のみで返してください。説明文は不要です。

{
  "date": "YYYY-MM-DD",
  "picks": [
    {
      "rank": 1,
      "name": "銘柄名（正式名称）",
      "tags": ["産地", "フレーバー特徴", "価格帯"],
      "copy": "1〜2文の短いコピー。断言口調。「おすすめ」「ぴったり」禁止。感嘆符禁止。ユーモアは描写に紛れ込ませる。例:「外れくじを引く確率が低い。世界で一番売れている理由がある。」",
      "amazonKeyword": "Amazon検索用キーワード",
      "rakutenKeyword": "楽天検索用キーワード",
      "bottleSlug": "スラッグ または null"
    }
  ]
}`

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2400,
    temperature: 1,
    system: systemPrompt,
    messages: [{ role: 'user', content: `今日の日付: ${date}\nこの日付をシードとして、前日と異なる構成にすること。\n今日（${date}）のおすすめウイスキー・焼酎10本を選んでください。` }],
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
    return null
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
                <DailyPickImage bottleSlug={pick.bottleSlug} name={pick.name} />
                <span className="dailyPickRank">{String(pick.rank).padStart(2, '0')}</span>
                <p className="dailyPickName">{pick.name}</p>
                <div className="dailyPickTags">
                  {pick.tags.map((tag) => (
                    <span key={tag} className="dailyPickTag">{tag}</span>
                  ))}
                </div>
                {pick.copy && <p className="dailyPickCopy">{pick.copy}</p>}
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
