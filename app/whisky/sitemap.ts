import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'

const BASE = 'https://pick.sowhat.monster'

const GUIDE_SLUGS = [
  'scotch', 'irish', 'japanese', 'bourbon', 'canadian',
  'newworld', 'imo', 'mugi', 'kome', 'kokuto', 'other-shochu',
]

const SCENE_SLUGS = [
  'beginner', 'gift', 'winter-night', 'fathers-day',
  'food-pairing', 'outdoor', 'special',
  'solo-night', 'after-work', 'highball', 'womens-pick',
]

// DBから銘柄slugを取得（Postgres未設定時は空配列）
async function getBottleSlugs(): Promise<{ slug: string; date: string }[]> {
  if (!process.env.POSTGRES_URL) return []
  try {
    const { sql } = await import('@/lib/db')
    const result = await sql<{ slug: string; date: string }>`
      SELECT df.slug, df.date::text AS date
      FROM daily_featured df
      JOIN bottle_details bd ON df.slug = bd.slug
      ORDER BY df.date DESC
    `
    return result.rows
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now     = new Date()
  const bottles = await getBottleSlugs()

  return [
    // ── トップ ──
    {
      url:             `${BASE}/whisky`,
      lastModified:    now,
      changeFrequency: 'daily',
      priority:        1.0,
    },

    // ── バックナンバー ──
    {
      url:             `${BASE}/whisky/bottle`,
      lastModified:    now,
      changeFrequency: 'daily',
      priority:        0.7,
    },

    // ── 銘柄詳細ページ（DBにある分） ──
    ...bottles.map(({ slug, date }) => ({
      url:             `${BASE}/whisky/bottle/${slug}`,
      lastModified:    new Date(date),
      changeFrequency: 'weekly' as const,
      priority:        0.6,
    })),

    // ── スタイルガイド下層 ──
    ...GUIDE_SLUGS.map((slug) => ({
      url:             `${BASE}/whisky/guide/${slug}`,
      lastModified:    now,
      changeFrequency: 'monthly' as const,
      priority:        0.8,
    })),

    // ── シーン別下層 ──
    ...SCENE_SLUGS.map((slug) => ({
      url:             `${BASE}/whisky/scene/${slug}`,
      lastModified:    now,
      changeFrequency: 'monthly' as const,
      priority:        0.7,
    })),
  ]
}
