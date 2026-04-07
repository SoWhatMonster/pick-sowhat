// ============================================================
// SO WHAT Pick — Journal トップページ
// app/whisky/journal/page.tsx
// ============================================================

import type { Metadata } from 'next'
import Link from 'next/link'
import SubpageTopbar from '@/components/subpage/SubpageTopbar'
import SubpageFooter from '@/components/subpage/SubpageFooter'
import { getAllArticles, formatJournalDate } from '@/lib/journal'

export const metadata: Metadata = {
  title: 'Journal | SO WHAT Pick',
  description: 'ウィスキーと焼酎をめぐる考察。市場・産地・価格・文化について書く。',
  alternates: {
    canonical: 'https://pick.sowhat.monster/whisky/journal',
  },
}

export default function JournalPage() {
  const articles = getAllArticles()

  return (
    <main className="journalPage">
      <SubpageTopbar />

      <div className="staticInner">

        <div className="bottleDetailBack">
          <Link href="/whisky" className="bottleDetailBackLink">← ウイスキー・焼酎トップ</Link>
        </div>

        <header className="journalPageHeader">
          <p className="journalPageLabel">Journal</p>
          <h1 className="journalPageTitle">ウィスキーと焼酎をめぐる考察</h1>
          <p className="journalPageDesc">市場・産地・価格・文化について書く。</p>
        </header>

        {articles.length === 0 ? (
          <p className="journalEmpty">記事はまだありません。</p>
        ) : (
          <div className="journalThumbGrid">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/whisky/journal/${article.slug}`}
                className="journalThumbCard"
              >
                <div className="journalThumbImgWrap journalThumbImgWrap--list">
                  <img
                    src={article.thumbnail}
                    alt={article.title}
                    className="journalThumbImg"
                    loading="lazy"
                  />
                </div>
                <div className="journalThumbBody">
                  <div className="journalThumbMeta">
                    <span className="journalCardCategory">{article.category}</span>
                    <span className="journalCardDate">{formatJournalDate(article.date)}</span>
                  </div>
                  <h2 className="journalThumbTitle">{article.title}</h2>
                  <p className="journalThumbDesc journalThumbDesc--3">{article.description}</p>
                  <span className="journalThumbArrow">読む →</span>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>

      <SubpageFooter />
    </main>
  )
}
