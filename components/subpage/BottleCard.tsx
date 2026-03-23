// ============================================================
// SO WHAT Pick — 銘柄カード（下層ページ共通）
// アフィリエイトリンク付き
// ============================================================

import { buildAmazonUrl, buildRakutenUrl } from '@/lib/affiliate'

export type BottleData = {
  rank?: number
  name: string
  region?: string          // 産地・種類
  tags: string[]           // 特徴タグ
  reason?: string          // なぜおすすめか（初心者ページなど）
  price: string            // 価格帯（例: "3,500円〜"）
  amazonKeyword: string
  rakutenKeyword: string
  bottleSlug?: string | null  // /public/bottles/ 以下の画像スラッグ
}

type Props = {
  bottle: BottleData
}

const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG ?? ''
const RAKUTEN_ID = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID ?? ''

export default function BottleCard({ bottle }: Props) {
  const amazonUrl = buildAmazonUrl(bottle.amazonKeyword, AMAZON_TAG)
  const rakutenUrl = buildRakutenUrl(bottle.rakutenKeyword, RAKUTEN_ID)
  const imgExt = bottle.bottleSlug === 'chita' ? 'png' : 'jpg'

  return (
    <div className="subBottleCard">
      {/* 画像エリア */}
      <div className="subBottleImgWrap">
        {bottle.bottleSlug ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/bottles/${bottle.bottleSlug}.${imgExt}`}
            alt={bottle.name}
            className="subBottleImg"
          />
        ) : (
          <div className="subBottleImgFallback">🥃</div>
        )}
      </div>

      {/* テキスト */}
      <div className="subBottleBody">
        {bottle.rank && (
          <span className="subBottleRank">#{bottle.rank}</span>
        )}
        <h3 className="subBottleName">{bottle.name}</h3>
        {bottle.region && (
          <p className="subBottleRegion">{bottle.region}</p>
        )}
        {bottle.tags.length > 0 && (
          <div className="subBottleTags">
            {bottle.tags.map((t) => (
              <span key={t} className="subBottleTag">{t}</span>
            ))}
          </div>
        )}
        {bottle.reason && (
          <p className="subBottleReason">{bottle.reason}</p>
        )}
        <p className="subBottlePrice">{bottle.price}</p>
      </div>

      {/* 購入ボタン */}
      <div className="subBottleBtns">
        <a
          href={amazonUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="subBtnAmazon"
        >
          Amazon
        </a>
        <a
          href={rakutenUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="subBtnRakuten"
        >
          楽天
        </a>
      </div>
    </div>
  )
}
