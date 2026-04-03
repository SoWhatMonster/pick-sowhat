// ============================================================
// SO WHAT Pick — 今日の1本 API
// app/api/daily-featured/route.ts
// DB（Vercel Postgres）はオプション。未設定でもAI生成で動作する。
// ============================================================

import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export type DailyFeaturedResult = {
  date: string
  slug: string
  name: string
  ai_comment: string
  tags: string[]
  amazon_keyword: string
  rakuten_keyword: string
}

// ── DB操作（Postgres未設定時はnullを返す） ──
async function tryDbRead(today: string): Promise<DailyFeaturedResult | null> {
  if (!process.env.POSTGRES_URL) return null
  try {
    const { sql } = await import('@/lib/db')
    const existing = await sql<DailyFeaturedResult>`
      SELECT df.date::text AS date, df.slug, df.ai_comment, bd.name, bd.tags,
             bd.amazon_keyword, bd.rakuten_keyword
      FROM daily_featured df
      JOIN bottle_details bd ON df.slug = bd.slug
      WHERE df.date = ${today}
    `
    return existing.rows[0] ?? null
  } catch {
    return null
  }
}

async function tryDbWrite(
  today: string,
  featured: Omit<DailyFeaturedResult, 'date'>,
  detail: Record<string, unknown> | null,
) {
  if (!process.env.POSTGRES_URL) return
  try {
    const { sql } = await import('@/lib/db')

    // bottle_detailsに詳細がなければ保存
    if (detail) {
      await sql`
        INSERT INTO bottle_details (slug, name, tasting_nose, tasting_palate, tasting_finish,
          distillery_bg, how_to_drink, pairing, amazon_keyword, rakuten_keyword, tags)
        VALUES (
          ${featured.slug}, ${featured.name},
          ${detail.tasting_nose as string}, ${detail.tasting_palate as string},
          ${detail.tasting_finish as string}, ${detail.distillery_bg as string},
          ${detail.how_to_drink as string}, ${detail.pairing as string},
          ${featured.amazon_keyword}, ${featured.rakuten_keyword},
          ${featured.tags as unknown as string}
        )
        ON CONFLICT (slug) DO NOTHING
      `
    }

    await sql`
      INSERT INTO daily_featured (date, slug, ai_comment)
      VALUES (${today}, ${featured.slug}, ${featured.ai_comment})
      ON CONFLICT (date) DO NOTHING
    `
  } catch (e) {
    console.warn('[daily-featured] DB書き込み失敗（スキップ）:', e)
  }
}

// ── 直近の使用済みslugを取得（名前比較より確実）──
async function getRecentSlugs(days = 7): Promise<string[]> {
  if (!process.env.POSTGRES_URL) return []
  try {
    const { sql } = await import('@/lib/db')
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const result = await sql<{ slug: string }>`
      SELECT slug FROM daily_featured
      WHERE date >= ${cutoff}
      ORDER BY date DESC
    `
    return result.rows.map((r) => r.slug)
  } catch {
    return []
  }
}

// ── 今日の1本をAIで選出 ──
async function generateDailyFeatured(date: string, recentSlugs: string[] = []): Promise<{
  name: string
  slug: string
  ai_comment: string
  tags: string[]
  amazon_keyword: string
  rakuten_keyword: string
}> {
  const d = new Date(date)
  const weekdays = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日']
  const weekday = weekdays[d.getDay()]
  const month = d.getMonth() + 1
  const seasons: Record<number, string> = {
    1: '冬', 2: '冬', 3: '春', 4: '春', 5: '春',
    6: '初夏', 7: '夏', 8: '夏', 9: '秋', 10: '秋',
    11: '秋', 12: '冬',
  }
  const season = seasons[month] ?? '冬'

  // 曜日ベースのカテゴリローテーション（0=日〜6=土）
  const categoryRotation: Record<number, string> = {
    0: '焼酎（芋・麦・米・黒糖いずれか）',
    1: 'ジャパニーズウイスキー（余市・宮城峡・山崎・白州・竹鶴・知多のいずれか）',
    2: 'スコッチ（アイラまたはアイランズ：ボウモア・ラフロイグ・アードベッグ・ラガヴーリン・タリスカーのいずれか）',
    3: 'バーボン・アイリッシュ・カナディアン・ワールドウイスキーのいずれか',
    4: '焼酎（芋・麦・米・黒糖いずれか）',
    5: 'スコッチ（ハイランド・スペイサイド・ローランド：アイラ以外）',
    6: 'ジャパニーズウイスキーまたはワールドウイスキー（カバラン・アムルット等）',
  }
  const todayCategory = categoryRotation[d.getDay()]

  const systemPrompt = `あなたはウイスキーと焼酎の専門家であり、言葉で酒を描く作家でもあります。
今日（${date}・${weekday}・${season}）の「今日の1本」を選んでください。

【重要】必ず以下の「銘柄名 → slug」リストから選ぶこと。slugは必ずリスト記載の値をそのまま使うこと。

ウイスキー候補（銘柄名 → slug）:
グレンフィディック 12年 → glenfiddich-12
グレンフィディック 15年 → glenfiddich-15
グレンフィディック 18年 → glenfiddich-18
マッカラン 12年 シェリーオーク → macallan-12-sherry
マッカラン 12年 ダブルカスク → macallan-12-dc
マッカラン 18年 → macallan-18
グレンモーレンジィ オリジナル 10年 → glenmorangie-original-10
グレンモーレンジィ ラサンタ → glenmorangie-lasanta
ボウモア 12年 → bowmore-12
ラフロイグ 10年 → laphroaig-10
アードベッグ 10年 → ardbeg-10
ラガヴーリン 16年 → lagavulin-16
タリスカー 10年 → talisker-10
オーバン 14年 → oban-14
グレンリベット 12年 → glenlivet-12
グレンリベット 15年 → glenlivet-15
ダルモア 12年 → dalmore-12
ダルウィニー 15年 → dalwhinnie-15
ジェムソン → jameson
ジェムソン ブラックバレル → jameson-black-barrel
ブッシュミルズ オリジナル → bushmills-original
山崎 12年 → yamazaki-12
白州 12年 → hakushu-12
余市 → yoichi
宮城峡 → miyagikyo
竹鶴 ピュアモルト → taketsuru-pure-malt
知多 → chita
メーカーズマーク → makers-mark
バッファロートレース → buffalo-trace
ウッドフォードリザーブ → woodford-reserve
エヴァン・ウィリアムス ブラックラベル → evan-williams-black
ワイルドターキー 8年 → wild-turkey-8
ジャックダニエル No.7 → jack-daniels-no7
ジムビーム → jim-beam
クラウンローヤル → crown-royal
カナディアンクラブ → canadian-club
カバラン クラシック → kavalan-classic
アムルット フュージョン → amrut-fusion

焼酎候補（銘柄名 → slug）:
森伊蔵 → moriizo
魔王 → mao
伊佐美 → isami
佐藤 黒 → sato-kuro
村尾 → murao
八幡 白石酒造 → yahata
海 → umi
二階堂 → nikaido
いいちこ スペシャル → iichiko-special
麦焼酎 西の星 → nishi-no-hoshi
球磨焼酎 繊月 → sengetsu
米焼酎 白岳 → hakutake
里の曙 → sato-no-akebono
龍宮 → ryugyu
にしの誉 → nishino-homare

【今日のカテゴリ指定（厳守）】
${todayCategory}から選ぶこと。上記リストにない銘柄は選ばない。

${recentSlugs.length > 0 ? `【絶対に選ばないこと】以下のslugは直近で使用済みのため除外:\n${recentSlugs.map((s) => `- ${s}`).join('\n')}\n` : ''}選出条件:
- 今日のカテゴリ指定を最優先する
- 季節・曜日にゆるく関連した銘柄
- 直近で選ばれた銘柄は絶対に選ばない（重複禁止）
- 「なぜ今日この1本なのか」のAIコメントを必ず付ける

コメントの文体（厳守）:
- ドライ・ウィット
- 断言口調
- 季節・曜日・その日の空気感とウイスキーをこじつける
- 1〜2文
- 感嘆符は使わない
- 例: 「月曜日。長い一週間の始まりに、これくらい落ち着いた甘さが必要だと思う。」
- 例: 「金曜の夜は、スモーキーじゃなくていい。むしろ、優しい方が続く。」

必ずJSON形式のみで返してください:
{
  "name": "上記リストの銘柄名（そのまま）",
  "slug": "上記リストのslug（そのまま・変更禁止）",
  "ai_comment": "なぜ今日この1本なのか（1〜2文）",
  "tags": ["産地またはカテゴリ", "フレーバー特徴", "価格帯"],
  "amazon_keyword": "Amazon検索用キーワード（銘柄名＋容量等）",
  "rakuten_keyword": "楽天検索用キーワード"
}`

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    temperature: 1,
    system: systemPrompt,
    messages: [{ role: 'user', content: `今日の日付: ${date}（${weekday}・${season}）\n今日のカテゴリ: ${todayCategory}\n今日の1本を選んでください。` }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('レスポンス形式が不正です')
  return JSON.parse(jsonMatch[0])
}

// ── 詳細コンテンツ生成（DBある場合のみ保存） ──
async function generateBottleDetail(slug: string, name: string): Promise<Record<string, unknown> | null> {
  if (!process.env.POSTGRES_URL) return null  // DBなしの場合は詳細生成しない

  try {
    const { sql } = await import('@/lib/db')
    const existing = await sql`SELECT slug FROM bottle_details WHERE slug = ${slug}`
    if (existing.rows.length > 0) return null  // すでに存在する

    const systemPrompt = `あなたはウイスキー・焼酎の専門家であり、言葉で酒を描く作家でもあります。
指定された銘柄について、詳細なコンテンツを生成してください。

文体ルール:
- 断言口調。短い文で切る。
- テイスティングノートは専門用語を使いつつ、情景や記憶に触れる
- 「おすすめ」「ぴったり」は使わない
- ユーモアは描写に紛れ込ませる
- 感嘆符は使わない

必ずJSON形式のみで返してください:
{
  "name": "正式な銘柄名",
  "tags": ["産地", "フレーバー特徴", "価格帯", "レベル"],
  "tasting_nose": "香りの描写（2〜3文）",
  "tasting_palate": "味わいの描写（2〜3文）",
  "tasting_finish": "余韻の描写（1〜2文）",
  "distillery_bg": "産地・蒸留所の背景（3〜4文。歴史・地理・製法の個性）",
  "how_to_drink": "飲み方提案（2〜3文。ストレート・ロック・ハイボール等）",
  "pairing": "ペアリング提案（料理・シーン、2〜3文）",
  "amazon_keyword": "Amazon検索用キーワード",
  "rakuten_keyword": "楽天検索用キーワード"
}`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1200,
      system: systemPrompt,
      messages: [{ role: 'user', content: `銘柄: ${name}\n上記の銘柄について詳細コンテンツを生成してください。` }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null
    return JSON.parse(jsonMatch[0])
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0]

    // DBキャッシュ確認
    const cached = await tryDbRead(today)
    if (cached) return NextResponse.json(cached)

    // 直近の使用済みslugを取得（slug比較は名前表記ゆれに影響されない）
    const recentSlugs = await getRecentSlugs(7)

    // AIで今日の1本を選出（重複時は最大3回リトライ）
    let featured = await generateDailyFeatured(today, recentSlugs)
    let retries = 0
    while (recentSlugs.includes(featured.slug) && retries < 3) {
      console.warn(`[daily-featured] 重複検出 slug=${featured.slug}、リトライ ${retries + 1}/3`)
      featured = await generateDailyFeatured(today, recentSlugs)
      retries++
    }

    // 詳細生成（DBある場合のみ）
    const detail = await generateBottleDetail(featured.slug, featured.name)

    // DB保存（失敗してもレスポンスは返す）
    await tryDbWrite(today, featured, detail)

    return NextResponse.json({
      date: today,
      slug: featured.slug,
      name: featured.name,
      ai_comment: featured.ai_comment,
      tags: featured.tags,
      amazon_keyword: featured.amazon_keyword,
      rakuten_keyword: featured.rakuten_keyword,
    } as DailyFeaturedResult)
  } catch (err) {
    console.error('[daily-featured]', err)
    return NextResponse.json({ error: '今日の1本の取得に失敗しました' }, { status: 500 })
  }
}
