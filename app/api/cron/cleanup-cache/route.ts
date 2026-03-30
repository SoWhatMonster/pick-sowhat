// ============================================================
// SO WHAT Pick — キャッシュクリーンアップ Cron
// app/api/cron/cleanup-cache/route.ts
// Vercel Cron Job: 毎日深夜3時に実行
// ============================================================

export async function GET() {
  if (!process.env.POSTGRES_URL) {
    return Response.json({ ok: true, skipped: 'no db' })
  }
  try {
    const { sql } = await import('@/lib/db')
    const result = await sql`
      DELETE FROM recommendation_cache WHERE expires_at < NOW()
    `
    return Response.json({ ok: true, deleted: result.rowCount })
  } catch (e) {
    console.error('[cron/cleanup-cache]', e)
    return Response.json({ ok: false }, { status: 500 })
  }
}
