// ============================================================
// SO WHAT Pick — シンプルなIPベースレート制限
// lib/rateLimit.ts
// ============================================================

type RateLimitEntry = { count: number; resetAt: number }

const store = new Map<string, RateLimitEntry>()

/**
 * @param ip      クライアントIP
 * @param limit   許可リクエスト数
 * @param windowMs ウィンドウ（ミリ秒）
 * @returns allowed: true なら通過、false なら429
 */
export function checkRateLimit(
  ip: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = store.get(ip)

  if (!entry || entry.resetAt < now) {
    store.set(ip, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1 }
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  return { allowed: true, remaining: limit - entry.count }
}
