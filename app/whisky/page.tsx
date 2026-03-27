import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import StepFlow from '@/components/pick/StepFlow'
import DailyFeatured from './DailyFeatured'
import DailyPicks from './DailyPicks'
import SceneCarousel from './SceneCarousel'

export const metadata: Metadata = {
  title: 'ウイスキー・焼酎AIレコメンド | AIが選ぶあなただけの1本 | SO WHAT Pick',
  description:
    'ウイスキー・焼酎をAIが診断してレコメンド。シーン・気分・フレーバーを入力するだけで、AIがあなたにぴったりの銘柄を3本提案。ギフト選びにも対応。Amazon・楽天でそのまま購入できます。',
  keywords: [
    'ウイスキー AI おすすめ',
    '焼酎 AI 診断',
    'ウイスキー 診断',
    'ウイスキー おすすめ 初心者',
    'AIチョイス ウイスキー',
    'ウイスキー ギフト AI',
    '焼酎 銘柄 おすすめ',
    'ウイスキー 選び方',
    'ウイスキー ギフト',
    'ジャパニーズウイスキー 選び方',
  ],
  alternates: {
    canonical: 'https://pick.sowhat.monster/whisky',
  },
  openGraph: {
    title: 'ウイスキー・焼酎AIレコメンド | SO WHAT Pick',
    description:
      'AIがあなたにぴったりのウイスキー・焼酎を診断。シーン・気分・フレーバーを入力するだけ。',
    url: 'https://pick.sowhat.monster/whisky',
    siteName: 'SO WHAT Pick',
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: 'https://pick.sowhat.monster/og-whisky.png',
        width: 1200,
        height: 630,
        alt: 'ウイスキー・焼酎AIレコメンド | SO WHAT Pick',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ウイスキー・焼酎AIレコメンド | SO WHAT Pick',
    description: 'AIがあなたにぴったりのウイスキー・焼酎を診断。シーン・気分・フレーバーを入力するだけ。',
    images: ['https://pick.sowhat.monster/og-whisky.png'],
  },
}

const webAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SO WHAT Pick — Whisky & Shochu',
  url: 'https://pick.sowhat.monster/whisky',
  description:
    'シーン・気分・フレーバーをもとにウイスキー・焼酎をAIがレコメンドする無料ツール。自分用・ギフト用の両方に対応。',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Web',
  inLanguage: 'ja',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'JPY',
  },
  publisher: {
    '@type': 'Organization',
    name: 'SO WHAT',
    url: 'https://sowhat.monster/',
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'ウイスキーの選び方がわからない場合はどうすればいいですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SO WHAT Pickでは、シーン・気分・フレーバーの好みを入力するだけで、あなたにぴったりのウイスキーを3本AIが診断・レコメンドします。アイラ・ハイランド・ジャパニーズなど産地やスタイルのこだわりも指定できます。初心者の方にも最適です。',
      },
    },
    {
      '@type': 'Question',
      name: 'ウイスキーをギフトとして選ぶには？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ギフトモードを選択すると、贈る相手の年代・関係性・経験値をもとに最適なウイスキーや焼酎を提案します。誕生日・記念日・お中元・お歳暮など各種ギフトシーンに対応しています。',
      },
    },
    {
      '@type': 'Question',
      name: '焼酎のおすすめも診断できますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい。ウイスキーだけでなく焼酎も診断できます。鹿児島・宮崎・球磨など産地、芋・麦・米・黒糖などの原料、熟成スタイルといったこだわりも細かく指定できます。',
      },
    },
    {
      '@type': 'Question',
      name: '選んだボトルはどこで購入できますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'レコメンド結果画面からAmazonまたは楽天市場の検索ページに直接リンクしています。そのままオンラインで購入できます。',
      },
    },
  ],
}

const STYLE_CARDS = [
  { slug: 'scotch',       icon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', name: 'スコッチ',           catch: '複雑で奥深い、世界の王道',           brands: 'グレンフィディック、マッカラン',   guidePath: '/whisky/guide/scotch' },
  { slug: 'irish',        icon: '🇮🇪', name: 'アイリッシュ',        catch: 'なめらかで親しみやすい入門酒',         brands: 'ジェムソン、ブッシュミルズ',       guidePath: '/whisky/guide/irish' },
  { slug: 'japanese',     icon: '🇯🇵', name: 'ジャパニーズ',        catch: '繊細で均整、職人の美学',              brands: '山崎、白州、余市',               guidePath: '/whisky/guide/japanese' },
  { slug: 'american',     icon: '🇺🇸', name: 'バーボン＆アメリカン', catch: '甘くてリッチ、アメリカンスピリット',   brands: 'メーカーズマーク、ジャックダニエル', guidePath: '/whisky/guide/bourbon' },
  { slug: 'canadian',     icon: '🇨🇦', name: 'カナディアン',         catch: '軽やかでまろやか、北米の隠れた名酒',  brands: 'クラウンローヤル、カナディアンクラブ', guidePath: '/whisky/guide/canadian' },
  { slug: 'newworld',     icon: '🌍', name: 'ニューワールド',       catch: '台湾・インド・欧州、新世代の挑戦',     brands: 'カバラン、アムルット',            guidePath: '/whisky/guide/newworld' },
  { slug: 'imo',          icon: '🍠', name: '芋焼酎',             catch: '個性的な香り、鹿児島の魂',             brands: '森伊蔵、魔王、伊佐美',           guidePath: '/whisky/guide/imo' },
  { slug: 'mugi',         icon: '🌾', name: '麦焼酎',             catch: 'クセなく飲みやすい万能派',             brands: '二階堂、いいちこ',               guidePath: '/whisky/guide/mugi' },
  { slug: 'kome',         icon: '🍚', name: '米焼酎',             catch: '上品な甘さ、熊本の誇り',              brands: '球磨焼酎、繊月',                guidePath: '/whisky/guide/kome' },
  { slug: 'kokuto',       icon: '🍬', name: '黒糖焼酎',           catch: '奄美だけの希少な甘さ',                brands: '里の曙、にしの誉',               guidePath: '/whisky/guide/kokuto' },
  { slug: 'other-shochu', icon: '🌿', name: 'その他の焼酎',        catch: 'そば・栗・泡盛、個性派ぞろい',         brands: '雲海（そば）、池の露（栗）',       guidePath: '/whisky/guide/other-shochu' },
]

const SCENE_CARDS = [
  { icon: '🔰', name: '初めてウイスキーを飲む',    catch: 'やさしくて飲みやすい入門',       styles: 'アイリッシュ、ハイランド',          scenePath: '/whisky/scene/beginner' },
  { icon: '🌙', name: '夜、ひとりで静かに',         catch: 'スモーキーで落ち着く1本を',      styles: 'アイラスコッチ、芋焼酎',            scenePath: '/whisky/scene/solo-night' },
  { icon: '😮‍💨', name: '仕事終わりの一杯',         catch: 'さっと飲める、軽めのやつ',       styles: '米焼酎、グレーンウイスキー',         scenePath: '/whisky/scene/after-work' },
  { icon: '🍽️', name: '食事に合わせたい',          catch: '料理を邪魔しない1本',            styles: 'アイリッシュ、麦焼酎',             scenePath: '/whisky/scene/food-pairing' },
  { icon: '🫧', name: 'ハイボールにおすすめ',       catch: '炭酸で映える、さっぱり系を',     styles: 'グレーン、バーボン、麦焼酎',         scenePath: '/whisky/scene/highball' },
  { icon: '🔥', name: 'BBQ・アウトドア',            catch: '外飲みで盛り上がる1本',          styles: 'バーボン、グレーン',               scenePath: '/whisky/scene/outdoor' },
  { icon: '♨️', name: '冬にホットで飲む',           catch: '温かく体に染みる1本',            styles: 'アイリッシュ、ジャパニーズ',         scenePath: '/whisky/scene/winter-night' },
  { icon: '🌸', name: '女性が自分用に選ぶ',         catch: '甘くて華やか、自分へのご褒美に',  styles: 'フルーティスコッチ、ジャパニーズ',   scenePath: '/whisky/scene/womens-pick' },
  { icon: '🎁', name: '手土産・ちょっとしたギフト', catch: '見栄えよく、予算5,000円以内',     styles: 'バーボン、ジャパニーズ',            scenePath: '/whisky/scene/gift' },
  { icon: '👔', name: '父の日・敬老の日',            catch: '贈って外さない定番を',           styles: 'ジャパニーズ、スコッチ',            scenePath: '/whisky/scene/fathers-day' },
  { icon: '🥂', name: '記念日・特別な夜',            catch: '少し奮発するならこれ',           styles: '山崎・白州・マッカラン',             scenePath: '/whisky/scene/special' },
]

export default function WhiskyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <StepFlow />

      {/* ── 今日の1本 ── */}
      <DailyFeatured />

      {/* ── Phase 3：今日のおすすめ10本 ── */}
      <Suspense fallback={null}>
        <DailyPicks />
      </Suspense>

      {/* ── Phase 1：産地・スタイルガイド ── */}
      <section className="staticSection styleGuideSection" aria-label="スタイルガイド">
        <div className="staticInner">
          <div className="sectionHead">
            <h2 className="sectionTitle">ウイスキー＆焼酎 スタイルガイド</h2>
            <p className="sectionSub">Find your style.</p>
          </div>
          <div className="styleGrid">
            {STYLE_CARDS.map((c) =>
              c.guidePath ? (
                <Link key={c.slug} href={c.guidePath} className="styleCard styleCardLink" data-slug={c.slug}>
                  <span className="styleIcon">{c.icon}</span>
                  <h3 className="styleName">{c.name}</h3>
                  <p className="styleCatch">{c.catch}</p>
                  <p className="styleBrands">{c.brands}</p>
                  <span className="styleArrow">詳しく →</span>
                </Link>
              ) : (
                <div key={c.slug} className="styleCard" data-slug={c.slug}>
                  <span className="styleIcon">{c.icon}</span>
                  <h3 className="styleName">{c.name}</h3>
                  <p className="styleCatch">{c.catch}</p>
                  <p className="styleBrands">{c.brands}</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── Phase 1：シーン別おすすめ ── */}
      <section className="staticSection sceneSectionOuter" aria-label="シーン別おすすめ">
        <div className="staticInner">
          <div className="sectionHead">
            <h2 className="sectionTitle">シーン別おすすめ</h2>
            <p className="sectionSub">The right bottle for every moment.</p>
          </div>
          <SceneCarousel cards={SCENE_CARDS} />
        </div>
      </section>

      {/* ── SEOテキスト ── */}
      <section className="staticSection seoSection" aria-label="サービス説明">
        <div className="staticInner">
          <p className="seoText">
            ウイスキーや焼酎選びに迷ったら、SO WHAT Pickにおまかせください。好みのフレーバーや予算、シーンを入力するだけで、AIがぴったりの1本をレコメンドします。
          </p>
          <p className="seoText">
            ウイスキーの産地で選ぶなら、スコットランド（スコッチ）・アメリカ（バーボン）・日本（ジャパニーズ）・アイルランド（アイリッシュ）が4大産地。焼酎は芋・麦・米・黒糖・そばなど原料で個性が大きく変わります。
          </p>
          <p className="seoText">
            初めてウイスキーを選ぶ方には、クセが少なく飲みやすいアイリッシュウイスキーやジャパニーズウイスキーがおすすめ。ギフトには、見栄えのいいボックス入りのジャパニーズウイスキーや、バーボンの定番銘柄が人気です。
          </p>
          <p className="seoText">
            SO WHAT Pickは、あなたの「今」に合ったウイスキーや焼酎をAIが診断するレコメンドツールです。「ウイスキーをAIに選んでもらいたい」「焼酎のおすすめをAIに聞きたい」——そんなニーズに、シーン・フレーバー・予算の3ステップで応えます。
          </p>
          <p className="seoText">
            同じ条件を入力しても、AIが季節や気分のニュアンスを読んで毎回異なる提案をします。「今日のおすすめ」は毎日更新。日替わりでAIが選んだ10本をチェックするだけでも、新しいウイスキーや焼酎との出会いがあります。
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="staticSection faqSection" aria-label="よくある質問">
        <div className="staticInner">
          <div className="sectionHead">
            <h2 className="sectionTitle">よくある質問</h2>
            <p className="sectionSub">FAQ</p>
          </div>
          <dl className="faqList">
            {[
              { q: 'AIはどうやってレコメンドしますか？', a: '入力されたフレーバー・シーン・予算をもとに、Anthropic Claude APIがリアルタイムで最適な銘柄を提案します。' },
              { q: '焼酎も選べますか？', a: 'はい。芋・麦・米・黒糖焼酎に対応しています。' },
              { q: '購入はどこでできますか？', a: '各レコメンド結果にAmazon・楽天へのリンクを表示します。' },
              { q: 'スコッチとバーボンの違いは？', a: 'スコッチはスコットランド産で麦芽を原料とした深みある風味が特徴。バーボンはアメリカ産でトウモロコシ主体の甘くリッチな味わいです。' },
              { q: 'ウイスキーと焼酎、どちらが飲みやすいですか？', a: '一般的に焼酎（特に麦・米）はクセが少なく飲みやすい傾向があります。ウイスキーではアイリッシュが初心者向けとされています。' },
              { q: '予算3,000円以内でおすすめはありますか？', a: 'はい。予算の入力欄で「〜2,000円」または「〜5,000円」を選ぶと、その範囲でAIがレコメンドします。' },
              { q: 'ハイボールに合うウイスキーを選べますか？', a: '診断のシーン選択で「食事と合わせたい」を選び、フレーバーで「軽め・ドライ」に設定するとハイボール向きの銘柄が出やすくなります。' },
              { q: '焼酎のギフトも選べますか？', a: 'はい。ギフトモードで「酒の種類：焼酎」を選ぶと、芋・麦・米焼酎の中から相手に合った1本を提案します。' },
              { q: 'AIがウイスキーを選ぶとはどういうこと？', a: 'シーン・フレーバー・予算などの条件をAIが分析し、膨大なウイスキー・焼酎の知識から最適な銘柄を3本提案します。人の好みは十人十色ですが、AIは条件に忠実に、偏りなくおすすめを返します。' },
              { q: 'AI診断は無料ですか？', a: 'はい、完全無料です。何度でも診断できます。' },
              { q: 'ウイスキーのAIレコメンドはどの程度正確ですか？', a: '入力した条件（フレーバー・シーン・予算・経験値）に基づいて提案します。AIのレコメンドはあくまで参考として、最終的な判断はご自身でお願いします。' },
            ].map(({ q, a }) => (
              <div key={q} className="faqItem">
                <dt className="faqQ">{q}</dt>
                <dd className="faqA">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── フィードバック ── */}
      <section className="staticSection feedbackSection" id="feedback" aria-label="フィードバック">
        <div className="staticInner">
          <div className="sectionHead">
            <h2 className="feedbackTitle">
              ご意見をお聞かせください
              <span className="feedbackBeta">BETA</span>
            </h2>
            <p className="feedbackDesc">
              SO WHAT Pick は現在ベータ版です。AIのレコメンド精度・使いやすさ・掲載してほしい銘柄など、気になった点をなんでもお送りください。今後の改善に活かします。
            </p>
          </div>
          <form className="feedbackForm" action="https://formspree.io/f/mlgpkoea" method="POST">
            <input type="email" name="email" placeholder="メールアドレス（任意）" className="feedbackInput" />
            <textarea name="message" placeholder="ご意見・ご要望・気になった点など" required className="feedbackTextarea" />
            <button type="submit" className="feedbackSubmit">送信する →</button>
            <p className="feedbackNote">※ 個人情報は改善目的以外には使用しません</p>
          </form>
        </div>
      </section>

      {/* ── 飲酒注意事項 ── */}
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

      {/* ── フッター ── */}
      <footer className="siteFooter">
        <div className="staticInner">
          <a href="https://sowhat.monster/" target="_blank" rel="noopener noreferrer" className="footerLogo">
            SO WHAT
          </a>
          <p className="footerCopy">© {new Date().getFullYear()} SO WHAT. All rights reserved.</p>
        </div>
      </footer>

      <section aria-label="サービス説明" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>
        <h1>SO WHAT Pick — ウイスキー・焼酎のAIレコメンドツール</h1>
        <p>シーン・気分・フレーバーから、あなたにぴったりのウイスキーや焼酎を3本AIが診断します。自分用はもちろん、誕生日や記念日のギフト選びにも対応。アイラ・ハイランド・スペイサイド・ジャパニーズウイスキーから、芋・麦・米焼酎まで幅広くカバー。産地・スタイル・熟成樽・熟成年数など細かいこだわりも指定できます。レコメンドされたボトルはAmazon・楽天市場でそのまま購入可能です。</p>
        <h2>よくある質問</h2>
        <dl>
          <dt>ウイスキーの選び方がわからない</dt>
          <dd>シーン・フレーバー・予算を入力するだけでAIが最適な1本を診断します。</dd>
          <dt>ウイスキーギフトの選び方は？</dt>
          <dd>ギフトモードで贈る相手の情報を入力すると、相手に合ったウイスキーや焼酎を提案します。</dd>
          <dt>焼酎も選べますか？</dt>
          <dd>はい。芋焼酎・麦焼酎・米焼酎・黒糖焼酎など、焼酎も産地や原料からこだわって選べます。</dd>
        </dl>
      </section>
    </>
  )
}
