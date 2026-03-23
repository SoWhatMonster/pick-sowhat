// ============================================================
// SO WHAT Pick — ウイスキースタイルガイド 下層ページ
// /whisky/guide/[slug]
// ============================================================

import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import SubpageTopbar from '@/components/subpage/SubpageTopbar'
import Breadcrumb from '@/components/subpage/Breadcrumb'
import SubpageNav, { type SubpageNavItem } from '@/components/subpage/SubpageNav'
import RelatedPages, { type RelatedPageItem } from '@/components/subpage/RelatedPages'
import BottleCard, { type BottleData } from '@/components/subpage/BottleCard'
import CTABanner from '@/components/subpage/CTABanner'
import SubpageFooter from '@/components/subpage/SubpageFooter'
import { buildAmazonUrl, buildRakutenUrl } from '@/lib/affiliate'

const AMAZON_TAG = process.env.AMAZON_ASSOCIATE_TAG ?? ''
const RAKUTEN_ID = process.env.RAKUTEN_AFFILIATE_ID ?? ''

// ── ナビゲーションデータ ──────────────────────────────────

const GUIDE_NAV_ITEMS: (SubpageNavItem & { desc: string })[] = [
  { slug: 'scotch',   label: 'スコッチ',       emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', desc: '主要産地・銘柄を徹底解説' },
  { slug: 'bourbon',  label: 'バーボン',       emoji: '🇺🇸', desc: '甘くリッチなアメリカンウイスキー' },
  { slug: 'japanese', label: 'ジャパニーズ',   emoji: '🇯🇵', desc: '山崎・白州など国産ウイスキーを解説' },
  { slug: 'irish',    label: 'アイリッシュ',   emoji: '🇮🇪', desc: '3回蒸留のなめらかな味わい' },
  { slug: 'imo',      label: '芋焼酎',         emoji: '🍠', desc: '鹿児島・宮崎の本格芋焼酎' },
  { slug: 'mugi',     label: '麦焼酎',         emoji: '🌾', desc: '大分・長崎発のクリーンな麦焼酎' },
  { slug: 'kome',     label: '米焼酎',         emoji: '🍚', desc: '熊本・球磨の米焼酎' },
  { slug: 'kokuto',   label: '黒糖焼酎',       emoji: '🏝️', desc: '奄美大島限定の特産焼酎' },
]

// ── 型定義 ────────────────────────────────────────────────

type Region = {
  name: string
  desc: string
  brands: string
  amazonKeyword: string
  rakutenKeyword: string
}

type CompareCol = {
  title: string
  items: string[]
  amazonKeyword: string
  rakutenKeyword: string
}

type HeroImage = {
  src: string
  alt: string
  credit?: string            // 例: 'Photo by John Doe on Unsplash'
  creditUrl?: string         // クレジットリンク先URL
  objectPosition?: string    // object-position（省略時: 'center center'）
  objectPositionPc?: string  // PC専用 object-position（省略時はobjectPositionを使用）
}

type Brand = {
  nameJa: string            // ブランド名（日本語）
  nameEn: string            // ブランド名（英語）
  founded: number           // 創業年
  region: string            // 産地
  flavorTags: string[]      // フレーバータグ
  desc: string              // ブランド解説（2〜3文）
  signature: string         // 代表的な銘柄・表現
  amazonKeyword: string
  rakutenKeyword: string
}

type GuideData = {
  slug: string
  flag: string             // 国旗絵文字
  titleTag: string
  descriptionTag: string
  titleJa: string
  titleEn: string
  intro: string
  introTitle?: string      // "〇〇とは" 見出し（省略時: titleJa + 'とは'）
  heroImage?: HeroImage
  regions?: Region[]
  regionsTitle?: string    // 産地セクション見出し（省略時: '主要産地・スタイル'）
  compareLeft?: CompareCol
  compareRight?: CompareCol
  compareTitle?: string    // 比較セクション見出し（省略時: 'スタイルの違い'）
  brandProfiles?: Brand[]
  beginnerTip?: string
  bottles: BottleData[]
  faqItems?: { q: string; a: string }[]
}

// ── スコッチデータ ─────────────────────────────────────────

const SCOTCH: GuideData = {
  slug: 'scotch',
  flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  introTitle: 'スコッチとは',
  regionsTitle: '主要産地',
  compareTitle: 'シングルモルトとグレーンの違い',
  titleTag: 'スコッチウイスキーとは？産地・種類・おすすめ銘柄を解説 | SO WHAT Pick',
  descriptionTag:
    'スコッチウイスキーの産地・スタイル・味わいの特徴をわかりやすく解説。初心者から上級者まで、産地別おすすめ銘柄をAmazon・楽天でそのまま購入できます。',
  titleJa: 'スコッチウイスキー',
  titleEn: 'Scotland',
  intro:
    'スコットランドで製造・熟成されたウイスキー。麦芽（モルト）またはグレーン穀物を原料とし、オーク樽で最低3年以上熟成させることが法律で定められている。世界のウイスキー市場の約60%を占め、複雑な香りと深みのある味わいが特徴。',
  heroImage: {
    // ── 差し替え手順 ──────────────────────────────────────
    // 1. フリー素材サイト（Unsplash / Pexels / Pixabay）で
    //    "Scottish distillery" などで検索
    // 2. 画像を /public/distillery/scotch.jpg に保存
    // 3. alt と credit を更新する
    // ──────────────────────────────────────────────────────
    src: '/distillery/scotch.jpg',
    alt: 'スコットランドの蒸留所',
    objectPosition: 'center 70%',
    credit: 'Photo by Alexander Hanssen on Unsplash',
    creditUrl: 'https://unsplash.com/photos/p17IHRg7K-Q',
  },
  regions: [
    {
      name: 'スペイサイド',
      desc: 'フルーティ・甘め・バランスよし。スコッチの中でも最も蒸留所が多く集まるエリア。洗練された香りと飲みやすさから入門に最適。',
      brands: 'グレンフィディック、マッカラン、グレンリベット',
      amazonKeyword: 'スペイサイド シングルモルト ウイスキー',
      rakutenKeyword: 'スペイサイド シングルモルト',
    },
    {
      name: 'ハイランド',
      desc: '豊かでボディがある・多様なスタイル。広大な産地のため蒸留所ごとに個性が異なり、重厚なものから軽やかなものまで幅広い。',
      brands: 'ダルモア、グレンモーレンジィ、オーバン',
      amazonKeyword: 'ハイランド シングルモルト ウイスキー',
      rakutenKeyword: 'ハイランド シングルモルト',
    },
    {
      name: 'アイランズ',
      desc: '海風・塩気・スモークがほんのり。スカイ島・オークニー・マル島など各島に個性ある蒸留所が点在。アイラほど重くなく、ハイランドより個性的。',
      brands: 'タリスカー、ハイランドパーク、スキャパ',
      amazonKeyword: 'タリスカー ウイスキー アイランズ',
      rakutenKeyword: 'タリスカー ウイスキー',
    },
    {
      name: 'アイラ',
      desc: '強烈なピート香・スモーキー・個性的。海岸沿いの島で作られる力強いウイスキー。スモーク好きには唯一無二の産地。',
      brands: 'ラフロイグ、アードベッグ、ボウモア',
      amazonKeyword: 'アイラ ウイスキー スコッチ',
      rakutenKeyword: 'アイラ ウイスキー スコッチ',
    },
    {
      name: 'ローランド',
      desc: '軽め・繊細・飲みやすい。3回蒸留を行う蒸留所も多く、クセが少なく軽やかな仕上がり。スコッチ初心者にも試しやすい。',
      brands: 'オーヘントッシャン、グレンキンチー',
      amazonKeyword: 'ローランド スコッチ ウイスキー',
      rakutenKeyword: 'ローランド スコッチ ウイスキー',
    },
    {
      name: 'キャンベルタウン',
      desc: '塩気・スモーク・独特の個性。かつては多くの蒸留所が集まった港町。現在は少数精鋭で個性派揃い。',
      brands: 'スプリングバンク、グレンスコシア',
      amazonKeyword: 'スプリングバンク ウイスキー キャンベルタウン',
      rakutenKeyword: 'スプリングバンク ウイスキー',
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
    amazonKeyword: 'シングルモルト スコッチ おすすめ',
    rakutenKeyword: 'シングルモルト スコッチウイスキー',
  },
  compareRight: {
    title: 'グレーン',
    items: [
      '複数の穀物を使用',
      '連続式蒸留器',
      '軽やかで飲みやすい',
      '大量生産向き',
    ],
    amazonKeyword: 'グレーンウイスキー スコッチ',
    rakutenKeyword: 'グレーンウイスキー スコッチ',
  },
  brandProfiles: [
    // ── スペイサイド ──────────────────────────────────────
    {
      nameJa: 'グレンフィディック',
      nameEn: 'Glenfiddich',
      founded: 1887,
      region: 'スペイサイド',
      flavorTags: ['洋梨', 'リンゴ', 'バニラ', '蜂蜜'],
      desc: 'ウィリアム・グラント一家が1887年に創業した、世界で最も売れているシングルモルト。三角形のボトルとフルーティな風味は世界中で愛されており、クリーンで洗練されたスタイルはスコッチ入門に最適。',
      signature: 'グレンフィディック 12年（洋梨・ハチミツ）、18年（リッチ・複雑）',
      amazonKeyword: 'グレンフィディック ウイスキー',
      rakutenKeyword: 'グレンフィディック ウイスキー',
    },
    {
      nameJa: 'グレンリベット',
      nameEn: 'The Glenlivet',
      founded: 1824,
      region: 'スペイサイド',
      flavorTags: ['柑橘', 'トロピカル', '草花', '甘め'],
      desc: '1824年にスコッチウイスキーの政府公認を受けた最初の蒸留所。スペイサイドの典型ともいえる甘くフルーティで上品なスタイルが特徴で、世界販売量第2位を誇る入門用スコッチの定番。',
      signature: 'グレンリベット 12年（柑橘・フローラル）、15年（フレンチオーク熟成）',
      amazonKeyword: 'グレンリベット ウイスキー',
      rakutenKeyword: 'グレンリベット ウイスキー',
    },
    {
      nameJa: 'マッカラン',
      nameEn: 'The Macallan',
      founded: 1824,
      region: 'スペイサイド',
      flavorTags: ['シェリー', 'ドライフルーツ', 'スパイス', 'チョコレート'],
      desc: '「シェリー樽の王」と称されるスコッチ最高峰ブランド。スペイン産シェリー樽へのこだわりが豊かなフルーツ香とリッチな甘みを生む。コレクターズアイテムとしても人気が高く、希少ボトルはオークションで高値がつく。',
      signature: 'マッカラン 12年 ダブルカスク、18年 シェリーオーク',
      amazonKeyword: 'マッカラン ウイスキー',
      rakutenKeyword: 'マッカラン ウイスキー',
    },
    {
      nameJa: 'バルヴェニー',
      nameEn: 'The Balvenie',
      founded: 1892,
      region: 'スペイサイド',
      flavorTags: ['蜂蜜', 'バニラ', 'スパイス', '繊細'],
      desc: 'グレンフィディックと同じグラント家が所有するスペイサイドの名門。自社農場での大麦栽培から麦芽化、樽製造まで一貫して行う数少ない蒸留所のひとつ。手仕事にこだわった職人的なスタイルが愛好家に高く評価される。',
      signature: 'バルヴェニー ダブルウッド 12年、カリビアンカスク 14年',
      amazonKeyword: 'バルヴェニー ウイスキー',
      rakutenKeyword: 'バルヴェニー ウイスキー',
    },
    {
      nameJa: 'グレンファークラス',
      nameEn: 'Glenfarclas',
      founded: 1836,
      region: 'スペイサイド',
      flavorTags: ['シェリー', 'リッチ', 'ドライフルーツ', 'オーク'],
      desc: '1836年創業で、現在も創業家グラント一族が経営を続ける独立系蒸留所。シェリー樽熟成を重視したリッチで重厚なスタイルが特徴。コストパフォーマンスの高さでも知られ、本格的なスペイサイドスタイルを手頃な価格で楽しめる。',
      signature: 'グレンファークラス 105（高アルコール）、15年（バランスの取れたシェリー）',
      amazonKeyword: 'グレンファークラス ウイスキー',
      rakutenKeyword: 'グレンファークラス ウイスキー',
    },
    // ── ハイランド ───────────────────────────────────────
    {
      nameJa: 'グレンモーレンジィ',
      nameEn: 'Glenmorangie',
      founded: 1843,
      region: 'ハイランド',
      flavorTags: ['フローラル', '白桃', 'バニラ', '繊細'],
      desc: 'スコットランド北部ハイランドの老舗蒸留所。業界最長クラスのポットスチルで軽やかでフローラルなスタイルを実現。多彩な樽フィニッシュシリーズがウイスキーの幅広い可能性を示す。',
      signature: 'グレンモーレンジィ オリジナル（入門向け）、ネクター・ドール（ソーテルヌ樽）',
      amazonKeyword: 'グレンモーレンジィ ウイスキー',
      rakutenKeyword: 'グレンモーレンジィ ウイスキー',
    },
    {
      nameJa: 'ダルモア',
      nameEn: 'The Dalmore',
      founded: 1839,
      region: 'ハイランド',
      flavorTags: ['シェリー', 'オレンジピール', 'チョコ', 'リッチ'],
      desc: '12本のシカの角をあしらったボトルが印象的なハイランドの名門蒸留所。バーボン樽で熟成後、シェリー樽でフィニッシュする独自の製法が、リッチで甘みのある複雑な味わいを生み出す。ギフトとしての人気も高い。',
      signature: 'ダルモア 12年（オレンジとシェリーの融合）、キングアレクサンダー III',
      amazonKeyword: 'ダルモア ウイスキー',
      rakutenKeyword: 'ダルモア ウイスキー',
    },
    {
      nameJa: 'オーバン',
      nameEn: 'Oban',
      founded: 1794,
      region: 'ハイランド',
      flavorTags: ['海塩', '蜂蜜', '柑橘', '穏やかなスモーク'],
      desc: 'スコットランド西岸の港町オーバンで1794年に創業した歴史ある蒸留所。海辺の立地を反映した潮気とフルーティさが共存する独特のスタイルは、ハイランドとアイラの中間的な個性を持つ。',
      signature: 'オーバン 14年（バランス派の西ハイランドモルト）',
      amazonKeyword: 'オーバン ウイスキー',
      rakutenKeyword: 'オーバン ウイスキー',
    },
    {
      nameJa: 'グレンドロナック',
      nameEn: 'GlenDronach',
      founded: 1826,
      region: 'ハイランド',
      flavorTags: ['シェリー', 'リコリス', '濃厚', 'スパイス'],
      desc: '1826年創業の東ハイランドに位置する蒸留所。100%シェリー樽熟成にこだわった、濃厚で個性的なスタイルが特徴。ビル・ラムズデン博士が関与した時期もあり、品質への評価が近年急上昇している。',
      signature: 'グレンドロナック 12年（シェリー好きの入門）、18年（深みと複雑さ）',
      amazonKeyword: 'グレンドロナック ウイスキー',
      rakutenKeyword: 'グレンドロナック ウイスキー',
    },
    // ── アイラ ────────────────────────────────────────────
    {
      nameJa: 'ラフロイグ',
      nameEn: 'Laphroaig',
      founded: 1815,
      region: 'アイラ',
      flavorTags: ['強烈なスモーク', 'ヨード', '海塩', '薬品香'],
      desc: '「好きか嫌いかがはっきり分かれる」と言われるアイラモルトの代名詞。独特のスモーキー&ヨード香は一度体験すると忘れられない。チャールズ国王が愛飲し、王室御用達「ロイヤル・ワラント」を授与されたことでも有名。',
      signature: 'ラフロイグ 10年（アイラスタイルの原点）、クォーターカスク',
      amazonKeyword: 'ラフロイグ ウイスキー',
      rakutenKeyword: 'ラフロイグ ウイスキー',
    },
    {
      nameJa: 'アードベッグ',
      nameEn: 'Ardbeg',
      founded: 1815,
      region: 'アイラ',
      flavorTags: ['超強烈スモーク', 'ピート', 'タール', 'バニラ'],
      desc: '1815年創業のアイラ最南端に位置する蒸留所。一時閉鎖の危機を経てグレンモーレンジィ社の傘下で復活を遂げた。スモーク感が非常に強いながらもバランスのとれた甘みを持ち、ウイスキー愛好家の間で熱狂的なファンを持つカルトブランド。',
      signature: 'アードベッグ 10年（スモーク&スイート）、ウーガダール（ピート×シェリー）',
      amazonKeyword: 'アードベッグ ウイスキー',
      rakutenKeyword: 'アードベッグ ウイスキー',
    },
    {
      nameJa: 'ボウモア',
      nameEn: 'Bowmore',
      founded: 1779,
      region: 'アイラ',
      flavorTags: ['スモーク', 'シーウィード', 'ダークフルーツ', 'バランス'],
      desc: '1779年創業のアイラ島最古の蒸留所のひとつ。「アイラの女王」とも称され、スモーキーさとシェリー樽のフルーツ感が共存するバランス派。ラフロイグほど強烈でなくアイラの個性を体験したい初心者にも向く。',
      signature: 'ボウモア 12年（バランス派の入口）、18年（深みとエレガンス）',
      amazonKeyword: 'ボウモア ウイスキー',
      rakutenKeyword: 'ボウモア ウイスキー',
    },
    {
      nameJa: 'ブルックラディ',
      nameEn: 'Bruichladdich',
      founded: 1881,
      region: 'アイラ',
      flavorTags: ['フローラル', '大麦', 'クリーン', 'ノンピート'],
      desc: '2001年に独立系として再起動したアイラの異端児。アイラらしいスモーク系のほか、ノンピートの「ザ・クラシックラディ」シリーズでアイラのイメージを覆す。重農産物にこだわるテロワール志向が業界内外で注目される。',
      signature: 'ザ・クラシックラディ（ノンピートの入門）、ポートシャーロット（スモーキー）',
      amazonKeyword: 'ブルックラディ ウイスキー',
      rakutenKeyword: 'ブルックラディ ウイスキー',
    },
    {
      nameJa: 'カリラ',
      nameEn: 'Caol Ila',
      founded: 1846,
      region: 'アイラ',
      flavorTags: ['スモーク', 'レモン', '軽め', '清涼感'],
      desc: 'アイラ島北部のジュラ海峡に面した蒸留所。ピートスモークを持ちながらも比較的軽やかでドライな仕上がりが特徴。大部分がブレンド用に使われるが、シングルモルトとしての評価も高く「スモークの入門」として最適な一本。',
      signature: 'カリラ 12年（軽快なアイラ入門）、ディスティラーズエディション',
      amazonKeyword: 'カリラ ウイスキー',
      rakutenKeyword: 'カリラ ウイスキー',
    },
    // ── ローランド ───────────────────────────────────────
    {
      nameJa: 'オーヘントッシャン',
      nameEn: 'Auchentoshan',
      founded: 1823,
      region: 'ローランド',
      flavorTags: ['軽め', 'フルーティ', 'クリーン', '飲みやすい'],
      desc: 'グラスゴー近郊に位置するローランドの代表的蒸留所。スコッチでは珍しい3回蒸留を採用し、アイリッシュウイスキーに近いクリーンで軽やかな口当たりを実現。ウイスキー入門者や軽い飲み口を好む方に特に推奨できる。',
      signature: 'オーヘントッシャン アメリカンオーク（軽やかな入門）、12年',
      amazonKeyword: 'オーヘントッシャン ウイスキー',
      rakutenKeyword: 'オーヘントッシャン ウイスキー',
    },
    {
      nameJa: 'グレンキンチー',
      nameEn: 'Glenkinchie',
      founded: 1837,
      region: 'ローランド',
      flavorTags: ['草花', '甘め', '軽め', 'フローラル'],
      desc: 'エジンバラ郊外に位置する「エジンバラのモルト」。大きなポットスチルから生まれる軽やかでフローラルなスタイルはローランドの特徴を体現している。ジョニーウォーカーのブレンド原酒としても使われる。',
      signature: 'グレンキンチー 12年（ローランドスタイルの入門）',
      amazonKeyword: 'グレンキンチー ウイスキー',
      rakutenKeyword: 'グレンキンチー ウイスキー',
    },
    // ── キャンベルタウン ──────────────────────────────────
    {
      nameJa: 'スプリングバンク',
      nameEn: 'Springbank',
      founded: 1828,
      region: 'キャンベルタウン',
      flavorTags: ['塩気', '果実', 'スモーク', '複雑'],
      desc: 'かつてウイスキーの都と呼ばれたキャンベルタウンに残る独立系蒸留所。麦芽化から瓶詰めまで全工程を自社で行う希少な蒸留所のひとつ。スモーク・塩気・フルーツが複雑に絡み合うスタイルは世界中の愛好家から高く評価される。',
      signature: 'スプリングバンク 10年（複雑で個性的）、15年（熟成感と塩気）',
      amazonKeyword: 'スプリングバンク ウイスキー',
      rakutenKeyword: 'スプリングバンク ウイスキー',
    },
    {
      nameJa: 'グレンスコシア',
      nameEn: 'Glen Scotia',
      founded: 1832,
      region: 'キャンベルタウン',
      flavorTags: ['塩気', 'スモーク', '柑橘', 'ドライ'],
      desc: 'キャンベルタウンに現存する2蒸留所のうちのひとつ。海辺の立地を反映した塩気とドライなスタイルが特徴。スプリングバンクほど有名ではないが、近年の品質向上とコストパフォーマンスの高さで評価が急上昇中。',
      signature: 'グレンスコシア ダブルカスク（バランス良好）、15年（複雑でドライ）',
      amazonKeyword: 'グレンスコシア ウイスキー',
      rakutenKeyword: 'グレンスコシア ウイスキー',
    },
    // ── ブレンデッド ──────────────────────────────────────
    {
      nameJa: 'ジョニーウォーカー',
      nameEn: 'Johnnie Walker',
      founded: 1820,
      region: 'ブレンデッド',
      flavorTags: ['スモーク', '甘め', 'バランス', '複雑'],
      desc: '世界で最も売れているスコッチウイスキーブランド。黒・赤・金・青・白など多彩なラベルシリーズがそれぞれ異なる個性を持ち、幅広いシーンと飲み手に対応。アイラのスモーク感を持つ「ブラックラベル」はブレンデッド入門に最適。',
      signature: 'ブラックラベル 12年（スモーキー）、ゴールドラベル リザーブ（甘くリッチ）',
      amazonKeyword: 'ジョニーウォーカー ウイスキー',
      rakutenKeyword: 'ジョニーウォーカー ウイスキー',
    },
    {
      nameJa: 'シーバスリーガル',
      nameEn: 'Chivas Regal',
      founded: 1801,
      region: 'ブレンデッド',
      flavorTags: ['蜂蜜', 'フルーツ', '滑らか', 'クリーミー'],
      desc: 'スコットランド最古のウイスキー商社のひとつアバディーン発祥。滑らかでクリーミーなスタイルはブレンデッドスコッチの優雅さを体現。世界的なギフト需要が高く、ビジネス贈答品としても定番の一本。',
      signature: 'シーバスリーガル 12年（定番ギフト）、18年（リッチでエレガント）',
      amazonKeyword: 'シーバスリーガル ウイスキー',
      rakutenKeyword: 'シーバスリーガル ウイスキー',
    },
  ],
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

// ── バーボンデータ ─────────────────────────────────────────

const BOURBON: GuideData = {
  slug: 'bourbon',
  flag: '🇺🇸',
  introTitle: 'バーボンとは',
  regionsTitle: 'スタイル・カテゴリ',
  compareTitle: 'バーボンとテネシーウイスキーの違い',
  titleTag: 'バーボンウイスキーとは？種類・飲み方・おすすめ銘柄を解説 | SO WHAT Pick',
  descriptionTag: 'バーボンウイスキーの種類・味わいの特徴をわかりやすく解説。スモールバッチからシングルバレルまで、初心者から上級者向けのおすすめ銘柄をAmazon・楽天でそのまま購入できます。',
  titleJa: 'バーボンウイスキー',
  titleEn: 'Bourbon Whiskey Guide',
  intro: 'アメリカ・ケンタッキー州を中心に生産されるバーボンは、原料の51%以上にトウモロコシを使用し、新品のオーク樽で熟成させることが法律で規定されている。バニラ・キャラメル・オークの甘い香りが特徴で、ストレートからハイボールまで幅広いシーンで楽しめる。',
  heroImage: { src: '/distillery/bourbon.jpg', alt: 'ジャックダニエル オールドNo.7 テネシーウイスキー', credit: 'Photo by Ryan Parker on Unsplash', creditUrl: 'https://unsplash.com/photos/PtGwPV5fKn0', objectPosition: 'center center' },
  regions: [
    { name: 'ストレートバーボン', desc: '2年以上新品チャーオーク樽で熟成。バーボンの基本形。', brands: 'ジム・ビーム、ワイルド・ターキー', amazonKeyword: 'ストレートバーボン ウイスキー', rakutenKeyword: 'バーボン ストレート' },
    { name: 'スモールバッチ', desc: '限られた樽を選別してブレンドした高品質バーボン。複雑な味わい。', brands: 'ウッドフォードリザーブ、ノブクリーク', amazonKeyword: 'スモールバッチ バーボン', rakutenKeyword: 'スモールバッチ バーボン' },
    { name: 'シングルバレル', desc: '1つの樽のみから充填。各樽の個性が際立つ唯一無二の味わい。', brands: 'ブラントンズ、フォアローゼズ', amazonKeyword: 'シングルバレル バーボン', rakutenKeyword: 'シングルバレル バーボン' },
    { name: 'ウィートバーボン', desc: '副原料に小麦を使用。柔らかくまろやかな飲み口が特徴。', brands: 'メーカーズマーク、W.L.ウェラー', amazonKeyword: 'ウィートバーボン メーカーズマーク', rakutenKeyword: 'メーカーズマーク バーボン' },
    { name: 'ライハイバーボン', desc: 'ライ麦比率が高くスパイシーで複雑。バーボン上級者向き。', brands: 'ブレット、フォアローゼズ スモールバッチ', amazonKeyword: 'ライ バーボン ウイスキー', rakutenKeyword: 'ライ バーボン' },
  ],
  compareLeft: {
    title: 'バーボン',
    items: ['トウモロコシ51%以上使用', '新品チャーオーク樽熟成', 'ケンタッキー州が中心', 'バニラ・キャラメルの甘み', '熟成期間の規定なし（ストレートは2年以上）'],
    amazonKeyword: 'バーボン ウイスキー おすすめ',
    rakutenKeyword: 'バーボン ウイスキー',
  },
  compareRight: {
    title: 'テネシーウイスキー',
    items: ['サトウカエデ炭でろ過（チャコールメローイング）', 'テネシー州のみで生産', 'よりまろやかで甘い仕上がり', 'バーボンの規定を満たすが別カテゴリ', 'ジャック ダニエルズが代表格'],
    amazonKeyword: 'ジャックダニエル テネシーウイスキー',
    rakutenKeyword: 'ジャックダニエル',
  },
  brandProfiles: [
    { nameJa: 'ジム・ビーム', nameEn: "Jim Beam", founded: 1795, region: 'ケンタッキー', flavorTags: ['バニラ', 'オーク', '定番'], desc: '200年以上の歴史を持つ世界最大のバーボンブランド。クリーンでバランスよく、バーボン入門の定番として世界中で親しまれている。', signature: 'ジム・ビーム ホワイト', amazonKeyword: 'ジム・ビーム バーボン', rakutenKeyword: 'ジムビーム バーボン' },
    { nameJa: 'メーカーズマーク', nameEn: "Maker's Mark", founded: 1953, region: 'ケンタッキー', flavorTags: ['ハニー', '甘め', 'まろやか'], desc: '赤い封蝋が目印のウィートバーボン。小麦を副原料に使うことでなめらかな甘みを実現し、初心者にも飲みやすい。', signature: 'メーカーズマーク', amazonKeyword: 'メーカーズマーク バーボン', rakutenKeyword: 'メーカーズマーク' },
    { nameJa: 'ワイルドターキー', nameEn: "Wild Turkey", founded: 1869, region: 'ケンタッキー', flavorTags: ['スパイシー', 'ボールド', '力強い'], desc: 'ライ麦比率が高くスパイシーで骨太なキャラクター。101プルーフの力強さが人気で、バーテンダーにも愛用される。', signature: 'ワイルドターキー 101', amazonKeyword: 'ワイルドターキー バーボン', rakutenKeyword: 'ワイルドターキー 101' },
    { nameJa: 'ウッドフォードリザーブ', nameEn: "Woodford Reserve", founded: 1812, region: 'ケンタッキー', flavorTags: ['フルーティ', 'リッチ', '複雑'], desc: '銅製ポットスチルで3回蒸留するプレミアムスモールバッチバーボン。チョコレートやドライフルーツのリッチな風味が魅力。', signature: 'ウッドフォードリザーブ ディスティラーズセレクト', amazonKeyword: 'ウッドフォードリザーブ バーボン', rakutenKeyword: 'ウッドフォードリザーブ' },
    { nameJa: 'ブラントンズ', nameEn: "Blanton's", founded: 1984, region: 'ケンタッキー', flavorTags: ['シングルバレル', 'オレンジ', '上品'], desc: '世界初のシングルバレルバーボン。馬上の騎手が乗るストッパーが特徴的で、コレクターズアイテムとしても人気が高い。', signature: 'ブラントンズ オリジナル', amazonKeyword: 'ブラントンズ バーボン', rakutenKeyword: 'ブラントンズ' },
    { nameJa: 'ノブクリーク', nameEn: "Knob Creek", founded: 1992, region: 'ケンタッキー', flavorTags: ['スモーキー', '長熟', 'プレミアム'], desc: 'ビームの職人が手がけるスモールバッチコレクションの一つ。9年熟成でオークとバニラが深く交わった複雑な味わい。', signature: 'ノブクリーク 9年', amazonKeyword: 'ノブクリーク バーボン', rakutenKeyword: 'ノブクリーク' },
    { nameJa: 'フォアローゼズ', nameEn: "Four Roses", founded: 1888, region: 'ケンタッキー', flavorTags: ['フローラル', '軽め', 'バランス'], desc: '5種のイースト株と2種のマッシュビルを組み合わせる独自製法が特徴。フローラルで軽やかな風味が女性にも人気。', signature: 'フォアローゼズ スモールバッチ', amazonKeyword: 'フォアローゼズ バーボン', rakutenKeyword: 'フォアローゼズ' },
    { nameJa: 'バッファロートレース', nameEn: "Buffalo Trace", founded: 1787, region: 'ケンタッキー', flavorTags: ['キャラメル', 'スパイス', 'クリーン'], desc: '世界最古の蒸留所の一つ。バニラ・キャラメル・スパイスのバランスが秀逸で、コストパフォーマンスも高い定番銘柄。', signature: 'バッファロートレース', amazonKeyword: 'バッファロートレース バーボン', rakutenKeyword: 'バッファロートレース' },
    { nameJa: 'エライジャクレイグ', nameEn: "Elijah Craig", founded: 1789, region: 'ケンタッキー', flavorTags: ['ナッツ', '甘い', '長熟'], desc: 'チャーオーク樽熟成の発明者とされるエライジャ・クレイグ牧師の名を冠した銘柄。12年熟成の深みある甘さが特徴。', signature: 'エライジャクレイグ スモールバッチ', amazonKeyword: 'エライジャクレイグ バーボン', rakutenKeyword: 'エライジャクレイグ' },
    { nameJa: 'エンジェルズエンヴィ', nameEn: "Angel's Envy", founded: 2011, region: 'ケンタッキー', flavorTags: ['ポートカスク', 'フルーティ', '甘口'], desc: 'ポートワイン樽でフィニッシュする革新的なバーボン。ドライフルーツのような甘さとなめらかな飲み口で高評価。', signature: "エンジェルズエンヴィ ポートワインカスクフィニッシュ", amazonKeyword: 'エンジェルズエンヴィ バーボン', rakutenKeyword: 'エンジェルズエンヴィ' },
    { nameJa: 'ブレット', nameEn: "Bulleit", founded: 1987, region: 'ケンタッキー', flavorTags: ['スパイシー', 'ドライ', 'モダン'], desc: '高ライ麦マッシュビルによるスパイシーでドライな風味が特徴。カクテルベースとしてもバーで広く使われる人気銘柄。', signature: 'ブレット バーボン', amazonKeyword: 'ブレット バーボン', rakutenKeyword: 'ブレット バーボン' },
    { nameJa: 'オールドフォレスター', nameEn: "Old Forester", founded: 1870, region: 'ケンタッキー', flavorTags: ['伝統', 'スパイス', 'ミント'], desc: '瓶詰め保証を最初に導入した歴史的銘柄。ミントとスパイスのクリアな風味はバーボンの教科書とも言われる。', signature: 'オールドフォレスター 86プルーフ', amazonKeyword: 'オールドフォレスター バーボン', rakutenKeyword: 'オールドフォレスター' },
    { nameJa: 'ミクターズ', nameEn: "Michter's", founded: 1753, region: 'ケンタッキー', flavorTags: ['クラフト', '上品', 'ハニー'], desc: 'アメリカ最古の蒸留所の流れを汲むプレミアムブランド。小ロット生産にこだわった深みある風味が世界中のバー関係者に支持される。', signature: "ミクターズ US*1 バーボン", amazonKeyword: 'ミクターズ バーボン', rakutenKeyword: 'ミクターズ' },
    { nameJa: 'ジャックダニエル', nameEn: "Jack Daniel's", founded: 1866, region: 'テネシー', flavorTags: ['メロウ', 'バニラ', '定番'], desc: 'テネシーウイスキーの代表格。チャコールメローイングによるまろやかさが特徴で、世界で最も多く飲まれるアメリカンウイスキー。', signature: 'ジャックダニエル ブラック', amazonKeyword: 'ジャックダニエル テネシーウイスキー', rakutenKeyword: 'ジャックダニエル' },
    { nameJa: 'ジョージディッケル', nameEn: "George Dickel", founded: 1870, region: 'テネシー', flavorTags: ['スムース', 'グレイン', 'クリーン'], desc: 'テネシー州タリーダウンで作られるもう一つのテネシーウイスキー。冬季の低温でチャコールろ過するためよりまろやかな仕上がり。', signature: 'ジョージディッケル No.12', amazonKeyword: 'ジョージディッケル テネシー', rakutenKeyword: 'ジョージディッケル' },
    { nameJa: 'ヘブンヒル', nameEn: "Heaven Hill", founded: 1934, region: 'ケンタッキー', flavorTags: ['甘い', '家族経営', '多様'], desc: 'アメリカ最大の家族経営蒸留所。多数のブランドを持ち、エライジャクレイグやエヴァン・ウィリアムズを手がける。', signature: 'ヘブンヒル 6年', amazonKeyword: 'ヘブンヒル バーボン', rakutenKeyword: 'ヘブンヒル バーボン' },
    { nameJa: 'ラーセニー', nameEn: "Larceny", founded: 2012, region: 'ケンタッキー', flavorTags: ['ハニー', 'バター', '滑らか'], desc: 'ヘブンヒルが手がけるウィートバーボン。オールドフィッツジェラルドの後継として、蜂蜜バターのような甘さが人気。', signature: 'ラーセニー スモールバッチ', amazonKeyword: 'ラーセニー バーボン', rakutenKeyword: 'ラーセニー バーボン' },
    { nameJa: 'ジェファーソンズ', nameEn: "Jefferson's", founded: 1997, region: 'ケンタッキー', flavorTags: ['ブレンド芸術', '革新的', 'リッチ'], desc: '海上熟成や異なる蒸留所原酒のブレンドなど革新的な試みで知られる。トーマス・ジェファーソンの名を冠した哲学あるブランド。', signature: "ジェファーソンズ バーボン", amazonKeyword: 'ジェファーソンズ バーボン', rakutenKeyword: 'ジェファーソンズ' },
    { nameJa: 'ブッカーズ', nameEn: "Booker's", founded: 1988, region: 'ケンタッキー', flavorTags: ['カスクストレングス', '力強い', '長熟'], desc: 'カスクストレングス（樽出し原液）で瓶詰めされる高度数バーボン。ノブクリークなどを手がけたブッカー・ノウが生み出した傑作。', signature: 'ブッカーズ バーボン', amazonKeyword: 'ブッカーズ バーボン カスクストレングス', rakutenKeyword: 'ブッカーズ バーボン' },
    { nameJa: 'エヴァン・ウィリアムズ', nameEn: "Evan Williams", founded: 1783, region: 'ケンタッキー', flavorTags: ['コスパ', 'クリーン', '万能'], desc: 'ケンタッキー初の蒸留業者の名を冠したコスパ抜群の銘柄。シングルバレルヴィンテージもリリースし本格的な味わいを手軽に楽しめる。', signature: 'エヴァン・ウィリアムズ ブラック', amazonKeyword: 'エヴァンウィリアムズ バーボン', rakutenKeyword: 'エヴァンウィリアムズ' },
  ],
  beginnerTip: 'バーボン初心者にはメーカーズマークまたはウッドフォードリザーブがおすすめ。ウィートバーボンのまろやかな甘さで「バーボン＝きつい」というイメージが変わるはずです。コーラ割りやハイボールから始めると飲みやすい。',
  bottles: [
    { rank: 1, name: 'メーカーズマーク', region: 'バーボン', tags: ['甘め', '入門向け'], reason: '赤い封蝋が目印のウィートバーボン。蜂蜜のような甘さで最も飲みやすいバーボンの一つ', price: '2,500円〜', amazonKeyword: 'メーカーズマーク バーボン 700ml', rakutenKeyword: 'メーカーズマーク', bottleSlug: null },
    { rank: 2, name: 'ウッドフォードリザーブ', region: 'バーボン', tags: ['プレミアム', 'フルーティ'], reason: 'スモールバッチの上品な複雑さ。チョコ・ドライフルーツの香りが楽しめる', price: '4,500円〜', amazonKeyword: 'ウッドフォードリザーブ バーボン', rakutenKeyword: 'ウッドフォードリザーブ', bottleSlug: null },
    { rank: 3, name: 'ジム・ビーム', region: 'バーボン', tags: ['定番', 'コスパ'], reason: 'バーボンの教科書的存在。コーラ割り・ハイボールに最適', price: '1,500円〜', amazonKeyword: 'ジムビーム バーボン 700ml', rakutenKeyword: 'ジムビーム', bottleSlug: null },
    { rank: 4, name: 'ブレット バーボン', region: 'バーボン', tags: ['スパイシー', 'モダン'], reason: 'スパイシーでカクテル映えする。ハイライ麦でバーテンダーに人気', price: '2,800円〜', amazonKeyword: 'ブレット バーボン', rakutenKeyword: 'ブレット バーボン', bottleSlug: null },
    { rank: 5, name: 'バッファロートレース', region: 'バーボン', tags: ['キャラメル', 'バランス'], reason: '世界最古の蒸留所発。キャラメルとバニラのクラシックな味わい', price: '3,000円〜', amazonKeyword: 'バッファロートレース バーボン', rakutenKeyword: 'バッファロートレース', bottleSlug: null },
    { rank: 6, name: 'ブラントンズ', region: 'バーボン', tags: ['シングルバレル', '上品'], reason: '世界初シングルバレル。コレクターズアイテムとしても人気の逸品', price: '8,000円〜', amazonKeyword: 'ブラントンズ シングルバレル', rakutenKeyword: 'ブラントンズ', bottleSlug: null },
  ],
}

// ── ジャパニーズウイスキーデータ ──────────────────────────

const JAPANESE: GuideData = {
  slug: 'japanese',
  flag: '🇯🇵',
  introTitle: 'ジャパニーズウイスキーとは',
  regionsTitle: '主要蒸留所',
  compareTitle: 'シングルモルトとブレンデッドの違い',
  titleTag: 'ジャパニーズウイスキーとは？蒸留所・銘柄・選び方を解説 | SO WHAT Pick',
  descriptionTag: 'サントリー・ニッカを中心に、ジャパニーズウイスキーの蒸留所と味わいの特徴をわかりやすく解説。山崎・白州・余市など定番から新興クラフトまで、おすすめ銘柄をAmazon・楽天で購入できます。',
  titleJa: 'ジャパニーズウイスキー',
  titleEn: 'Japanese Whisky Guide',
  intro: '日本のウイスキーは1923年に山崎蒸留所が創設されてから100年の歴史を持つ。スコッチの製法を基盤にしつつ、日本独自の職人気質と繊細な感性で磨き上げられた。ミズナラ樽熟成による独特のオリエンタルな香りが世界的に高く評価され、近年は入手困難な銘柄も増えている。',
  heroImage: { src: '/distillery/japanese.jpg', alt: '棚に並ぶ日本のウイスキーボトル', credit: 'Photo by Truong Tuyet Ly on Unsplash', creditUrl: 'https://unsplash.com/photos/OrngjB5RRTw', objectPosition: 'center 70%', objectPositionPc: 'center 80%' },
  regions: [
    { name: '山崎蒸留所（大阪）', desc: '日本最古のモルトウイスキー蒸留所。霧深い山崎の地でミズナラ樽熟成による優美な香りを生む。', brands: '山崎12年・18年・25年', amazonKeyword: '山崎 サントリー ウイスキー', rakutenKeyword: '山崎 ウイスキー' },
    { name: '白州蒸留所（山梨）', desc: '南アルプスの森に囲まれた高原の蒸留所。爽やかなグリーンノートと清涼感が特徴。', brands: '白州12年・18年・ノンエイジ', amazonKeyword: '白州 サントリー ウイスキー', rakutenKeyword: '白州 ウイスキー' },
    { name: '余市蒸留所（北海道）', desc: 'ニッカが誇る石炭直火蒸留の蒸留所。力強くスモーキーなキャラクターはスコッチに近い。', brands: '余市10年・ノンエイジ', amazonKeyword: '余市 ニッカ ウイスキー', rakutenKeyword: '余市 ウイスキー' },
    { name: '宮城峡蒸留所（宮城）', desc: '緑豊かな渓谷に位置するニッカの第2蒸留所。軽やかでフルーティな個性を持つ。', brands: '宮城峡12年・ノンエイジ', amazonKeyword: '宮城峡 ニッカ ウイスキー', rakutenKeyword: '宮城峡 ウイスキー' },
    { name: '新興クラフト蒸留所', desc: '2010年代以降に誕生した各地の個性派蒸留所。地元の素材や水を活かした多様なスタイル。', brands: 'イチローズモルト、嘉之助、松井、マルス', amazonKeyword: 'イチローズモルト ジャパニーズウイスキー', rakutenKeyword: 'ジャパニーズウイスキー クラフト' },
  ],
  compareLeft: {
    title: 'シングルモルト',
    items: ['単一蒸留所で製造', '大麦麦芽100%使用', 'ポットスチル蒸留', '蒸留所ごとの個性が強い', '価格は高め'],
    amazonKeyword: 'シングルモルト ジャパニーズウイスキー',
    rakutenKeyword: 'シングルモルト 日本 ウイスキー',
  },
  compareRight: {
    title: 'ブレンデッド',
    items: ['複数の原酒をブレンド', 'モルトとグレーンを組み合わせ', '職人のブレンド技術が光る', 'バランス良く飲みやすい', '比較的リーズナブル'],
    amazonKeyword: '響 サントリー ブレンデッドウイスキー',
    rakutenKeyword: '響 ウイスキー',
  },
  brandProfiles: [
    { nameJa: '山崎', nameEn: 'Yamazaki', founded: 1923, region: '大阪', flavorTags: ['ミズナラ', 'フルーティ', 'エレガント'], desc: '日本初のモルトウイスキー蒸留所で作られる最高峰。ミズナラ樽由来のビャクダン・伽羅の香りが日本人の精神性を表現している。', signature: '山崎12年', amazonKeyword: '山崎 12年 ウイスキー', rakutenKeyword: '山崎 12年' },
    { nameJa: '白州', nameEn: 'Hakushu', founded: 1973, region: '山梨', flavorTags: ['爽快', 'グリーン', 'スモーキー'], desc: '南アルプスの森に囲まれた「森の蒸留所」。爽やかなグリーンハーブと軽いスモークが絶妙に調和した個性的な銘柄。', signature: '白州12年', amazonKeyword: '白州 12年 ウイスキー', rakutenKeyword: '白州 12年' },
    { nameJa: '響', nameEn: 'Hibiki', founded: 1989, region: '日本', flavorTags: ['調和', '上品', 'ブレンデッド'], desc: 'サントリーが誇る最高峰ブレンデッド。山崎・白州・知多の原酒を高い技術でブレンドし、日本の四季と調和を表現している。', signature: '響 JAPANESE HARMONY', amazonKeyword: '響 ジャパニーズハーモニー ウイスキー', rakutenKeyword: '響 ウイスキー' },
    { nameJa: '余市', nameEn: 'Yoichi', founded: 1934, region: '北海道', flavorTags: ['ピーティ', '力強い', '重厚'], desc: '石炭直火蒸留という伝統製法を守るニッカの旗艦蒸留所。スコッチに似た重厚なピート香と海のニュアンスが魅力。', signature: '余市 ノンエイジ', amazonKeyword: '余市 ニッカ ウイスキー', rakutenKeyword: '余市 ウイスキー' },
    { nameJa: '宮城峡', nameEn: 'Miyagikyo', founded: 1969, region: '宮城', flavorTags: ['軽快', 'フルーティ', '繊細'], desc: '新川・広瀬川の合流点に位置するニッカ第2蒸留所。余市と対照的な軽やかでフルーティなスタイルを担う。', signature: '宮城峡 ノンエイジ', amazonKeyword: '宮城峡 ニッカ ウイスキー', rakutenKeyword: '宮城峡 ウイスキー' },
    { nameJa: 'ニッカ フロム ザ バレル', nameEn: 'Nikka From the Barrel', founded: 1985, region: '日本', flavorTags: ['カスクストレングス', '複雑', '濃厚'], desc: 'モルトとグレーンを再貯蔵したパワフルなブレンデッド。51.4度の高アルコールと深みある複雑さが世界で高評価を得ている。', signature: 'ニッカ フロム ザ バレル', amazonKeyword: 'ニッカ フロムザバレル', rakutenKeyword: 'ニッカ フロムザバレル' },
    { nameJa: '竹鶴', nameEn: 'Taketsuru', founded: 1989, region: '日本', flavorTags: ['バランス', '伝統', 'まろやか'], desc: 'ニッカ創業者・竹鶴政孝の名を冠したブレンデッドモルト。余市と宮城峡の個性が絶妙に融合した日本のウイスキー哲学の体現。', signature: '竹鶴 ピュアモルト', amazonKeyword: '竹鶴 ピュアモルト ウイスキー', rakutenKeyword: '竹鶴 ウイスキー' },
    { nameJa: '知多', nameEn: 'Chita', founded: 1972, region: '愛知', flavorTags: ['ライト', 'グレーン', 'スムース'], desc: '知多蒸留所のグレーンウイスキー。軽やかでスムースな飲み口はハイボールや水割りに最適で、日常使いの1本として人気。', signature: '知多', amazonKeyword: '知多 サントリー グレーンウイスキー', rakutenKeyword: '知多 ウイスキー' },
    { nameJa: 'イチローズモルト', nameEn: "Ichiro's Malt", founded: 2004, region: '埼玉', flavorTags: ['クラフト', '個性', 'トランプ'], desc: '肥土伊知郎氏が秩父で興したクラフト蒸留所。トランプシリーズや秩父シリーズは国際品評会で高評価を受け続けるジャパニーズの新星。', signature: 'イチローズモルト&グレーン', amazonKeyword: 'イチローズモルト ウイスキー', rakutenKeyword: 'イチローズモルト' },
    { nameJa: 'マルスウイスキー',  nameEn: 'Mars Whisky', founded: 1985, region: '長野', flavorTags: ['高地熟成', 'クリーン', 'フルーティ'], desc: '標高798mの長野県駒ヶ根に位置するマルス信州蒸留所。高冷地熟成のクリーンな味わいは近年国際的評価が急上昇中。', signature: 'マルスモルテージ越百', amazonKeyword: 'マルスウイスキー 信州 ウイスキー', rakutenKeyword: 'マルスウイスキー' },
    { nameJa: '富士', nameEn: 'Fuji', founded: 1973, region: '静岡', flavorTags: ['グレーン', 'クリスタル', '富士山水'], desc: 'キリンが誇る富士御殿場蒸留所。富士山の伏流水とスコットランド人技術者の指導で培われたグレーンウイスキーが特徴。', signature: '富士 シングルグレーン', amazonKeyword: '富士 キリン グレーンウイスキー', rakutenKeyword: '富士 キリン ウイスキー' },
    { nameJa: 'トキ', nameEn: 'Toki', founded: 2016, region: '日本', flavorTags: ['ハーブ', '柑橘', '軽快'], desc: 'サントリーが海外市場向けに開発したブレンデッド。白州モルトの爽やかさと知多グレーンのなめらかさが絶妙なバランス。', signature: 'TOKI', amazonKeyword: '碧 Toki サントリーウイスキー', rakutenKeyword: '碧 Toki' },
    { nameJa: '嘉之助', nameEn: 'Kanosuke', founded: 2018, region: '鹿児島', flavorTags: ['南国', 'フルーティ', '温暖熟成'], desc: '鹿児島の焼酎蔵が手がける南九州のウイスキー。温暖な気候による速い熟成とトロピカルフルーツのような風味が個性。', signature: '嘉之助 シングルモルト', amazonKeyword: '嘉之助 シングルモルト ウイスキー', rakutenKeyword: '嘉之助 ウイスキー' },
    { nameJa: '松井ウイスキー', nameEn: 'Matsui Whisky', founded: 2017, region: '鳥取', flavorTags: ['ミズナラ', '日本海', '和モダン'], desc: '大山山麓の清冽な伏流水と日本海の潮風が育む個性的なシングルモルト。ミズナラ樽・桜樽など和の素材を積極的に使用。', signature: '松井 シングルモルト ミズナラカスク', amazonKeyword: '松井ウイスキー シングルモルト', rakutenKeyword: '松井 ウイスキー' },
    { nameJa: '静岡蒸留所', nameEn: 'Gaiaflow Shizuoka', founded: 2016, region: '静岡', flavorTags: ['薪直火', 'クリーン', 'ナチュラル'], desc: 'ガイアフロー社が静岡に設立した話題の蒸留所。スコットランドから移設したポットスチルと日本の薪直火蒸留を組み合わせた革新的製法。', signature: 'プロローグK', amazonKeyword: 'ガイアフロー 静岡 シングルモルト', rakutenKeyword: '静岡 シングルモルト ウイスキー' },
    { nameJa: 'ハトザキ', nameEn: 'Hatozaki', founded: 2018, region: '兵庫', flavorTags: ['甘口', '梅', '和風'], desc: '明石の江井ヶ嶋酒造が手がけるジャパニーズブレンデッド。梅酒樽やミズナラ樽仕上げなど日本らしいフィニッシュが特徴。', signature: 'ハトザキ ピュアモルト', amazonKeyword: 'ハトザキ ウイスキー', rakutenKeyword: 'ハトザキ ウイスキー' },
    { nameJa: '海響', nameEn: 'Kaikyō', founded: 2019, region: '山口', flavorTags: ['潮風', '海峡', 'クリーン'], desc: '関門海峡を望む厚狭蒸留所のシングルモルト。海峡特有の潮風がもたらすマリンノートが個性的で国際的に注目されている。', signature: '海響 シングルモルト', amazonKeyword: '海響 シングルモルト ウイスキー', rakutenKeyword: '海響 ウイスキー' },
    { nameJa: '宮の舞', nameEn: 'Miyanomai', founded: 2016, region: '北海道', flavorTags: ['北海道', '泥炭', '冷涼'], desc: '北海道・余市近郊の冷涼な気候で熟成されるシングルモルト。ピート感と北の大地らしいクリーンさが調和した個性派。', signature: '宮の舞 ピーテッド', amazonKeyword: '宮の舞 北海道 ウイスキー', rakutenKeyword: '宮の舞 ウイスキー' },
    { nameJa: '厚岸', nameEn: 'Akkeshi', founded: 2016, region: '北海道', flavorTags: ['ピーティ', '海塩', '牡蠣'], desc: '酪農と牡蠣の町・北海道厚岸に立つ蒸留所。スコットランドのピート大麦を使いアイラ島を思わせるスモーキーな風味を持つ。', signature: '厚岸 寒露', amazonKeyword: '厚岸 シングルモルト ウイスキー', rakutenKeyword: '厚岸 ウイスキー' },
    { nameJa: '長濱', nameEn: 'Nagahama', founded: 2016, region: '滋賀', flavorTags: ['クラフト', '琵琶湖水', 'フルーティ'], desc: '日本最小規模のウイスキー蒸留所の一つ。琵琶湖の伏流水とクラフト精神が生む繊細でフルーティなシングルモルト。', signature: '長濱 シングルモルト', amazonKeyword: '長濱 シングルモルト ウイスキー', rakutenKeyword: '長濱 ウイスキー' },
  ],
  beginnerTip: 'ジャパニーズウイスキー入門には「知多」か「響JAPANESE HARMONY」がおすすめ。比較的入手しやすく、日本らしい繊細で飲みやすい味わいがジャパニーズの魅力を伝えてくれます。山崎・白州は入手困難ですが見かけたらぜひ試して。',
  bottles: [
    { rank: 1, name: 'ニッカ フロム ザ バレル', region: 'ジャパニーズ', tags: ['濃厚', 'コスパ'], reason: '500mlの四角いボトルが目印。高度数51.4%で深みある複雑さ、コストパフォーマンス最高', price: '3,000円〜', amazonKeyword: 'ニッカ フロムザバレル', rakutenKeyword: 'ニッカ フロムザバレル', bottleSlug: null },
    { rank: 2, name: '知多', region: 'ジャパニーズ', tags: ['ライト', 'ハイボール向き'], reason: 'グレーンウイスキーで軽やか。ハイボールや水割りに最適な入門向け', price: '3,000円〜', amazonKeyword: '知多 サントリー ウイスキー', rakutenKeyword: '知多 ウイスキー', bottleSlug: null },
    { rank: 3, name: '響 JAPANESE HARMONY', region: 'ジャパニーズ', tags: ['上品', 'ブレンデッド'], reason: '日本の四季を表現した最高峰ブレンデッド。贈り物にも最適', price: '7,000円〜', amazonKeyword: '響 ジャパニーズハーモニー', rakutenKeyword: '響 ジャパニーズハーモニー', bottleSlug: null },
    { rank: 4, name: '竹鶴 ピュアモルト', region: 'ジャパニーズ', tags: ['ブレンデッドモルト', '円熟'], reason: '余市・宮城峡の個性が融合。バランスが良くジャパニーズの真価を体感できる', price: '4,500円〜', amazonKeyword: '竹鶴 ピュアモルト ウイスキー', rakutenKeyword: '竹鶴 ウイスキー', bottleSlug: null },
    { rank: 5, name: 'イチローズモルト＆グレーン', region: 'ジャパニーズ', tags: ['クラフト', '世界的評価'], reason: 'クラフト蒸留所の代表格。世界が認めた日本のクラフトウイスキー', price: '5,000円〜', amazonKeyword: 'イチローズモルト ウイスキー', rakutenKeyword: 'イチローズモルト', bottleSlug: null },
    { rank: 6, name: 'マルス モルテージ越百', region: 'ジャパニーズ', tags: ['高地熟成', '爽やか'], reason: '信州の高原熟成による山々の清澄さ。コスパよく本格的なシングルモルトを楽しめる', price: '4,000円〜', amazonKeyword: 'マルスウイスキー 越百', rakutenKeyword: 'マルスウイスキー', bottleSlug: null },
  ],
}

// ── アイリッシュデータ ──────────────────────────────────────

const IRISH: GuideData = {
  slug: 'irish',
  flag: '🇮🇪',
  introTitle: 'アイリッシュウイスキーとは',
  regionsTitle: 'スタイル分類',
  compareTitle: 'シングルモルトとポットスチルウイスキーの違い',
  titleTag: 'アイリッシュウイスキーとは？種類・特徴・おすすめ銘柄を解説 | SO WHAT Pick',
  descriptionTag: '3回蒸留でなめらかなアイリッシュウイスキーの特徴・種類・銘柄を解説。ジェムソンから希少なレッドブレストまで、初心者から上級者向けのおすすめ銘柄をAmazon・楽天で購入できます。',
  titleJa: 'アイリッシュウイスキー',
  titleEn: 'Irish Whiskey Guide',
  intro: 'アイルランドで製造されるウイスキーで、伝統的に3回蒸留することでなめらかで飲みやすい風味を生み出す。「ウイスキー（Whiskey）」という言葉はアイルランド語の"Uisce Beatha"（命の水）に由来するとも言われる。近年は新蒸留所が急増し、世界のウイスキーシーンで再び注目を集めている。',
  heroImage: { src: '/distillery/irish.jpg', alt: 'アイルランドの緑の草原と山', credit: 'Photo by K. Mitch Hodge on Unsplash', creditUrl: 'https://unsplash.com/photos/418qmDW2HCU', objectPosition: 'center center' },
  regions: [
    { name: 'ブレンデッド', desc: 'モルト・グレーン・ポットスチル原酒をブレンド。飲みやすく世界で最も多く飲まれるスタイル。', brands: 'ジェムソン、ブッシュミルズ ブラック', amazonKeyword: 'ジェムソン アイリッシュウイスキー', rakutenKeyword: 'ジェムソン ウイスキー' },
    { name: 'シングルモルト', desc: '大麦麦芽のみで単一蒸留所製造。アイリッシュモルトは3回蒸留で軽やか。', brands: 'コネマラ、ティーリング シングルモルト', amazonKeyword: 'コネマラ アイリッシュ シングルモルト', rakutenKeyword: 'コネマラ ウイスキー' },
    { name: 'シングルポットスチル', desc: 'アイルランド独自のスタイル。未発芽大麦を混合して蒸留、スパイシーでオイリーな個性。', brands: 'レッドブレスト、グリーンスポット、パワーズ', amazonKeyword: 'レッドブレスト アイリッシュ ポットスチル', rakutenKeyword: 'レッドブレスト ウイスキー' },
    { name: 'グレーン', desc: '連続式蒸留器で製造。軽やかでフルーティ、ブレンドの骨格を担う。', brands: 'ティーリング グレーン、グリーンスポット シャトーレオヴィル', amazonKeyword: 'ティーリング グレーン アイリッシュ', rakutenKeyword: 'ティーリング グレーン' },
  ],
  compareLeft: {
    title: 'シングルモルト',
    items: ['大麦麦芽100%使用', 'ポットスチル蒸留（通常3回）', '単一蒸留所で製造', '軽やかでフルーティ', '世界共通のカテゴリ'],
    amazonKeyword: 'アイリッシュ シングルモルト ウイスキー',
    rakutenKeyword: 'アイリッシュ シングルモルト',
  },
  compareRight: {
    title: 'シングルポットスチル',
    items: ['発芽大麦＋未発芽大麦を使用', 'アイルランド独自のスタイル', 'スパイシーでクリーミーな口当たり', 'かつてアイリッシュの主流だった', 'レッドブレストが代表格'],
    amazonKeyword: 'レッドブレスト ポットスチル アイリッシュ',
    rakutenKeyword: 'レッドブレスト',
  },
  brandProfiles: [
    { nameJa: 'ジェムソン', nameEn: 'Jameson', founded: 1780, region: 'コーク', flavorTags: ['なめらか', 'クセなし', '世界1位'], desc: '世界で最も売れているアイリッシュウイスキー。3回蒸留によるなめらかさとバランスの良さで、ウイスキー入門者に最もおすすめできる1本。', signature: 'ジェムソン オリジナル', amazonKeyword: 'ジェムソン アイリッシュウイスキー', rakutenKeyword: 'ジェムソン ウイスキー' },
    { nameJa: 'ブッシュミルズ', nameEn: "Bushmills", founded: 1608, region: 'アントリム（北アイルランド）', flavorTags: ['フルーティ', '世界最古', 'ハニー'], desc: '1608年創業、世界最古の公認蒸留所。ライトでフルーティな風味は400年の歴史が培った洗練さを感じさせる。', signature: 'ブッシュミルズ オリジナル', amazonKeyword: 'ブッシュミルズ アイリッシュウイスキー', rakutenKeyword: 'ブッシュミルズ ウイスキー' },
    { nameJa: 'タラモアD.E.W.', nameEn: "Tullamore D.E.W.", founded: 1829, region: 'オファリー', flavorTags: ['スムース', '甘み', '飲みやすい'], desc: '蒸留所の頭文字D.E.W.から命名された大手ブランド。モルト・グレーン・ポットスチルの三重ブレンドによる心地よい甘さが特徴。', signature: 'タラモア D.E.W. オリジナル', amazonKeyword: 'タラモア DEW アイリッシュウイスキー', rakutenKeyword: 'タラモア DEW' },
    { nameJa: 'レッドブレスト', nameEn: "Redbreast", founded: 1912, region: 'コーク', flavorTags: ['ポットスチル', 'リッチ', '複雑'], desc: 'シングルポットスチルの最高峰として世界的に高評価。シェリー樽熟成によるドライフルーツとスパイスの複雑な風味が際立つ。', signature: 'レッドブレスト 12年', amazonKeyword: 'レッドブレスト 12年 アイリッシュ', rakutenKeyword: 'レッドブレスト ウイスキー' },
    { nameJa: 'グリーンスポット', nameEn: "Green Spot", founded: 1887, region: 'コーク', flavorTags: ['ポットスチル', 'フレッシュ', '希少'], desc: 'ミッチェル＆サン社の歴史ある銘柄。シングルポットスチルのフレッシュな果実感と独特のスパイシーさが愛好家を魅了する。', signature: 'グリーンスポット', amazonKeyword: 'グリーンスポット アイリッシュウイスキー', rakutenKeyword: 'グリーンスポット' },
    { nameJa: 'コネマラ', nameEn: "Connemara", founded: 1987, region: 'ミース', flavorTags: ['ピーティ', '甘い', '独特'], desc: 'アイリッシュで珍しいピーテッドタイプ。スコッチのようなスモーキーさとアイリッシュのなめらかさが共存する個性的な銘柄。', signature: 'コネマラ オリジナル', amazonKeyword: 'コネマラ アイリッシュ ピーテッド', rakutenKeyword: 'コネマラ ウイスキー' },
    { nameJa: 'ティーリング', nameEn: "Teeling", founded: 2015, region: 'ダブリン', flavorTags: ['ラム樽', 'モダン', '都市的'], desc: '2015年にダブリン市内に125年ぶりに復活した蒸留所。ラム樽フィニッシュなど革新的手法でアイリッシュウイスキーの新時代を牽引。', signature: 'ティーリング スモールバッチ', amazonKeyword: 'ティーリング アイリッシュウイスキー', rakutenKeyword: 'ティーリング ウイスキー' },
    { nameJa: 'パワーズ', nameEn: "Powers", founded: 1791, region: 'コーク', flavorTags: ['クリーミー', 'スパイス', '伝統'], desc: 'アイルランドで長く愛される伝統銘柄。シングルポットスチルのクリーミーなテクスチャーとスパイシーな余韻が持ち味。', signature: 'パワーズ ゴールドラベル', amazonKeyword: 'パワーズ アイリッシュウイスキー', rakutenKeyword: 'パワーズ ウイスキー' },
    { nameJa: 'ライターズティアーズ', nameEn: "Writer's Tears", founded: 2009, region: 'カーロー', flavorTags: ['ポットスチル', 'エレガント', '文学的'], desc: 'ウォルシュウイスキー社のプレミアムブレンド。ポットスチルとモルトを組み合わせた優美な風味はアイリッシュの新たな顔。', signature: "ライターズティアーズ カッパーポット", amazonKeyword: 'ライターズティアーズ アイリッシュ', rakutenKeyword: 'ライターズティアーズ' },
    { nameJa: 'スレーン', nameEn: "Slane", founded: 2017, region: 'ミース', flavorTags: ['三重熟成', 'バニラ', 'ロック感'], desc: 'ブラウン・フォーマン傘下のモダンアイリッシュ。バーボン・シェリー・ヴァージン樽の3種で熟成するトリプルキャスク製法が特徴。', signature: 'スレーン アイリッシュウイスキー', amazonKeyword: 'スレーン アイリッシュウイスキー', rakutenKeyword: 'スレーン ウイスキー' },
    { nameJa: 'ディングル', nameEn: "Dingle", founded: 2012, region: 'ケリー', flavorTags: ['クラフト', '海', 'フルーティ'], desc: 'アイルランド南西部の港町ディングルのクラフト蒸留所。大西洋の潮風を受けた独特のフレーバーが個性的で愛好家に人気。', signature: 'ディングル シングルモルト', amazonKeyword: 'ディングル アイリッシュ シングルモルト', rakutenKeyword: 'ディングル ウイスキー' },
    { nameJa: 'ウォーターフォード', nameEn: "Waterford", founded: 2015, region: 'ウォーターフォード', flavorTags: ['テロワール', '農場別', '哲学的'], desc: '農場ごとの大麦で異なるウイスキーを造るテロワール哲学が革新的。科学的なアプローチでウイスキーの新境地を開拓している。', signature: 'ウォーターフォード テロワール シリーズ', amazonKeyword: 'ウォーターフォード アイリッシュウイスキー', rakutenKeyword: 'ウォーターフォード ウイスキー' },
    { nameJa: 'ノッキングストン キャッスル', nameEn: "Knappogue Castle", founded: 1951, region: 'クレア', flavorTags: ['シングルモルト', '繊細', 'ヴィンテージ'], desc: '古城ノッキングストンで蒸留されたシングルモルト。ヴィンテージ年数ごとの表情の違いを楽しめる上品な銘柄。', signature: 'ノッキングストンキャッスル 12年', amazonKeyword: 'ノッキングストンキャッスル アイリッシュ', rakutenKeyword: 'ノッキングストン ウイスキー' },
    { nameJa: 'グレンダロッホ', nameEn: "Glendalough", founded: 2011, region: 'ウィックロー', flavorTags: ['野生酵母', '季節限定', '自然派'], desc: 'ウィックロー山地の修道院跡近くに立つクラフト蒸留所。野生酵母や地元産ハーブを使った実験的なリリースが話題を集める。', signature: 'グレンダロッホ ダブルバレル', amazonKeyword: 'グレンダロッホ アイリッシュウイスキー', rakutenKeyword: 'グレンダロッホ ウイスキー' },
    { nameJa: 'ウエストコーク', nameEn: "West Cork", founded: 2003, region: 'コーク', flavorTags: ['スタウト樽', '多様', 'コスパ'], desc: 'コーク州の小蒸留所が手がけるコスパ優秀なアイリッシュ。スタウト・ラム・バーボンなど多種のカスクフィニッシュシリーズが魅力。', signature: 'ウエストコーク オリジナル', amazonKeyword: 'ウエストコーク アイリッシュウイスキー', rakutenKeyword: 'ウエストコーク ウイスキー' },
    { nameJa: 'ハイドウイスキー', nameEn: "Hyde Whiskey", founded: 2014, region: 'コーク', flavorTags: ['シェリー', '歴史', 'プレミアム'], desc: 'アイルランド初の蒸留所長に敬意を表したプレミアムブランド。オロロソシェリー樽フィニッシュによる豊かな風味が特徴。', signature: 'ハイド No.3 シェリーカスクフィニッシュ', amazonKeyword: 'ハイドウイスキー アイリッシュ', rakutenKeyword: 'ハイドウイスキー' },
    { nameJa: 'セクストン', nameEn: "The Sexton", founded: 2016, region: 'アントリム', flavorTags: ['シェリー', 'リッチ', 'モダン'], desc: 'ブッシュミルズ蒸留所のシェリー樽熟成シングルモルト。六角形のボトルが印象的で、ギフトとしても人気が高い。', signature: 'セクストン シングルモルト', amazonKeyword: 'セクストン アイリッシュシングルモルト', rakutenKeyword: 'セクストン ウイスキー' },
    { nameJa: 'プロパーナンバートゥエルブ', nameEn: "Proper No. Twelve", founded: 2018, region: 'コーク', flavorTags: ['バニラ', 'ハニー', 'スムース'], desc: 'UFC王者コナー・マクレガーが共同設立した話題のブランド。バニラと蜂蜜の甘みでスムースに飲める親しみやすいブレンデッド。', signature: 'プロパーナンバートゥエルブ', amazonKeyword: 'プロパー ナンバートゥエルブ アイリッシュ', rakutenKeyword: 'プロパー12 ウイスキー' },
    { nameJa: 'タイロンネル', nameEn: "The Tyrconnell", founded: 1762, region: 'ロンドンデリー', flavorTags: ['シングルモルト', 'フルーティ', '競馬'], desc: '19世紀に同名の競走馬の勝利を記念して名付けられた由緒ある銘柄。フルーティでライトなアイリッシュシングルモルト。', signature: 'タイロンネル シングルモルト', amazonKeyword: 'タイロンネル アイリッシュウイスキー', rakutenKeyword: 'タイロンネル ウイスキー' },
    { nameJa: 'キルベガン', nameEn: "Kilbeggan", founded: 1757, region: 'ウェストミース', flavorTags: ['軽い', '清涼', 'クラシック'], desc: '世界最古の連続操業蒸留所の一つ。軽やかでクリーンな飲み口はアイリッシュ本来のスタイルを忠実に体現している。', signature: 'キルベガン ブレンデッド', amazonKeyword: 'キルベガン アイリッシュウイスキー', rakutenKeyword: 'キルベガン ウイスキー' },
  ],
  beginnerTip: 'アイリッシュ入門は「ジェムソン」が最適解。3回蒸留のなめらかさでウイスキーの苦手意識を払拭できます。慣れてきたら「レッドブレスト 12年」でポットスチルウイスキーの複雑な風味を体験してみてください。',
  bottles: [
    { rank: 1, name: 'ジェムソン', region: 'アイリッシュ', tags: ['なめらか', '入門最適'], reason: '世界一飲まれるアイリッシュ。クセがなくコーラ割りでも抜群', price: '2,500円〜', amazonKeyword: 'ジェムソン アイリッシュウイスキー 700ml', rakutenKeyword: 'ジェムソン ウイスキー', bottleSlug: null },
    { rank: 2, name: 'ブッシュミルズ ブラック', region: 'アイリッシュ', tags: ['10年熟成', '上品'], reason: '世界最古の蒸留所の10年物。シェリー樽熟成の甘みある個性派', price: '4,000円〜', amazonKeyword: 'ブッシュミルズ 10年 アイリッシュ', rakutenKeyword: 'ブッシュミルズ 10年', bottleSlug: null },
    { rank: 3, name: 'レッドブレスト 12年', region: 'アイリッシュ', tags: ['ポットスチル', 'リッチ'], reason: 'シングルポットスチルの最高峰。シェリー樽の豊かな複雑さが魅力', price: '7,000円〜', amazonKeyword: 'レッドブレスト 12年 アイリッシュ', rakutenKeyword: 'レッドブレスト 12年', bottleSlug: null },
    { rank: 4, name: 'コネマラ ピーテッド', region: 'アイリッシュ', tags: ['ピーティ', '個性的'], reason: 'アイリッシュ唯一のピーテッドタイプ。スモーキーさとアイリッシュの甘さが融合', price: '5,000円〜', amazonKeyword: 'コネマラ アイリッシュ ピーテッド', rakutenKeyword: 'コネマラ ウイスキー', bottleSlug: null },
    { rank: 5, name: 'ティーリング スモールバッチ', region: 'アイリッシュ', tags: ['モダン', 'ラム樽'], reason: '125年ぶりにダブリンに復活した蒸留所。ラム樽フィニッシュで甘みとトロピカル感', price: '4,500円〜', amazonKeyword: 'ティーリング スモールバッチ アイリッシュ', rakutenKeyword: 'ティーリング ウイスキー', bottleSlug: null },
    { rank: 6, name: 'タラモア D.E.W.', region: 'アイリッシュ', tags: ['スムース', '飲みやすい'], reason: '三重ブレンドのバランスが秀逸。価格も手頃で毎日飲みたい1本', price: '2,500円〜', amazonKeyword: 'タラモア DEW アイリッシュウイスキー', rakutenKeyword: 'タラモア DEW', bottleSlug: null },
  ],
}

// ── 芋焼酎データ ──────────────────────────────────────────

const IMO: GuideData = {
  slug: 'imo',
  flag: '🇯🇵',
  introTitle: '芋焼酎とは',
  regionsTitle: '主要産地',
  compareTitle: '白麹と黒麹の違い',
  titleTag: '芋焼酎とは？産地・銘柄・選び方を解説 | SO WHAT Pick',
  descriptionTag: '鹿児島・宮崎を中心とした芋焼酎の特徴・産地・銘柄をわかりやすく解説。霧島から幻の銘柄まで、おすすめ芋焼酎をAmazon・楽天で購入できます。',
  titleJa: '芋焼酎',
  titleEn: 'Imo Shochu Guide',
  intro: 'サツマイモを主原料とした本格焼酎で、鹿児島県（薩摩）と宮崎県が二大産地。独特の甘みと芋の香りが特徴で、白麹・黒麹・黄麹などの麹の種類によって風味が大きく変わる。国税庁が「薩摩焼酎」として地理的表示を認定するほどの伝統的な酒造文化を持つ。',
  heroImage: { src: '/distillery/imo.jpg', alt: '青空の下に広がる山の風景', credit: 'Photo by Marek Piwnicki on Unsplash', creditUrl: 'https://unsplash.com/photos/mCCGOBmTE4Q', objectPosition: 'center 60%' },
  regions: [
    { name: '鹿児島県（薩摩）', desc: '芋焼酎の本場。薩摩芋と豊富な地下水を使った伝統製法が守られ、「薩摩焼酎」の地理的表示が認定されている。', brands: '森伊蔵、村尾、魔王、さつま白波', amazonKeyword: '薩摩 芋焼酎 鹿児島', rakutenKeyword: '鹿児島 芋焼酎' },
    { name: '宮崎県', desc: '鹿児島に次ぐ芋焼酎の産地。霧島山系の清冽な水が個性ある風味を生む。霧島酒造の本拠地。', brands: '霧島、黒霧島、赤霧島、松露', amazonKeyword: '宮崎 芋焼酎', rakutenKeyword: '宮崎 芋焼酎' },
    { name: '屋久島・離島', desc: '屋久島の世界遺産の水と南国の気候が育む独特のテロワールを持つ芋焼酎。', brands: '三岳、屋久杉', amazonKeyword: '三岳 屋久島 芋焼酎', rakutenKeyword: '三岳 芋焼酎' },
    { name: '熊本・宮崎（球磨・高千穂）', desc: '球磨地方や高千穂エリアの個性派蒸留所が少量生産する希少な芋焼酎。', brands: '高千穂 峰、球磨焼酎 芋', amazonKeyword: '芋焼酎 熊本 宮崎', rakutenKeyword: '芋焼酎 希少 九州' },
    { name: '種子島・奄美', desc: '黒潮と太陽に育まれた島の芋を使うことで大陸産とは一線を画した個性的な風味。', brands: '種子島ゴールド、島芋', amazonKeyword: '種子島 芋焼酎', rakutenKeyword: '種子島 焼酎' },
  ],
  compareLeft: {
    title: '白麹',
    items: ['クエン酸が少なめ', 'まろやかで甘い仕上がり', '香りが穏やかで飲みやすい', '初心者に向いたタイプ', '霧島・白波が代表例'],
    amazonKeyword: '白麹 芋焼酎',
    rakutenKeyword: '白麹 芋焼酎',
  },
  compareRight: {
    title: '黒麹',
    items: ['クエン酸が豊富', 'キレがあって力強い風味', '芋の香りが前面に出る', '飲み応えのある個性派', '黒霧島・黒伊佐錦が代表例'],
    amazonKeyword: '黒麹 芋焼酎',
    rakutenKeyword: '黒麹 芋焼酎',
  },
  brandProfiles: [
    { nameJa: '霧島', nameEn: 'Kirishima', founded: 1916, region: '宮崎', flavorTags: ['定番', '白麹', 'まろやか'], desc: '宮崎・霧島酒造が製造する日本で最も売れている芋焼酎ブランド。白麹ならではのまろやかな甘みとクリアな飲み口が幅広い層に支持される。', signature: '霧島 25度', amazonKeyword: '霧島 芋焼酎 25度', rakutenKeyword: '霧島 芋焼酎' },
    { nameJa: '黒霧島', nameEn: 'Kuro Kirishima', founded: 1995, region: '宮崎', flavorTags: ['黒麹', 'キレ', '濃厚'], desc: '黒麹仕込みで力強い風味が特徴。食事との相性が良く、焼き肉や刺身と合わせると芋焼酎の真髄を体験できる。', signature: '黒霧島 25度', amazonKeyword: '黒霧島 芋焼酎', rakutenKeyword: '黒霧島 芋焼酎' },
    { nameJa: '赤霧島',  nameEn: 'Aka Kirishima', founded: 2003, region: '宮崎', flavorTags: ['ムラサキマサリ', 'フルーティ', '人気'], desc: '紫芋「ムラサキマサリ」を原料とした限定感ある銘柄。ポリフェノール由来のフルーティな甘さと深みある紫色が特徴的。', signature: '赤霧島 25度', amazonKeyword: '赤霧島 芋焼酎', rakutenKeyword: '赤霧島 芋焼酎' },
    { nameJa: '森伊蔵', nameEn: 'Mori Izou', founded: 1950, region: '鹿児島', flavorTags: ['幻', '甘い', 'プレミアム'], desc: '「幻の焼酎」と呼ばれる入手困難な最高峰。甘く芳醇な香りとなめらかな口当たりは、芋焼酎の概念を変えると言われる。', signature: '森伊蔵 25度', amazonKeyword: '森伊蔵 芋焼酎', rakutenKeyword: '森伊蔵 芋焼酎' },
    { nameJa: '村尾', nameEn: 'Murao', founded: 1908, region: '鹿児島', flavorTags: ['幻', '力強い', '複雑'], desc: '森伊蔵・魔王と並ぶ「3M」の一つ。少量生産にこだわる村尾酒造が手がける芋焼酎は深いコクとスモーキーな個性を持つ。', signature: '村尾 25度', amazonKeyword: '村尾 芋焼酎', rakutenKeyword: '村尾 芋焼酎' },
    { nameJa: '魔王', nameEn: 'Maou', founded: 1998, region: '鹿児島', flavorTags: ['フルーティ', '華やか', '上品'], desc: '3Mの中で最も飲みやすいとされる華やかな1本。フルーティな香りと柔らかな甘みはウイスキー愛好家にも受け入れられやすい。', signature: '魔王 25度', amazonKeyword: '魔王 芋焼酎', rakutenKeyword: '魔王 芋焼酎' },
    { nameJa: '三岳', nameEn: 'Mitake', founded: 1962, region: '鹿児島（屋久島）', flavorTags: ['屋久島水', 'クリーン', '爽やか'], desc: '世界自然遺産・屋久島の湧き水だけで仕込む清廉な芋焼酎。芋の甘みがありながら後味がすっきりとしていて飲み飽きない。', signature: '三岳 25度', amazonKeyword: '三岳 屋久島 芋焼酎', rakutenKeyword: '三岳 芋焼酎' },
    { nameJa: '天使の誘惑', nameEn: "Tenshi no Yuwaku", founded: 1845, region: '鹿児島', flavorTags: ['長期樽熟成', 'ウイスキー的', '上品'], desc: '西酒造が手がける樽熟成芋焼酎の先駆け。バーボン樽で長期熟成することでウイスキーに近い複雑な風味を生み出す個性派。', signature: '天使の誘惑', amazonKeyword: '天使の誘惑 芋焼酎', rakutenKeyword: '天使の誘惑 焼酎' },
    { nameJa: 'さつま白波',  nameEn: 'Satsuma Shiranami', founded: 1936, region: '鹿児島', flavorTags: ['黄金千貫', '伝統', 'コスパ'], desc: '薩摩酒造の代表銘柄で鹿児島を代表する定番芋焼酎。黄金千貫芋の豊かな風味をリーズナブルに楽しめる安心のブランド。', signature: 'さつま白波 25度', amazonKeyword: 'さつま白波 芋焼酎', rakutenKeyword: 'さつま白波 芋焼酎' },
    { nameJa: '晴耕雨読',  nameEn: 'Seiko Udoku', founded: 1908, region: '鹿児島', flavorTags: ['柔らか', '品格', 'ストレート向き'], desc: '佐多宗二商店の丁寧な手造り焼酎。「晴れた日は田畑を耕し、雨の日は読書を楽しむ」という名の通り、穏やかでゆったりした風味。', signature: '晴耕雨読 25度', amazonKeyword: '晴耕雨読 芋焼酎', rakutenKeyword: '晴耕雨読 焼酎' },
    { nameJa: 'なかむら', nameEn: 'Nakamura', founded: 1912, region: '鹿児島', flavorTags: ['黄麹', '吟醸的', 'フルーティ'], desc: '黄麹仕込みという珍しい製法で作られる個性派。清酒に近い吟醸的な香りとフルーティさが芋焼酎の常識を覆す。', signature: 'なかむら 25度', amazonKeyword: 'なかむら 芋焼酎 黄麹', rakutenKeyword: 'なかむら 芋焼酎' },
    { nameJa: '萬膳',  nameEn: 'Manzen', founded: 1935, region: '鹿児島', flavorTags: ['甕壺仕込み', '深い', '伝統'], desc: '霧島山麓の清水を使い甕壺で仕込む伝統的な製法を守る蔵。芋の甘みと深い旨味が重なり合う複雑な味わい。', signature: '萬膳 25度', amazonKeyword: '萬膳 芋焼酎', rakutenKeyword: '萬膳 芋焼酎' },
    { nameJa: '前田利右衛門', nameEn: 'Maeda Riuemon', founded: 1888, region: '鹿児島', flavorTags: ['薩摩芋の父', '甘み', '歴史的'], desc: 'サツマイモを日本に広めた前田利右衛門の名を冠した銘柄。甘い香りとまろやかな飲み口はサツマイモの魅力を存分に表現。', signature: '前田利右衛門 25度', amazonKeyword: '前田利右衛門 芋焼酎', rakutenKeyword: '前田利右衛門 焼酎' },
    { nameJa: '蔵の師匠', nameEn: 'Kura no Shisho', founded: 2004, region: '鹿児島', flavorTags: ['長期熟成', 'まろやか', '琥珀色'], desc: '長期甕貯蔵による深いまろやかさが特徴。琥珀色に輝く色合いとウイスキーに似た複雑な熟成香が上級者に好まれる。', signature: '蔵の師匠 黒麹', amazonKeyword: '蔵の師匠 芋焼酎', rakutenKeyword: '蔵の師匠 焼酎' },
    { nameJa: '甕雫',  nameEn: 'Kamishizuku', founded: 1909, region: '宮崎', flavorTags: ['甕仕込み', 'まろやか', '上品'], desc: '都城酒造の伝統的な甕仕込みが生む上品な芋焼酎。穏やかな甘みと洗練された味わいはロックやお湯割りで真価を発揮する。', signature: '甕雫 25度', amazonKeyword: '甕雫 宮崎 芋焼酎', rakutenKeyword: '甕雫 芋焼酎' },
    { nameJa: '島美人',  nameEn: 'Shima Bijin', founded: 1922, region: '鹿児島（南さつま）', flavorTags: ['甘い', '軽快', '飲みやすい'], desc: '南さつまの豊かな土壌で育った芋を使う銘柄。甘くライトな飲み口は女性にも人気で、芋焼酎デビューにも最適。', signature: '島美人 25度', amazonKeyword: '島美人 芋焼酎', rakutenKeyword: '島美人 焼酎' },
    { nameJa: '伊佐美',  nameEn: 'Isami', founded: 1895, region: '鹿児島', flavorTags: ['幻', '濃厚', '骨太'], desc: 'かつては3Mに匹敵する「幻の焼酎」として名を馳せた伊佐の名酒。骨太で濃厚な芋の旨味はストレートで飲んで真価を発揮する。', signature: '伊佐美 25度', amazonKeyword: '伊佐美 芋焼酎', rakutenKeyword: '伊佐美 芋焼酎' },
    { nameJa: '八幡', nameEn: 'Yahata', founded: 1918, region: '鹿児島', flavorTags: ['自然農法', '有機', '希少'], desc: '自然農法で栽培した芋と自家培養の麹にこだわる少量生産の蔵。農家直結の素直な芋の旨みが詰まった希少銘柄。', signature: '八幡 25度', amazonKeyword: '八幡 芋焼酎 鹿児島', rakutenKeyword: '八幡 芋焼酎' },
    { nameJa: '松露', nameEn: 'Shoro', founded: 1902, region: '宮崎', flavorTags: ['まろやか', '食中酒', 'バランス'], desc: '宮崎・松露酒造の看板銘柄。食事に寄り添うバランスのとれた味わいは日常の晩酌から特別な場面まで幅広く活躍する。', signature: '松露 25度', amazonKeyword: '松露 宮崎 芋焼酎', rakutenKeyword: '松露 芋焼酎' },
    { nameJa: '薩摩茶屋',  nameEn: 'Satsuma Chaya', founded: 1908, region: '鹿児島', flavorTags: ['村尾', '希少', '軽め'], desc: '村尾酒造が手がける村尾の弟分的な位置づけの銘柄。村尾に比べ軽やかでフルーティな飲み口で入手もやや容易。', signature: '薩摩茶屋 25度', amazonKeyword: '薩摩茶屋 芋焼酎', rakutenKeyword: '薩摩茶屋 芋焼酎' },
  ],
  beginnerTip: '芋焼酎を初めて飲むなら「霧島」か「三岳」がおすすめ。ロックよりもお湯割り（6:4）から始めると芋の甘い香りが引き立って飲みやすい。「芋臭い」が苦手な方は白麹・黄麹の銘柄（白霧島、なかむら）を選ぶと違和感なく楽しめます。',
  bottles: [
    { rank: 1, name: '霧島', region: '芋焼酎', tags: ['定番', '飲みやすい'], reason: '国内売上No.1。白麹のまろやかな甘みで芋焼酎デビューに最適', price: '900円〜（900ml）', amazonKeyword: '霧島 芋焼酎 1800ml', rakutenKeyword: '霧島 芋焼酎', bottleSlug: null },
    { rank: 2, name: '三岳', region: '芋焼酎', tags: ['屋久島', 'クリーン'], reason: '世界遺産の水で仕込む爽やかな1本。芋の甘みとすっきりした後味が人気', price: '1,400円〜（720ml）', amazonKeyword: '三岳 芋焼酎 720ml', rakutenKeyword: '三岳 芋焼酎', bottleSlug: null },
    { rank: 3, name: '黒霧島', region: '芋焼酎', tags: ['黒麹', 'キレ'], reason: '黒麹仕込みで力強い風味。焼肉・揚げ物との相性抜群', price: '1,100円〜（900ml）', amazonKeyword: '黒霧島 芋焼酎 1800ml', rakutenKeyword: '黒霧島 芋焼酎', bottleSlug: null },
    { rank: 4, name: '魔王', region: '芋焼酎', tags: ['幻系', '華やか'], reason: '3Mの中で最も飲みやすい華やかな芋焼酎。特別な夜の1本に', price: '3,000円〜（720ml）', amazonKeyword: '魔王 芋焼酎 720ml', rakutenKeyword: '魔王 芋焼酎', bottleSlug: null },
    { rank: 5, name: '天使の誘惑', region: '芋焼酎', tags: ['樽熟成', 'ウイスキー的'], reason: 'バーボン樽熟成でウイスキーに近い複雑さ。ウイスキーファンにも刺さる', price: '2,000円〜（720ml）', amazonKeyword: '天使の誘惑 芋焼酎', rakutenKeyword: '天使の誘惑 焼酎', bottleSlug: null },
    { rank: 6, name: '赤霧島', region: '芋焼酎', tags: ['紫芋', 'フルーティ'], reason: '紫芋のフルーティな甘みが独特。口当たり滑らかで飲み疲れしない', price: '1,500円〜（900ml）', amazonKeyword: '赤霧島 芋焼酎', rakutenKeyword: '赤霧島 芋焼酎', bottleSlug: null },
  ],
}

// ── 麦焼酎データ ──────────────────────────────────────────

const MUGI: GuideData = {
  slug: 'mugi',
  flag: '🇯🇵',
  introTitle: '麦焼酎とは',
  regionsTitle: '主要産地',
  compareTitle: '常圧蒸留と減圧蒸留の違い',
  titleTag: '麦焼酎とは？産地・種類・おすすめ銘柄を解説 | SO WHAT Pick',
  descriptionTag: '大分・長崎・鹿児島を中心とした麦焼酎の産地・種類・銘柄を解説。いいちこから百年の孤独まで、おすすめ麦焼酎をAmazon・楽天で購入できます。',
  titleJa: '麦焼酎',
  titleEn: 'Mugi Shochu Guide',
  intro: '大麦を主原料とした本格焼酎。芋焼酎に比べてクセが少なくすっきりとした風味で、焼酎の中で最も日常的に飲まれている種類の一つ。大分県・長崎県（壱岐）が二大産地で、常圧蒸留と減圧蒸留によって全く異なる個性が生まれる。',
  heroImage: { src: '/distillery/mugi.jpg', alt: '麦焼酎の風景', objectPosition: 'center center' },
  regions: [
    { name: '大分県', desc: '麦焼酎の最大産地。「いいちこ」「二階堂」「吉四六」など全国ブランドを輩出する本場。', brands: 'いいちこ、二階堂、吉四六、兼八', amazonKeyword: '大分 麦焼酎', rakutenKeyword: '大分 麦焼酎' },
    { name: '長崎県（壱岐）', desc: '壱岐島は麦焼酎発祥の地とされる。米麹2/3・麦1/3という独自の製法が「壱岐焼酎」として地理的表示認定を受けている。', brands: '壱岐の蔵、玄海、壱岐ゴールド', amazonKeyword: '壱岐 麦焼酎', rakutenKeyword: '壱岐 麦焼酎' },
    { name: '宮崎県', desc: '黒木本店など個性派蔵元が多く、クオリティの高い麦焼酎を少量生産する。百年の孤独は全国的プレミアム銘柄。', brands: '百年の孤独、中々', amazonKeyword: '宮崎 麦焼酎 黒木本店', rakutenKeyword: '宮崎 麦焼酎' },
    { name: '鹿児島県', desc: '芋焼酎のイメージが強い鹿児島だが、田苑・佐藤（麦）など麦焼酎も力強い個性を持つ蔵が存在する。', brands: '田苑、佐藤麦', amazonKeyword: '鹿児島 麦焼酎', rakutenKeyword: '鹿児島 麦焼酎' },
    { name: '福岡県', desc: '九州の玄関口として麦焼酎も盛ん。博多の文化と融合した個性ある麦焼酎が造られている。', brands: '博多の華、かめ焼き麦', amazonKeyword: '福岡 麦焼酎 博多', rakutenKeyword: '博多 麦焼酎' },
  ],
  compareLeft: {
    title: '常圧蒸留',
    items: ['大気圧で蒸留（昔ながらの方法）', '麦の香りが豊かに残る', '重厚でコク深い仕上がり', '長期熟成に向く', 'いいちこ・吉四六が代表'],
    amazonKeyword: '常圧 麦焼酎',
    rakutenKeyword: '常圧蒸留 麦焼酎',
  },
  compareRight: {
    title: '減圧蒸留',
    items: ['低温・減圧下で蒸留（現代製法）', '雑味が少なくクリーン', '軽やかでフルーティな風味', '日常的に飲みやすい', '二階堂・博多の華が代表'],
    amazonKeyword: '減圧 麦焼酎',
    rakutenKeyword: '減圧蒸留 麦焼酎',
  },
  brandProfiles: [
    { nameJa: 'いいちこ', nameEn: 'Iichiko', founded: 1979, region: '大分', flavorTags: ['クリーン', '定番', '飲みやすい'], desc: '「下町のナポレオン」の愛称で知られる麦焼酎の代名詞。すっきりとした飲み口と麦の香りのバランスが絶妙で、毎日飲んでも飽きない。', signature: 'いいちこ 25度', amazonKeyword: 'いいちこ 麦焼酎 1800ml', rakutenKeyword: 'いいちこ 麦焼酎' },
    { nameJa: '二階堂', nameEn: 'Nikaido', founded: 1867, region: '大分', flavorTags: ['麦香り', '伝統', 'バランス'], desc: '大分の老舗蔵元が手がける麦焼酎。麦の香ばしい香りとまろやかな飲み口は伝統の製法から生まれる安定した美味しさ。', signature: '二階堂 麦 25度', amazonKeyword: '二階堂 麦焼酎', rakutenKeyword: '二階堂 麦焼酎' },
    { nameJa: '百年の孤独',  nameEn: 'Hyakunen no Kodoku', founded: 1885, region: '宮崎', flavorTags: ['樽熟成', 'プレミアム', 'ウイスキー的'], desc: '「幻の麦焼酎」として知られる黒木本店の最高傑作。長期樽熟成によるウイスキーに近い複雑な香りとコクは焼酎の概念を変える。', signature: '百年の孤独 40度', amazonKeyword: '百年の孤独 麦焼酎', rakutenKeyword: '百年の孤独 麦焼酎' },
    { nameJa: '中々', nameEn: 'Nakanaka', founded: 1885, region: '宮崎', flavorTags: ['長期熟成', '麦の旨み', '芳醇'], desc: '百年の孤独と同じ黒木本店の銘柄で、長期貯蔵による豊かな風味が特徴。百年の孤独より入手しやすくコスパも良い。', signature: '中々 25度', amazonKeyword: '中々 麦焼酎 黒木本店', rakutenKeyword: '中々 麦焼酎' },
    { nameJa: '吉四六',  nameEn: 'Kichiku', founded: 1702, region: '大分', flavorTags: ['常圧', '個性', '骨太'], desc: '常圧蒸留にこだわる老松酒造の個性派麦焼酎。壺型の瓶に詰まった麦の香ばしい香りと力強いコクは一度飲んだら忘れられない。', signature: '吉四六 25度', amazonKeyword: '吉四六 麦焼酎', rakutenKeyword: '吉四六 麦焼酎' },
    { nameJa: '壱岐の蔵',  nameEn: 'Iki no Kura', founded: 1898, region: '長崎（壱岐）', flavorTags: ['麦焼酎発祥', '米麹', '独自'], desc: '壱岐焼酎の伝統製法（米麹2/3・麦1/3）を守る名蔵。麦だけでは出せない米由来の甘みとまろやかさが独特の個性を生む。', signature: '壱岐の蔵 25度', amazonKeyword: '壱岐の蔵 麦焼酎', rakutenKeyword: '壱岐の蔵 焼酎' },
    { nameJa: '佐藤 麦',  nameEn: 'Sato Mugi', founded: 1906, region: '鹿児島', flavorTags: ['麦の旨み', '芋蔵の麦', 'バランス'], desc: '芋焼酎「佐藤」で名高い佐藤酒造が手がける麦焼酎。芋の製法で培った技術が麦にも活きた、深みある飲み口が特徴。', signature: '佐藤麦 25度', amazonKeyword: '佐藤 麦焼酎 鹿児島', rakutenKeyword: '佐藤 麦焼酎' },
    { nameJa: '兼八', nameEn: 'Kanehachi', founded: 1922, region: '大分', flavorTags: ['常圧', '香ばしい', '個性派'], desc: '四ツ谷酒造の少量生産麦焼酎。麦を焙煎してから使うという独特の製法で、コーヒーや黒糖を思わせる香ばしさが際立つ。', signature: '兼八 25度', amazonKeyword: '兼八 麦焼酎 大分', rakutenKeyword: '兼八 麦焼酎' },
    { nameJa: '田苑 金ラベル',  nameEn: 'Denen Gold', founded: 1949, region: '鹿児島', flavorTags: ['音楽熟成', '長期貯蔵', 'まろやか'], desc: '音楽を聴かせながら熟成させる「音楽仕込み」で話題の田苑酒造。長期貯蔵による豊かなまろやかさがウイスキー愛好家にも人気。', signature: '田苑 金ラベル 25度', amazonKeyword: '田苑 麦焼酎 金ラベル', rakutenKeyword: '田苑 麦焼酎' },
    { nameJa: '博多の華',  nameEn: 'Hakata no Hana', founded: 1964, region: '福岡', flavorTags: ['クリーン', '軽快', 'コスパ'], desc: '福岡を代表するコスパ優秀な麦焼酎。減圧蒸留によるクリーンで軽やかな飲み口は九州全域で親しまれている日常酒の定番。', signature: '博多の華 麦 25度', amazonKeyword: '博多の華 麦焼酎', rakutenKeyword: '博多の華 麦焼酎' },
    { nameJa: '閻魔', nameEn: 'Enma', founded: 1702, region: '大分', flavorTags: ['長期熟成', 'まろやか', '骨格'], desc: '吉四六と同じ老松酒造が手がける長期貯蔵麦焼酎。3年以上熟成させたまろやかさと深い余韻は晩酌の贅沢な1本。', signature: '閻魔 長期貯蔵 25度', amazonKeyword: '閻魔 麦焼酎 大分', rakutenKeyword: '閻魔 麦焼酎' },
    { nameJa: '天草', nameEn: 'Amakusa', founded: 1967, region: '熊本', flavorTags: ['島産大麦', 'フルーティ', '個性'], desc: '天草の島産大麦と天草の湧き水で造る地元密着型の麦焼酎。海に囲まれた天草の豊かな環境が生む清涼感あふれる風味。', signature: '天草 麦 25度', amazonKeyword: '天草 麦焼酎 熊本', rakutenKeyword: '天草 麦焼酎' },
    { nameJa: '常蔵',  nameEn: 'Tsunezo', founded: 1895, region: '宮崎', flavorTags: ['穏やか', '食中酒', 'バランス'], desc: '宮崎の老舗蔵が手がける食事に合わせやすい麦焼酎。軽やかで穏やかな麦の香りは和食・洋食問わず食中酒として活躍する。', signature: '常蔵 25度', amazonKeyword: '常蔵 麦焼酎 宮崎', rakutenKeyword: '常蔵 麦焼酎' },
    { nameJa: '博多小女郎',  nameEn: 'Hakata Kojoro', founded: 1964, region: '福岡', flavorTags: ['甘み', '軽い', '女性向き'], desc: '博多の華と同じ福徳長酒類の銘柄。女性を意識した甘みのある軽やかな飲み口で、麦焼酎入門者にも飲みやすい。', signature: '博多小女郎 麦 25度', amazonKeyword: '博多小女郎 麦焼酎', rakutenKeyword: '博多小女郎 焼酎' },
    { nameJa: '風憚',  nameEn: 'Fuudan', founded: 1903, region: '大分', flavorTags: ['常圧', 'ダーク', '個性'], desc: '王手門酒造が手がける常圧蒸留の個性派。麦を焙煎した香ばしさと黒砂糖のようなコクが独特で、飲み始めると癖になる。', signature: '風憚 25度', amazonKeyword: '風憚 麦焼酎 大分', rakutenKeyword: '風憚 麦焼酎' },
    { nameJa: '玄海',  nameEn: 'Genkai', founded: 1898, region: '長崎（壱岐）', flavorTags: ['壱岐伝統', '米麹', 'まろやか'], desc: '壱岐の伝統製法を守る玄海酒造の定番銘柄。米麹由来のまろやかな甘みと大麦の香ばしさが調和した壱岐焼酎の正統派。', signature: '玄海 25度', amazonKeyword: '玄海 壱岐 麦焼酎', rakutenKeyword: '玄海 麦焼酎' },
    { nameJa: '旭万年',  nameEn: 'Asahi Mannen', founded: 1916, region: '大分', flavorTags: ['長期貯蔵', '円熟', '深み'], desc: '大分の旭酒造（大分）が手がける長期貯蔵麦焼酎。数年の熟成期間が生む円熟した旨みは他に代えがたい深みを持つ。', signature: '旭万年 25度', amazonKeyword: '旭万年 麦焼酎 大分', rakutenKeyword: '旭万年 麦焼酎' },
    { nameJa: '麦仙人',  nameEn: 'Mugi Sennin', founded: 1870, region: '大分', flavorTags: ['古酒', 'なめらか', '熟成感'], desc: '長期熟成の古酒スタイルにこだわる大分の蔵が手がける銘柄。ゆっくりと時間をかけて生まれる円熟したなめらかさが特徴。', signature: '麦仙人 25度', amazonKeyword: '麦仙人 麦焼酎', rakutenKeyword: '麦仙人 焼酎' },
    { nameJa: 'つくし',  nameEn: 'Tsukushi', founded: 1883, region: '福岡', flavorTags: ['黒麹', 'コク', '個性的'], desc: '黒麹を使うという麦焼酎では珍しい製法の個性派。芋焼酎のような力強いコクと麦の香りが合わさった独特の味わい。', signature: 'つくし 麦 25度', amazonKeyword: 'つくし 麦焼酎 福岡', rakutenKeyword: 'つくし 麦焼酎' },
    { nameJa: '西の星',  nameEn: 'Nishi no Hoshi', founded: 1845, region: '鹿児島', flavorTags: ['芋蔵の麦', 'まろやか', '芳醇'], desc: '西酒造（天使の誘惑の蔵）が手がける麦焼酎。芋焼酎で培った樽熟成の技術が応用されたまろやかで芳醇な仕上がり。', signature: '西の星 麦 25度', amazonKeyword: '西の星 麦焼酎 鹿児島', rakutenKeyword: '西の星 麦焼酎' },
  ],
  beginnerTip: '麦焼酎デビューは「いいちこ」一択。クセがなくすっきりしているので焼酎の苦手意識がある方でも飲みやすい。慣れてきたら「吉四六」「兼八」で常圧蒸留の香ばしい個性を体験し、最終的には「百年の孤独」でウイスキー感覚の麦焼酎世界へ。',
  bottles: [
    { rank: 1, name: 'いいちこ', region: '麦焼酎', tags: ['定番', 'クリーン'], reason: '日本中で愛されるクリーンな麦焼酎。水割り・お湯割り・ロックなんでも合う', price: '700円〜（900ml）', amazonKeyword: 'いいちこ 麦焼酎 1800ml', rakutenKeyword: 'いいちこ 麦焼酎', bottleSlug: null },
    { rank: 2, name: '百年の孤独', region: '麦焼酎', tags: ['樽熟成', 'プレミアム'], reason: '麦焼酎の最高峰。ウイスキーに近い複雑な樽香が楽しめるプレミアム1本', price: '3,000円〜（720ml）', amazonKeyword: '百年の孤独 麦焼酎', rakutenKeyword: '百年の孤独 麦焼酎', bottleSlug: null },
    { rank: 3, name: '吉四六', region: '麦焼酎', tags: ['常圧', '香ばしい'], reason: '常圧蒸留の麦焼酎入門に最適。香ばしい麦の個性を存分に楽しめる', price: '1,200円〜（720ml）', amazonKeyword: '吉四六 麦焼酎', rakutenKeyword: '吉四六 麦焼酎', bottleSlug: null },
    { rank: 4, name: '兼八', region: '麦焼酎', tags: ['焙煎麦', '個性的'], reason: '焙煎麦の香ばしさが独特。常圧蒸留の力強い個性が飲み手を選ぶ通好み', price: '1,500円〜（720ml）', amazonKeyword: '兼八 麦焼酎', rakutenKeyword: '兼八 麦焼酎', bottleSlug: null },
    { rank: 5, name: '壱岐の蔵', region: '麦焼酎', tags: ['壱岐伝統', '米麹'], reason: '麦焼酎発祥の地・壱岐の伝統製法。米麹由来のまろやかさが独特', price: '1,300円〜（720ml）', amazonKeyword: '壱岐の蔵 麦焼酎', rakutenKeyword: '壱岐の蔵 焼酎', bottleSlug: null },
    { rank: 6, name: '田苑 金ラベル', region: '麦焼酎', tags: ['音楽熟成', '長期貯蔵'], reason: '音楽仕込みのユニークな麦焼酎。長期貯蔵のまろやかさがロックで映える', price: '1,500円〜（720ml）', amazonKeyword: '田苑 麦焼酎 金ラベル', rakutenKeyword: '田苑 麦焼酎', bottleSlug: null },
  ],
}

// ── 米焼酎データ ──────────────────────────────────────────

const KOME: GuideData = {
  slug: 'kome',
  flag: '🇯🇵',
  introTitle: '米焼酎とは',
  regionsTitle: '主要産地',
  compareTitle: '球磨焼酎とその他の米焼酎の違い',
  titleTag: '米焼酎とは？産地・種類・おすすめ銘柄を解説 | SO WHAT Pick',
  descriptionTag: '熊本・球磨地方を中心とした米焼酎の産地・特徴・銘柄を解説。白岳から鳥飼まで、おすすめ米焼酎をAmazon・楽天で購入できます。',
  titleJa: '米焼酎',
  titleEn: 'Kome Shochu Guide',
  intro: '米を主原料とした本格焼酎で、日本酒に近い甘みとフルーティな香りが特徴。熊本県球磨地方が最も有名な産地で、「球磨焼酎」として地理的表示が認定されている。清酒の製造技術がベースにあるため、発酵・蒸留のコントロールが精緻で品質の高い銘柄が多い。',
  heroImage: { src: '/distillery/kome.jpg', alt: '山を背景に野原に立つ人', credit: 'Photo by Jinomono Media on Unsplash', creditUrl: 'https://unsplash.com/photos/HQnY0twPFkc', objectPosition: 'center 30%' },
  regions: [
    { name: '熊本県（球磨地方）', desc: '米焼酎の聖地。球磨川の清冽な水と地元産のヒノヒカリを使う球磨焼酎は「日本のラム」と呼ばれることも。', brands: '白岳、繊月、球磨の泉、豊永蔵', amazonKeyword: '球磨 米焼酎 熊本', rakutenKeyword: '球磨焼酎 米' },
    { name: '宮崎県', desc: '米焼酎においても宮崎は独自の個性を持つ産地。豊かな自然の恵みと独自技術が個性ある銘柄を生む。', brands: '鳥飼、宮崎 米焼酎', amazonKeyword: '鳥飼 米焼酎 宮崎', rakutenKeyword: '宮崎 米焼酎' },
    { name: '新潟・東北', desc: '日本酒の産地として知られる地域が手がける米焼酎。酒米の品質とノウハウが活かされた吟醸的な風味が特徴。', brands: '那須の白梅、東北の米焼酎', amazonKeyword: '新潟 米焼酎', rakutenKeyword: '新潟 米焼酎' },
    { name: '熊本・阿蘇', desc: '阿蘇の豊かな伏流水を使う蔵元が手がける米焼酎。火の国の豊かな自然が育む独特の風味。', brands: '阿蘇 米焼酎、火の国', amazonKeyword: '阿蘇 米焼酎 熊本', rakutenKeyword: '阿蘇 米焼酎' },
    { name: '鹿児島・九州各地', desc: '九州各地のクラフト蒸留所が産地の枠を超えた個性的な米焼酎を生産。', brands: '武者返し、島米焼酎', amazonKeyword: '九州 米焼酎 クラフト', rakutenKeyword: '九州 米焼酎' },
  ],
  compareLeft: {
    title: '球磨焼酎',
    items: ['熊本県球磨・人吉地区のみで製造', '地元産の米と球磨川の水を使用', 'EU等で地理的表示保護を取得', '伝統製法を守る蔵元が多い', '甘みが強くフルーティな傾向'],
    amazonKeyword: '球磨焼酎 米 熊本',
    rakutenKeyword: '球磨焼酎',
  },
  compareRight: {
    title: 'その他の米焼酎',
    items: ['全国各地で製造可能', '様々な品種の米を使用', '吟醸酒的な香りを持つものも', '日本酒蔵が副業で作ることも', '個性豊かな銘柄が増加中'],
    amazonKeyword: '米焼酎 吟醸 フルーティ',
    rakutenKeyword: '米焼酎 フルーティ',
  },
  brandProfiles: [
    { nameJa: '白岳', nameEn: 'Hakutake', founded: 1903, region: '熊本（球磨）', flavorTags: ['球磨の定番', 'クリーン', 'まろやか'], desc: '球磨焼酎の代表格、高橋酒造の主力銘柄。クリーンでまろやかな飲み口は米焼酎の入門として最適で、冷や・ロック・お湯割りと幅広く対応。', signature: '白岳 25度', amazonKeyword: '白岳 米焼酎 球磨', rakutenKeyword: '白岳 米焼酎' },
    { nameJa: '鳥飼', nameEn: 'Torikai', founded: 1950, region: '熊本', flavorTags: ['フルーティ', '吟醸香', '上品'], desc: '鳥飼酒造が手がける米焼酎の最高峰の一つ。吟醸酒のような華やかなフルーティ香と滑らかな口当たりは他に類を見ない個性。', signature: '鳥飼 25度', amazonKeyword: '鳥飼 米焼酎', rakutenKeyword: '鳥飼 米焼酎' },
    { nameJa: '繊月',  nameEn: 'Sengetsu', founded: 1917, region: '熊本（球磨）', flavorTags: ['柔らか', '品格', '伝統'], desc: '球磨の老舗・繊月酒造の代表銘柄。柔らかな甘みと上品な香りは米焼酎の品格を体現しており、贈り物としても喜ばれる。', signature: '繊月 25度', amazonKeyword: '繊月 米焼酎 球磨', rakutenKeyword: '繊月 米焼酎' },
    { nameJa: '武者返し',  nameEn: 'Mushagaeshi', founded: 1902, region: '熊本', flavorTags: ['辛口', 'キレ', '食中酒'], desc: '球磨米を100%使用した辛口の米焼酎。すっきりしたキレのある飲み口は食事と非常に相性が良く、特に和食の食中酒として人気。', signature: '武者返し 25度', amazonKeyword: '武者返し 米焼酎 熊本', rakutenKeyword: '武者返し 米焼酎' },
    { nameJa: '花の露',  nameEn: 'Hana no Tsuyu', founded: 1876, region: '熊本（球磨）', flavorTags: ['フルーティ', '花の香り', '女性向き'], desc: '花の名前の通りフローラルな香りが印象的な銘柄。女性にも人気の優しい甘みと華やかな香りは米焼酎の魅力を存分に伝える。', signature: '花の露 25度', amazonKeyword: '花の露 米焼酎 球磨', rakutenKeyword: '花の露 米焼酎' },
    { nameJa: '豊永蔵',  nameEn: 'Toyonagagura', founded: 1903, region: '熊本（球磨）', flavorTags: ['有機米', '旨み', '深い'], desc: '有機農法で育てた地元産米にこだわる球磨の蔵元。有機米由来の豊かな旨みと甘みは大量生産品では味わえない深みを持つ。', signature: '豊永蔵 25度', amazonKeyword: '豊永蔵 米焼酎 球磨', rakutenKeyword: '豊永蔵 米焼酎' },
    { nameJa: '常楽',  nameEn: 'Joraku', founded: 1893, region: '熊本（球磨）', flavorTags: ['まろやか', '熟成', '深み'], desc: '100年以上の歴史を持つ球磨の老舗。長期熟成させた古酒は米焼酎とは思えないほどまろやかで深い風味を持つ。', signature: '常楽 長期貯蔵 25度', amazonKeyword: '常楽 米焼酎 球磨', rakutenKeyword: '常楽 米焼酎' },
    { nameJa: '林',  nameEn: 'Hayashi', founded: 1897, region: '熊本（球磨）', flavorTags: ['甘い', 'なめらか', '伝統'], desc: '林酒造の代表銘柄。球磨焼酎の中でも特に甘みが豊かでなめらかな口当たりが特徴。ストレートで飲むと米の旨みが最大限に引き立つ。', signature: '林 25度', amazonKeyword: '林 米焼酎 熊本', rakutenKeyword: '林 米焼酎' },
    { nameJa: '人吉',  nameEn: 'Hitoyoshi', founded: 1910, region: '熊本（球磨）', flavorTags: ['バランス', '軽やか', '食事向き'], desc: '球磨川の清冽な水と地元産米で仕込む軽やかな米焼酎。バランスよく軽やかな飲み口は日常の食卓に寄り添う万能タイプ。', signature: '人吉 25度', amazonKeyword: '人吉 米焼酎 熊本', rakutenKeyword: '人吉 米焼酎' },
    { nameJa: '球磨の泉',  nameEn: 'Kuma no Izumi', founded: 1912, region: '熊本（球磨）', flavorTags: ['湧き水', 'クリーン', 'フレッシュ'], desc: '球磨川の伏流水から湧き出る天然水だけを使った銘柄。水の清冽さが米の風味を最大限に引き出したクリーンな仕上がり。', signature: '球磨の泉 25度', amazonKeyword: '球磨の泉 米焼酎', rakutenKeyword: '球磨の泉 米焼酎' },
    { nameJa: '千寿',  nameEn: 'Senjyu', founded: 1898, region: '熊本（球磨）', flavorTags: ['円熟', '古酒', '上品'], desc: '長期貯蔵による円熟した味わいが特徴の上品な米焼酎。「千年の命をもたらす」という名の通り、じっくりと時間をかけた深みを持つ。', signature: '千寿 25度', amazonKeyword: '千寿 米焼酎 球磨', rakutenKeyword: '千寿 米焼酎' },
    { nameJa: '那須の白梅',  nameEn: 'Nasuno Shiro Ume', founded: 1985, region: '栃木', flavorTags: ['東日本', 'クリーン', '淡麗'], desc: '関東圏の米どころ栃木が生む米焼酎。日本酒に近い淡麗でクリーンな風味は九州産とはまた異なる東日本の個性を持つ。', signature: '那須の白梅 25度', amazonKeyword: '那須の白梅 米焼酎', rakutenKeyword: '那須の白梅 焼酎' },
    { nameJa: '千代の亀',  nameEn: 'Chiyo no Kame', founded: 1892, region: '愛媛', flavorTags: ['吟醸香', 'フルーティ', '西日本'], desc: '日本酒の名門・愛媛の千代の亀が手がける米焼酎。清酒蔵のノウハウが活きた吟醸香が際立つ個性的な1本。', signature: '千代の亀 米焼酎', amazonKeyword: '千代の亀 米焼酎 愛媛', rakutenKeyword: '千代の亀 米焼酎' },
    { nameJa: '蒸留美人',  nameEn: 'Joryu Bijin', founded: 1965, region: '熊本', flavorTags: ['フルーティ', '華やか', '女性向き'], desc: '女性をイメージした美しい米焼酎。フルーティで華やかな香りは米焼酎のイメージを覆す、日本酒にも近い上品な飲み心地。', signature: '蒸留美人 25度', amazonKeyword: '蒸留美人 米焼酎 熊本', rakutenKeyword: '蒸留美人 米焼酎' },
    { nameJa: '白水',  nameEn: 'Hakusui', founded: 1936, region: '熊本（球磨）', flavorTags: ['すっきり', '淡麗', '爽快'], desc: '球磨の清らかな水を使った淡麗タイプの米焼酎。すっきりとした飲み口は夏の暑い日の水割りや炭酸割りに最適。', signature: '白水 25度', amazonKeyword: '白水 米焼酎 球磨', rakutenKeyword: '白水 米焼酎' },
  ],
  beginnerTip: '米焼酎入門は「白岳」か「鳥飼」がおすすめ。球磨焼酎の「白岳」はクリーンで飲みやすく、米の甘みを感じられる定番。「鳥飼」は日本酒好きに特にすすめたい吟醸香が魅力の1本です。',
  bottles: [
    { rank: 1, name: '白岳', region: '米焼酎', tags: ['球磨', 'クリーン'], reason: '球磨焼酎の入門として最適。クリーンでまろやかな米の甘みが際立つ', price: '1,300円〜（720ml）', amazonKeyword: '白岳 米焼酎', rakutenKeyword: '白岳 米焼酎', bottleSlug: null },
    { rank: 2, name: '鳥飼', region: '米焼酎', tags: ['吟醸香', 'フルーティ'], reason: '米焼酎唯一の吟醸香。日本酒好きには必飲の华やかな1本', price: '1,800円〜（720ml）', amazonKeyword: '鳥飼 米焼酎', rakutenKeyword: '鳥飼 米焼酎', bottleSlug: null },
    { rank: 3, name: '繊月', region: '米焼酎', tags: ['品格', '贈り物'], reason: '上品な甘みと香りで贈り物にも最適。球磨の老舗が手がける伝統の味', price: '1,500円〜（720ml）', amazonKeyword: '繊月 米焼酎', rakutenKeyword: '繊月 米焼酎', bottleSlug: null },
    { rank: 4, name: '花の露', region: '米焼酎', tags: ['フローラル', '女性向き'], reason: 'フローラルな香りが際立つ女性に人気の米焼酎', price: '1,200円〜（720ml）', amazonKeyword: '花の露 米焼酎', rakutenKeyword: '花の露 米焼酎', bottleSlug: null },
    { rank: 5, name: '武者返し', region: '米焼酎', tags: ['辛口', '食中酒'], reason: 'キレのある辛口タイプ。和食全般と相性抜群の万能食中酒', price: '1,300円〜（720ml）', amazonKeyword: '武者返し 米焼酎', rakutenKeyword: '武者返し 米焼酎', bottleSlug: null },
    { rank: 6, name: '豊永蔵', region: '米焼酎', tags: ['有機米', '旨み'], reason: '有機米にこだわる少量生産。球磨焼酎の真髄を知りたい方に', price: '1,600円〜（720ml）', amazonKeyword: '豊永蔵 米焼酎', rakutenKeyword: '豊永蔵 米焼酎', bottleSlug: null },
  ],
}

// ── 黒糖焼酎データ ────────────────────────────────────────

const KOKUTO: GuideData = {
  slug: 'kokuto',
  flag: '🇯🇵',
  introTitle: '黒糖焼酎とは',
  regionsTitle: '産地と主要蒸留所',
  compareTitle: '若酒と長期熟成酒の違い',
  titleTag: '黒糖焼酎とは？奄美の特産・銘柄・飲み方を解説 | SO WHAT Pick',
  descriptionTag: '奄美大島限定の黒糖焼酎の特徴・製法・銘柄を解説。れんとから里の曙まで、おすすめ黒糖焼酎をAmazon・楽天で購入できます。',
  titleJa: '黒糖焼酎',
  titleEn: 'Kokuto Shochu Guide',
  intro: '鹿児島県奄美群島のみで製造が認められた特産焼酎。サトウキビから作られた黒糖と米麹を使うことで、ラム酒に似た甘い香りと本格焼酎の個性を兼ね備えた唯一無二の酒が生まれる。奄美大島の温暖な気候と豊かな自然が育む、南国の恵みを感じられる焼酎。',
  heroImage: { src: '/distillery/kokuto.jpg', alt: '黒糖焼酎の風景', objectPosition: 'center center', objectPositionPc: 'center 65%' },
  regions: [
    { name: '奄美大島', desc: '黒糖焼酎の中心地。島全体に多くの蔵元が点在し、各蔵が独自のこだわりを持った多様な銘柄を生産している。', brands: '里の曙、龍宮、奄美、れんと', amazonKeyword: '奄美大島 黒糖焼酎', rakutenKeyword: '奄美大島 黒糖焼酎' },
    { name: '喜界島', desc: '奄美群島の一島・喜界島で造られる黒糖焼酎。サトウキビの生産が盛んな島ならではの豊かな黒糖風味が特徴。', brands: '喜界島 焼酎、朝日', amazonKeyword: '喜界島 黒糖焼酎', rakutenKeyword: '喜界島 黒糖焼酎' },
    { name: '徳之島', desc: '日本一のサトウキビ産地の一つとして知られる徳之島の個性ある黒糖焼酎。', brands: '天乃水、徳之島 焼酎', amazonKeyword: '徳之島 黒糖焼酎', rakutenKeyword: '徳之島 黒糖焼酎' },
    { name: '沖永良部島', desc: '花の島として知られる沖永良部島でも黒糖焼酎が造られており、独特の個性を持つ。', brands: '沖永良部 黒糖焼酎', amazonKeyword: '沖永良部 黒糖焼酎', rakutenKeyword: '沖永良部島 焼酎' },
  ],
  compareLeft: {
    title: '若酒（タンク貯蔵）',
    items: ['製造後比較的短期間で出荷', '黒糖の甘みがフレッシュに感じられる', '軽やかでクリーンな飲み口', 'リーズナブルな価格帯', 'ロック・水割りで飲みやすい'],
    amazonKeyword: '黒糖焼酎 タンク貯蔵',
    rakutenKeyword: '黒糖焼酎 若酒',
  },
  compareRight: {
    title: '長期熟成（樽・甕貯蔵）',
    items: ['3年以上の長期貯蔵が多い', '熟成による深みとまろやかさ', 'バニラ・キャラメルの風味が加わる', '琥珀色に変化するものも', 'ストレートや水割りで真価発揮'],
    amazonKeyword: '黒糖焼酎 長期熟成',
    rakutenKeyword: '黒糖焼酎 長期貯蔵',
  },
  brandProfiles: [
    { nameJa: '里の曙', nameEn: 'Sato no Akebono', founded: 1946, region: '奄美大島', flavorTags: ['定番', 'まろやか', '奄美を代表'], desc: '奄美を代表する黒糖焼酎の最定番銘柄。まろやかな甘みとすっきりした後味は黒糖焼酎入門として最適な1本。', signature: '里の曙 25度', amazonKeyword: '里の曙 黒糖焼酎', rakutenKeyword: '里の曙 黒糖焼酎' },
    { nameJa: '龍宮', nameEn: 'Ryuugu', founded: 1949, region: '奄美大島', flavorTags: ['甕仕込み', 'コク', '伝統'], desc: '富田酒造場の甕仕込みによる個性ある黒糖焼酎。甕由来のミネラル感とコクは伝統製法ならではの深みを持つ。', signature: '龍宮 25度', amazonKeyword: '龍宮 黒糖焼酎 奄美', rakutenKeyword: '龍宮 黒糖焼酎' },
    { nameJa: '加那',  nameEn: 'Kana', founded: 1910, region: '奄美大島', flavorTags: ['フルーティ', '甘い', '上品'], desc: '奄美の言葉で「愛しい人」を意味する「加那」。フルーティな甘みと上品な香りは黒糖焼酎の中でも特に飲みやすい銘柄。', signature: '加那 25度', amazonKeyword: '加那 黒糖焼酎', rakutenKeyword: '加那 黒糖焼酎' },
    { nameJa: 'れんと',  nameEn: 'Rento', founded: 1952, region: '奄美大島', flavorTags: ['音楽熟成', '全国区', 'まろやか'], desc: 'クラシック音楽を聴かせながら熟成させる「音楽熟成」で有名な奄美大島酒造の代表銘柄。まろやかで全国的に知名度が高い。', signature: 'れんと 25度', amazonKeyword: 'れんと 黒糖焼酎 奄美', rakutenKeyword: 'れんと 黒糖焼酎' },
    { nameJa: 'まんこい',  nameEn: 'Mankoi', founded: 1901, region: '奄美大島', flavorTags: ['古酒', '長期熟成', 'プレミアム'], desc: '弥生焼酎醸造所が手がける長期熟成黒糖焼酎。「まんこい」とは奄美の言葉で「招く・引き寄せる」の意。深い熟成香が魅力。', signature: 'まんこい 25度', amazonKeyword: 'まんこい 黒糖焼酎', rakutenKeyword: 'まんこい 黒糖焼酎' },
    { nameJa: '天海',  nameEn: 'Tenkai', founded: 1927, region: '奄美大島', flavorTags: ['バランス', '軽快', '食事向き'], desc: '奄美の天海酒造が手がけるバランスのとれた黒糖焼酎。食事を邪魔しない軽快な飲み口は島料理との相性が抜群。', signature: '天海 25度', amazonKeyword: '天海 黒糖焼酎 奄美', rakutenKeyword: '天海 黒糖焼酎' },
    { nameJa: '島有泉',  nameEn: 'Shima Yusen', founded: 1927, region: '奄美大島', flavorTags: ['甘み', '南国感', '個性的'], desc: '有村酒造の代表銘柄。奄美の太陽を思わせる南国的な甘みとコクは、島の食文化・郷土料理と深く結びついた味わい。', signature: '島有泉 25度', amazonKeyword: '島有泉 黒糖焼酎', rakutenKeyword: '島有泉 黒糖焼酎' },
    { nameJa: '崎山',  nameEn: 'Sakiyama', founded: 1927, region: '奄美大島', flavorTags: ['コク', '骨太', '通好み'], desc: '崎山酒造廠が手がける骨太でコクのある黒糖焼酎。甘みとビター感のバランスが焼酎通に好まれる本格的な1本。', signature: '崎山 25度', amazonKeyword: '崎山 黒糖焼酎 奄美', rakutenKeyword: '崎山 黒糖焼酎' },
    { nameJa: '弥生',  nameEn: 'Yayoi', founded: 1901, region: '奄美大島', flavorTags: ['春らしい', '軽快', 'フレッシュ'], desc: '弥生焼酎醸造所のフレッシュな若酒スタイル黒糖焼酎。「まんこい」と同じ蔵から生まれる、春のような軽やかな飲み口。', signature: '弥生 25度', amazonKeyword: '弥生 黒糖焼酎 奄美', rakutenKeyword: '弥生 黒糖焼酎' },
    { nameJa: '孤舟',  nameEn: 'Kojyu', founded: 1950, region: '奄美大島', flavorTags: ['長期熟成', '円熟', '琥珀'], desc: '長期間の樽熟成で琥珀色に変化した個性的な黒糖焼酎。ウイスキーを思わせるバニラとキャラメルの風味が焼酎とは思えない複雑さ。', signature: '孤舟 長期貯蔵', amazonKeyword: '孤舟 黒糖焼酎 長期熟成', rakutenKeyword: '孤舟 黒糖焼酎' },
    { nameJa: '昇龍',  nameEn: 'Shoryu', founded: 1948, region: '奄美大島', flavorTags: ['縁起物', 'まろやか', '贈り物'], desc: '昇る龍をイメージした縁起の良い名を持つ黒糖焼酎。まろやかで飲みやすく、祝いの席や贈り物として選ばれることが多い。', signature: '昇龍 25度', amazonKeyword: '昇龍 黒糖焼酎 奄美', rakutenKeyword: '昇龍 黒糖焼酎' },
    { nameJa: '珊瑚',  nameEn: 'Sango', founded: 1910, region: '奄美大島', flavorTags: ['海', '珊瑚礁', '清涼感'], desc: '奄美の美しいサンゴ礁をイメージした爽やかな黒糖焼酎。海と島の自然を感じさせる清涼感と甘みが夏の飲み物として最適。', signature: '珊瑚 25度', amazonKeyword: '珊瑚 黒糖焼酎 奄美', rakutenKeyword: '珊瑚 黒糖焼酎' },
    { nameJa: '長期貯蔵れんと',  nameEn: 'Rento Choki Chozo', founded: 1952, region: '奄美大島', flavorTags: ['長期熟成', 'まろやか', '上品'], desc: '定番「れんと」の長期貯蔵版。音楽熟成に加えてさらに長い時間をかけることで生まれる深いまろやかさとコクが楽しめる。', signature: '長期貯蔵れんと', amazonKeyword: '長期貯蔵 れんと 黒糖焼酎', rakutenKeyword: 'れんと 長期貯蔵' },
    { nameJa: '三年寝太郎',  nameEn: 'Sannen Netaro', founded: 1946, region: '奄美大島', flavorTags: ['3年熟成', '円熟', 'まろやか'], desc: '名前の通り3年間じっくり眠らせた長期熟成黒糖焼酎。時間をかけた分だけ深みとまろやかさが増した、じっくり味わいたい1本。', signature: '三年寝太郎 25度', amazonKeyword: '三年寝太郎 黒糖焼酎 奄美', rakutenKeyword: '三年寝太郎 黒糖焼酎' },
    { nameJa: 'AMAMI',  nameEn: 'AMAMI', founded: 1963, region: '奄美大島', flavorTags: ['モダン', 'デザイン', '土産'], desc: 'スタイリッシュなデザインボトルで土産品としても人気の黒糖焼酎。飲みやすく甘みのある味わいは黒糖焼酎を初めて飲む方のファーストチョイスにも。', signature: 'AMAMI 25度', amazonKeyword: 'AMAMI 黒糖焼酎 奄美', rakutenKeyword: 'AMAMI 黒糖焼酎' },
  ],
  beginnerTip: '黒糖焼酎入門は「里の曙」か「れんと」がおすすめ。ロックや水割りで黒糖の甘みを感じながら飲んでみてください。ラム酒が好きな方なら「孤舟」や「まんこい」の長期熟成タイプで、甘くリッチな世界観をお楽しみいただけます。',
  bottles: [
    { rank: 1, name: '里の曙', region: '黒糖焼酎', tags: ['奄美定番', 'まろやか'], reason: '奄美を代表する入門銘柄。まろやかな黒糖の甘みで飲みやすい', price: '1,200円〜（720ml）', amazonKeyword: '里の曙 黒糖焼酎', rakutenKeyword: '里の曙 黒糖焼酎', bottleSlug: null },
    { rank: 2, name: 'れんと', region: '黒糖焼酎', tags: ['音楽熟成', '全国区'], reason: 'クラシック音楽熟成で有名な全国区ブランド。まろやかで初心者に最適', price: '1,300円〜（720ml）', amazonKeyword: 'れんと 黒糖焼酎', rakutenKeyword: 'れんと 黒糖焼酎', bottleSlug: null },
    { rank: 3, name: '加那', region: '黒糖焼酎', tags: ['フルーティ', '上品'], reason: 'フルーティな甘みと上品な香り。黒糖焼酎で最も飲みやすい部類', price: '1,400円〜（720ml）', amazonKeyword: '加那 黒糖焼酎', rakutenKeyword: '加那 黒糖焼酎', bottleSlug: null },
    { rank: 4, name: '龍宮', region: '黒糖焼酎', tags: ['甕仕込み', 'コク'], reason: '甕仕込みの伝統製法。黒糖焼酎のコクと深みを知りたい方に', price: '1,300円〜（720ml）', amazonKeyword: '龍宮 黒糖焼酎', rakutenKeyword: '龍宮 黒糖焼酎', bottleSlug: null },
    { rank: 5, name: 'まんこい', region: '黒糖焼酎', tags: ['長期熟成', '複雑'], reason: '長期熟成の深みが際立つ。飲めば飲むほど奄美の大地を感じる', price: '1,600円〜（720ml）', amazonKeyword: 'まんこい 黒糖焼酎', rakutenKeyword: 'まんこい 黒糖焼酎', bottleSlug: null },
    { rank: 6, name: '孤舟', region: '黒糖焼酎', tags: ['樽熟成', 'ウイスキー的'], reason: '樽熟成でウイスキーに近い琥珀色。ウイスキーファンにも楽しめる珍しい焼酎', price: '2,500円〜（720ml）', amazonKeyword: '孤舟 黒糖焼酎 長期熟成', rakutenKeyword: '孤舟 黒糖焼酎', bottleSlug: null },
  ],
}

const GUIDE_DATA: Record<string, GuideData> = {
  scotch: SCOTCH,
  bourbon: BOURBON,
  japanese: JAPANESE,
  irish: IRISH,
  imo: IMO,
  mugi: MUGI,
  kome: KOME,
  kokuto: KOKUTO,
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
      <SubpageNav
        items={GUIDE_NAV_ITEMS}
        basePath="/whisky/guide"
        currentSlug={slug}
        categoryLabel="スタイルガイド"
      />

      <main>
        {/* ── ページヘッダー ── */}
        <div className="subPageHeader">
          <div className="subInner">
            <p className="subPageEn">{data.titleEn}</p>
            <h1 className="subPageTitle">
              <span className="subPageFlag">{data.flag}</span>
              {data.titleJa}
            </h1>
          </div>
        </div>

        {/* ── 蒸留所イメージ写真 ── */}
        {data.heroImage && (
          <div className="subHeroImage">
            <Image
              src={data.heroImage.src}
              alt={data.heroImage.alt}
              fill
              sizes="100vw"
              className="subHeroImg"
              style={{
                '--hero-obj-pos': data.heroImage.objectPosition ?? 'center center',
                '--hero-obj-pos-pc': data.heroImage.objectPositionPc ?? data.heroImage.objectPosition ?? 'center center',
              } as React.CSSProperties}
              priority
            />
            {data.heroImage.credit && (
              data.heroImage.creditUrl ? (
                <a
                  href={data.heroImage.creditUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="subHeroCredit"
                >
                  {data.heroImage.credit}
                </a>
              ) : (
                <p className="subHeroCredit">{data.heroImage.credit}</p>
              )
            )}
          </div>
        )}

        {/* ── 1. 概要 ── */}
        <section className="subSection">
          <div className="subInner">
            <h2 className="subSectionTitle">{data.introTitle ?? `${data.titleJa}とは`}</h2>
            <p className="subLeadText">{data.intro}</p>
          </div>
        </section>

        {/* ── 2. 5大産地カード（各産地にアフィリエイトリンク） ── */}
        {data.regions && (
          <section className="subSection">
            <div className="subInner">
              <h2 className="subSectionTitle">{data.regionsTitle ?? '主要産地・スタイル'}</h2>
              <div className="subRegionGrid">
                {data.regions.map((r) => {
                  const amazonUrl = buildAmazonUrl(r.amazonKeyword, AMAZON_TAG)
                  const rakutenUrl = buildRakutenUrl(r.rakutenKeyword, RAKUTEN_ID)
                  return (
                    <div key={r.name} className="subRegionCard">
                      <p className="subRegionName">{r.name}</p>
                      <p className="subRegionDesc">{r.desc}</p>
                      <p className="subRegionBrands">代表銘柄：{r.brands}</p>
                      <div className="subRegionBtns">
                        <a
                          href={amazonUrl}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="subBtnAmazon"
                        >
                          Amazon
                        </a>
                        <a
                          href={rakutenUrl}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="subBtnRakuten"
                        >
                          楽天
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── 3. シングルモルト vs グレーン（各カラムにアフィリエイトリンク） ── */}
        {data.compareLeft && data.compareRight && (
          <section className="subSection">
            <div className="subInner">
              <h2 className="subSectionTitle">{data.compareTitle ?? 'スタイルの違い'}</h2>
              <div className="subCompare">
                {[data.compareLeft, data.compareRight].map((col) => {
                  const amazonUrl = buildAmazonUrl(col.amazonKeyword, AMAZON_TAG)
                  const rakutenUrl = buildRakutenUrl(col.rakutenKeyword, RAKUTEN_ID)
                  return (
                    <div key={col.title} className="subCompareCol">
                      <p className="subCompareColTitle">{col.title}</p>
                      <ul className="subCompareList">
                        {col.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                      <div className="subCompareBtns">
                        <a
                          href={amazonUrl}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="subBtnAmazon"
                        >
                          Amazon
                        </a>
                        <a
                          href={rakutenUrl}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="subBtnRakuten"
                        >
                          楽天
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── 4. 主要ブランド解説 ── */}
        {data.brandProfiles && (
          <section className="subSection">
            <div className="subInner">
              <h2 className="subSectionTitle">主要ブランド解説</h2>
              <div className="subBrandGrid">
                {data.brandProfiles.map((brand) => {
                  const amazonUrl = buildAmazonUrl(brand.amazonKeyword, AMAZON_TAG)
                  const rakutenUrl = buildRakutenUrl(brand.rakutenKeyword, RAKUTEN_ID)
                  return (
                    <div key={brand.nameEn} className="subBrandCard">
                      <div className="subBrandBody">
                        <div className="subBrandMeta">
                          <span className="subBrandRegion">{brand.region}</span>
                          <span className="subBrandFounded">Est. {brand.founded}</span>
                        </div>
                        <h3 className="subBrandNameJa">{brand.nameJa}</h3>
                        <p className="subBrandNameEn">{brand.nameEn}</p>
                        <div className="subBrandFlavorTags">
                          {brand.flavorTags.map((t) => (
                            <span key={t} className="subBrandFlavorTag">{t}</span>
                          ))}
                        </div>
                        <p className="subBrandDesc">{brand.desc}</p>
                        <p className="subBrandSignature">
                          <span className="subBrandSignatureLabel">代表銘柄：</span>
                          {brand.signature}
                        </p>
                        <div className="subBrandBtns">
                          <a
                            href={amazonUrl}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="subBtnAmazon"
                          >
                            Amazon
                          </a>
                          <a
                            href={rakutenUrl}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="subBtnRakuten"
                          >
                            楽天
                          </a>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── 6. 初心者へのヒント ── */}
        {data.beginnerTip && (
          <section className="subSection">
            <div className="subInner">
              <h2 className="subSectionTitle">初心者へのおすすめ</h2>
              <p className="subLeadText">{data.beginnerTip}</p>
            </div>
          </section>
        )}

        {/* ── 7. おすすめ銘柄 ── */}
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

      <RelatedPages
        items={GUIDE_NAV_ITEMS}
        basePath="/whisky/guide"
        currentSlug={slug}
        title="他のスタイルガイドを見る"
      />
      <CTABanner />
      <SubpageFooter />
    </div>
  )
}
