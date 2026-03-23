// ============================================================
// SubpageNav — 同カテゴリページ横断ナビゲーション（タブ形式）
// ============================================================

import Link from 'next/link'

export type SubpageNavItem = {
  slug: string
  label: string
  emoji?: string
}

type Props = {
  items: SubpageNavItem[]
  basePath: string   // e.g. '/whisky/guide' or '/whisky/scene'
  currentSlug: string
  categoryLabel: string  // e.g. 'スタイルガイド' or 'シーン別'
}

export default function SubpageNav({ items, basePath, currentSlug, categoryLabel }: Props) {
  return (
    <div className="subpageNav">
      <div className="subpageNavScroll">
        <span className="subpageNavCategory">{categoryLabel}</span>
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`${basePath}/${item.slug}`}
            className={`subpageNavItem${item.slug === currentSlug ? ' subpageNavItemActive' : ''}`}
          >
            {item.emoji && <span className="subpageNavEmoji">{item.emoji}</span>}
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
