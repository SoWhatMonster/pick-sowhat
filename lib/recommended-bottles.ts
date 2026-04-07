// ============================================================
// SO WHAT Pick — 記事連動おすすめボトルデータ
// lib/recommended-bottles.ts
// ============================================================

export type RecommendedBottle = {
  name:           string
  category:       string   // scotch / bourbon / japanese / ...
  tags:           string[]
  amazonKeyword:  string
  rakutenKeyword: string
  bottleSlug?:    string   // /public/bottles/{slug}.{jpg|png} がある場合のみ設定
}

// ── ボトルデータ ─────────────────────────────────────────────
export const RECOMMENDED_BOTTLES: RecommendedBottle[] = [

  // ── スコッチ ──
  {
    name:           'グレンフィディック 12年',
    category:       'scotch',
    tags:           ['スコッチ', 'スペイサイド', 'フルーティ'],
    amazonKeyword:  'グレンフィディック 12年 700ml',
    rakutenKeyword: 'グレンフィディック 12年',
    bottleSlug:     'glenfiddich12',
  },
  {
    name:           'マッカラン 12年 シェリーオーク',
    category:       'scotch',
    tags:           ['スコッチ', 'ハイランド', 'シェリー'],
    amazonKeyword:  'マッカラン 12年 シェリーオーク 700ml',
    rakutenKeyword: 'マッカラン 12年 シェリーオーク',
    bottleSlug:     'macallan12',
  },
  {
    name:           'ラフロイグ 10年',
    category:       'scotch',
    tags:           ['スコッチ', 'アイラ', 'スモーキー'],
    amazonKeyword:  'ラフロイグ 10年 700ml',
    rakutenKeyword: 'ラフロイグ 10年',
  },
  {
    name:           'アードベッグ 10年',
    category:       'scotch',
    tags:           ['スコッチ', 'アイラ', 'ピーティー'],
    amazonKeyword:  'アードベッグ 10年 700ml',
    rakutenKeyword: 'アードベッグ 10年',
  },
  {
    name:           'グレンモーレンジィ オリジナル',
    category:       'scotch',
    tags:           ['スコッチ', 'ハイランド', 'フローラル'],
    amazonKeyword:  'グレンモーレンジィ オリジナル 700ml',
    rakutenKeyword: 'グレンモーレンジィ オリジナル',
  },
  {
    name:           'タリスカー 10年',
    category:       'scotch',
    tags:           ['スコッチ', 'アイランズ', 'スパイシー'],
    amazonKeyword:  'タリスカー 10年 700ml',
    rakutenKeyword: 'タリスカー 10年',
  },
  {
    name:           'グレンリベット 12年',
    category:       'scotch',
    tags:           ['スコッチ', 'スペイサイド', 'まろやか'],
    amazonKeyword:  'グレンリベット 12年 700ml',
    rakutenKeyword: 'グレンリベット 12年',
  },
  {
    name:           'デュワーズ 12年',
    category:       'scotch',
    tags:           ['スコッチ', 'ブレンデッド', '華やか'],
    amazonKeyword:  'デュワーズ 12年 700ml',
    rakutenKeyword: 'デュワーズ 12年',
    bottleSlug:     'dewars12',
  },

  // ── バーボン ──
  {
    name:           'ウッドフォード リザーブ',
    category:       'bourbon',
    tags:           ['バーボン', 'ケンタッキー', '複雑'],
    amazonKeyword:  'ウッドフォードリザーブ 700ml',
    rakutenKeyword: 'ウッドフォードリザーブ',
    bottleSlug:     'woodford-reserve',
  },
  {
    name:           'バッファロートレース',
    category:       'bourbon',
    tags:           ['バーボン', 'ケンタッキー', 'バニラ'],
    amazonKeyword:  'バッファロートレース 750ml',
    rakutenKeyword: 'バッファロートレース',
  },
  {
    name:           'メーカーズマーク',
    category:       'bourbon',
    tags:           ['バーボン', 'ケンタッキー', 'まろやか'],
    amazonKeyword:  'メーカーズマーク 700ml',
    rakutenKeyword: 'メーカーズマーク',
  },
  {
    name:           'ワイルドターキー 8年',
    category:       'bourbon',
    tags:           ['バーボン', 'ケンタッキー', 'スパイシー'],
    amazonKeyword:  'ワイルドターキー 8年 700ml',
    rakutenKeyword: 'ワイルドターキー 8年',
  },

  // ── ジャパニーズ ──
  {
    name:           'ニッカ フロム・ザ・バレル',
    category:       'japanese',
    tags:           ['ジャパニーズ', '余市', 'リッチ'],
    amazonKeyword:  'ニッカ フロム ザ バレル 500ml',
    rakutenKeyword: 'ニッカ フロムザバレル',
    bottleSlug:     'from-the-barrel',
  },
  {
    name:           '知多',
    category:       'japanese',
    tags:           ['ジャパニーズ', 'グレーン', '軽快'],
    amazonKeyword:  '知多 700ml',
    rakutenKeyword: '知多 ウイスキー',
    bottleSlug:     'chita',
  },
  {
    name:           'サントリー 角瓶',
    category:       'japanese',
    tags:           ['ジャパニーズ', 'ブレンデッド', '定番'],
    amazonKeyword:  'サントリー 角瓶 700ml',
    rakutenKeyword: 'サントリー角瓶',
  },
  {
    name:           'ブラックニッカ クリア',
    category:       'japanese',
    tags:           ['ジャパニーズ', 'グレーン', 'すっきり'],
    amazonKeyword:  'ブラックニッカ クリア 700ml',
    rakutenKeyword: 'ブラックニッカ クリア',
  },

  // ── アイリッシュ ──
  {
    name:           'ジェムソン スタンダード',
    category:       'irish',
    tags:           ['アイリッシュ', 'なめらか', '入門向け'],
    amazonKeyword:  'ジェムソン 700ml',
    rakutenKeyword: 'ジェムソン ウイスキー',
  },
  {
    name:           'ブッシュミルズ オリジナル',
    category:       'irish',
    tags:           ['アイリッシュ', 'トリプル蒸留', '甘口'],
    amazonKeyword:  'ブッシュミルズ 700ml',
    rakutenKeyword: 'ブッシュミルズ',
  },
  {
    name:           'コネマラ ピーテッド',
    category:       'irish',
    tags:           ['アイリッシュ', 'スモーキー', '個性派'],
    amazonKeyword:  'コネマラ ピーテッド 700ml',
    rakutenKeyword: 'コネマラ アイリッシュ',
  },

  // ── カナディアン ──
  {
    name:           'クラウン ローヤル',
    category:       'canadian',
    tags:           ['カナディアン', '軽やか', 'まろやか'],
    amazonKeyword:  'クラウンローヤル 750ml',
    rakutenKeyword: 'クラウンローヤル',
  },
  {
    name:           'カナディアンクラブ',
    category:       'canadian',
    tags:           ['カナディアン', '軽口', '定番'],
    amazonKeyword:  'カナディアンクラブ 700ml',
    rakutenKeyword: 'カナディアンクラブ',
  },

  // ── ニューワールド ──
  {
    name:           'カバラン クラシック',
    category:       'newworld',
    tags:           ['ニューワールド', '台湾', 'フルーティ'],
    amazonKeyword:  'カバラン クラシック 700ml',
    rakutenKeyword: 'カバラン クラシック',
  },
  {
    name:           'アムルット フュージョン',
    category:       'newworld',
    tags:           ['ニューワールド', 'インド', 'スパイシー'],
    amazonKeyword:  'アムルット フュージョン 700ml',
    rakutenKeyword: 'アムルット フュージョン',
  },
  {
    name:           'ポールジョン ブリリアンス',
    category:       'newworld',
    tags:           ['ニューワールド', 'インド', '甘口'],
    amazonKeyword:  'ポールジョン ブリリアンス 700ml',
    rakutenKeyword: 'ポールジョン ブリリアンス',
  },

  // ── 芋焼酎 ──
  {
    name:           '魔王',
    category:       'imo',
    tags:           ['芋焼酎', '鹿児島', 'プレミアム'],
    amazonKeyword:  '魔王 焼酎 720ml',
    rakutenKeyword: '魔王 芋焼酎',
  },
  {
    name:           '赤霧島',
    category:       'imo',
    tags:           ['芋焼酎', '宮崎', '甘口'],
    amazonKeyword:  '赤霧島 900ml',
    rakutenKeyword: '赤霧島 芋焼酎',
  },
  {
    name:           '黒霧島',
    category:       'imo',
    tags:           ['芋焼酎', '宮崎', '定番'],
    amazonKeyword:  '黒霧島 900ml',
    rakutenKeyword: '黒霧島 芋焼酎',
  },
  {
    name:           '村尾',
    category:       'imo',
    tags:           ['芋焼酎', '鹿児島', '幻の銘柄'],
    amazonKeyword:  '村尾 焼酎 720ml',
    rakutenKeyword: '村尾 芋焼酎',
  },

  // ── 麦焼酎 ──
  {
    name:           'いいちこ スペシャル',
    category:       'mugi',
    tags:           ['麦焼酎', '大分', 'すっきり'],
    amazonKeyword:  'いいちこ スペシャル 700ml',
    rakutenKeyword: 'いいちこ スペシャル',
  },
  {
    name:           '壱岐の島',
    category:       'mugi',
    tags:           ['麦焼酎', '長崎', '壱岐'],
    amazonKeyword:  '壱岐の島 麦焼酎 720ml',
    rakutenKeyword: '壱岐の島 焼酎',
  },
  {
    name:           '中々',
    category:       'mugi',
    tags:           ['麦焼酎', '宮崎', 'まろやか'],
    amazonKeyword:  '中々 麦焼酎 720ml',
    rakutenKeyword: '中々 麦焼酎',
  },

  // ── 米焼酎 ──
  {
    name:           '白岳しろ',
    category:       'kome',
    tags:           ['米焼酎', '熊本', '上品'],
    amazonKeyword:  '白岳しろ 720ml',
    rakutenKeyword: '白岳 しろ 米焼酎',
  },
  {
    name:           '繊月 球磨焼酎',
    category:       'kome',
    tags:           ['米焼酎', '熊本', '球磨'],
    amazonKeyword:  '繊月 焼酎 720ml',
    rakutenKeyword: '繊月 米焼酎',
  },

  // ── 黒糖焼酎 ──
  {
    name:           '里の曙',
    category:       'kokuto',
    tags:           ['黒糖焼酎', '奄美', '甘香'],
    amazonKeyword:  '里の曙 720ml',
    rakutenKeyword: '里の曙 黒糖焼酎',
  },
  {
    name:           'れんと',
    category:       'kokuto',
    tags:           ['黒糖焼酎', '奄美', '音楽熟成'],
    amazonKeyword:  'れんと 黒糖焼酎 720ml',
    rakutenKeyword: 'れんと 黒糖焼酎',
  },

  // ── その他の焼酎 ──
  {
    name:           '雲海 そば焼酎',
    category:       'other-shochu',
    tags:           ['そば焼酎', '宮崎', 'すっきり'],
    amazonKeyword:  '雲海 そば焼酎 720ml',
    rakutenKeyword: '雲海 そば焼酎',
  },
  {
    name:           '久米島の久米仙',
    category:       'other-shochu',
    tags:           ['泡盛', '沖縄', '久米島'],
    amazonKeyword:  '久米島の久米仙 720ml',
    rakutenKeyword: '久米島の久米仙 泡盛',
  },
]

// ── ユーティリティ ──

/**
 * 記事スラッグを種とした決定論的なシャッフル（Fisher-Yates + LCG）
 */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr]
  let s = seed >>> 0
  for (let i = result.length - 1; i > 0; i--) {
    s = ((s * 1664525) + 1013904223) >>> 0
    const j = s % (i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * 記事カテゴリーに連動したおすすめボトルを返す
 *
 * @param category   - 記事のカテゴリー（scotch/bourbon/japanese/等）
 * @param articleSlug - 記事スラッグ（決定論的なシード選択に使用）
 * @param count       - 表示件数（デフォルト 4）
 *
 * フォールバック仕様:
 *   - category が "all" の場合: 全カテゴリーからランダムにピックアップ
 *   - 該当カテゴリーが3件未満の場合: 全カテゴリーにフォールバック
 */
export function getRecommendedBottles(
  category: string,
  articleSlug: string,
  count = 4,
): RecommendedBottle[] {
  // カテゴリーフィルタリング
  let pool =
    category === 'all'
      ? RECOMMENDED_BOTTLES
      : RECOMMENDED_BOTTLES.filter((b) => b.category === category)

  // フォールバック：3件未満なら全カテゴリーへ
  if (pool.length < 3) {
    pool = RECOMMENDED_BOTTLES
  }

  // 記事スラッグからシード値を生成
  let seed = 0
  for (const char of articleSlug) {
    seed = ((seed * 31) + char.charCodeAt(0)) >>> 0
  }

  const shuffled = seededShuffle(pool, seed)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}
