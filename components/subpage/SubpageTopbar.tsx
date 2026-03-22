// ============================================================
// SO WHAT Pick — 下層ページ共通トップバー
// ============================================================

import Link from 'next/link'

export default function SubpageTopbar() {
  return (
    <header className="subTopbar">
      <Link href="/whisky" className="subWordmark">
        ✦ SO WHAT Pick
        <span className="subWordmarkSub"> — Whisky &amp; Shochu</span>
      </Link>
    </header>
  )
}
