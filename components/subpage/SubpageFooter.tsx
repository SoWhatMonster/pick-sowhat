// ============================================================
// SO WHAT Pick — 下層ページ共通フッター
// ============================================================

export default function SubpageFooter() {
  return (
    <>
      <div className="drinkingDisclaimer">
        <div className="staticInner">
          <ul className="disclaimerList">
            <li>本サービスは20歳以上の方を対象としています。</li>
            <li>未成年者への酒類の販売および提供は法律で禁止されています。</li>
            <li>妊娠中・授乳中の飲酒はお控えください。</li>
            <li>飲酒運転は法律で禁止されています。</li>
            <li>お酒は適量を楽しみましょう。</li>
          </ul>
        </div>
      </div>
      <footer className="siteFooter">
        <div className="staticInner">
          <a
            href="https://sowhat.monster/"
            target="_blank"
            rel="noopener noreferrer"
            className="footerLogo"
          >
            SO WHAT
          </a>
          <p className="footerCopy">
            © {new Date().getFullYear()} SO WHAT. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}
