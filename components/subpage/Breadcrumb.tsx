// ============================================================
// SO WHAT Pick — パンくずリスト
// ============================================================

import Link from 'next/link'

export type BreadcrumbItem = {
  label: string
  href?: string
}

type Props = {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: Props) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `https://pick.sowhat.monster${item.href}` } : {}),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="breadcrumb" aria-label="パンくずリスト">
        <ol className="breadcrumbList">
          {items.map((item, i) => (
            <li key={i} className="breadcrumbItem">
              {i > 0 && <span className="breadcrumbSep" aria-hidden="true">›</span>}
              {item.href ? (
                <Link href={item.href} className="breadcrumbLink">
                  {item.label}
                </Link>
              ) : (
                <span className="breadcrumbCurrent" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
