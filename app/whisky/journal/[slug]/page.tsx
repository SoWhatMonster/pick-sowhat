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
} from '@/components/journal/IranWarCharts'
import { getArticleBySlug, getAllArticles, formatJournalDate } from '@/lib/journal'

type Props = {
  params: { slug: string }
}

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticleBySlug(params.slug)
  if (!article) return { title: '記事が見つかりません | SO WHAT Pick' }

  return {
    title: `${article.title} | Journal | SO WHAT Pick`,
    description: article.description,
    alternates: {
      canonical: `https://pick.sowhat.monster/whisky/journal/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `https://pick.sowhat.monster/whisky/journal/${article.slug}`,
      siteName: 'SO WHAT Pick',
      locale: 'ja_JP',
      type: 'article',
      publishedTime: article.date,
    },
  }
}

// ── Unsplash 写真 URL ────────────────────────────────────────
// images.unsplash.com 直接 CDN URL（source.unsplash.com は廃止済み）
const UNSPLASH = (cdnId: string, w: number, h: number) =>
  `https://images.unsplash.com/${cdnId}?w=${w}&h=${h}&fit=crop&q=80&auto=format`

// CDN photo IDs（Unsplash 写真ページの srcset から取得）
const PHOTOS = {
  hero:       'photo-1487621167305-5d248087c724', // グレンリベット ウィスキーボトル
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
        nodes.push(<h2 key={key++} className="journalBodyH2">{line.slice(3)}</h2>)
      } else if (/^\[(?:IMAGE|CHART):[^\]]+\]$/.test(line)) {
        // ビジュアルマーカー: [IMAGE:xxx] / [CHART:xxx]
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
            <time className="journalCardDate" dateTime={article.date}>
              {formatJournalDate(article.date)}
            </time>
          </div>
          <h1 className="journalArticleTitle">{article.title}</h1>
          {/* ヒーロー画像：タイトル直下・リード文の上 */}
          {heroImage}
          <p className="journalArticleLead">{article.description}</p>
        </header>

        {/* ── 本文 ── */}
        <article className="journalArticleBody">
          {renderBody(article.body, visuals)}
        </article>

        {/* ── フッターナビ ── */}
        <div className="bottleDetailFooterNav">
          <Link href="/whisky/journal" className="bottleDetailBackLink">← Journal一覧へ</Link>
        </div>

      </div>

      <SubpageFooter />
    </main>
  )
}
