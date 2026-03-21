// ============================================================
// SO WHAT Pick — 銘柄画像マッピング
// ⚠️  このファイルは bottle-images.csv から自動生成されます
//    直接編集せず、CSVを編集して以下を実行してください:
//    node scripts/gen-bottle-images.js
//
// 【画像の配置場所】
//   public/bottles/<ファイル名>  （例: public/bottles/yamazaki12.jpg）
//
// 【マッチングの仕組み】
//   AIが返した銘柄名に対してキーワードの部分一致で検索します。
//   長いキーワードが優先されるため "山崎12" を "山崎" より先にマッチします。
//
// 【進捗】 64 / 64 件設定済み
// ============================================================

export const BOTTLE_IMAGE_MAP: Record<string, string> = {

  // ── ジャパニーズ ────────────────────────────────────────────

  '山崎12'                : '/bottles/yamazaki-12.jpg',
  '山崎18'                : '/bottles/yamazaki-18.jpg',
  '山崎'                  : '/bottles/yamazaki.jpg',
  '白州12'                : '/bottles/hakushu-12.jpg',
  '白州'                  : '/bottles/hakushu.jpg',
  '響17'                 : '/bottles/hibiki-17.jpg',
  '響ジャパニーズ'             : '/bottles/hibiki-jh.jpg',
  '響'                   : '/bottles/hibiki.jpg',
  '知多'                  : '/bottles/chita.png',
  '余市'                  : '/bottles/yoichi.jpg',
  '宮城峡'                 : '/bottles/miyagikyo.jpg',
  'フロム・ザ・バレル'           : '/bottles/from-the-barrel.jpg',
  'ブラックニッカ'             : '/bottles/black-nikka.jpg',
  'イチローズモルト'            : '/bottles/ichiros-malt.jpg',
  '白角'                  : '/bottles/shiro-kaku.jpg',
  'トリス'                 : '/bottles/tris.jpg',

  // ── スコッチ(シングルモルト) ─────────────────────────────────────

  'グレンモーレンジ'            : '/bottles/glenmorangie.jpg',
  'グレンフィディック'           : '/bottles/glenfiddich.jpg',
  'マッカラン'               : '/bottles/macallan.jpg',
  'ラフロイグ'               : '/bottles/laphroaig.jpg',
  'アードベッグ'              : '/bottles/ardbeg.jpg',
  'ボウモア'                : '/bottles/bowmore.jpg',
  'グレンリベット'             : '/bottles/glenlivet.jpg',
  'グレングラント'             : '/bottles/glen-grant.jpg',
  'グレンドロナック'            : '/bottles/glendronach.jpg',
  'バルヴェニー'              : '/bottles/balvenie.jpg',
  'タリスカー'               : '/bottles/talisker.jpg',
  'オーバン'                : '/bottles/oban.jpg',
  'ダルウィニー'              : '/bottles/dalwhinnie.jpg',
  'クラガンモア'              : '/bottles/cragganmore.jpg',
  'アベラワー'               : '/bottles/aberlour.jpg',

  // ── スコッチ(ブレンデッド) ──────────────────────────────────────

  'ジョニーウォーカーブルー'        : '/bottles/johnnie-walker-blue.jpg',
  'ジョニーウォーカーブラック'       : '/bottles/johnnie-walker-black.jpg',
  'ジョニーウォーカー'           : '/bottles/johnnie-walker.jpg',
  'バランタイン17'            : '/bottles/ballantines-17.jpg',
  'バランタイン'              : '/bottles/ballantines.jpg',
  'シーバスリーガル'            : '/bottles/chivas-regal.jpg',
  'シングルトン'              : '/bottles/singleton.jpg',
  'デュワーズ'               : '/bottles/dewars.jpg',

  // ── バーボン ──────────────────────────────────────────────

  'メーカーズマーク'            : '/bottles/makers-mark.jpg',
  'バッファロートレース'          : '/bottles/buffalo-trace.jpg',
  'ウッドフォードリザーブ'         : '/bottles/woodford-reserve.jpg',
  'ワイルドターキー'            : '/bottles/wild-turkey.jpg',
  'ノブクリーク'              : '/bottles/knob-creek.jpg',
  'エライジャクレイグ'           : '/bottles/elijah-craig.jpg',
  'フォアローゼズ'             : '/bottles/four-roses.jpg',

  // ── 焼酎(芋) ─────────────────────────────────────────────

  '三岳'                  : '/bottles/mitake.jpg',
  '魔王'                  : '/bottles/maou.jpg',
  '森伊蔵'                 : '/bottles/morizou.jpg',
  '村尾'                  : '/bottles/murao.jpg',
  '伊佐美'                 : '/bottles/isami.jpg',
  '富乃宝山'                : '/bottles/tominohouzан.jpg',
  '黒霧島'                 : '/bottles/kuro-kirishima.jpg',
  '赤霧島'                 : '/bottles/aka-kirishima.jpg',
  '白霧島'                 : '/bottles/shiro-kirishima.jpg',
  '霧島'                  : '/bottles/kirishima.jpg',
  '白波'                  : '/bottles/shiranami.jpg',
  'さつま白波'               : '/bottles/satsuma-shiranami.jpg',

  // ── 焼酎(麦・米・その他) ───────────────────────────────────────

  '二階堂'                 : '/bottles/nikaido.jpg',
  'いいちこ'                : '/bottles/iichiko.jpg',
  '吉四六'                 : '/bottles/kicchoku.jpg',
  '百年の孤独'               : '/bottles/hyakunen-no-kodoku.jpg',
  '天草'                  : '/bottles/amakusa.jpg',
  '球磨焼酎'                : '/bottles/kuma-shochu.jpg',

}

/**
 * 銘柄名から画像URLを検索（部分一致）
 * 長いキーワードを優先してマッチングするため、より具体的な銘柄が優先されます。
 */
export function findBottleImage(name: string): string | null {
  const normalize = (s: string) =>
    s.replace(/[　\s\-・・]/g, '').toLowerCase()

  const normalizedName = normalize(name)

  // キーワード長の降順でソートして長いものを優先
  const sortedKeys = Object.keys(BOTTLE_IMAGE_MAP).sort((a, b) => b.length - a.length)

  for (const key of sortedKeys) {
    const url = BOTTLE_IMAGE_MAP[key]
    if (!url) continue // 未設定はスキップ
    if (normalizedName.includes(normalize(key))) {
      return url
    }
  }
  return null
}
