// ============================================================
// SO WHAT Pick — Whisky & Shochu
// lib/affiliate.ts
// アフィリエイトリンク生成
// Phase 2: locale引数を追加し、言語に紐づいてリンク先を切り替え可能な構造
// ============================================================

type Locale = 'ja' // Phase 2で 'en' などを追加

/**
 * Amazon アフィリエイトリンクを生成する
 * @param keyword - 検索キーワード（例: "グレンフィディック 12年 700ml"）
 * @param tag - Amazonアソシエイトタグ
 * @param locale - ロケール（現在は 'ja' のみ対応）
 */
export function buildAmazonUrl(
  keyword: string,
  tag: string,
  locale: Locale = 'ja'
): string {
  const q = encodeURIComponent(keyword)

  // Phase 2: locale に応じてドメインを切り替え
  const domains: Record<Locale, string> = {
    ja: 'amazon.co.jp',
    // en: 'amazon.com', // Phase 2で追加
  }

  const domain = domains[locale] ?? 'amazon.co.jp'
  return `https://www.${domain}/s?k=${q}&tag=${tag}`
}

/**
 * 楽天アフィリエイトリンクを生成する
 * @param keyword - 検索キーワード
 * @param affiliateId - 楽天アフィリエイトID
 * @param locale - ロケール（現在は 'ja' のみ対応）
 */
export function buildRakutenUrl(
  keyword: string,
  affiliateId: string,
  locale: Locale = 'ja'
): string {
  const searchUrl = `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(keyword)}/`

  if (locale !== 'ja') {
    // Phase 2: 英語圏向けの代替ストア（例: The Whisky Exchange）
    // return `https://www.thewhiskyexchange.com/search#q=${encodeURIComponent(keyword)}`
    return `https://hb.afl.rakuten.co.jp/ichiba/${affiliateId}/?pc=${encodeURIComponent(searchUrl)}`
  }

  return `https://hb.afl.rakuten.co.jp/ichiba/${affiliateId}/?pc=${encodeURIComponent(searchUrl)}`
}
