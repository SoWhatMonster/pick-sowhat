// ============================================================
// SO WHAT Pick — シーン別ウイスキーガイド 下層ページ
// /whisky/scene/[slug]
// ============================================================

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SubpageTopbar from '@/components/subpage/SubpageTopbar'
import Breadcrumb from '@/components/subpage/Breadcrumb'
import BottleCard, { type BottleData } from '@/components/subpage/BottleCard'
import CTABanner from '@/components/subpage/CTABanner'
import SubpageFooter from '@/components/subpage/SubpageFooter'

// ── 型定義 ────────────────────────────────────────────────

type DrinkingStyle = {
  imageSrc: string  // /public/ 以下の画像パス
  name: string
  desc: string
}

type FaqItem = {
  q: string
  a: string
}

type SceneData = {
  slug: string
  titleTag: string
  descriptionTag: string
  titleJa: string
  titleEn: string
  intro: string
  drinkingStyles?: DrinkingStyle[]
  criteria?: string[]
  bottles: BottleData[]
  faqItems?: FaqItem[]
}

// ── 初心者データ ──────────────────────────────────────────

const BEGINNER: SceneData = {
  slug: 'beginner',
  titleTag: '初めてのウイスキー入門｜初心者におすすめの飲み方・銘柄を解説 | SO WHAT Pick',
  descriptionTag:
    'ウイスキーを初めて飲む方へ。失敗しない選び方・飲み方のコツと、初心者におすすめの銘柄をわかりやすく紹介。Amazon・楽天でそのまま購入できます。',
  titleJa: '初めてのウイスキー',
  titleEn: 'Your First Whisky Guide',
  intro:
    'ウイスキーを初めて飲む多くの方が、いきなりストレートで飲んで「まずい」と感じてしまいます。ウイスキーの本当の魅力は、正しい飲み方で初めて体験できます。',
  drinkingStyles: [
    {
      imageSrc: '/drinks/highball.jpg',
      name: 'ハイボール',
      desc: 'ウイスキー1:ソーダ3〜4。最もとっつきやすく、食事にも合う。炭酸の爽快感がアルコールの刺激を和らげる。',
    },
    {
      imageSrc: '/drinks/mizuwari.jpg',
      name: '水割り',
      desc: 'ウイスキー1:水2〜2.5。アルコールが和らいで飲みやすい。ゆっくりと香りを楽しみながら飲める。',
    },
    {
      imageSrc: '/drinks/rock.jpg',
      name: 'ロック',
      desc: '氷で冷やすことで香りが落ち着き、甘みが引き立つ。少しずつ溶ける氷で味わいの変化も楽しめる。',
    },
  ],
  criteria: [
    'アルコールのトゲが少ない',
    'フルーティまたは甘めのフレーバー',
    'スモーキーすぎない',
    '価格が手頃（3,000円前後）',
  ],
  bottles: [
    {
      rank: 1,
      name: 'ジェムソン',
      region: 'アイリッシュ',
      tags: ['なめらか', 'クセなし'],
      reason: '3回蒸留でなめらか・クセなし・世界一売れているアイリッシュウイスキー',
      price: '2,500円〜',
      amazonKeyword: 'ジェムソン ウイスキー',
      rakutenKeyword: 'ジェムソン ウイスキー',
      bottleSlug: null,
    },
    {
      rank: 2,
      name: 'グレンフィディック 12年',
      region: 'スコッチ',
      tags: ['フルーティ', '飲みやすい'],
      reason: 'フルーティで飲みやすいスコッチの入門書',
      price: '3,500円〜',
      amazonKeyword: 'グレンフィディック 12年',
      rakutenKeyword: 'グレンフィディック 12年',
      bottleSlug: 'glenfiddich12',
    },
    {
      rank: 3,
      name: '知多',
      region: 'ジャパニーズ',
      tags: ['軽やか', 'ハイボール向き'],
      reason: '軽やかでハイボール向き・日本人の口に合う',
      price: '3,000円〜',
      amazonKeyword: '知多 サントリー ウイスキー',
      rakutenKeyword: '知多 サントリー ウイスキー',
      bottleSlug: 'chita',
    },
    {
      rank: 4,
      name: 'バランタイン 12年',
      region: 'スコッチ',
      tags: ['ブレンデッド', '手頃'],
      reason: 'ブレンデッドで飲みやすく価格も手頃',
      price: '2,800円〜',
      amazonKeyword: 'バランタイン 12年',
      rakutenKeyword: 'バランタイン 12年',
      bottleSlug: null,
    },
    {
      rank: 5,
      name: 'メーカーズマーク',
      region: 'バーボン',
      tags: ['バニラ', '甘め'],
      reason: 'バニラ・蜂蜜の甘さ・バーボン入門に最適',
      price: '2,500円〜',
      amazonKeyword: 'メーカーズマーク バーボン',
      rakutenKeyword: 'メーカーズマーク バーボン',
      bottleSlug: null,
    },
  ],
  faqItems: [
    {
      q: 'ウイスキーはどうやって保存すればいいですか？',
      a: '直射日光を避け、立てて常温保存。開封後は1〜2年以内に飲み切るのが理想です。',
    },
    {
      q: '高いウイスキーほど美味しいですか？',
      a: '必ずしもそうではありません。初心者には2,000〜4,000円台のものがコスパよく美味しく飲めるものが多くあります。',
    },
    {
      q: 'ウイスキーと焼酎の違いは？',
      a: '原料と製法が異なります。ウイスキーは穀物を麦芽で糖化・蒸留し木樽熟成させたもの。焼酎は芋・麦・米などを原料に蒸留したもので、樽熟成は必須ではありません。',
    },
  ],
}

// ── シーンデータマップ ────────────────────────────────────

const SCENE_DATA: Record<string, SceneData> = {
  beginner: BEGINNER,
  // 将来追加: gift, winter-night, fathers-day, food-pairing, outdoor, special
}

// ── generateStaticParams ──────────────────────────────────

export async function generateStaticParams() {
  return Object.keys(SCENE_DATA).map((slug) => ({ slug }))
}

// ── Metadata ─────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const data = SCENE_DATA[slug]
  if (!data) return {}
  return {
    title: data.titleTag,
    description: data.descriptionTag,
    alternates: {
      canonical: `https://pick.sowhat.monster/whisky/scene/${slug}`,
    },
    openGraph: {
      title: data.titleTag,
      description: data.descriptionTag,
      url: `https://pick.sowhat.monster/whisky/scene/${slug}`,
      siteName: 'SO WHAT Pick',
      locale: 'ja_JP',
      type: 'article',
    },
  }
}

// ── Page ─────────────────────────────────────────────────

export default async function ScenePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = SCENE_DATA[slug]
  if (!data) notFound()

  const breadcrumbs = [
    { label: '✦ SO WHAT Pick', href: '/' },
    { label: 'ウイスキー・焼酎', href: '/whisky' },
    { label: 'シーン別' },
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

        {/* ── 1. よくある失敗 ── */}
        <section className="subSection">
          <div className="subInner">
            <h2 className="subSectionTitle">ウイスキー初心者がやりがちな失敗</h2>
            <p className="subLeadText">{data.intro}</p>
          </div>
        </section>

        {/* ── 2. 飲み方カード ── */}
        {data.drinkingStyles && (
          <section className="subSection">
            <div className="subInner">
              <h2 className="subSectionTitle">初心者におすすめの飲み方</h2>
              <div className="subStyleCards">
                {data.drinkingStyles.map((s) => (
                  <div key={s.name} className="subStyleCard">
                    <div className="subStyleCardImgWrap">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.imageSrc}
                        alt={s.name}
                        className="subStyleCardImg"
                      />
                    </div>
                    <p className="subStyleCardName">{s.name}</p>
                    <p className="subStyleCardDesc">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── 3. 銘柄選びの条件 ── */}
        {data.criteria && (
          <section className="subSection">
            <div className="subInner">
              <h2 className="subSectionTitle">初心者が選ぶべき銘柄の条件</h2>
              <ul className="subCheckList">
                {data.criteria.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ── 4. おすすめ銘柄 ── */}
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

        {/* ── 5. FAQ ── */}
        {data.faqItems && (
          <section className="subSection">
            <div className="subInner">
              <h2 className="subSectionTitle">よくある疑問</h2>
              <dl className="subFaqList">
                {data.faqItems.map((item) => (
                  <div key={item.q} className="subFaqItem">
                    <dt className="subFaqQ">{item.q}</dt>
                    <dd className="subFaqA">{item.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}
      </main>

      <CTABanner />
      <SubpageFooter />
    </div>
  )
}
