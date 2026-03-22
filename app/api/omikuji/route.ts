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
  bottleSlug: string | null
  category: 'scotch' | 'bourbon' | 'japanese' | 'irish' | 'newworld' | 'imo' | 'mugi' | 'kome' | 'kokuto' | 'other'
}

// ── 決定論的ハッシュ（文字列 → 正の整数） ──
function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i) | 0
  }
  return Math.abs(h)
}

// ── 干支 ──
const ETO = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
function getEto(year: number): string {
  return ETO[((year - 4) % 12 + 12) % 12]
}

// ── 西洋星座 ──
function getSeiza(month: number, day: number): string {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return '牡羊座'
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return '牡牛座'
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return '双子座'
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return '蟹座'
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return '獅子座'
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return '乙女座'
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return '天秤座'
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return '蠍座'
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return '射手座'
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return '山羊座'
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return '水瓶座'
  return '魚座'
}

// ── フレーバープロファイル（生年月日ハッシュで決定） ──
const FLAVOR_PROFILES = [
  {
    label: 'スモーキー・ピーティ',
    instruction: 'スモーキーでピーティな銘柄を必ず選んでください。アイラ系スコッチ（ラフロイグ、アードベッグ、ボウモア、カリラなど）または芋焼酎（霧島、魔王、赤霧島など）の中から選んでください。',
  },
  {
    label: 'フルーティ・華やか',
    instruction: 'フルーティで華やかな銘柄を必ず選んでください。スペイサイドスコッチ（グレンフィディック、グレンリベット、バルヴェニーなど）またはジャパニーズウイスキー（山崎、余市など）の中から選んでください。',
  },
  {
    label: '甘口・リッチ',
    instruction: '甘くてリッチな銘柄を必ず選んでください。シェリー樽熟成スコッチ（マッカラン、グレンドロナック）またはバーボン（メーカーズマーク、バッファロートレースなど）の中から選んでください。',
  },
  {
    label: '軽快・ドライ',
    instruction: '軽快でドライな銘柄を必ず選んでください。アイリッシュウイスキー（ジェムソン、ブッシュミルズ）、ジャパニーズグレーン（知多）、または麦焼酎（いいちこ、二階堂）の中から選んでください。',
  },
  {
    label: 'スパイシー・力強い',
    instruction: 'スパイシーで力強い銘柄を必ず選んでください。アイランズ・ハイランド系スコッチ（タリスカー、ハイランドパーク）またはライウイスキー、ニューワールド（カバラン、アムルット）の中から選んでください。',
  },
  {
    label: 'まろやか・バランス型',
    instruction: 'まろやかでバランスのとれた銘柄を必ず選んでください。ジャパニーズブレンデッド（白州、ニッカ フロム・ザ・バレル、デュワーズ）または米焼酎（球磨焼酎、繊月）の中から選んでください。',
  },
  {
    label: '個性派・ユニーク',
    instruction: '個性的でユニークな銘柄を必ず選んでください。ニューワールドウイスキー（台湾カバラン、インドアムルット、欧州）、泡盛（久米仙、残波）、またはそば焼酎（雲海）の中から選んでください。',
  },
  {
    label: '上品・プレミアム',
    instruction: '上品でプレミアムな銘柄を必ず選んでください。高年数シングルモルト（マッカラン15年以上、山崎12年以上、響）の中から選んでください。価格帯は高め（10,000円以上）でも構いません。',
  },
] as const

// ── 画像あり銘柄カタログ ──
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

const SYSTEM_PROMPT = `あなたはウイスキーと焼酎の専門家です。
依頼に従って今日のおみくじとして1本レコメンドしてください。

必ずJSON形式のみで返してください。説明文は不要です。

以下の銘柄はボトル画像があります。これらをレコメンドする場合は "bottleSlug" フィールドにスラッグを設定してください。それ以外は null にしてください:
${BOTTLE_CATALOG_TEXT}

categoryは以下から1つ選んでください:
  scotch / bourbon / japanese / irish / newworld / imo / mugi / kome / kokuto / other

JSONフォーマット:
{
  "name": "銘柄名（正式名称）",
  "tags": ["産地またはカテゴリ", "フレーバー特徴", "価格帯"],
  "comment": "今日この1本を引いたあなたへの一言（1〜2文、占い的なトーンで）",
  "amazonKeyword": "Amazon検索用キーワード",
  "rakutenKeyword": "楽天検索用キーワード",
  "bottleSlug": "スラッグ または null",
  "category": "カテゴリ"
}`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { date, seed, birthdate } = body as { date: string; seed?: string; birthdate?: string }

    if (!date) {
      return NextResponse.json({ error: '日付が必要です' }, { status: 400 })
    }

    let flavorInstruction = '好みの1本をランダムに選んでください。'
    let fortuneContext = ''

    if (birthdate) {
      // 1. 生年月日ハッシュ → フレーバープロファイルを決定（同じ誕生日は常に同じプロファイル）
      const profileIndex = hashString(birthdate) % FLAVOR_PROFILES.length
      const profile = FLAVOR_PROFILES[profileIndex]
      flavorInstruction = profile.instruction

      // 2. 干支・星座をコメント用に算出
      const d = new Date(birthdate)
      const year = d.getFullYear()
      const month = d.getMonth() + 1
      const day = d.getDate()
      const eto = getEto(year)
      const seiza = getSeiza(month, day)
      fortuneContext = `\n依頼者: ${birthdate}生まれ（${eto}年・${seiza}）。commentには干支か星座を自然に絡めてください。`
    }

    // 3. 日付を加味して当日のバリエーションを作る
    const dailyVariant = seed
      ? ` 今回のバリエーション番号: ${seed}`
      : ` 今日の日付: ${date}`

    const userPrompt = `${flavorInstruction}${fortuneContext}${dailyVariant}`

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      temperature: 1,
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
