// ============================================================
// SO WHAT Pick — 銘柄ヘルパー（タグ→画像・アイコン変換）
// lib/bottleHelper.ts
// ============================================================

const TAG_IMAGE_MAP: [string, string][] = [
  ['スコッチ',     '/distillery/scotch.jpg'],
  ['アイリッシュ', '/distillery/irish.jpg'],
  ['ジャパニーズ', '/distillery/japanese.jpg'],
  ['バーボン',     '/distillery/bourbon.jpg'],
  ['アメリカン',   '/distillery/bourbon.jpg'],
  ['カナディアン', '/distillery/canadian.jpg'],
  ['ニューワールド', '/distillery/newworld.jpg'],
  ['芋焼酎',      '/distillery/imo.jpg'],
  ['麦焼酎',      '/distillery/mugi.jpg'],
  ['米焼酎',      '/distillery/kome.jpg'],
  ['黒糖焼酎',    '/distillery/kokuto.jpg'],
  ['焼酎',        '/distillery/other-shochu.jpg'],
]

const TAG_ICON_MAP: [string, string][] = [
  ['スコッチ',     '🏴󠁧󠁢󠁳󠁣󠁴󠁿'],
  ['アイリッシュ', '🇮🇪'],
  ['ジャパニーズ', '🇯🇵'],
  ['バーボン',     '🇺🇸'],
  ['アメリカン',   '🇺🇸'],
  ['カナディアン', '🇨🇦'],
  ['ニューワールド', '🌍'],
  ['台湾',        '🌍'],
  ['インド',       '🌍'],
  ['芋焼酎',      '🍠'],
  ['麦焼酎',      '🌾'],
  ['米焼酎',      '🍚'],
  ['黒糖焼酎',    '🍬'],
  ['焼酎',        '🌿'],
]

/** タグ配列から最初にマッチするカテゴリ画像パスを返す */
export function getTagImage(tags: string[]): string {
  for (const tag of tags) {
    for (const [keyword, path] of TAG_IMAGE_MAP) {
      if (tag.includes(keyword)) return path
    }
  }
  return '/distillery/scotch.jpg' // fallback
}

/** タグ配列から最初にマッチするカテゴリアイコンを返す */
export function getTagIcon(tags: string[]): string {
  for (const tag of tags) {
    for (const [keyword, icon] of TAG_ICON_MAP) {
      if (tag.includes(keyword)) return icon
    }
  }
  return '🥃' // fallback
}
