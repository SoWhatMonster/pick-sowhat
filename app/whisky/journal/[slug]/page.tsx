// ============================================================
// SO WHAT Pick — Journal 記事ページ
// app/whisky/journal/[slug]/page.tsx
// ============================================================

import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SubpageTopbar from '@/components/subpage/SubpageTopbar'
import SubpageFooter from '@/components/subpage/SubpageFooter'
import {
  OilPriceChart,
  HormuzChart,
  CategoryRiskChart,
  PriceTimelineChart,
} from '@/components/journal/IranWarCharts'
import { getArticleBySlug, getAllArticles, formatJournalDate } from '@/lib/journal'

type Props = {
  params: { slug: string }
}

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }))
}

// ── スラッグごとの OG 画像 ─────────────────────────────────────
const OG_IMAGES: Record<string, string> = {
  'iran-war-whisky-price':
    'https://images.unsplash.com/photo-1576373718969-1c6620e2ed49?w=1200&h=630&fit=crop&q=80&auto=format',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticleBySlug(params.slug)
  if (!article) return { title: '記事が見つかりません | SO WHAT Pick' }

  const ogImage = OG_IMAGES[article.slug]
  const canonicalUrl = `https://pick.sowhat.monster/whisky/journal/${article.slug}`

  return {
    title: `${article.title} | Journal | SO WHAT Pick`,
    description: article.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: canonicalUrl,
      siteName: 'SO WHAT Pick',
      locale: 'ja_JP',
      type: 'article',
      publishedTime: article.date,
      ...(article.updatedDate && { modifiedTime: article.updatedDate }),
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: article.title }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      ...(ogImage && { images: [ogImage] }),
    },
  }
}

// ── Unsplash 写真 URL ────────────────────────────────────────
// images.unsplash.com 直接 CDN URL（source.unsplash.com は廃止済み）
const UNSPLASH = (cdnId: string, w: number, h: number) =>
  `https://images.unsplash.com/${cdnId}?w=${w}&h=${h}&fit=crop&q=80&auto=format`

// CDN photo IDs（Unsplash 写真ページの srcset から取得）
const PHOTOS = {
  hero:       'photo-1576373718969-1c6620e2ed49', // グレンリベット ウィスキーボトル
  logistics:  'photo-1632688174100-7ada9b64f241', // コンテナ船
  categories: 'photo-1716720882232-9fa4912f142d', // ウィスキーボトル棚
  premium:    'photo-1737478580339-b6def2f84087', // ウィスキーボトル＆グラス
}

// ── 記事スラッグ別ビジュアル定義 ─────────────────────────────
type VisualMap = Record<string, React.ReactNode>

const VISUALS_BY_SLUG: Record<string, VisualMap> = {
  'iran-war-whisky-price': {
    /* ── チャート ── */
    'CHART:oil-price':  <OilPriceChart />,
    'CHART:hormuz':     <HormuzChart />,
    'CHART:categories': <CategoryRiskChart />,
    'CHART:timeline':   <PriceTimelineChart />,

    /* ── 写真 ── */
    'IMAGE:logistics': (
      <figure className="journalFigure">
        <img
          src={UNSPLASH(PHOTOS.logistics, 800, 280)}
          alt="コンテナ船"
          className="journalFigImg"
          loading="lazy"
        />
        <figcaption className="journalFigCaption">
          喜望峰迂回により、スコットランドから日本への輸送日数は10〜14日以上延長されている。
        </figcaption>
      </figure>
    ),
    'IMAGE:categories': (
      <figure className="journalFigure">
        <img
          src={UNSPLASH(PHOTOS.categories, 800, 280)}
          alt="ウィスキーボトル"
          className="journalFigImg"
          loading="lazy"
        />
        <figcaption className="journalFigCaption">
          スコッチ・バーボン・ジャパニーズ——カテゴリーによって価格上昇の速度と幅は異なる。
        </figcaption>
      </figure>
    ),
    'IMAGE:premium': (
      <figure className="journalFigure">
        <img
          src={UNSPLASH(PHOTOS.premium, 800, 280)}
          alt="プレミアムウィスキー"
          className="journalFigImg"
          loading="lazy"
        />
        <figcaption className="journalFigCaption">
          希少・プレミアムウィスキーは、コスト高騰局面でも需要が底堅く、価格は逆方向に動く可能性がある。
        </figcaption>
      </figure>
    ),
  },
}

// ── ヒーロー画像定義 ──────────────────────────────────────────
const HERO_BY_SLUG: Record<string, React.ReactNode> = {
  'iran-war-whisky-price': (
    <figure className="journalHeroFigure">
      <img
        src={UNSPLASH(PHOTOS.hero, 1200, 400)}
        alt="スコッチウィスキー"
        className="journalHeroImg"
        loading="eager"
      />
      <figcaption className="journalFigCaption">
        スコットランドの蒸留所。イラン戦争が、ここから日本の棚までの道を変えつつある。
      </figcaption>
    </figure>
  ),
}

// ── 本文レンダラー ────────────────────────────────────────────

function renderBoldText(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  if (parts.length === 1) return text
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i}>{part.slice(2, -2)}</strong>
          : part
      )}
    </>
  )
}

function renderBody(body: string, visuals: VisualMap = {}): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  let key = 0
  let headingCount = 0

  const sections = body.split('\n---\n')

  sections.forEach((section, sIdx) => {
    if (sIdx > 0) {
      nodes.push(<hr key={key++} className="journalHr" />)
    }

    const lines = section.trim().split('\n')
    let pLines: string[] = []

    const flushP = () => {
      if (pLines.length === 0) return
      const text = pLines.join(' ')
      nodes.push(
        <p key={key++} className="journalBodyP">
          {renderBoldText(text)}
        </p>
      )
      pLines = []
    }

    for (const line of lines) {
      if (line.startsWith('## ')) {
        flushP()
        headingCount++
        nodes.push(
          <h2 key={key++} id={`h2-${headingCount}`} className="journalBodyH2">
            {line.slice(3)}
          </h2>
        )
      } else if (/^\[(?:IMAGE|CHART|BLOCKQUOTE):[^\]]+\]$/.test(line)) {
        // ビジュアルマーカー: [IMAGE:xxx] / [CHART:xxx] / [BLOCKQUOTE:xxx]
        flushP()
        const markerKey = line.slice(1, -1) // "IMAGE:logistics" etc.
        const visual = visuals[markerKey]
        if (visual) {
          nodes.push(<React.Fragment key={key++}>{visual}</React.Fragment>)
        }
      } else if (line === '') {
        flushP()
      } else {
        pLines.push(line)
      }
    }
    flushP()
  })

  return nodes
}

// ── 記事内目次定義 ────────────────────────────────────────────
type TocEntry = { id: string; label: string }

const ARTICLE_TOC: Record<string, TocEntry[]> = {
  'iran-war-whisky-price': [
    { id: 'h2-1', label: 'はじめに：問いを立てる' },
    { id: 'h2-2', label: '第一の因数：原油高' },
    { id: 'h2-3', label: '第二の因数：物流コストと輸送日数' },
    { id: 'h2-4', label: '第三の因数：円安' },
    { id: 'h2-5', label: '第四の因数：包装資材' },
    { id: 'h2-6', label: '第五の因数：関税' },
    { id: 'h2-7', label: 'カテゴリーごとの上昇幅：どれが最も上がるか' },
    { id: 'h2-8', label: '逆説：希少・プレミアム品は「逆方向」に動く' },
    { id: 'h2-9', label: '結論：いつ、どの程度上がるか' },
  ],
}

// ── YouTube 動画カード定義 ────────────────────────────────────
type VideoCard = {
  title:   string
  channel: string
  url:     string
  thumbId?: string  // YouTube video ID (for thumbnail via img.youtube.com)
}

const ARTICLE_VIDEOS: Record<string, VideoCard[]> = {
  'iran-war-whisky-price': [
    {
      title:   'Strait of Hormuz crisis: Trump Ultimatums, Iran response & rising war fears explained',
      channel: 'Al Jazeera English',
      url:     'https://www.youtube.com/watch?v=HiaheOYucu8',
      thumbId: 'HiaheOYucu8',
    },
    {
      title:   '2025年もウイスキーは賢い投資対象か？ボトルと樽に関する厳しい真実',
      channel: 'Mark Littler',
      url:     'https://www.youtube.com/watch?v=-CYqxLNiTgk',
      thumbId: '-CYqxLNiTgk',
    },
  ],
}

// ── ページコンポーネント ──────────────────────────────────────

export default function JournalArticlePage({ params }: Props) {
  const article = getArticleBySlug(params.slug)
  if (!article) notFound()

  const visuals = VISUALS_BY_SLUG[article.slug] ?? {}
  const heroImage = HERO_BY_SLUG[article.slug] ?? null

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    inLanguage: 'ja',
    publisher: {
      '@type': 'Organization',
      name: 'SO WHAT',
      url: 'https://sowhat.monster/',
    },
  }

  return (
    <main className="journalArticlePage">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <SubpageTopbar />

      <div className="journalArticleInner">

        <div className="bottleDetailBack">
          <Link href="/whisky/journal" className="bottleDetailBackLink">← Journal</Link>
          <Link href="/whisky"         className="bottleDetailBackLink">← トップ</Link>
        </div>

        {/* ── 記事ヘッダー ── */}
        <header className="journalArticleHeader">
          <div className="journalArticleHeaderMeta">
            <span className="journalCardCategory">{article.category}</span>
            <div className="journalDateGroup">
              <time className="journalCardDate" dateTime={article.date}>
                {formatJournalDate(article.date)}<span className="journalDateLabel">公開</span>
              </time>
              {article.updatedDate && (
                <time className="journalCardDate" dateTime={article.updatedDate}>
                  {formatJournalDate(article.updatedDate)}<span className="journalDateLabel">更新</span>
                </time>
              )}
            </div>
          </div>
          <h1 className="journalArticleTitle">{article.title}</h1>
          {/* ヒーロー画像：タイトル直下 */}
          {heroImage}
          {/* ── 記事内目次 ── */}
          {ARTICLE_TOC[article.slug] && (
            <details className="journalToc" open>
              <summary className="journalTocSummary">目次</summary>
              <ol className="journalTocList">
                {ARTICLE_TOC[article.slug].map((entry) => (
                  <li key={entry.id} className="journalTocItem">
                    <a href={`#${entry.id}`} className="journalTocLink">
                      {entry.label}
                    </a>
                  </li>
                ))}
              </ol>
            </details>
          )}
          <p className="journalArticleLead">{article.description}</p>
        </header>

        {/* ── 本文 ── */}
        <article className="journalArticleBody">
          {renderBody(article.body, visuals)}
        </article>

        {/* ── YouTube 動画セクション ── */}
        {ARTICLE_VIDEOS[article.slug] && ARTICLE_VIDEOS[article.slug].length > 0 && (
          <section className="journalVideoSection">
            <h2 className="journalVideoSectionTitle">📺 もっと深く知るための動画</h2>
            <div className="journalVideoCards">
              {ARTICLE_VIDEOS[article.slug].map((video, i) => (
                <a
                  key={i}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="journalVideoCard"
                >
                  <div className="journalVideoThumb">
                    {video.thumbId ? (
                      <img
                        src={`https://img.youtube.com/vi/${video.thumbId}/mqdefault.jpg`}
                        alt={video.title}
                        className="journalVideoThumbImg"
                        loading="lazy"
                      />
                    ) : (
                      <div className="journalVideoThumbPlaceholder">
                        <div className="journalVideoThumbPlayIcon" />
                      </div>
                    )}
                  </div>
                  <div className="journalVideoMeta">
                    <p className="journalVideoCardTitle">{video.title}</p>
                    <p className="journalVideoCardChannel">{video.channel}</p>
                    <span className="journalVideoCardLink">YouTubeで見る →</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ── フッターナビ ── */}
        <div className="bottleDetailFooterNav">
          <Link href="/whisky/journal" className="bottleDetailBackLink">← Journal一覧へ</Link>
        </div>

      </div>

      <SubpageFooter />
    </main>
  )
}
