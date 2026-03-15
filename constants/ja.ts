// ============================================================
// SO WHAT Pick — Whisky & Shochu
// constants/ja.ts
// 日本語UIテキスト定数
// Phase 2で英語対応する場合は constants/en.ts を追加する
// ============================================================

export const TEXT = {
  siteTitle: '✦ SO WHAT',

  step0: {
    label: 'あなたの一本を見つける',
    title: '誰のために\n選びますか？',
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
    next: '次へ →',
    back: '← 戻る',
  },

  step3: {
    label: 'STEP 3 / 最後の調整',
    title: '予算と\nこだわりを教えて',
    budgetLabel: '予算',
    experienceLabel: 'あなたの経験値',
    next: 'この条件で探す →',
    back: '← 戻る',
  },

  loading: {
    message: 'あなたの一本を探しています…',
  },

  result: {
    label: 'RESULT / あなたの3本',
    title: 'あなたの一本。',
    amazon: 'Amazon →',
    rakuten: '楽天 →',
    restart: '最初からやり直す',
    back: '← 条件を変える',
    imageAlt: '商品画像',
    imageFallbackNote: 'Amazon\n画像',
  },
} as const
