import { NextRequest, NextResponse } from 'next/server'
import { getRecommendations, RecommendRequest } from '@/lib/anthropic'

export async function POST(req: NextRequest) {
  try {
    const body: RecommendRequest = await req.json()

    // experienceはギフトモード時にundefinedになるため除外
    if (!body.mode || !body.flavors || !body.spirit || !body.budget) {
      return NextResponse.json(
        { error: '必須パラメータが不足しています' },
        { status: 400 }
      )
    }

    const result = await getRecommendations(body)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[recommend] Error:', err)
    if (err instanceof SyntaxError) {
      return NextResponse.json({ error: 'AIレスポンスのパースに失敗しました' }, { status: 500 })
    }
    return NextResponse.json(
      { error: 'レコメンドの取得に失敗しました。しばらくしてからお試しください。' },
      { status: 500 }
    )
  }
}
