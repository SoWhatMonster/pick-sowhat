// ============================================================
// SO WHAT Pick — ウイスキースタイルガイド 下層ページ
// /whisky/guide/[slug]
// ============================================================

import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import SubpageTopbar from '@/components/subpage/SubpageTopbar'
import Breadcrumb from '@/components/subpage/Breadcrumb'
import BottleCard, { type BottleData } from '@/components/subpage/BottleCard'
import CTABanner from '@/components/subpage/CTABanner'
import SubpageFooter from '@/components/subpage/SubpageFooter'
import { buildAmazonUrl, buildRakutenUrl } from '@/lib/affiliate'

const AMAZON_TAG = process.env.AMAZON_ASSOCIATE_TAG ?? ''
const RAKUTEN_ID = process.env.RAKUTEN_AFFILIATE_ID ?? ''

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
  /** /public/ 以下のパス。実際の蒸留所写真に差し替え可 */
  src: string
  alt: string
  credit?: string
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
  heroImage?: HeroImage
  regions?: Region[]
  compareLeft?: CompareCol
  compareRight?: CompareCol
  brandProfiles?: Brand[]
  beginnerTip?: string
  bottles: BottleData[]
  faqItems?: { q: string; a: string }[]
}

// ── スコッチデータ ─────────────────────────────────────────

const SCOTCH: GuideData = {
  slug: 'scotch',
  flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  titleTag: 'スコッチウイスキーとは？産地・種類・おすすめ銘柄を解説 | SO WHAT Pick',
  descriptionTag:
    'スコッチウイスキーの産地・スタイル・味わいの特徴をわかりやすく解説。初心者から上級者まで、産地別おすすめ銘柄をAmazon・楽天でそのまま購入できます。',
  titleJa: 'スコッチウイスキー',
  titleEn: 'Scotch Whisky Guide',
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
    credit: '※ 実際の蒸留所写真に差し替えてください',
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
            <p className="subPageEn">
              <span className="subPageFlag">{data.flag}</span>
              {data.titleEn}
            </p>
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
              width={1200}
              height={500}
              className="subHeroImg"
              priority
            />
            {data.heroImage.credit && (
              <p className="subHeroCredit">{data.heroImage.credit}</p>
            )}
          </div>
        )}

        {/* ── 1. 概要 ── */}
        <section className="subSection">
          <div className="subInner">
            <h2 className="subSectionTitle">スコッチとは</h2>
            <p className="subLeadText">{data.intro}</p>
          </div>
        </section>

        {/* ── 2. 5大産地カード（各産地にアフィリエイトリンク） ── */}
        {data.regions && (
          <section className="subSection">
            <div className="subInner">
              <h2 className="subSectionTitle">5大産地</h2>
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
              <h2 className="subSectionTitle">シングルモルトとグレーンの違い</h2>
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

      <CTABanner />
      <SubpageFooter />
    </div>
  )
}
