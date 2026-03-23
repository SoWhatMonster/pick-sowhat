// ============================================================
// SO WHAT Pick — Whisky & Shochu
// lib/fortune.ts
// 星座・干支などおみくじ用ユーティリティ
// ============================================================

/**
 * 月日から西洋星座を返す（日本語かな表記）
 */
export function getZodiacSign(month: number, day: number): string {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'おひつじ座'
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'おうし座'
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'ふたご座'
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'かに座'
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'しし座'
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'おとめ座'
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'てんびん座'
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'さそり座'
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'いて座'
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'やぎ座'
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'みずがめ座'
  return 'うお座'
}

/** 今月の支配星座を返す（月の前半・後半で変わるため「〜座または〜座」形式） */
export function getMonthZodiacLabel(month: number): string {
  const labels: Record<number, string> = {
    1:  'やぎ座・みずがめ座',
    2:  'みずがめ座・うお座',
    3:  'うお座・おひつじ座',
    4:  'おひつじ座・おうし座',
    5:  'おうし座・ふたご座',
    6:  'ふたご座・かに座',
    7:  'かに座・しし座',
    8:  'しし座・おとめ座',
    9:  'おとめ座・てんびん座',
    10: 'てんびん座・さそり座',
    11: 'さそり座・いて座',
    12: 'いて座・やぎ座',
  }
  return labels[month] ?? 'うお座・おひつじ座'
}

/**
 * 年から干支を返す
 * 例: 2026 → '午'
 */
export function getEtoSign(year: number): string {
  const eto = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
  return eto[((year - 4) % 12 + 12) % 12]
}

/**
 * Date オブジェクトから今日のおみくじ用 fortune コンテキスト文字列を生成
 */
export function buildTodayFortuneContext(date: Date): string {
  const year  = date.getFullYear()
  const month = date.getMonth() + 1
  const day   = date.getDate()
  const weekdays = ['日', '月', '火', '水', '木', '金', '土']
  const weekday  = weekdays[date.getDay()]
  const eto      = getEtoSign(year)
  const zodiac   = getMonthZodiacLabel(month)

  return `今日の日付: ${year}年${month}月${day}日（${weekday}）\n今月の星座: ${zodiac}\n今年の干支: ${eto}年（${year}年）`
}
