// ============================================================
// SO WHAT Pick — Journal 記事ページ
// app/whisky/journal/[slug]/page.tsx
// ============================================================

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SubpageTopbar from '@/components/subpage/SubpageTopbar'
import SubpageFooter from '@/components/subpage/SubpageFooter'
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

// ── 本文レンダラー ──

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

function renderBody(body: string): React.ReactNode[] {
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

export default function JournalArticlePage({ params }: Props) {
  const article = getArticleBySlug(params.slug)
  if (!article) notFound()

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
          <p className="journalArticleLead">{article.description}</p>
        </header>

        {/* ── 本文 ── */}
        <article className="journalArticleBody">
          {renderBody(article.body)}
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
