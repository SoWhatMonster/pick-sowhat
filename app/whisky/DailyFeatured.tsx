// ============================================================
// SO WHAT Pick — 今日の1本セクション（Client Component）
// app/whisky/DailyFeatured.tsx
// ============================================================

'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { buildAmazonUrl, buildRakutenUrl } from '@/lib/affiliate'
import { getTagIcon } from '@/lib/bottleHelper'

type FeaturedData = {
  date:            string
  slug:            string
  name:            string
  ai_comment:      string
  tags:            string[]
  amazon_keyword:  string
  rakuten_keyword: string
  image_url?:      string | null
}

export default function DailyFeatured() {
  const [data, setData]       = useState<FeaturedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)

  const amazonTag   = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG  ?? ''
  const rakutenAfId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID  ?? ''

  useEffect(() => {
    fetch('/api/daily-featured')
      .then((r) => r.json())
      .then((d: FeaturedData & { error?: string }) => {
        if (d.error) {
          setError(true)
        } else {
          setData(d)
          // 詳細ページをバックグラウンドでウォームアップ（クリック時の速度改善）
          if (d.slug) {
            fetch(`/api/bottle-detail?slug=${d.slug}&name=${encodeURIComponent(d.name)}`)
              .catch(() => {})
          }
        }
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  if (error) return null

  if (loading || !data) return (
    <section className="staticSection dailyFeaturedSection" aria-label="今日の1本">
      <div className="staticInner">
        <div className="sectionHead">
          <h2 className="sectionTitle">コラム — 今日の1本</h2>
          <p className="sectionSub">Today&apos;s bottle.</p>
        </div>
        <div className="dailyFeaturedLoading" />
      </div>
    </section>
  )

  const categoryIcon = getTagIcon(data.tags)
  const hasImage     = !!data.image_url

  return (
    <section className="staticSection dailyFeaturedSection" aria-label="今日の1本">
      <div className="staticInner">
        <div className="sectionHead">
          <h2 className="sectionTitle">コラム — 今日の1本</h2>
          <p className="sectionSub">Today&apos;s bottle.</p>
        </div>

        <div className={`dailyFeaturedCard${hasImage ? '' : ' dailyFeaturedCard--noimg'}`}>
          {/* ── 商品画像（Amazon PA-API） ── */}
          {hasImage && (
            <div className="dailyFeaturedImgWrap">
              <Image
                src={data.image_url!}
                alt={data.name}
                fill
                className="dailyFeaturedImg"
                sizes="(max-width: 640px) 100vw, 200px"
              />
            </div>
          )}

          {/* ── コンテンツ ── */}
          <div className="dailyFeaturedBody">
            <div className="dailyFeaturedMeta">
              <span className="dailyFeaturedIcon">{categoryIcon}</span>
              <div className="dailyFeaturedTags">
                {data.tags.map((tag) => (
                  <span key={tag} className="dailyPickTag">{tag}</span>
                ))}
              </div>
            </div>
            <p className="dailyFeaturedName">{data.name}</p>
            <p className="dailyFeaturedComment">{data.ai_comment}</p>
            <div className="dailyFeaturedActions">
              <a
                href={buildAmazonUrl(data.amazon_keyword, amazonTag)}
                target="_blank" rel="noopener noreferrer"
                className="dailyPickAmazon"
              >Amazon</a>
              <a
                href={buildRakutenUrl(data.rakuten_keyword, rakutenAfId)}
                target="_blank" rel="noopener noreferrer"
                className="dailyPickRakuten"
              >楽天</a>
              <Link href={`/whisky/bottle/${data.slug}`} className="dailyFeaturedReadMore">
                今日のコラムを読む →
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
