// ============================================================
// SO WHAT Pick — 今日の1本セクション（Client Component）
// app/whisky/DailyFeatured.tsx
// ============================================================

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { buildAmazonUrl, buildRakutenUrl } from '@/lib/affiliate'

type FeaturedData = {
  date: string
  slug: string
  name: string
  ai_comment: string
  tags: string[]
  amazon_keyword: string
  rakuten_keyword: string
}

export default function DailyFeatured() {
  const [data, setData] = useState<FeaturedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const amazonTag = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG ?? ''
  const rakutenAfId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID ?? ''

  useEffect(() => {
    fetch('/api/daily-featured')
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          setError(true)
        } else {
          setData(d)
        }
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  // エラー or 完全非表示
  if (error) return null

  if (loading) return (
    <section className="staticSection dailyFeaturedSection" aria-label="今日の1本">
      <div className="staticInner">
        <div className="sectionHead">
          <h2 className="sectionTitle">今日の1本</h2>
          <p className="sectionSub">Today&apos;s bottle.</p>
        </div>
        <div className="dailyFeaturedLoading" />
      </div>
    </section>
  )

  return (
    <section className="staticSection dailyFeaturedSection" aria-label="今日の1本">
      <div className="staticInner">
        <div className="sectionHead">
          <h2 className="sectionTitle">今日の1本</h2>
          <p className="sectionSub">Today&apos;s bottle.</p>
        </div>

        <div className="dailyFeaturedCard">
          <div className="dailyFeaturedBody">
            <div className="dailyFeaturedTags">
              {data.tags.map((tag) => (
                <span key={tag} className="dailyPickTag">{tag}</span>
              ))}
            </div>
            <p className="dailyFeaturedName">{data.name}</p>
            <p className="dailyFeaturedComment">{data.ai_comment}</p>
            <div className="dailyFeaturedActions">
              <a
                href={buildAmazonUrl(data.amazon_keyword, amazonTag)}
                target="_blank"
                rel="noopener noreferrer"
                className="dailyPickAmazon"
              >Amazon</a>
              <a
                href={buildRakutenUrl(data.rakuten_keyword, rakutenAfId)}
                target="_blank"
                rel="noopener noreferrer"
                className="dailyPickRakuten"
              >楽天</a>
              <Link href={`/whisky/bottle/${data.slug}`} className="dailyFeaturedReadMore">
                詳しく読む →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
