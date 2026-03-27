// ============================================================
// SO WHAT Pick — ニュース取得（NewsAPI.org）
// lib/fetchNews.ts
// 環境変数: NEWS_API_KEY（未設定時は空配列を返す）
// ============================================================

/**
 * 今日の日本トップニュース見出しを最大3件取得する。
 * NEWS_API_KEY 未設定 or 取得失敗時は空配列を返す（エラーにしない）。
 */
export async function fetchTodayNews(): Promise<string[]> {
  const apiKey = process.env.NEWS_API_KEY
  if (!apiKey) return []

  try {
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?country=jp&pageSize=5`,
      {
        headers: { 'X-Api-Key': apiKey },
        next:    { revalidate: 3600 }, // 1時間キャッシュ
      }
    )
    if (!res.ok) return []

    const data = await res.json()
    return (data.articles ?? [])
      .slice(0, 3)
      .map((a: { title: string }) => a.title)
      .filter(Boolean)
  } catch {
    return []
  }
}
