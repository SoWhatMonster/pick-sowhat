// ============================================================
// SO WHAT Pick — 銘柄詳細 API
// app/api/bottle-detail/route.ts
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { getBottleDetail, type BottleDetail } from '@/lib/getBottleDetail'

export type { BottleDetail }

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  const name = searchParams.get('name') ?? undefined

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'slugが不正です' }, { status: 400 })
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
