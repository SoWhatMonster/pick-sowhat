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
const RANK_ORDER: Record<string, number> = {
  'BEST MATCH': 0,
  'RUNNER UP':  1,
  'ALSO GREAT': 2,
  'HIDDEN GEM': 3,
  'WILD CARD':  4,
}

const BottleSVG = ({ rank }: { rank: string }) => {
  const isBest = rank === 'BEST MATCH'
  const idx = RANK_ORDER[rank] ?? 4
  const color = idx === 0 ? '#c8fe08' : idx === 1 ? '#b0b8a0' : idx === 2 ? '#9a9888' : '#5a5a52'
  return (
    <svg width="36" height="68" viewBox="0 0 36 68" fill="none" aria-hidden="true">
      {/* ネック */}
      <rect x="14" y="1" width="8" height="10" rx="2" fill={color} opacity="0.9" />
      {/* ショルダー */}
      <path d="M10 11 Q8 18 8 26 L8 60 Q8 67 18 67 Q28 67 28 60 L28 26 Q28 18 26 11Z" fill={color} opacity="0.85" />
      {/* ラベル */}
      <rect x="10" y="32" width="16" height="14" rx="3" fill="#1a1a18" opacity="0.45" />
      {/* ラベル上のライン */}
      <rect x="12" y="35" width="12" height="1.5" rx="1" fill={color} opacity="0.5" />
      <rect x="13" y="38" width="10" height="1" rx="1" fill={color} opacity="0.3" />
      <rect x="13" y="41" width="10" height="1" rx="1" fill={color} opacity="0.3" />
      {/* キャップ */}
      <rect x="15" y="0" width="6" height="3" rx="1" fill={color} />
      {/* BEST MATCHのみグロー */}
      {isBest && (
        <ellipse cx="18" cy="67" rx="10" ry="3" fill="#c8fe08" opacity="0.15" />
      )}
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
  const rankIndex = RANK_ORDER[rank] ?? 4

  const rankBadgeClass =
    isBestMatch ? styles.rankBadgeBest :
    rankIndex <= 1 ? styles.rankBadgeAlso :
    styles.rankBadgeWild

  return (
    <div
      className={`${styles.card} ${isBestMatch ? styles.top : ''} ${styles.cardAnimate}`}
      style={{ animationDelay: `${rankIndex * 0.1}s` }}
    >
      {/* 画像エリア */}
      <div className={`${styles.imageWrap} ${isBestMatch ? styles.imageWrapBest : ''}`}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${name} ${TEXT.result.imageAlt}`}
            width={80}
            height={110}
            className={styles.productImage}
            unoptimized
          />
        ) : (
          <BottleSVG rank={rank} />
        )}
        <div className={`${styles.rankBadge} ${rankBadgeClass}`}>
          {isBestMatch ? `★ ${rank}` : rank}
        </div>
      </div>

      {/* 情報エリア */}
      <div className={styles.body}>
        <div className={styles.name}>{name}</div>
        <div className={styles.tags}>
          {tags.map((tag, i) => (
            <span key={i} className={styles.tag}>{tag}</span>
          ))}
        </div>
        <p className={styles.description}>{description}</p>
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
  )
}
