// ============================================================
// SO WHAT Pick — Whisky & Shochu
// constants/ja.ts
// 日本語UIテキスト定数
// ============================================================

export const TEXT = {
  siteTitle: '✦ SO WHAT Pick — Whisky & Shochu',
  siteUrl: 'https://pick.sowhat.monster/whisky',
  brandUrl: 'https://sowhat.monster/',
  copyright: '© SO WHAT',

  search: {
    placeholder: '例：グレンフィディック 12年',
    label: '銘柄名で直接探す',
    btn: '探す',
    divider: 'または AIにおすすめしてもらう',
    amazonBtn: 'Amazonで探す →',
    rakutenBtn: '楽天で探す →',
  },

  step0: {
    label: '今、最高の1本を見つける',
    tagline: 'Find Your Perfect Bottle.',
    spirits: ['WHISKY', 'SHOCHU'] as const,
    sub: 'ウイスキーと焼酎から、シーン・気分・フレーバーをもとにAIがあなただけの1本を提案。',
    howSteps: [
      { step: 'STEP 1', icon: '🎯', text: 'シーンを\n選ぶ' },
      { step: 'STEP 2', icon: '🎨', text: '好みを\n入力する' },
      { step: 'STEP 3', icon: '🥃', text: '3本を\nレコメンド' },
    ] as const,
    title: '誰のための\nお酒を選びますか？',
    selfLabel: '自分用',
    selfIcon: '🥃',
    giftLabel: 'ギフト用',
    giftIcon: '🎁',
  },

  step1Self: {
    label: 'STEP 1 / シーン',
    title: '今はどんな\nシーンですか？',
    seasonNote: (season: string) => `📍 現在の季節（${season}）を自動で考慮します`,
    next: '次へ →',
    back: '← 戻る',
  },

  step1Gift: {
    label: 'STEP 1 / 相手の情報',
    title: '誰に\n贈りますか？',
    relationLabel: '関係性',
    ageLabel: '相手の年代',
    experienceLabel: '相手の経験値',
    next: '次へ →',
    back: '← 戻る',
  },

  step2: {
    label: 'STEP 2 / フレーバー',
    title: 'どんな味わいが\n好きですか？',
    spiritLabel: '酒の種類',
    optionalNote: '未選択はお任せ',
    // ウイスキー詳細
    whiskyRegionLabel: '産地・地域',
    whiskyStyleLabel: 'スタイル',
    whiskyCaskLabel: '熟成樽',
    whiskyAgeLabel: '熟成年数',
    // 焼酎詳細
    shochuRegionLabel: '産地',
    shochuIngredientLabel: '原料',
    shochuAgingLabel: '熟成スタイル',
    next: '次へ →',
    back: '← 戻る',
  },

  step3: {
    label: 'STEP 3 / 最後の調整',
    title: '予算と\nこだわりを教えて',
    titleGift: '予算を\n教えてください',
    budgetLabel: '予算',
    experienceLabel: 'あなたの経験値',
    next: 'この条件で探す →',
    back: '← 戻る',
  },

  loading: {
    message: 'Searching for your perfect bottle...',
    sub: 'AIがあなたの条件を分析中…',
  },

  result: {
    label: 'RESULT / あなたへのおすすめ',
    title: "Here's Your Pick.",
    amazon: 'Amazon →',
    rakuten: '楽天 →',
    restart: '最初からやり直す',
    back: '← 条件を変える',
    imageAlt: '商品画像',
    imageFallbackNote: 'Amazon\n画像',
  },
} as const
