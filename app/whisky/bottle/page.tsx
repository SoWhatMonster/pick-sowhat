// ============================================================
// SO WHAT Pick — バックナンバー（今日の1本 履歴）
// app/whisky/bottle/page.tsx
// ============================================================

import type { Metadata } from 'next'
import Link from 'next/link'
import { getTagIcon } from '@/lib/bottleHelper'
import SubpageTopbar from '@/components/subpage/SubpageTopbar'
import SubpageFooter from '@/components/subpage/SubpageFooter'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'バックナンバー | 今日の1本 | SO WHAT Pick',
  description: 'AIが毎日選んだウイスキー・焼酎の「今日の1本」バックナンバー。各銘柄のテイスティングノートや蒸留所情報も掲載。',
  alternates: {
    canonical: 'https://pick.sowhat.monster/whisky/bottle',
  },
}

const PAGE_SIZE = 20

type BacknumberRow = {
  date: string
  slug: string
  ai_comment: string
  name: string
  tags: string[]
}

async function getBacknumber(): Promise<BacknumberRow[]> {
  const today = new Date().toISOString().split('T')[0]
  let rows: BacknumberRow[] = []

  // DB（Postgres設定済みの場合）
  if (process.env.POSTGRES_URL) {
    try {
      const { sql } = await import('@/lib/db')
      const result = await sql<BacknumberRow>`
        SELECT
          df.date::text AS date,
          df.slug,
          df.ai_comment,
          bd.name,
          bd.tags
        FROM daily_featured df
        JOIN bottle_details bd ON df.slug = bd.slug
        ORDER BY df.date DESC
        LIMIT 365
      `
      rows = result.rows
    } catch {
      rows = []
    }
  }

  // 今日のエントリーがなければAPIから取得して先頭に追加
  const hasToday = rows.some((r) => r.date === today)
  if (!hasToday) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://pick.sowhat.monster'
      const res = await fetch(`${baseUrl}/api/daily-featured`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        if (!data.error && data.slug) {
          rows = [
            {
              date:       today,
              slug:       data.slug,
              ai_comment: data.ai_comment ?? '',
              name:       data.name,
              tags:       data.tags ?? [],
            },
            ...rows,
          ]
        }
      }
    } catch {
      // フェッチ失敗はスキップ
    }
  }

  return rows
}

function formatDate(dateStr: string): string {
  // YYYY-MM-DD をローカル日付として解釈
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const weekdays = ['日', '月', '火', '水', '木', '金', '土']
  return `${y}年${m}月${d}日（${weekdays[date.getDay()]}）`
}

type Props = {
  searchParams: { page?: string }
}

export default async function BottleBacknumberPage({ searchParams }: Props) {
  const allRows = await getBacknumber()
  const today   = new Date().toISOString().split('T')[0]

  const totalPages = Math.max(1, Math.ceil(allRows.length / PAGE_SIZE))
  const page       = Math.min(Math.max(1, parseInt(searchParams.page ?? '1', 10) || 1), totalPages)
  const rows       = allRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <main className="bottleBacknumberPage">

      <SubpageTopbar />

      <div className="staticInner">

        <div className="bottleDetailBack">
          <Link href="/whisky" className="bottleDetailBackLink">← ウイスキー・焼酎トップ</Link>
        </div>

        <header className="bottleDetailHeader">
          <h1 className="bottleDetailName">今日の1本 — バックナンバー</h1>
          <p className="bottleBacknumberSub">AIが毎日1本、日替わりで選ぶウイスキー・焼酎。</p>
        </header>

        {allRows.length === 0 ? (
          <p className="bottleBacknumberEmpty">まだデータがありません。</p>
        ) : (
          <>
            <ul className="bottleBacknumberList">
              {rows.map((row) => (
                <li key={row.date} className="bottleBacknumberItem">
                  <Link href={`/whisky/bottle/${row.slug}`} className="bottleBacknumberLink">
                    <span className="bottleBacknumberDate">
                      {row.date === today ? '今日' : formatDate(row.date)}
                    </span>
                    <div className="bottleBacknumberBody">
                      <p className="bottleBacknumberName">
                        <span className="bottleBacknumberIcon">{getTagIcon(row.tags)}</span>
                        {row.name}
                      </p>
                      {row.tags && row.tags.length > 0 && (
                        <div className="bottleBacknumberTags">
                          {row.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="dailyPickTag">{tag}</span>
                          ))}
                        </div>
                      )}
                      {row.ai_comment && (
                        <p className="bottleBacknumberComment">{row.ai_comment}</p>
                      )}
                    </div>
                    <span className="bottleBacknumberArrow">→</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* ── ページネーション ── */}
            {totalPages > 1 && (
              <nav className="backnumberPagination" aria-label="ページネーション">
                {page > 1 && (
                  <Link
                    href={page === 2 ? '/whisky/bottle' : `/whisky/bottle?page=${page - 1}`}
                    className="backnumberPageBtn"
                  >
                    ← 前のページ
                  </Link>
                )}
                <span className="backnumberPageInfo">
                  {page} / {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={`/whisky/bottle?page=${page + 1}`}
                    className="backnumberPageBtn"
                  >
                    次のページ →
                  </Link>
                )}
              </nav>
            )}
          </>
        )}

      </div>

      <SubpageFooter />

    </main>
  )
}
