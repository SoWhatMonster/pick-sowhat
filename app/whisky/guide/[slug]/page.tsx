// ============================================================
// SO WHAT Pick — ウイスキースタイルガイド 下層ページ
// /whisky/guide/[slug]
// ============================================================

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SubpageTopbar from '@/components/subpage/SubpageTopbar'
import Breadcrumb from '@/components/subpage/Breadcrumb'
import BottleCard, { type BottleData } from '@/components/subpage/BottleCard'
import CTABanner from '@/components/subpage/CTABanner'
import SubpageFooter from '@/components/subpage/SubpageFooter'

// ── 産地データ ────────────────────────────────────────────

type Region = {
  name: string
  desc: string
  brands: string
}

type GuideData = {
  slug: string
  titleTag: string
  descriptionTag: string
  titleJa: string
  titleEn: string
  intro: string
  regions?: Region[]
  compareLeft?: { title: string; items: string[] }
  compareRight?: { title: string; items: string[] }
  beginnerTip?: string
  bottles: BottleData[]
  faqItems?: { q: string; a: string }[]
}

// ── スコッチデータ ─────────────────────────────────────────

const SCOTCH: GuideData = {
  slug: 'scotch',
  titleTag: 'スコッチウイスキーとは？産地・種類・おすすめ銘柄を解説 | SO WHAT Pick',
  descriptionTag:
    'スコッチウイスキーの産地・スタイル・味わいの特徴をわかりやすく解説。初心者から上級者まで、産地別おすすめ銘柄をAmazon・楽天でそのまま購入できます。',
  titleJa: 'スコッチウイスキー',
  titleEn: 'Scotch Whisky Guide',
  intro:
    'スコットランドで製造・熟成されたウイスキー。麦芽（モルト）またはグレーン穀物を原料とし、オーク樽で最低3年以上熟成させることが法律で定められている。世界のウイスキー市場の約60%を占め、複雑な香りと深みのある味わいが特徴。',
  regions: [
    {
      name: 'スペイサイド',
      desc: 'フルーティ・甘め・バランスよし。スコッチの中でも最も蒸留所が多く集まるエリア。洗練された香りと飲みやすさから入門に最適。',
      brands: 'グレンフィディック、マッカラン、グレンリベット',
    },
    {
      name: 'ハイランド',
      desc: '豊かでボディがある・多様なスタイル。広大な産地のため蒸留所ごとに個性が異なり、重厚なものから軽やかなものまで幅広い。',
      brands: 'ダルモア、グレンモーレンジィ、オーバン',
    },
    {
      name: 'アイラ',
      desc: '強烈なピート香・スモーキー・個性的。海岸沿いの島で作られる力強いウイスキー。スモーク好きには唯一無二の産地。',
      brands: 'ラフロイグ、アードベッグ、ボウモア',
    },
    {
      name: 'ローランド',
      desc: '軽め・繊細・飲みやすい。3回蒸留を行う蒸留所も多く、クセが少なく軽やかな仕上がり。スコッチ初心者にも試しやすい。',
      brands: 'オーヘントッシャン、グレンキンチー',
    },
    {
      name: 'キャンベルタウン',
      desc: '塩気・スモーク・独特の個性。かつては多くの蒸留所が集まった港町。現在は少数精鋭で個性派揃い。',
      brands: 'スプリングバンク、グレンスコシア',
    },
  ],
  compareLeft: {
    title: 'シングルモルト',
    items: [
      '大麦麦芽のみ使用',
      '単式蒸留器（ポットスチル）',
      '個性が強く複雑',
      '1つの蒸留所で製造',
    ],
  },
  compareRight: {
    title: 'グレーン',
    items: [
      '複数の穀物を使用',
      '連続式蒸留器',
      '軽やかで飲みやすい',
      '大量生産向き',
    ],
  },
  beginnerTip:
    'スコッチ初心者にはスペイサイドモルトがおすすめ。クセが少なくフルーティで、ウイスキーの基本的な魅力を無理なく体験できます。',
  bottles: [
    {
      rank: 1,
      name: 'グレンフィディック 12年',
      region: 'スペイサイド',
      tags: ['フルーティ', '入門向け'],
      price: '3,500円〜',
      amazonKeyword: 'グレンフィディック 12年 700ml',
      rakutenKeyword: 'グレンフィディック 12年',
      bottleSlug: 'glenfiddich12',
    },
    {
      rank: 2,
      name: 'グレンリベット 12年',
      region: 'スペイサイド',
      tags: ['甘め', 'バランス良好'],
      price: '3,000円〜',
      amazonKeyword: 'グレンリベット 12年',
      rakutenKeyword: 'グレンリベット 12年',
      bottleSlug: null,
    },
    {
      rank: 3,
      name: 'マッカラン 12年 ダブルカスク',
      region: 'スペイサイド',
      tags: ['シェリー樽', 'リッチ'],
      price: '7,000円〜',
      amazonKeyword: 'マッカラン 12年 ダブルカスク',
      rakutenKeyword: 'マッカラン 12年 ダブルカスク',
      bottleSlug: 'macallan12dc',
    },
    {
      rank: 4,
      name: 'グレンモーレンジィ オリジナル',
      region: 'ハイランド',
      tags: ['華やか', 'フローラル'],
      price: '4,500円〜',
      amazonKeyword: 'グレンモーレンジィ オリジナル',
      rakutenKeyword: 'グレンモーレンジィ オリジナル',
      bottleSlug: null,
    },
    {
      rank: 5,
      name: 'ボウモア 12年',
      region: 'アイラ',
      tags: ['スモーキー', '中級向け'],
      price: '4,000円〜',
      amazonKeyword: 'ボウモア 12年',
      rakutenKeyword: 'ボウモア 12年',
      bottleSlug: null,
    },
    {
      rank: 6,
      name: 'ラフロイグ 10年',
      region: 'アイラ',
      tags: ['強烈スモーク', '上級者向け'],
      price: '5,000円〜',
      amazonKeyword: 'ラフロイグ 10年',
      rakutenKeyword: 'ラフロイグ 10年',
      bottleSlug: null,
    },
  ],
}

// ── ガイドデータマップ ─────────────────────────────────────

const GUIDE_DATA: Record<string, GuideData> = {
  scotch: SCOTCH,
  // 将来追加: bourbon, japanese, irish, imo, mugi, kome, kokuto
}

// ── generateStaticParams ──────────────────────────────────

export async function generateStaticParams() {
  return Object.keys(GUIDE_DATA).map((slug) => ({ slug }))
}

// ── Metadata ─────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const data = GUIDE_DATA[slug]
  if (!data) return {}
  return {
    title: data.titleTag,
    description: data.descriptionTag,
    alternates: {
      canonical: `https://pick.sowhat.monster/whisky/guide/${slug}`,
    },
    openGraph: {
      title: data.titleTag,
      description: data.descriptionTag,
      url: `https://pick.sowhat.monster/whisky/guide/${slug}`,
      siteName: 'SO WHAT Pick',
      locale: 'ja_JP',
      type: 'article',
    },
  }
}

// ── Page ─────────────────────────────────────────────────

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = GUIDE_DATA[slug]
  if (!data) notFound()

  const breadcrumbs = [
    { label: '✦ SO WHAT Pick', href: '/' },
    { label: 'ウイスキー・焼酎', href: '/whisky' },
    { label: 'スタイルガイド' },
    { label: data.titleJa },
  ]

  return (
    <div className="subpageWrap">
      <SubpageTopbar />
      <Breadcrumb items={breadcrumbs} />

      <main>
        {/* ── ページヘッダー ── */}
        <div className="subPageHeader">
          <div className="subInner">
            <p className="subPageEn">{data.titleEn}</p>
            <h1 className="subPageTitle">{data.titleJa}</h1>
          </div>
        </div>

        {/* ── 1. 概要 ── */}
        <section className="subSection">
          <div className="subInner">
            <h2 className="subSectionTitle">スコッチとは</h2>
            <p className="subLeadText">{data.intro}</p>
          </div>
        </section>

        {/* ── 2. 産地カード ── */}
        {data.regions && (
          <section className="subSection">
            <div className="subInner">
              <h2 className="subSectionTitle">5大産地</h2>
              <div className="subRegionGrid">
                {data.regions.map((r) => (
                  <div key={r.name} className="subRegionCard">
                    <p className="subRegionName">{r.name}</p>
                    <p className="subRegionDesc">{r.desc}</p>
                    <p className="subRegionBrands">代表銘柄：{r.brands}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── 3. モルト vs グレーン ── */}
        {data.compareLeft && data.compareRight && (
          <section className="subSection">
            <div className="subInner">
              <h2 className="subSectionTitle">シングルモルトとグレーンの違い</h2>
              <div className="subCompare">
                <div className="subCompareCol">
                  <p className="subCompareColTitle">{data.compareLeft.title}</p>
                  <ul className="subCompareList">
                    {data.compareLeft.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="subCompareCol">
                  <p className="subCompareColTitle">{data.compareRight.title}</p>
                  <ul className="subCompareList">
                    {data.compareRight.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── 4. 初心者へのヒント ── */}
        {data.beginnerTip && (
          <section className="subSection">
            <div className="subInner">
              <h2 className="subSectionTitle">初心者へのおすすめ</h2>
              <p className="subLeadText">{data.beginnerTip}</p>
            </div>
          </section>
        )}

        {/* ── 5. おすすめ銘柄 ── */}
        <section className="subSection">
          <div className="subInner">
            <h2 className="subSectionTitle">おすすめ銘柄</h2>
            <div className="subBottleGrid">
              {data.bottles.map((bottle) => (
                <BottleCard key={bottle.name} bottle={bottle} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <CTABanner />
      <SubpageFooter />
    </div>
  )
}
