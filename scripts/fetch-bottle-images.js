#!/usr/bin/env node
// ============================================================
// scripts/fetch-bottle-images.js
// Wikimedia Commons から銘柄画像を自動取得して public/bottles/ に保存する
//
// 使い方:
//   node scripts/fetch-bottle-images.js
//
// ・未取得の銘柄のみ処理（ステータスが「✅」以外）
// ・取得成功したらCSVを自動更新
// ・取得後に npm run gen:images を自動実行
// ============================================================

const fs   = require('fs')
const path = require('path')
const https = require('https')
const http  = require('http')

const CSV_PATH     = path.join(__dirname, '..', 'bottle-images.csv')
const BOTTLES_DIR  = path.join(__dirname, '..', 'public', 'bottles')

// Wikimedia Commons で検索するキーワードマップ（日本語名 → 英語検索クエリ）
// シンプルなブランド名で検索する方が見つかりやすい
const SEARCH_QUERIES = {
  // ── ジャパニーズ ──
  '山崎12':    'Yamazaki 12',
  '山崎18':    'Yamazaki 18',
  '山崎':      'Suntory Yamazaki',
  '白州12':    'Hakushu 12',
  '白州':      'Hakushu whisky',
  '響17':      'Hibiki 17',
  '響ジャパニーズ': 'Hibiki Japanese Harmony',
  '響':        'Hibiki whisky',
  '知多':      'Chita whisky',
  '余市':      'Yoichi whisky',
  '宮城峡':    'Miyagikyo whisky',
  'フロム・ザ・バレル': 'From the Barrel Nikka',
  'ブラックニッカ':    'Black Nikka',
  'イチローズモルト':  'Ichiro Malt',
  '白角':      'Kaku whisky',
  'トリス':    'Tris whisky',
  // ── スコッチ（シングルモルト）──
  'グレンモーレンジ':   'Glenmorangie',
  'グレンフィディック': 'Glenfiddich',
  'マッカラン':         'Macallan',
  'ラフロイグ':         'Laphroaig',
  'アードベッグ':       'Ardbeg',
  'ボウモア':           'Bowmore whisky',
  'グレンリベット':     'Glenlivet',
  'グレングラント':     'Glen Grant',
  'グレンドロナック':   'GlenDronach',
  'バルヴェニー':       'Balvenie',
  'タリスカー':         'Talisker',
  'オーバン':           'Oban whisky',
  'ダルウィニー':       'Dalwhinnie',
  'クラガンモア':       'Cragganmore',
  'アベラワー':         'Aberlour',
  // ── スコッチ（ブレンデッド）──
  'ジョニーウォーカーブルー':   'Johnnie Walker Blue Label',
  'ジョニーウォーカーブラック': 'Johnnie Walker Black Label',
  'ジョニーウォーカー':         'Johnnie Walker',
  'バランタイン17':             'Ballantines 17',
  'バランタイン':               'Ballantines whisky',
  'シーバスリーガル':           'Chivas Regal',
  'シングルトン':               'Singleton whisky',
  'デュワーズ':                 'Dewars whisky',
  // ── バーボン ──
  'メーカーズマーク':       'Makers Mark',
  'バッファロートレース':   'Buffalo Trace',
  'ウッドフォードリザーブ': 'Woodford Reserve',
  'ワイルドターキー':       'Wild Turkey bourbon',
  'ノブクリーク':           'Knob Creek',
  'エライジャクレイグ':     'Elijah Craig',
  'フォアローゼズ':         'Four Roses bourbon',
  // ── 焼酎 ──
  '三岳':       'Mitake shochu',
  '魔王':       'Maou shochu',
  '森伊蔵':     'Morizou shochu',
  '村尾':       'Murao shochu',
  '伊佐美':     'Isami shochu',
  '富乃宝山':   'Tominohozан shochu',
  '黒霧島':     'Kirishima black shochu',
  '赤霧島':     'Kirishima red shochu',
  '白霧島':     'Kirishima white shochu',
  '霧島':       'Kirishima shochu',
  'さつま白波': 'Satsuma Shiranami',
  '白波':       'Shiranami shochu',
  '二階堂':     'Nikaido shochu',
  'いいちこ':   'Iichiko',
  '吉四六':     'Kicchoku shochu',
  '百年の孤独': 'Hyakunen no Kodoku',
  '天草':       'Amakusa shochu',
  '球磨焼酎':   'Kuma shochu',
}

// ── ユーティリティ ─────────────────────────────────────────

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http
    client.get(url, { headers: { 'User-Agent': 'SOWHATPickBot/1.0' } }, (res) => {
      // リダイレクト追従（最大3回）
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
        resolve(httpsGet(res.headers.location))
        return
      }
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => resolve({ status: res.statusCode, body: data }))
    }).on('error', reject)
  })
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http
    const file = fs.createWriteStream(dest)
    client.get(url, { headers: { 'User-Agent': 'SOWHATPickBot/1.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
        file.close()
        fs.unlinkSync(dest)
        resolve(downloadFile(res.headers.location, dest))
        return
      }
      if (res.statusCode !== 200) {
        file.close()
        fs.unlinkSync(dest)
        reject(new Error(`HTTP ${res.statusCode}`))
        return
      }
      res.pipe(file)
      file.on('finish', () => file.close(resolve))
    }).on('error', (err) => {
      fs.unlinkSync(dest)
      reject(err)
    })
  })
}

// Wikimedia Commons API でボトル画像を検索
async function searchWikimedia(query) {
  const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=5&format=json`
  try {
    const { body } = await httpsGet(searchUrl)
    const json = JSON.parse(body)
    const hits = json?.query?.search ?? []
    if (hits.length === 0) return null

    // 最初のヒットからURLを取得
    const title = hits[0].title
    const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|mime&format=json`
    const { body: infoBody } = await httpsGet(infoUrl)
    const infoJson = JSON.parse(infoBody)
    const pages = Object.values(infoJson?.query?.pages ?? {})
    if (pages.length === 0) return null

    const imageInfo = pages[0]?.imageinfo?.[0]
    if (!imageInfo) return null

    // JPEGまたはPNGのみ
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(imageInfo.mime)) return null

    return imageInfo.url
  } catch {
    return null
  }
}

// ── CSVパーサー ──────────────────────────────────────────────

function parseCsv(raw) {
  const lines = raw.replace(/^\uFEFF/, '').trim().split('\n')
  const header = lines[0]
  const rows = lines.slice(1).map((line) => {
    const cols = line.split(',')
    return {
      key:       cols[0]?.trim() ?? '',
      category:  cols[1]?.trim() ?? '',
      name:      cols[2]?.trim() ?? '',
      filename:  cols[3]?.trim() ?? '',
      status:    cols[4]?.trim() ?? '',
      note:      cols[5]?.trim() ?? '',
      _raw:      line,
    }
  })
  return { header, rows }
}

function serializeCsv(header, rows) {
  const lines = [header, ...rows.map((r) =>
    [r.key, r.category, r.name, r.filename, r.status, r.note].join(',')
  )]
  return '\uFEFF' + lines.join('\n') + '\n'
}

// ── メイン ──────────────────────────────────────────────────

async function main() {
  fs.mkdirSync(BOTTLES_DIR, { recursive: true })

  const raw = fs.readFileSync(CSV_PATH, 'utf8')
  const { header, rows } = parseCsv(raw)

  const targets = rows.filter((r) => r.key && r.status !== '✅' && r.filename)
  console.log(`\n🔍  未取得: ${targets.length} 件を処理します\n`)

  let success = 0
  let failed  = 0

  for (const row of targets) {
    const query = SEARCH_QUERIES[row.key]
    if (!query) {
      console.log(`  ⏭  ${row.key}: 検索クエリ未定義 → スキップ`)
      continue
    }

    process.stdout.write(`  🔎  ${row.key} (${query}) ... `)

    const imageUrl = await searchWikimedia(query)
    if (!imageUrl) {
      console.log('❌ 見つからず')
      failed++
      continue
    }

    const ext  = imageUrl.includes('.png') ? '.png' : '.jpg'
    const base = row.filename.replace(/\.(jpg|png)$/, '')
    const filename = base + ext
    const destPath = path.join(BOTTLES_DIR, filename)

    try {
      await downloadFile(imageUrl, destPath)
      // CSVのファイル名と一致しない場合は更新
      row.filename = filename
      row.status   = '✅'
      success++
      console.log(`✅ 保存: ${filename}`)
    } catch (err) {
      console.log(`❌ ダウンロード失敗: ${err.message}`)
      failed++
    }

    // API負荷軽減のため少し待機
    await new Promise((r) => setTimeout(r, 300))
  }

  // CSV を更新して保存
  fs.writeFileSync(CSV_PATH, serializeCsv(header, rows), 'utf8')
  console.log(`\n📄  CSV を更新しました`)

  // bottleImages.ts を再生成
  console.log(`\n⚙️   constants/bottleImages.ts を再生成...`)
  require('./gen-bottle-images.js')

  console.log(`\n📊  結果: 成功 ${success} 件 / 失敗 ${failed} 件`)
  if (failed > 0) {
    console.log(`    失敗した銘柄はCSVで「ファイル名」列を確認し、手動で画像を追加してください`)
  }
  console.log(`\n✨  完了！ public/bottles/ に画像が保存されました\n`)
}

main().catch((err) => {
  console.error('エラー:', err)
  process.exit(1)
})
