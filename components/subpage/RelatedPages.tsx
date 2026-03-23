// ============================================================
// RelatedPages — 同カテゴリ関連ページカードグリッド（ページ下部）
// ============================================================

import Link from 'next/link'

export type RelatedPageItem = {
  slug: string
  label: string
  emoji?: string
  desc: string
}

type Props = {
  items: RelatedPageItem[]
  basePath: string
  currentSlug: string
  title?: string
}

export default function RelatedPages({
  items,
  basePath,
  currentSlug,
  title = '他のガイドを見る',
}: Props) {
  // 現在ページを除いた最大4件
  const related = items.filter((i) => i.slug !== currentSlug).slice(0, 4)
  if (related.length === 0) return null

  return (
    <section className="subSection subRelatedSection">
      <div className="subInner">
        <h2 className="subSectionTitle">{title}</h2>
        <div className="relatedGrid">
          {related.map((item) => (
            <Link
              key={item.slug}
              href={`${basePath}/${item.slug}`}
              className="relatedCard"
            >
              {item.emoji && <span className="relatedEmoji">{item.emoji}</span>}
              <p className="relatedLabel">{item.label}</p>
              <p className="relatedDesc">{item.desc}</p>
              <span className="relatedArrow">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
