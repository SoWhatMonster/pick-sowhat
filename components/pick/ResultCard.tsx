// ============================================================
// SO WHAT Pick — ResultCard
// RESULT: レコメンド結果カード
// ============================================================

'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { TEXT } from '@/constants/ja'
import { buildAmazonUrl, buildRakutenUrl } from '@/lib/affiliate'
import styles from './ResultCard.module.css'

// ボトルシルエットSVG（PA-API利用不可時のフォールバック）
const BottleSVG = ({ rank }: { rank: string }) => {
  const color =
    rank === 'BEST MATCH' ? '#c8fe08' : rank === 'ALSO GREAT' ? '#9a9888' : '#5a5a52'
  return (
    <svg width="28" height="52" viewBox="0 0 28 52" fill="none" aria-hidden="true">
      <rect x="11" y="1" width="6" height="7" rx="1" fill={color} />
      <path
        d="M8 8 Q6 14 6 20 L6 47 Q6 51 14 51 Q22 51 22 47 L22 20 Q22 14 20 8Z"
        fill={color}
      />
      <rect x="8" y="24" width="12" height="9" rx="2" fill="#1a1a18" opacity="0.35" />
    </svg>
  )
}

type ResultCardProps = {
  rank: string
  name: string
  tags: string[]
  description: string
  amazonKeyword: string
  rakutenKeyword: string
  onAmazonClick: () => void
  onRakutenClick: () => void
}

export default function ResultCard({
  rank,
  name,
  tags,
  description,
  amazonKeyword,
  rakutenKeyword,
  onAmazonClick,
  onRakutenClick,
}: ResultCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const amazonTag = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG ?? ''
  const rakutenAfId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID ?? ''

  const amazonUrl = buildAmazonUrl(amazonKeyword, amazonTag)
  const rakutenUrl = buildRakutenUrl(rakutenKeyword, rakutenAfId)

  // PA-APIから画像取得（失敗時はフォールバック）
  useEffect(() => {
    if (!amazonKeyword) return
    fetch(`/api/product-image?keyword=${encodeURIComponent(amazonKeyword)}`)
      .then((r) => r.json())
      .then((data: { imageUrl: string | null }) => {
        if (data.imageUrl) setImageUrl(data.imageUrl)
      })
      .catch(() => {
        // フォールバックのまま
      })
  }, [amazonKeyword])

  const isBestMatch = rank === 'BEST MATCH'

  return (
    <div className={`${styles.card} ${isBestMatch ? styles.top : ''}`}>
      <div className={styles.inner}>
        {/* 商品画像 */}
        <div className={styles.imageWrap}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${name} ${TEXT.result.imageAlt}`}
              width={64}
              height={90}
              className={styles.productImage}
              unoptimized
            />
          ) : (
            <>
              <BottleSVG rank={rank} />
              <span className={styles.imageNote}>{TEXT.result.imageFallbackNote}</span>
            </>
          )}
        </div>

        {/* テキスト情報 */}
        <div className={styles.body}>
          <div className={styles.rank}>{rank}</div>
          <div className={styles.name}>{name}</div>
          <div className={styles.tags}>
            {tags.map((tag, i) => (
              <span key={i} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
          <p className={styles.description}>{description}</p>

          {/* アフィリエイトボタン */}
          <div className={styles.buyBtns}>
            <a
              href={amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.buyBtn}
              onClick={onAmazonClick}
            >
              {TEXT.result.amazon}
            </a>
            <a
              href={rakutenUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.buyBtn} ${styles.rakuten}`}
              onClick={onRakutenClick}
            >
              {TEXT.result.rakuten}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
