// ============================================================
// SO WHAT Pick — シーン別ウイスキーガイド 下層ページ
// /whisky/scene/[slug]
// ============================================================

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
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

// ── ギフトデータ ──────────────────────────────────────────

const GIFT: SceneData = {
  slug: 'gift',
  titleTag: '手土産・ギフトに喜ばれるウイスキー・焼酎おすすめ6選 | SO WHAT Pick',
  descriptionTag: '誕生日・お中元・お歳暮・父の日など各種ギフトに最適なウイスキー・焼酎を厳選。外れない贈り物をAmazon・楽天でそのまま購入できます。',
  titleJa: '手土産・ギフトに選ぶ1本',
  titleEn: 'The Perfect Gift Bottle',
  intro: 'ウイスキーや焼酎は贈り物として非常に喜ばれます。相手の好みが分からない場合も、ブランドの認知度・パッケージの高級感・価格帯を意識して選ぶと外れません。',
  criteria: [
    '知名度があり「もらって嬉しい」ブランド',
    'パッケージが美しく見栄えがする',
    '価格が3,000〜10,000円で相手に負担感を与えない',
    'ウイスキー・焼酎を飲む方なら幅広く喜ばれるスタイル',
  ],
  bottles: [
    { rank: 1, name: '響 JAPANESE HARMONY', region: 'ジャパニーズ', tags: ['高級感', '定番贈り物'], reason: 'サントリーの最高峰ブレンデッド。受け取った瞬間から喜ばれる日本を代表するウイスキー', price: '7,000円〜', amazonKeyword: '響 ジャパニーズハーモニー 700ml', rakutenKeyword: '響 ジャパニーズハーモニー', bottleSlug: null },
    { rank: 2, name: 'ウッドフォードリザーブ', region: 'バーボン', tags: ['オシャレ', 'プレミアム'], reason: 'スタイリッシュなボトルデザインがギフトに映える。バーボン好きへの贈り物に最適', price: '4,500円〜', amazonKeyword: 'ウッドフォードリザーブ バーボン', rakutenKeyword: 'ウッドフォードリザーブ', bottleSlug: null },
    { rank: 3, name: 'グレンリベット 12年', region: 'スコッチ', tags: ['スコッチ入門', '上品'], reason: 'スコッチの入門として最適な1本。甘めでバランス良く、幅広い方に喜ばれる', price: '3,500円〜', amazonKeyword: 'グレンリベット 12年 スコッチ', rakutenKeyword: 'グレンリベット 12年', bottleSlug: null },
    { rank: 4, name: '森伊蔵', region: '芋焼酎', tags: ['幻の焼酎', 'プレミアム'], reason: '入手困難な幻の芋焼酎。もらえたら驚くほど喜ばれる最高の贈り物', price: '5,000円〜', amazonKeyword: '森伊蔵 芋焼酎', rakutenKeyword: '森伊蔵 芋焼酎', bottleSlug: null },
    { rank: 5, name: 'マッカラン 12年', region: 'スコッチ', tags: ['シェリー樽', 'リッチ'], reason: 'スコッチの中でも知名度抜群。シェリー樽の甘く豊かな香りが特別感を演出', price: '7,000円〜', amazonKeyword: 'マッカラン 12年 ダブルカスク', rakutenKeyword: 'マッカラン 12年', bottleSlug: null },
    { rank: 6, name: '百年の孤独', region: '麦焼酎', tags: ['幻', '焼酎通向け'], reason: '焼酎好きには最高の贈り物。樽熟成の深い風味は焼酎の概念を変える', price: '3,000円〜', amazonKeyword: '百年の孤独 麦焼酎', rakutenKeyword: '百年の孤独 麦焼酎', bottleSlug: null },
  ],
  faqItems: [
    { q: 'ウイスキーをギフトにするときの相場は？', a: '手土産なら2,000〜4,000円、誕生日など少し特別な場面では5,000〜10,000円が目安。お歳暮・お中元なら5,000円前後が一般的です。' },
    { q: 'お酒を飲むかどうか分からない相手へのギフトは？', a: '相手がお酒を飲むかどうか確認してからにしましょう。飲むことが確認できたら、知名度の高い「響」「グレンフィディック」などブランド力のあるものを選ぶと安心です。' },
    { q: 'ラッピングや熨斗は付けられますか？', a: 'Amazon・楽天のギフトラッピングサービスをご利用いただけます。購入時に「ギフト包装」を選択してください。' },
  ],
}

// ── 冬の夜データ ──────────────────────────────────────────

const WINTER_NIGHT: SceneData = {
  slug: 'winter-night',
  titleTag: '冬の夜に飲みたいウイスキー・焼酎おすすめ6選 | SO WHAT Pick',
  descriptionTag: '冬の寒い夜にぴったりのウイスキー・焼酎を厳選。ホットウイスキーからリッチなシングルモルトまで、体が温まるおすすめ銘柄をAmazon・楽天で購入できます。',
  titleJa: '冬の夜に飲む1本',
  titleEn: 'Winter Night Dram',
  intro: '冬の夜はウイスキーが最も輝く季節。暖かい部屋で香りを楽しみながら飲むホットウイスキーや、シェリー樽熟成の濃厚な1本が、長い夜を特別なものに変えてくれます。',
  drinkingStyles: [
    { imageSrc: '/drinks/hot_toddy.jpg', name: 'ホットウイスキー', desc: '湯のみやマグカップにウイスキー・お湯・蜂蜜・レモンを入れる。体の芯から温まる冬の定番スタイル。' },
    { imageSrc: '/drinks/straight.jpg', name: 'ストレート', desc: '常温のまま少量ずつ味わう。ウイスキー本来の香りと味わいに集中できる、通好みの飲み方。' },
    { imageSrc: '/drinks/rock.jpg', name: 'ハーフロック', desc: '氷1〜2個と少量の水を加えるハーフロック。冬に飲む場合は少なめの氷で温度を保ちながら楽しむのがコツ。' },
  ],
  criteria: [
    'シェリー樽やバーボン樽のリッチな甘み',
    'スモーキーさや深みある複雑さ',
    '高めの度数（40〜46度）でゆっくり飲める',
    'ホット割りに合うまろやかさ',
  ],
  bottles: [
    { rank: 1, name: 'マッカラン 12年', region: 'スコッチ', tags: ['シェリー樽', 'リッチ'], reason: 'シェリー樽のドライフルーツ香が冬の夜に最高にマッチ。ストレートでゆっくり味わいたい', price: '7,000円〜', amazonKeyword: 'マッカラン 12年 ダブルカスク', rakutenKeyword: 'マッカラン 12年', bottleSlug: null },
    { rank: 2, name: 'ラフロイグ 10年', region: 'スコッチ', tags: ['スモーキー', '個性的'], reason: '強烈なピート香と海の塩気。暖炉の前でストレートで飲む体験は格別', price: '5,000円〜', amazonKeyword: 'ラフロイグ 10年 アイラ', rakutenKeyword: 'ラフロイグ 10年', bottleSlug: null },
    { rank: 3, name: 'グレンモーレンジィ オリジナル', region: 'スコッチ', tags: ['華やか', 'ホット向き'], reason: '柑橘・バニラの甘い香りがホットウイスキーにすると一層引き立つ', price: '4,500円〜', amazonKeyword: 'グレンモーレンジィ オリジナル スコッチ', rakutenKeyword: 'グレンモーレンジィ', bottleSlug: null },
    { rank: 4, name: 'ニッカ フロム ザ バレル', region: 'ジャパニーズ', tags: ['濃厚', '高度数'], reason: '51.4度の力強さを少量ずつ楽しむ冬の贅沢。冷えた体を一気に温める', price: '3,000円〜', amazonKeyword: 'ニッカ フロムザバレル', rakutenKeyword: 'ニッカ フロムザバレル', bottleSlug: null },
    { rank: 5, name: 'レッドブレスト 12年', region: 'アイリッシュ', tags: ['シェリー', '複雑'], reason: 'シェリー樽熟成のアイリッシュポットスチル。ドライフルーツとスパイスの冬向き複雑さ', price: '7,000円〜', amazonKeyword: 'レッドブレスト 12年', rakutenKeyword: 'レッドブレスト 12年', bottleSlug: null },
    { rank: 6, name: '天使の誘惑', region: '芋焼酎', tags: ['樽熟成', '焼酎燗'], reason: 'バーボン樽熟成の芋焼酎はお湯割りにすると木樽の甘みが際立つ。和の冬にぴったり', price: '2,000円〜', amazonKeyword: '天使の誘惑 芋焼酎', rakutenKeyword: '天使の誘惑 焼酎', bottleSlug: null },
  ],
  faqItems: [
    { q: 'ホットウイスキーの作り方は？', a: 'グラスに蜂蜜小さじ1・レモン汁少々を入れ、お湯（70〜80℃）を注いでからウイスキーを30〜45ml加えます。好みでシナモンスティックやクローブを添えると本格的になります。' },
    { q: '冬の夜に飲みやすいウイスキーの度数は？', a: '40〜46度のものをストレートやお湯割りで飲むのが冬には最適。カスクストレングス（55度以上）は少量加水してゆっくり楽しむのがおすすめです。' },
    { q: 'ウイスキーのお湯割りで使うウイスキーの量は？', a: 'お湯：ウイスキー＝6:4が基本。最初はうすめに作って、徐々に自分の好みを見つけていきましょう。' },
  ],
}

// ── 父の日・敬老の日データ ────────────────────────────────

const FATHERS_DAY: SceneData = {
  slug: 'fathers-day',
  titleTag: '父の日・敬老の日に贈るウイスキー・焼酎おすすめ6選 | SO WHAT Pick',
  descriptionTag: '父の日・敬老の日のプレゼントにぴったりなウイスキー・焼酎を厳選。お父さん・おじいちゃんが喜ぶ1本をAmazon・楽天で購入できます。',
  titleJa: '父の日・敬老の日の1本',
  titleEn: "Father's Day & Respect for the Aged",
  intro: '父の日や敬老の日には、日頃の感謝を込めた1本を贈りませんか。お父さん・おじいちゃんの好みに合わせて選ぶのが一番ですが、悩んだら日本人好みの銘柄・飲みやすい価格帯を優先しましょう。',
  criteria: [
    '日本人好みのまろやかな甘みがある',
    '高すぎず・安すぎない3,000〜8,000円の価格帯',
    '「特別な贈り物感」が出るパッケージ・ブランド力',
    'ストレート・ロック・お湯割りなど複数の飲み方で楽しめる',
  ],
  bottles: [
    { rank: 1, name: '山崎 ノンエイジ', region: 'ジャパニーズ', tags: ['日本No.1', '特別感'], reason: 'サントリー山崎蒸留所のシングルモルト。「日本のウイスキーを贈りたい」ならこれ一択', price: '6,000円〜', amazonKeyword: '山崎 ノンエイジ サントリー', rakutenKeyword: '山崎 シングルモルト', bottleSlug: null },
    { rank: 2, name: '知多', region: 'ジャパニーズ', tags: ['ハイボール向き', '飲みやすい'], reason: '軽やかなグレーンウイスキー。ハイボール好きのお父さんに。飲み疲れしない毎日の1本に', price: '3,000円〜', amazonKeyword: '知多 サントリー グレーンウイスキー', rakutenKeyword: '知多 ウイスキー', bottleSlug: null },
    { rank: 3, name: '竹鶴 ピュアモルト', region: 'ジャパニーズ', tags: ['バランス', '伝統'], reason: 'ニッカの創業者の名を冠したブレンデッドモルト。日本のウイスキー文化の伝統を贈る', price: '4,500円〜', amazonKeyword: '竹鶴 ピュアモルト ウイスキー', rakutenKeyword: '竹鶴 ウイスキー', bottleSlug: null },
    { rank: 4, name: '森伊蔵', region: '芋焼酎', tags: ['幻の焼酎', '最高の贈り物'], reason: '焼酎好きのお父さんなら最高の贈り物。入手困難な幻の芋焼酎に喜ばない人はいない', price: '5,000円〜', amazonKeyword: '森伊蔵 芋焼酎', rakutenKeyword: '森伊蔵 芋焼酎', bottleSlug: null },
    { rank: 5, name: '百年の孤独', region: '麦焼酎', tags: ['樽熟成', '焼酎の最高峰'], reason: '焼酎の概念を変える樽熟成麦焼酎。焼酎好きへの最高のサプライズになる', price: '3,000円〜', amazonKeyword: '百年の孤独 麦焼酎', rakutenKeyword: '百年の孤独 麦焼酎', bottleSlug: null },
    { rank: 6, name: 'グレンフィディック 12年', region: 'スコッチ', tags: ['世界No.1', 'フルーティ'], reason: '世界で最も売れているシングルモルト。スコッチを試したことのないお父さんへの入門に最適', price: '3,500円〜', amazonKeyword: 'グレンフィディック 12年 700ml', rakutenKeyword: 'グレンフィディック 12年', bottleSlug: null },
  ],
  faqItems: [
    { q: '父の日のウイスキーはいくら位が適切ですか？', a: '3,000〜8,000円が一般的なギフトとして最も喜ばれるゾーンです。特別感を出したい場合は10,000円以上の限定品も選択肢になります。' },
    { q: '父がウイスキーと焼酎どちら好きか分からない場合は？', a: 'ジャパニーズウイスキー（知多・竹鶴など）は両方の中間的な飲みやすさがあり失敗しにくいです。どちらも飲む方には「響」が喜ばれます。' },
    { q: 'おじいちゃんへの敬老の日には何が向いていますか？', a: 'まろやかで飲みやすい銘柄が向いています。「霧島」「三岳」などの芋焼酎や、「白岳」「繊月」などの米焼酎は幅広い年代に親しまれています。' },
  ],
}

// ── 食事に合わせたいデータ ────────────────────────────────

const FOOD_PAIRING: SceneData = {
  slug: 'food-pairing',
  titleTag: '食事に合うウイスキー・焼酎おすすめ6選 | SO WHAT Pick',
  descriptionTag: '肉料理・魚料理・チーズなど料理のジャンル別に合うウイスキー・焼酎を解説。食事をより美味しくする1本をAmazon・楽天で購入できます。',
  titleJa: '食事と楽しむ1本',
  titleEn: 'Food Pairing Guide',
  intro: 'ウイスキーや焼酎は食事との相性が良い飲み物です。料理の風味を邪魔しないよう、ハイボールや水割りで食中酒として楽しむのが基本。料理のジャンルに合わせて銘柄を選ぶと食卓がより豊かになります。',
  criteria: [
    'ハイボール・水割りにしたとき料理の邪魔をしない',
    '料理の脂・旨みと相性が良い',
    'アルコールのトゲが強すぎない',
    '食中酒として繰り返し飲んでも飽きない',
  ],
  bottles: [
    { rank: 1, name: '知多', region: 'ジャパニーズ', tags: ['食中酒No.1', 'ハイボール向き'], reason: 'グレーンウイスキーで料理を邪魔しない軽やかさ。ハイボールにすれば肉・魚・揚げ物何でも合う', price: '3,000円〜', amazonKeyword: '知多 サントリー ウイスキー', rakutenKeyword: '知多 ウイスキー', bottleSlug: null },
    { rank: 2, name: 'いいちこ', region: '麦焼酎', tags: ['食中酒', 'クリーン'], reason: '麦焼酎の王道。水割りにすれば和食全般と最高にマッチする毎日の食中酒', price: '700円〜（900ml）', amazonKeyword: 'いいちこ 麦焼酎 1800ml', rakutenKeyword: 'いいちこ 麦焼酎', bottleSlug: null },
    { rank: 3, name: 'ジェムソン', region: 'アイリッシュ', tags: ['なめらか', '肉料理向き'], reason: 'なめらかな飲み口が肉料理・バーガーと相性抜群。ハイボールにして食事のお供に', price: '2,500円〜', amazonKeyword: 'ジェムソン アイリッシュウイスキー 700ml', rakutenKeyword: 'ジェムソン ウイスキー', bottleSlug: null },
    { rank: 4, name: '武者返し', region: '米焼酎', tags: ['辛口', '和食全般'], reason: 'キレのある辛口米焼酎。刺身・寿司・天ぷらなど繊細な和食との相性が最高', price: '1,300円〜', amazonKeyword: '武者返し 米焼酎', rakutenKeyword: '武者返し 米焼酎', bottleSlug: null },
    { rank: 5, name: '白岳', region: '米焼酎', tags: ['まろやか', '魚介向き'], reason: '球磨焼酎のまろやかな甘みが繊細な魚介料理と絶妙にマッチ', price: '1,300円〜', amazonKeyword: '白岳 米焼酎 球磨', rakutenKeyword: '白岳 米焼酎', bottleSlug: null },
    { rank: 6, name: '黒霧島', region: '芋焼酎', tags: ['黒麹', '焼肉向き'], reason: '黒麹のキレが焼肉・豚骨系料理の脂を切る。九州料理との相性は折り紙付き', price: '1,100円〜（900ml）', amazonKeyword: '黒霧島 芋焼酎 1800ml', rakutenKeyword: '黒霧島 芋焼酎', bottleSlug: null },
  ],
  faqItems: [
    { q: 'チーズとウイスキーはどう合わせればいいですか？', a: 'スモーキーなアイラモルト（ラフロイグなど）にはブルーチーズや熟成チェダーが合います。フルーティなスペイサイドモルトにはカマンベールやクリームチーズが相性良好です。' },
    { q: '和食にはウイスキーと焼酎どちらが合いますか？', a: '繊細な出汁の和食には、米焼酎・麦焼酎の水割りが最適です。居酒屋系の料理にはハイボールのウイスキーも良く合います。' },
    { q: 'ウイスキーをカクテルにして食事に合わせるコツは？', a: 'ハイボール（ウイスキー+ソーダ）が最も汎用性が高く、ほぼあらゆる料理に合います。甘みが欲しい場合はジンジャーエールで割ったジンジャーハイも人気。' },
  ],
}

// ── BBQ・アウトドアデータ ─────────────────────────────────

const OUTDOOR: SceneData = {
  slug: 'outdoor',
  titleTag: 'BBQ・アウトドアで飲むウイスキー・焼酎おすすめ6選 | SO WHAT Pick',
  descriptionTag: 'BBQやキャンプ・アウトドアシーンにぴったりのウイスキー・焼酎を厳選。外で飲みたいハイボール向き銘柄をAmazon・楽天で購入できます。',
  titleJa: 'BBQ・アウトドアで飲む1本',
  titleEn: 'Outdoor & BBQ Whisky',
  intro: '開放的なアウトドアでのウイスキーは格別。炭火の煙とスモーキーなウイスキーの相性は抜群で、爽やかなハイボールや炭酸割りはBBQの食事をさらに盛り上げます。',
  drinkingStyles: [
    { imageSrc: '/drinks/highball.jpg', name: 'ハイボール', desc: 'ウイスキー1:炭酸4。外で飲む爽快感は格別。BBQの肉料理との相性も最高。' },
    { imageSrc: '/drinks/gingerhigh.jpg', name: 'ジンジャーハイ', desc: 'ウイスキー1:ジンジャーエール3。生姜の爽快感が加わり、アウトドアにぴったりの爽やかな味わい。' },
    { imageSrc: '/drinks/rock.jpg', name: 'ロック', desc: '氷だけで飲むシンプルスタイル。氷が溶けるにつれて変化する味を楽しみながら、焚き火や星空を眺めたい。' },
  ],
  criteria: [
    '炭酸割りやジンジャーハイにして美味しい',
    'BBQの煙・肉の香りと相性が良い',
    '持ち運びやすく、アウトドアに適した価格帯',
    '気軽にがぶがぶ飲める親しみやすさ',
  ],
  bottles: [
    { rank: 1, name: 'ジム・ビーム', region: 'バーボン', tags: ['ハイボール最強', 'コスパ'], reason: 'BBQハイボールの定番。コーラ割りでも最高。大人数の集まりに最適のコスパ', price: '1,500円〜', amazonKeyword: 'ジムビーム バーボン 700ml', rakutenKeyword: 'ジムビーム バーボン', bottleSlug: null },
    { rank: 2, name: 'ラフロイグ 10年', region: 'スコッチ', tags: ['スモーキー', 'BBQと最高'], reason: 'ピートスモークが炭火の香りとシンクロする唯一無二の体験。焚き火の前で飲みたい', price: '5,000円〜', amazonKeyword: 'ラフロイグ 10年', rakutenKeyword: 'ラフロイグ 10年', bottleSlug: null },
    { rank: 3, name: 'ブレット バーボン', region: 'バーボン', tags: ['スパイシー', 'ジンジャーハイ向き'], reason: 'スパイシーな個性がジンジャーエール割りで映える。肉料理との相性も抜群', price: '2,800円〜', amazonKeyword: 'ブレット バーボン', rakutenKeyword: 'ブレット バーボン', bottleSlug: null },
    { rank: 4, name: '黒霧島', region: '芋焼酎', tags: ['炭酸割り', 'BBQ向き'], reason: '芋焼酎炭酸割りはBBQと絶対合う。肉料理の脂をすっきりと洗い流す', price: '1,100円〜（900ml）', amazonKeyword: '黒霧島 芋焼酎 1800ml', rakutenKeyword: '黒霧島 芋焼酎', bottleSlug: null },
    { rank: 5, name: '知多', region: 'ジャパニーズ', tags: ['軽やか', '飲み飽きない'], reason: '軽やかなハイボールで飲み続けられる。長いBBQの時間に最適な飲み疲れしない1本', price: '3,000円〜', amazonKeyword: '知多 サントリー ウイスキー', rakutenKeyword: '知多 ウイスキー', bottleSlug: null },
    { rank: 6, name: 'いいちこ', region: '麦焼酎', tags: ['万能', 'キャンプ向き'], reason: 'キャンプの焚き火には麦焼酎のお湯割り。荷物にもならないパックタイプが便利', price: '700円〜（900ml）', amazonKeyword: 'いいちこ 麦焼酎 パック', rakutenKeyword: 'いいちこ 麦焼酎', bottleSlug: null },
  ],
  faqItems: [
    { q: 'キャンプ・アウトドアにはどんな容器が向いていますか？', a: 'ボトル持参が最もコスパが良いです。割れにくいステンレス製の水筒に入れ替えて持っていく方法もあります。紙パックタイプの焼酎はかさばらずゴミも少ないのでキャンプに最適です。' },
    { q: 'BBQに合うハイボールの作り方は？', a: 'ウイスキー1：炭酸水4が基本。よく冷やしたグラスに大きめの氷を入れ、炭酸を注いだら混ぜすぎないのがポイント。氷をいれたクーラーボックスでグラスを冷やすだけで劇的に美味しくなります。' },
    { q: 'ジンジャーハイの美味しい割り方を教えてください。', a: 'ウイスキー30ml：ジンジャーエール90〜120ml＋ライム少々が黄金比。辛口のジンジャーエールを使うと大人の味になります。生姜スライスを浮かべると本格的。' },
  ],
}

// ── 記念日・特別な夜データ ────────────────────────────────

const SPECIAL: SceneData = {
  slug: 'special',
  titleTag: '記念日・特別な夜に飲みたいウイスキー・焼酎おすすめ6選 | SO WHAT Pick',
  descriptionTag: '誕生日・結婚記念日・昇進祝いなど特別な夜にふさわしいウイスキー・焼酎を厳選。ストレートで楽しみたい上質な1本をAmazon・楽天で購入できます。',
  titleJa: '記念日・特別な夜の1本',
  titleEn: 'Special Occasion Dram',
  intro: '特別な夜は、いつもとは違う上質な1本を開けるチャンス。高級感のあるパッケージと深みある味わいが夜の思い出を彩ります。ストレートやロックでゆっくり時間をかけて味わいましょう。',
  drinkingStyles: [
    { imageSrc: '/drinks/straight.jpg', name: 'ストレート', desc: '加水も氷も加えないピュアな状態。ウイスキー本来の香り・味・余韻を存分に楽しめる最上の飲み方。' },
    { imageSrc: '/drinks/rock.jpg', name: 'オンザロック', desc: '大きな氷でゆっくり冷やしながら飲む。氷が溶けるにつれて加水され、味わいが変化する過程を楽しめる。' },
    { imageSrc: '/drinks/mizuwari.jpg', name: '少量加水', desc: 'ストレートに数滴の水を加えるトワイスアップ。水を加えることで眠っていた香りが開き、複雑な風味が花開く。' },
  ],
  criteria: [
    '高級感があり特別な夜にふさわしい存在感',
    'ストレート・ロックで本来の個性を楽しめる複雑な風味',
    '長期熟成や限定品など希少性・ストーリー性がある',
    '自分へのご褒美として納得できる価格帯',
  ],
  bottles: [
    { rank: 1, name: '山崎 12年', region: 'ジャパニーズ', tags: ['日本の最高峰', '記念日向き'], reason: 'ミズナラ樽の神秘的な香りと深みは特別な夜に最高の1本。見つけたら即購入を', price: '15,000円〜', amazonKeyword: '山崎 12年 サントリー', rakutenKeyword: '山崎 12年 ウイスキー', bottleSlug: null },
    { rank: 2, name: 'マッカラン 18年', region: 'スコッチ', tags: ['シェリー樽18年', '至高'], reason: '18年シェリー樽熟成の深み。開けた瞬間に広がる複雑な香りが夜を特別に変える', price: '30,000円〜', amazonKeyword: 'マッカラン 18年 スコッチ', rakutenKeyword: 'マッカラン 18年', bottleSlug: null },
    { rank: 3, name: 'ブラントンズ オリジナル', region: 'バーボン', tags: ['シングルバレル', 'コレクター'], reason: '世界初シングルバレルバーボン。骑手のストッパーコレクションも特別な夜の思い出に', price: '8,000円〜', amazonKeyword: 'ブラントンズ シングルバレル バーボン', rakutenKeyword: 'ブラントンズ バーボン', bottleSlug: null },
    { rank: 4, name: 'ニッカ フロム ザ バレル', region: 'ジャパニーズ', tags: ['コスパ最強', '記念日にも'], reason: '3,000円台とは思えない複雑な深み。「特別感とコスパ」の両立を求める方に最適', price: '3,000円〜', amazonKeyword: 'ニッカ フロムザバレル', rakutenKeyword: 'ニッカ フロムザバレル', bottleSlug: null },
    { rank: 5, name: '魔王', region: '芋焼酎', tags: ['3M', '焼酎最高峰'], reason: '芋焼酎の3Mの1つ。焼酎の特別な夜に開けたい1本としてこれ以上ない選択', price: '3,000円〜', amazonKeyword: '魔王 芋焼酎 720ml', rakutenKeyword: '魔王 芋焼酎', bottleSlug: null },
    { rank: 6, name: '厚岸 寒露', region: 'ジャパニーズ', tags: ['クラフト', '希少'], reason: '北海道のクラフト蒸留所の限定品。見かけたら即購入推奨の国内注目銘柄', price: '12,000円〜', amazonKeyword: '厚岸 シングルモルト 寒露', rakutenKeyword: '厚岸 ウイスキー', bottleSlug: null },
  ],
  faqItems: [
    { q: 'ストレートで飲む前に知っておくべきことは？', a: '少し飲む前に数分間グラスを手で温めると香りが開きます。飲む前にグラスを軽く回してアロマを引き出すのも効果的。水（チェイサー）を用意しておくと度数の強さを和らげられます。' },
    { q: '記念日に開ける価格帯はいくらが目安ですか？', a: '自分へのご褒美なら5,000〜15,000円、パートナーと一緒に楽しむなら10,000〜30,000円、一生に一度の記念には制限なしで選ぶのがおすすめです。' },
    { q: 'ウイスキーのコレクションとして保管するコツは？', a: '直射日光を避け、温度変化が少ない場所で立てて保管します。開封後は空気との接触が進むため、1〜2年以内に飲み切るのが理想です。コレクション用には未開封のまま保管しましょう。' },
  ],
}

const SCENE_DATA: Record<string, SceneData> = {
  beginner: BEGINNER,
  gift: GIFT,
  'winter-night': WINTER_NIGHT,
  'fathers-day': FATHERS_DAY,
  'food-pairing': FOOD_PAIRING,
  outdoor: OUTDOOR,
  special: SPECIAL,
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
                      <Image
                        src={s.imageSrc}
                        alt={s.name}
                        fill
                        sizes="(max-width: 640px) 45vw, 220px"
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
