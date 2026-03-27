// ============================================================
// SO WHAT Pick — 銘柄コラム（Client Component）v2
// app/whisky/bottle/[slug]/BottleColumn.tsx
// ============================================================

'use client'

import { useEffect, useState } from 'react'

type Props = {
  slug: string
  name: string
  tags: string[]
}

function formatDisplayDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return `${y}年${m}月${d}日`
}

export default function BottleColumn({ slug, name, tags }: Props) {
  const [title, setTitle]     = useState<string | null>(null)
  const [column, setColumn]   = useState<string | null>(null)
  const [date, setDate]       = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams({ slug, name, tags: tags.join(',') })

    fetch(`/api/bottle-column?${params}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.error && d.column) {
          setTitle(d.title ?? null)
          setColumn(d.column)
          setDate(d.date)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug, name, tags])

  // ローディング中：スケルトン
  if (loading) {
    return (
      <div className="bottleColumn bottleColumnLoading">
        <div className="bottleColumnSkeleton bottleColumnSkeleton--short" style={{ width: '40%', marginBottom: '1rem' }} />
        <div className="bottleColumnSkeleton bottleColumnSkeleton--title" />
        <div className="bottleColumnSkeleton" />
        <div className="bottleColumnSkeleton bottleColumnSkeleton--short" />
        <div className="bottleColumnSkeleton" />
      </div>
    )
  }

  // 生成失敗：非表示
  if (!column) return null

  // 改行（\n）ごとに1段落として分割、空行はスキップ
  const lines = column.split('\n').filter((l) => l.trim() !== '')

  return (
    <div className="bottleColumn">
      {date && (
        <p className="bottleColumnDate">{formatDisplayDate(date)}</p>
      )}
      {title && (
        <h2 className="bottleColumnTitle">{title}</h2>
      )}
      <div className="bottleColumnBody">
        {lines.map((line, i) => (
          <p key={i} className="bottleColumnPara">{line}</p>
        ))}
      </div>
    </div>
  )
}
