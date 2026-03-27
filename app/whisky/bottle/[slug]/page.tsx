// ============================================================
// SO WHAT Pick — 銘柄詳細ページ
// app/whisky/bottle/[slug]/page.tsx
// ============================================================

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { sql } from '@/lib/db'
import { buildAmazonUrl, buildRakutenUrl } from '@/lib/affiliate'
import type { BottleDetail } from '@/app/api/bottle-detail/route'

type Props = {
  params: { slug: string }
}

// ── DB or オンデマンド生成 ──
async function getBottleDetail(slug: string): Promise<BottleDetail | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) return null

  try {
    const cached = await sql<BottleDetail>`SELECT * FROM bottle_details WHERE slug = ${slug}`
    if (cached.rows.length > 0) return cached.rows[0]

    // daily_featuredに存在するslugかチェック（存在しないslugは404）
    const inFeatured = await sql`SELECT slug FROM daily_featured WHERE slug = ${slug} LIMIT 1`
    if (inFeatured.rows.length === 0) return null

    // オンデマンド生成: /api/bottle-detail を内部呼び出しする代わりに直接生成
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://pick.sowhat.monster'
    const res = await fetch(`${baseUrl}/api/bottle-detail?slug=${slug}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// ── Metadata ──
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const detail = await getBottleDetail(params.slug)
  if (!detail) return { title: '銘柄が見つかりません | SO WHAT Pick' }

  return {
    title: `${detail.name} テイスティングノート | SO WHAT Pick`,
    description: `${detail.tasting_nose ?? ''} ${detail.distillery_bg ?? ''}`.slice(0, 140),
    alternates: {
      canonical: `https://pick.sowhat.monster/whisky/bottle/${params.slug}`,
    },
    openGraph: {
      title: `${detail.name} | SO WHAT Pick`,
      description: `${detail.tasting_nose ?? ''}`.slice(0, 120),
      url: `https://pick.sowhat.monster/whisky/bottle/${params.slug}`,
      siteName: 'SO WHAT Pick',
      locale: 'ja_JP',
      type: 'article',
    },
  }
}

// ── Page ──
export default async function BottleDetailPage({ params }: Props) {
  const detail = await getBottleDetail(params.slug)
  if (!detail) notFound()

  const amazonTag = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG ?? ''
  const rakutenAfId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID ?? ''

  return (
    <main className="bottleDetailPage">
      <div className="staticInner">

        {/* ── 戻るリンク ── */}
        <div className="bottleDetailBack">
          <Link href="/whisky/bottle" className="bottleDetailBackLink">← バックナンバー</Link>
          <Link href="/whisky" className="bottleDetailBackLink">← トップ</Link>
        </div>

        {/* ── ヘッダー ── */}
        <header className="bottleDetailHeader">
          {detail.tags && detail.tags.length > 0 && (
            <div className="bottleDetailTags">
              {detail.tags.map((tag) => (
                <span key={tag} className="dailyPickTag">{tag}</span>
              ))}
            </div>
          )}
          <h1 className="bottleDetailName">{detail.name}</h1>
        </header>

        {/* ── 購入ボタン ── */}
        <div className="bottleDetailBuyActions">
          <a
            href={buildAmazonUrl(detail.amazon_keyword, amazonTag)}
            target="_blank"
            rel="noopener noreferrer"
            className="dailyPickAmazon bottleDetailBuyBtn"
          >Amazon で探す</a>
          <a
            href={buildRakutenUrl(detail.rakuten_keyword, rakutenAfId)}
            target="_blank"
            rel="noopener noreferrer"
            className="dailyPickRakuten bottleDetailBuyBtn"
          >楽天で探す</a>
        </div>

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

        {/* ── 蒸留所・産地 ── */}
        {detail.distillery_bg && (
          <section className="bottleDetailSection" aria-label="産地・蒸留所">
            <h2 className="bottleDetailSectionTitle">産地・蒸留所について</h2>
            <p className="bottleDetailBody">{detail.distillery_bg}</p>
          </section>
        )}

        {/* ── 飲み方 ── */}
        {detail.how_to_drink && (
          <section className="bottleDetailSection" aria-label="飲み方">
            <h2 className="bottleDetailSectionTitle">飲み方</h2>
            <p className="bottleDetailBody">{detail.how_to_drink}</p>
          </section>
        )}

        {/* ── ペアリング ── */}
        {detail.pairing && (
          <section className="bottleDetailSection" aria-label="ペアリング">
            <h2 className="bottleDetailSectionTitle">ペアリング</h2>
            <p className="bottleDetailBody">{detail.pairing}</p>
          </section>
        )}

        {/* ── 購入ボタン（下） ── */}
        <div className="bottleDetailBuyActions bottleDetailBuyActionsBottom">
          <a
            href={buildAmazonUrl(detail.amazon_keyword, amazonTag)}
            target="_blank"
            rel="noopener noreferrer"
            className="dailyPickAmazon bottleDetailBuyBtn"
          >Amazon で探す</a>
          <a
            href={buildRakutenUrl(detail.rakuten_keyword, rakutenAfId)}
            target="_blank"
            rel="noopener noreferrer"
            className="dailyPickRakuten bottleDetailBuyBtn"
          >楽天で探す</a>
        </div>

        {/* ── フッターナビ ── */}
        <div className="bottleDetailFooterNav">
          <Link href="/whisky/bottle" className="bottleDetailBackLink">← バックナンバー一覧へ</Link>
        </div>

      </div>
    </main>
  )
}
