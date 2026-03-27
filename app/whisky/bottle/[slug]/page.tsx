// ============================================================
// SO WHAT Pick — 銘柄詳細ページ
// app/whisky/bottle/[slug]/page.tsx
// ============================================================

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBottleDetail } from '@/lib/getBottleDetail'
import { getTagIcon } from '@/lib/bottleHelper'
import { buildAmazonUrl, buildRakutenUrl } from '@/lib/affiliate'
import BottleColumn from './BottleColumn'

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const detail = await getBottleDetail(params.slug)
  if (!detail) return { title: '銘柄が見つかりません | SO WHAT Pick' }

  return {
    title: `${detail.name} テイスティングノート | SO WHAT Pick`,
    description: detail.tasting_nose.slice(0, 140),
    alternates: {
      canonical: `https://pick.sowhat.monster/whisky/bottle/${params.slug}`,
    },
    openGraph: {
      title: `${detail.name} | SO WHAT Pick`,
      description: detail.tasting_nose.slice(0, 120),
      url: `https://pick.sowhat.monster/whisky/bottle/${params.slug}`,
      siteName: 'SO WHAT Pick',
      locale: 'ja_JP',
      type: 'article',
      ...(detail.image_url ? { images: [{ url: detail.image_url }] } : {}),
    },
  }
}

export default async function BottleDetailPage({ params }: Props) {
  const detail = await getBottleDetail(params.slug)
  if (!detail) notFound()

  const amazonTag    = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG ?? ''
  const rakutenAfId  = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID ?? ''
  const categoryIcon = getTagIcon(detail.tags)
  const hasImage     = !!detail.image_url

  return (
    <main className="bottleDetailPage">

      {/* ── ヒーロー（商品画像あり） ── */}
      {hasImage ? (
        <div className="bottleDetailHero">
          <Image
            src={detail.image_url!}
            alt={detail.name}
            fill
            className="bottleDetailHeroImg"
            priority
            sizes="100vw"
          />
          <div className="bottleDetailHeroOverlay" />
          <div className="bottleDetailHeroContent">
            <div className="staticInner">
              <span className="bottleDetailCategoryIcon">{categoryIcon}</span>
              {detail.tags.length > 0 && (
                <div className="bottleDetailTags">
                  {detail.tags.map((tag) => (
                    <span key={tag} className="dailyPickTag">{tag}</span>
                  ))}
                </div>
              )}
              <h1 className="bottleDetailHeroName">{detail.name}</h1>
            </div>
          </div>
        </div>
      ) : (
        /* ── ヒーローなし：シンプルヘッダー ── */
        <div className="bottleDetailSimpleHeader">
          <div className="staticInner">
            <span className="bottleDetailCategoryIcon">{categoryIcon}</span>
            {detail.tags.length > 0 && (
              <div className="bottleDetailTags">
                {detail.tags.map((tag) => (
                  <span key={tag} className="dailyPickTag">{tag}</span>
                ))}
              </div>
            )}
            <h1 className="bottleDetailName">{detail.name}</h1>
          </div>
        </div>
      )}

      <div className="staticInner">

        <div className="bottleDetailBack">
          <Link href="/whisky/bottle" className="bottleDetailBackLink">← バックナンバー</Link>
          <Link href="/whisky"        className="bottleDetailBackLink">← トップ</Link>
        </div>

        {/* ── 購入ボタン ── */}
        <div className="bottleDetailBuyActions">
          <a
            href={buildAmazonUrl(detail.amazon_keyword, amazonTag)}
            target="_blank" rel="noopener noreferrer"
            className="dailyPickAmazon bottleDetailBuyBtn"
          >Amazon で探す</a>
          <a
            href={buildRakutenUrl(detail.rakuten_keyword, rakutenAfId)}
            target="_blank" rel="noopener noreferrer"
            className="dailyPickRakuten bottleDetailBuyBtn"
          >楽天で探す</a>
        </div>

        {/* ── コラム ── */}
        <BottleColumn slug={params.slug} name={detail.name} tags={detail.tags} />

        {/* ── テイスティングノート ── */}
        <section className="bottleDetailSection" aria-label="テイスティングノート">
          <h2 className="bottleDetailSectionTitle">テイスティングノート</h2>
          <dl className="bottleDetailNotes">
            {detail.tasting_nose && (
              <div className="bottleDetailNote">
                <dt className="bottleDetailNoteLabel">香り (Nose)</dt>
                <dd className="bottleDetailNoteText">{detail.tasting_nose}</dd>
              </div>
            )}
            {detail.tasting_palate && (
              <div className="bottleDetailNote">
                <dt className="bottleDetailNoteLabel">味わい (Palate)</dt>
                <dd className="bottleDetailNoteText">{detail.tasting_palate}</dd>
              </div>
            )}
            {detail.tasting_finish && (
              <div className="bottleDetailNote">
                <dt className="bottleDetailNoteLabel">余韻 (Finish)</dt>
                <dd className="bottleDetailNoteText">{detail.tasting_finish}</dd>
              </div>
            )}
          </dl>
        </section>

        {detail.distillery_bg && (
          <section className="bottleDetailSection" aria-label="産地・蒸留所">
            <h2 className="bottleDetailSectionTitle">産地・蒸留所について</h2>
            <p className="bottleDetailBody">{detail.distillery_bg}</p>
          </section>
        )}

        {detail.how_to_drink && (
          <section className="bottleDetailSection" aria-label="飲み方">
            <h2 className="bottleDetailSectionTitle">飲み方</h2>
            <p className="bottleDetailBody">{detail.how_to_drink}</p>
          </section>
        )}

        {detail.pairing && (
          <section className="bottleDetailSection" aria-label="ペアリング">
            <h2 className="bottleDetailSectionTitle">ペアリング</h2>
            <p className="bottleDetailBody">{detail.pairing}</p>
          </section>
        )}

        <div className="bottleDetailBuyActions bottleDetailBuyActionsBottom">
          <a
            href={buildAmazonUrl(detail.amazon_keyword, amazonTag)}
            target="_blank" rel="noopener noreferrer"
            className="dailyPickAmazon bottleDetailBuyBtn"
          >Amazon で探す</a>
          <a
            href={buildRakutenUrl(detail.rakuten_keyword, rakutenAfId)}
            target="_blank" rel="noopener noreferrer"
            className="dailyPickRakuten bottleDetailBuyBtn"
          >楽天で探す</a>
        </div>

        <div className="bottleDetailFooterNav">
          <Link href="/whisky/bottle" className="bottleDetailBackLink">← バックナンバー一覧へ</Link>
        </div>

      </div>
    </main>
  )
}
