#!/usr/bin/env node
// ============================================================
// scripts/gen-bottle-images.js
// bottle-images.csv から constants/bottleImages.ts を自動生成する
//
// 使い方:
//   node scripts/gen-bottle-images.js
//
// CSVのカラム:
//   キー, カテゴリ, 銘柄名（参考）, ファイル名, ステータス, 備考
// ============================================================

const fs = require('fs')
const path = require('path')

const CSV_PATH = path.join(__dirname, '..', 'bottle-images.csv')
const OUT_PATH = path.join(__dirname, '..', 'constants', 'bottleImages.ts')

// CSV をパース（ヘッダー行はスキップ）
const lines = fs.readFileSync(CSV_PATH, 'utf8').trim().split('\n').slice(1)

// カテゴリ別にグループ化
const groups = {}
let total = 0
let filled = 0

for (const line of lines) {
  if (!line.trim()) continue
  // カンマ区切り（備考フィールドにカンマが入る可能性があるため最大5分割）
  const cols = line.split(',')
  const key      = cols[0]?.trim() ?? ''
  const category = cols[1]?.trim() ?? 'その他'
  const filename = cols[3]?.trim() ?? ''

  if (!key) continue
  total++
  if (filename) filled++

  if (!groups[category]) groups[category] = []
  groups[category].push({ key, filename })
}

// TypeScript ファイルを生成
const lines_out = []
lines_out.push(`// ============================================================`)
lines_out.push(`// SO WHAT Pick — 銘柄画像マッピング`)
lines_out.push(`// ⚠️  このファイルは bottle-images.csv から自動生成されます`)
lines_out.push(`//    直接編集せず、CSVを編集して以下を実行してください:`)
lines_out.push(`//    node scripts/gen-bottle-images.js`)
lines_out.push(`//`)
lines_out.push(`// 【画像の配置場所】`)
lines_out.push(`//   public/bottles/<ファイル名>  （例: public/bottles/yamazaki12.jpg）`)
lines_out.push(`//`)
lines_out.push(`// 【マッチングの仕組み】`)
lines_out.push(`//   AIが返した銘柄名に対してキーワードの部分一致で検索します。`)
lines_out.push(`//   長いキーワードが優先されるため "山崎12" を "山崎" より先にマッチします。`)
lines_out.push(`//`)
lines_out.push(`// 【進捗】 ${filled} / ${total} 件設定済み`)
lines_out.push(`// ============================================================`)
lines_out.push(``)
lines_out.push(`export const BOTTLE_IMAGE_MAP: Record<string, string> = {`)
lines_out.push(``)

for (const [category, items] of Object.entries(groups)) {
  // カテゴリコメント
  const pad = 50
  lines_out.push(`  // ── ${category} ${'─'.repeat(Math.max(0, pad - category.length))}`)
  lines_out.push(``)
  for (const { key, filename } of items) {
    const url = filename ? `'/bottles/${filename}'` : `''`
    // キーの幅を揃える（最大20文字）
    const paddedKey = `'${key}'`.padEnd(22)
    lines_out.push(`  ${paddedKey}: ${url},`)
  }
  lines_out.push(``)
}

lines_out.push(`}`)
lines_out.push(``)
lines_out.push(`/**`)
lines_out.push(` * 銘柄名から画像URLを検索（部分一致）`)
lines_out.push(` * 長いキーワードを優先してマッチングするため、より具体的な銘柄が優先されます。`)
lines_out.push(` */`)
lines_out.push(`export function findBottleImage(name: string): string | null {`)
lines_out.push(`  const normalize = (s: string) =>`)
lines_out.push(`    s.replace(/[　\\s\\-・・]/g, '').toLowerCase()`)
lines_out.push(``)
lines_out.push(`  const normalizedName = normalize(name)`)
lines_out.push(``)
lines_out.push(`  // キーワード長の降順でソートして長いものを優先`)
lines_out.push(`  const sortedKeys = Object.keys(BOTTLE_IMAGE_MAP).sort((a, b) => b.length - a.length)`)
lines_out.push(``)
lines_out.push(`  for (const key of sortedKeys) {`)
lines_out.push(`    const url = BOTTLE_IMAGE_MAP[key]`)
lines_out.push(`    if (!url) continue // 未設定はスキップ`)
lines_out.push(`    if (normalizedName.includes(normalize(key))) {`)
lines_out.push(`      return url`)
lines_out.push(`    }`)
lines_out.push(`  }`)
lines_out.push(`  return null`)
lines_out.push(`}`)
lines_out.push(``)

fs.writeFileSync(OUT_PATH, lines_out.join('\n'), 'utf8')

console.log(`✅  constants/bottleImages.ts を生成しました`)
console.log(`    進捗: ${filled} / ${total} 件設定済み`)
if (total - filled > 0) {
  console.log(`    未設定: ${total - filled} 件（CSVの「ファイル名」列を埋めてください）`)
}
