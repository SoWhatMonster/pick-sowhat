// ============================================================
// SO WHAT Pick — コラム コンテキスト選択・プロンプト生成
// lib/columnContext.ts
// ============================================================

export type ContextType = 'news' | 'weather' | 'place' | 'culture' | 'observation'
export type JokeType   = 'excuse' | 'dadJoke'

/**
 * 日付をシードに、4〜5本に1本ジョークを入れるか判定（約20%）。
 * コンテキスト判定と干渉しないよう別の桁を使う。
 */
export function shouldAddJoke(date: string): boolean {
  const seed = date.replace(/-/g, '')
  return parseInt(seed.slice(-6, -4), 10) % 5 === 0
}

/**
 * ジョークの種類を日付ハッシュで決定。
 * 80%: 飲み手の言い訳・自己弁護系 / 20%: 親父ギャグ
 */
export function selectJokeType(date: string): JokeType {
  const seed = date.replace(/-/g, '')
  return parseInt(seed.slice(-8, -6), 10) % 5 === 0 ? 'dadJoke' : 'excuse'
}

/**
 * 日付をシードにしてコンテキストタイプを決定（同じ日は同じタイプ）。
 * news: 30% / weather: 20% / place: 20% / culture: 20% / observation: 10%
 */
export function selectContextType(date: string): ContextType {
  const seed = date.replace(/-/g, '')
  const n    = parseInt(seed.slice(-4)) % 10   // 末尾4桁で計算（安全域）

  if (n < 3) return 'news'
  if (n < 5) return 'weather'
  if (n < 7) return 'place'
  if (n < 9) return 'culture'
  return 'observation'
}

export function buildColumnPrompt(params: {
  name:        string
  tags:        string[]
  date:        string
  weekday:     string
  season:      string
  contextType: ContextType
  news?:       string[]
  jokeType?:   JokeType
}): string {
  const base =
    `銘柄: ${params.name}\n` +
    `今日: ${params.date}（${params.weekday}）\n` +
    `季節: ${params.season}\n` +
    `この銘柄の特徴: ${params.tags.join('・')}`

  const contextInstructions: Record<ContextType, string> = {
    news: `\nコンテキスト: 今日の実際のニュース\n` +
      `以下のニュースを1つ選んで書き出しに使うこと（架空のニュースは絶対に使わない）:\n` +
      (params.news ?? []).map((n, i) => `${i + 1}. ${n}`).join('\n') +
      `\n\nニュースと銘柄の関係は無理やりこじつけてよい。そのこじつけが面白さになる。`,

    weather: `\nコンテキスト: 今日の季節・気温・天気の感覚\n` +
      `${params.season}の${params.weekday}の空気感から書き出すこと。` +
      `具体的な気温や天気の描写を入れる。`,

    place: `\nコンテキスト: 場所・街の観察\n` +
      `東京の街角、または海外（バンコク・シンガポール・東欧・スコットランド等）を` +
      `舞台にした観察から書き出すこと。` +
      `海外の場合は、その場所とこのウイスキーの産地・特徴を結びつけてもよい。`,

    culture: `\nコンテキスト: 文化（音楽・映画・本・食・スポーツ等）\n` +
      `何かひとつ文化的なものを引用して書き出すこと。` +
      `引用は実在するものに限る。架空の作品・人物は使わない。`,

    observation: `\nコンテキスト: 日常の観察（電車・カフェ・コンビニ・会話・スマホ等）\n` +
      `2026年の東京の日常的な一場面から書き出すこと。` +
      `馬鹿馬鹿しくてよい。でも観察眼を忘れない。`,
  }

  let jokeInstruction = ''
  if (params.jokeType === 'excuse') {
    jokeInstruction = `

【ジョーク指示（必須）】
本文の最後の一文（締めの直前）に、飲み手の言い訳・自己弁護系のジョークを1文だけ入れること。
例: 「二杯目は、一杯目のせいにできる。」
例: 「『もう一杯だけ』は、人類が発明した最も信頼性の低い言葉だ。」
例: 「グラスが空なのは、グラスが小さすぎるのだと思っている。」
これらは参考例。同じものを使わず、この銘柄・今日のコンテキストに合わせて新しく作ること。
滑っても構わない。むしろ滑った方がいい。`
  } else if (params.jokeType === 'dadJoke') {
    jokeInstruction = `

【ジョーク指示（必須）】
本文の最後の一文（締めの直前）に、以下の要素を使った親父ギャグを1文だけ入れること。
対象: この銘柄名「${params.name}」・産地・国名・地名・蒸留所名・酒の種類
例（スコッチ）: 「スコッちだけください、と言えたら苦労しない。」
例（アイラ）: 「アイラ島に行きたい。愛らしいから。」
例（アイリッシュ）: 「アイリッシュだけに、アイがとまらない。」
これらは参考例。同じものを使わず、この銘柄に合わせて新しく作ること。
無理やり引っかければ引っかけるほどいい。滑ることを恐れない。`
  }

  return base + contextInstructions[params.contextType] + jokeInstruction
}
