// ============================================================
// SO WHAT Pick — Whisky & Shochu
// app/api/recommend/route.ts
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { getRecommendations, RecommendRequest } from '@/lib/anthropic'

// ── レート制限（IPベース、インメモリ） ─────────────────────────
// Vercel の無料プランはシングルインスタンス想定で十分機能する
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX = 10       // 1ウィンドウあたりの最大リクエスト数
const RATE_LIMIT_WINDOW = 60_000 // 60秒

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return true
  }
  if (entry.count >= RATE_LIMIT_MAX) return false
  entry.count++
  return true
}

// ── 許可値ホワイトリスト ────────────────────────────────────
const ALLOWED_MODES    = new Set(['self', 'gift'])
const ALLOWED_SPIRITS  = new Set(['ウイスキー', '焼酎', 'どちらでも'])
const ALLOWED_BUDGETS  = new Set(['〜2,000円', '〜5,000円', '〜10,000円', '10,000円以上', 'こだわらない'])
const ALLOWED_EXPERIENCES = new Set(['初めてに近い', 'たまに飲む', '結構好き', '詳しい'])
const ALLOWED_GIFT_EXPERIENCES = new Set(['ほぼ飲まない', 'たまに飲む', '好きだと思う', 'かなり詳しい'])
const ALLOWED_GIFT_AGES = new Set(['20代', '30代', '40代', '50代〜'])
const ALLOWED_SCENES = new Set([
  'ひとりで静かに', '誰かと語りたい', '食事と合わせたい',
  '昼からゆっくりと', '仕事終わり、気分転換', '自然の中で飲みたい', '飲み比べをしたい',
])
const ALLOWED_GIFT_RELATIONS = new Set([
  '上司・先輩', '父・母', '友人・同僚', '恋人・パートナー', 'クライアント・取引先', '自分へのご褒美',
])
const ALLOWED_WHISKY_REGIONS = new Set([
  'アイラ', 'ハイランド', 'スペイサイド', 'ローランド',
  'アイランズ', 'キャンベルタウン', 'ジャパニーズ', 'アイリッシュ',
  'バーボン（アメリカ）', 'テネシー', 'ニューワールド',
])
const ALLOWED_WHISKY_STYLES = new Set([
  'シングルモルト', 'ブレンデッドモルト', 'ブレンデッドスコッチ', 'バーボン', 'ライ',
])
const ALLOWED_WHISKY_CASKS = new Set([
  'バーボン樽', 'シェリー樽', 'ミズナラ樽', 'ポートワイン樽',
])
const ALLOWED_WHISKY_AGES = new Set([
  'NAS（ノンエイジ）', '〜12年', '12〜18年', '18年以上', 'お任せ',
])
const ALLOWED_SHOCHU_REGIONS = new Set([
  '鹿児島', '宮崎', '大分', '熊本（球磨）', '長崎（壱岐）', '沖縄（泡盛）', 'その他',
])
const ALLOWED_SHOCHU_INGREDIENTS = new Set(['芋', '麦', '米', '黒糖', '蕎麦', 'その他'])
const ALLOWED_SHOCHU_AGING = new Set(['通常', '長期熟成', '古酒', 'お任せ'])
const ALLOWED_FLAVORS = new Set(['甘い', 'スモーキー', 'フルーティ', '穀物・ドライ'])

// ── ヘルパー ─────────────────────────────────────────────────
function filterWhitelist(arr: unknown, allowed: Set<string>): string[] {
  if (!Array.isArray(arr)) return []
  return arr.filter((v): v is string => typeof v === 'string' && allowed.has(v)).slice(0, 15)
}

function validateFlavors(arr: unknown): { name: string; value: number }[] {
  if (!Array.isArray(arr)) return []
  return arr
    .filter((f): f is { name: string; value: number } =>
      typeof f === 'object' && f !== null &&
      typeof (f as Record<string, unknown>).name === 'string' &&
      ALLOWED_FLAVORS.has((f as Record<string, unknown>).name as string) &&
      typeof (f as Record<string, unknown>).value === 'number'
    )
    .map((f) => ({ name: f.name, value: Math.min(10, Math.max(0, Math.round(f.value))) }))
    .slice(0, 10)
}

// ── メインハンドラ ────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // レート制限
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'リクエストが多すぎます。しばらくしてからお試しください。' },
      { status: 429 }
    )
  }

  // リクエストボディサイズ制限（16KB）
  const contentLength = req.headers.get('content-length')
  if (contentLength && parseInt(contentLength, 10) > 16_384) {
    return NextResponse.json({ error: 'リクエストが大きすぎます' }, { status: 413 })
  }

  let raw: Record<string, unknown>
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ error: 'リクエスト形式が正しくありません' }, { status: 400 })
  }

  // ── 必須フィールドのバリデーション ──
  const mode = raw.mode
  if (!ALLOWED_MODES.has(mode as string)) {
    return NextResponse.json({ error: '必須パラメータが不足しています' }, { status: 400 })
  }

  const spirit = raw.spirit
  if (!ALLOWED_SPIRITS.has(spirit as string)) {
    return NextResponse.json({ error: '必須パラメータが不足しています' }, { status: 400 })
  }

  const budget = raw.budget
  if (!ALLOWED_BUDGETS.has(budget as string)) {
    return NextResponse.json({ error: '必須パラメータが不足しています' }, { status: 400 })
  }

  const flavors = validateFlavors(raw.flavors)
  if (flavors.length === 0) {
    return NextResponse.json({ error: '必須パラメータが不足しています' }, { status: 400 })
  }

  // ── ホワイトリストでフィルタリングした安全なリクエストを構築 ──
  const body: RecommendRequest = {
    mode: mode as 'self' | 'gift',
    flavors,
    spirit: spirit as RecommendRequest['spirit'],
    budget: budget as string,
    season: typeof raw.season === 'string' ? raw.season.slice(0, 10) : '冬',
    month: typeof raw.month === 'number' ? Math.min(12, Math.max(1, Math.round(raw.month))) : 1,

    // 自分用
    scenes: mode === 'self' ? filterWhitelist(raw.scenes, ALLOWED_SCENES) : undefined,
    experience: mode === 'self' && ALLOWED_EXPERIENCES.has(raw.experience as string)
      ? (raw.experience as string)
      : undefined,

    // ギフト用
    giftRelation: mode === 'gift' ? filterWhitelist(raw.giftRelation, ALLOWED_GIFT_RELATIONS) : undefined,
    giftAge: mode === 'gift' && ALLOWED_GIFT_AGES.has(raw.giftAge as string)
      ? (raw.giftAge as string)
      : undefined,
    giftExperience: mode === 'gift' && ALLOWED_GIFT_EXPERIENCES.has(raw.giftExperience as string)
      ? (raw.giftExperience as string)
      : undefined,
    giftNomikurabe: mode === 'gift' ? raw.giftNomikurabe === true : undefined,

    // ウイスキー詳細
    whiskyRegions: spirit === 'ウイスキー' ? filterWhitelist(raw.whiskyRegions, ALLOWED_WHISKY_REGIONS) : undefined,
    whiskyStyles:  spirit === 'ウイスキー' ? filterWhitelist(raw.whiskyStyles, ALLOWED_WHISKY_STYLES) : undefined,
    whiskyCasks:   spirit === 'ウイスキー' ? filterWhitelist(raw.whiskyCasks, ALLOWED_WHISKY_CASKS) : undefined,
    whiskyAge: spirit === 'ウイスキー' && ALLOWED_WHISKY_AGES.has(raw.whiskyAge as string)
      ? (raw.whiskyAge as string)
      : undefined,

    // 焼酎詳細
    shochuRegions:      spirit === '焼酎' ? filterWhitelist(raw.shochuRegions, ALLOWED_SHOCHU_REGIONS) : undefined,
    shochuIngredients:  spirit === '焼酎' ? filterWhitelist(raw.shochuIngredients, ALLOWED_SHOCHU_INGREDIENTS) : undefined,
    shochuAging: spirit === '焼酎' && ALLOWED_SHOCHU_AGING.has(raw.shochuAging as string)
      ? (raw.shochuAging as string)
      : undefined,
  }

  try {
    const result = await getRecommendations(body)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[recommend] Error:', err)
    if (err instanceof SyntaxError) {
      return NextResponse.json({ error: 'AIレスポンスのパースに失敗しました' }, { status: 500 })
    }
    return NextResponse.json(
      { error: 'レコメンドの取得に失敗しました。しばらくしてからお試しください。' },
      { status: 500 }
    )
  }
}
