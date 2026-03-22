import type { Metadata } from 'next'
import StepFlow from '@/components/pick/StepFlow'

export const metadata: Metadata = {
  title: 'SO WHAT Pick — Whisky & Shochu | 今、最高の1本を見つける',
  description:
    'シーン・気分・フレーバーから、あなたにぴったりのウイスキー・焼酎を3本AIがレコメンド。ギフト選びにも対応。アイラ・ジャパニーズ・バーボン・芋焼酎など幅広く対応。Amazon・楽天でそのまま購入できます。',
  keywords: [
    'ウイスキー おすすめ',
    'ウイスキー 選び方',
    'ウイスキー 診断',
    'ウイスキー ギフト',
    '焼酎 おすすめ',
    '焼酎 選び方',
    '焼酎 ギフト',
    'ウイスキー AI',
    'ウイスキー 初心者',
    'ジャパニーズウイスキー 選び方',
  ],
  alternates: {
    canonical: 'https://pick.sowhat.monster/whisky',
    // Phase 2: { en: 'https://pick.sowhat.monster/en/whisky' }
  },
  openGraph: {
    title: 'SO WHAT Pick — Whisky & Shochu | 今、最高の1本を見つける',
    description:
      'シーン・気分・フレーバーから、あなたにぴったりのウイスキー・焼酎を3本AIがレコメンド。ギフト選びにも対応。',
    url: 'https://pick.sowhat.monster/whisky',
    siteName: 'SO WHAT Pick',
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: '/og-whisky.png',
        width: 1200,
        height: 630,
        alt: 'SO WHAT Pick — Whisky & Shochu | Find Your Perfect Bottle.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SO WHAT Pick — Whisky & Shochu',
    description: 'シーン・気分・フレーバーから、あなたにぴったりのウイスキー・焼酎をAIがレコメンド。',
    images: ['/og-whisky.png'],
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
  { slug: 'scotch',    icon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', name: 'スコッチ',         catch: '複雑で奥深い、世界の王道',           brands: 'グレンフィディック、マッカラン' },
  { slug: 'irish',     icon: '🇮🇪', name: 'アイリッシュ',      catch: 'なめらかで親しみやすい入門酒',         brands: 'ジェムソン、ブッシュミルズ' },
  { slug: 'japanese',  icon: '🇯🇵', name: 'ジャパニーズ',      catch: '繊細で均整、職人の美学',              brands: '山崎、白州、余市' },
  { slug: 'american',  icon: '🇺🇸', name: 'バーボン＆アメリカン', catch: '甘くてリッチ、アメリカンスピリット',    brands: 'メーカーズマーク、ジャックダニエル' },
  { slug: 'newworld',  icon: '🌍', name: 'ニューワールド',    catch: '台湾・インド・欧州、新世代の挑戦',       brands: 'カバラン、アムルット' },
  { slug: 'imo',       icon: '🍠', name: '芋焼酎',           catch: '個性的な香り、鹿児島の魂',             brands: '森伊蔵、魔王、伊佐美' },
  { slug: 'mugi',      icon: '🌾', name: '麦焼酎',           catch: 'クセなく飲みやすい万能派',              brands: '二階堂、いいちこ' },
  { slug: 'kome',      icon: '🍚', name: '米焼酎',           catch: '上品な甘さ、熊本の誇り',               brands: '球磨焼酎、繊月' },
  { slug: 'kokuto',    icon: '🍬', name: '黒糖焼酎',         catch: '奄美だけの希少な甘さ',                 brands: '里の曙、にしの誉' },
  { slug: 'other-shochu', icon: '🌿', name: 'その他の焼酎',  catch: 'そば・栗・泡盛、個性派ぞろい',          brands: '雲海（そば）、池の露（栗）' },
]

const SCENE_CARDS = [
  { icon: '🔰', name: '初めてウイスキーを飲む',  catch: 'やさしくて飲みやすい入門',      styles: 'アイリッシュ、ハイランド' },
  { icon: '🌙', name: '夜、ひとりで静かに',       catch: 'スモーキーで落ち着く1本を',     styles: 'アイラスコッチ、芋焼酎' },
  { icon: '😮‍💨', name: '仕事終わりの一杯',       catch: 'さっと飲める、軽めのやつ',      styles: '米焼酎、グレーンウイスキー' },
  { icon: '🍽️', name: '食事に合わせたい',        catch: '料理を邪魔しない1本',           styles: 'アイリッシュ、麦焼酎' },
  { icon: '🫧', name: 'ハイボールにおすすめ',     catch: '炭酸で映える、さっぱり系を',    styles: 'グレーン、バーボン、麦焼酎' },
  { icon: '🔥', name: 'BBQ・アウトドア',          catch: '外飲みで盛り上がる1本',         styles: 'バーボン、グレーン' },
  { icon: '♨️', name: '冬にホットで飲む',         catch: '温かく体に染みる1本',           styles: 'アイリッシュ、ジャパニーズ' },
  { icon: '🌸', name: '女性が自分用に選ぶ',       catch: '甘くて華やか、自分へのご褒美に', styles: 'フルーティスコッチ、ジャパニーズ' },
  { icon: '🎁', name: '手土産・ちょっとしたギフト', catch: '見栄えよく、予算5,000円以内',  styles: 'バーボン、ジャパニーズ' },
  { icon: '👔', name: '父の日・敬老の日',          catch: '贈って外さない定番を',          styles: 'ジャパニーズ、スコッチ' },
  { icon: '🥂', name: '記念日・特別な夜',          catch: '少し奮発するならこれ',          styles: '山崎・白州・マッカラン' },
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

      {/* ── Phase 1：産地・スタイルガイド ── */}
      <section className="staticSection styleGuideSection" aria-label="スタイルガイド">
        <div className="staticInner">
          <div className="sectionHead">
            <h2 className="sectionTitle">ウイスキー＆焼酎 スタイルガイド</h2>
            <p className="sectionSub">Find your style.</p>
          </div>
          <div className="styleGrid">
            {STYLE_CARDS.map((c) => (
              <div key={c.slug} className="styleCard" data-slug={c.slug}>
                <span className="styleIcon">{c.icon}</span>
                <h3 className="styleName">{c.name}</h3>
                <p className="styleCatch">{c.catch}</p>
                <p className="styleBrands">{c.brands}</p>
              </div>
            ))}
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
          <div className="sceneScrollWrapper">
            <div className="sceneGrid">
              {SCENE_CARDS.map((c) => (
                <div key={c.name} className="sceneCard">
                  <span className="sceneIcon">{c.icon}</span>
                  <p className="sceneName">{c.name}</p>
                  <p className="sceneCatch">{c.catch}</p>
                  <p className="sceneStyles">{c.styles}</p>
                </div>
              ))}
            </div>
          </div>
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
