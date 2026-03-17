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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SO WHAT Pick — Whisky & Shochu',
    description: 'シーン・気分・フレーバーから、あなたにぴったりのウイスキー・焼酎をAIがレコメンド。',
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
