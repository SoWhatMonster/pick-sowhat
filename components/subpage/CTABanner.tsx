// ============================================================
// SO WHAT Pick — 診断ツールへのCTAバナー（下層ページ共通）
// ============================================================

import Link from 'next/link'

export default function CTABanner() {
  return (
    <section className="subCTABanner" aria-label="AI診断">
      <div className="subCTAInner">
        <p className="subCTAText">あなたにぴったりの1本をAIが選ぶ</p>
        <Link href="/whisky" className="subCTABtn">
          今すぐ診断する →
        </Link>
      </div>
    </section>
  )
}
