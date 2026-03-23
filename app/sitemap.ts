import { MetadataRoute } from 'next'

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

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    // ── トップ ──
    {
      url: `${BASE}/whisky`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },

    // ── スタイルガイド下層 ──
    ...GUIDE_SLUGS.map((slug) => ({
      url: `${BASE}/whisky/guide/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),

    // ── シーン別下層 ──
    ...SCENE_SLUGS.map((slug) => ({
      url: `${BASE}/whisky/scene/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
