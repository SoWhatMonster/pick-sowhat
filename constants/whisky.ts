// ============================================================
// SO WHAT Pick — Whisky & Shochu
// constants/whisky.ts
// ステップの選択肢定数
// ============================================================

/** レコメンド件数 */
export const RESULT_COUNT = 3

/** STEP 1A: シーン選択 */
export const SCENES: { icon: string; label: string }[] = [
  { icon: '🌙', label: 'ひとりで静かに' },
  { icon: '🔥', label: '誰かと語りたい' },
  { icon: '🍽', label: '食事と合わせたい' },
  { icon: '☀️', label: '昼からゆっくりと' },
  { icon: '😤', label: '仕事終わり、気分転換' },
  { icon: '🌊', label: '自然の中で飲みたい' },
]

/** STEP 1B: 関係性 */
export const GIFT_RELATIONS: string[] = [
  '上司・先輩', '父・母', '友人・同僚', '恋人・パートナー', '自分へのご褒美',
]

/** STEP 1B: 年代 */
export const GIFT_AGES: string[] = ['20代', '30代', '40代', '50代〜']

/** STEP 1B: 相手の経験値 */
export const GIFT_EXPERIENCES: string[] = [
  'ほぼ飲まない', 'たまに飲む', '好きだと思う', 'かなり詳しい',
]

/** STEP 2: フレーバースライダー */
export const FLAVORS: string[] = ['甘い', 'スモーキー', 'フルーティ', '穀物・ドライ']

/** STEP 2: 酒種 */
export const SPIRITS: string[] = ['ウイスキー', '焼酎', 'どちらでも']

/** STEP 2: 酒種デフォルト */
export const DEFAULT_SPIRIT = 'ウイスキー'

/** STEP 3: 予算 */
export const BUDGETS: string[] = ['〜2,000円', '〜5,000円', '〜10,000円', '10,000円以上', 'こだわらない']

/** STEP 3: 予算デフォルト */
export const DEFAULT_BUDGET = '〜5,000円'

/** STEP 3: 経験値（自分用のみ表示） */
export const EXPERIENCES: string[] = [
  '初めてに近い', 'たまに飲む', '結構好き', '詳しい',
]

/** STEP 3: 経験値デフォルト */
export const DEFAULT_EXPERIENCE = 'たまに飲む'

/** バッジラベル */
export const RANK_BADGES: string[] = ['BEST MATCH', 'ALSO GREAT', 'WILD CARD']

/** フレーバースライダーのデフォルト値（0〜10） */
export const DEFAULT_FLAVOR_VALUES: Record<string, number> = {
  甘い: 5, スモーキー: 3, フルーティ: 6, '穀物・ドライ': 4,
}

// ── ウイスキー詳細 ──────────────────────────────────────────

/** STEP 2: ウイスキー産地・地域（マルチセレクト） */
export const WHISKY_REGIONS: string[] = [
  'アイラ', 'ハイランド', 'スペイサイド', 'ローランド',
  'アイランズ', 'キャンベルタウン', 'ジャパニーズ', 'アイリッシュ',
  'バーボン（アメリカ）', 'テネシー', 'ニューワールド',
]

/** STEP 2: ウイスキースタイル（マルチセレクト） */
export const WHISKY_STYLES: string[] = [
  'シングルモルト', 'ブレンデッドモルト', 'ブレンデッドスコッチ', 'バーボン', 'ライ',
]

/** STEP 2: 熟成樽（マルチセレクト） */
export const WHISKY_CASKS: string[] = [
  'バーボン樽', 'シェリー樽', 'ミズナラ樽', 'ポートワイン樽',
]

/** STEP 2: 熟成年数（シングルセレクト） */
export const WHISKY_AGES: string[] = [
  'NAS（ノンエイジ）', '〜12年', '12〜18年', '18年以上', 'お任せ',
]

/** STEP 2: 熟成年数デフォルト */
export const DEFAULT_WHISKY_AGE = 'お任せ'

// ── 焼酎詳細 ────────────────────────────────────────────────

/** STEP 2: 焼酎産地（マルチセレクト） */
export const SHOCHU_REGIONS: string[] = [
  '鹿児島', '宮崎', '大分', '熊本（球磨）', '長崎（壱岐）', '沖縄（泡盛）', 'その他',
]

/** STEP 2: 焼酎原料（マルチセレクト） */
export const SHOCHU_INGREDIENTS: string[] = [
  '芋', '麦', '米', '黒糖', '蕎麦', 'その他',
]

/** STEP 2: 熟成スタイル（シングルセレクト） */
export const SHOCHU_AGING: string[] = ['通常', '長期熟成', '古酒', 'お任せ']

/** STEP 2: 熟成スタイルデフォルト */
export const DEFAULT_SHOCHU_AGING = 'お任せ'
