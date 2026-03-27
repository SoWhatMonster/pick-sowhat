// ============================================================
// SO WHAT Pick — 銘柄詳細 API
// app/api/bottle-detail/route.ts
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { getBottleDetail, type BottleDetail } from '@/lib/getBottleDetail'
import { checkRateLimit } from '@/lib/rateLimit'

export type { BottleDetail }

// 1IPあたり 10回/分
const LIMIT  = 10
const WINDOW = 60 * 1000

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const { allowed } = checkRateLimit(ip, LIMIT, WINDOW)
  if (!allowed) {
    return NextResponse.json({ error: 'リクエストが多すぎます' }, { status: 429 })
  }

  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  const name = searchParams.get('name') ?? undefined

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'slugが不正です' }, { status: 400 })
  }
  if (name && name.length > 200) {
    return NextResponse.json({ error: 'nameが長すぎます' }, { status: 400 })
  }

  try {
    const detail = await getBottleDetail(slug, name)
    if (!detail) return NextResponse.json({ error: '銘柄が見つかりません' }, { status: 404 })
    return NextResponse.json(detail)
  } catch (err) {
    console.error('[bottle-detail]', err)
    return NextResponse.json({ error: '銘柄詳細の取得に失敗しました' }, { status: 500 })
  }
}
