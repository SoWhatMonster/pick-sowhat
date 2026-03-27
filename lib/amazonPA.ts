// ============================================================
// SO WHAT Pick — Amazon PA-API v5 商品画像取得
// lib/amazonPA.ts
//
// 必要な環境変数:
//   AMAZON_PAAPI_ACCESS_KEY  — AWSアクセスキー
//   AMAZON_PAAPI_SECRET_KEY  — AWSシークレットキー
//   NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG — アソシエイトタグ
// ============================================================

import { createHmac, createHash } from 'crypto'

const PAAPI_HOST   = 'webservices.amazon.co.jp'
const PAAPI_REGION = 'us-east-1'
const PAAPI_PATH   = '/paapi5/searchitems'
const PAAPI_TARGET = 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems'

function hmac(key: Buffer, data: string): Buffer {
  return createHmac('sha256', key).update(data, 'utf8').digest()
}

function sha256hex(data: string): string {
  return createHash('sha256').update(data, 'utf8').digest('hex')
}

function signingKey(secret: string, dateStamp: string): Buffer {
  const kDate    = hmac(Buffer.from('AWS4' + secret, 'utf8'), dateStamp)
  const kRegion  = hmac(kDate,    PAAPI_REGION)
  const kService = hmac(kRegion,  'ProductAdvertisingAPI')
  return hmac(kService, 'aws4_request')
}

/**
 * Amazon PA-API v5 で商品画像URL（Large）を取得する。
 * 環境変数が未設定の場合は null を返す（ビルドは通る）。
 */
export async function fetchAmazonProductImage(keyword: string): Promise<string | null> {
  const accessKey  = process.env.AMAZON_PAAPI_ACCESS_KEY
  const secretKey  = process.env.AMAZON_PAAPI_SECRET_KEY
  const partnerTag = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG

  if (!accessKey || !secretKey || !partnerTag) return null

  // タイムスタンプ: 20260327T143000Z 形式
  const amzDate   = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
  const dateStamp = amzDate.slice(0, 8)

  const payload = JSON.stringify({
    Keywords:    keyword,
    Marketplace: 'www.amazon.co.jp',
    PartnerTag:  partnerTag,
    PartnerType: 'Associates',
    Resources:   ['Images.Primary.Large'],
    SearchIndex: 'All',
    ItemCount:   1,
  })

  const contentType     = 'application/json; charset=UTF-8'
  const payloadHash     = sha256hex(payload)
  const canonicalHeaders =
    `content-type:${contentType}\n` +
    `host:${PAAPI_HOST}\n` +
    `x-amz-date:${amzDate}\n` +
    `x-amz-target:${PAAPI_TARGET}\n`
  const signedHeaders   = 'content-type;host;x-amz-date;x-amz-target'
  const canonicalReq    = ['POST', PAAPI_PATH, '', canonicalHeaders, signedHeaders, payloadHash].join('\n')
  const credentialScope = `${dateStamp}/${PAAPI_REGION}/ProductAdvertisingAPI/aws4_request`
  const stringToSign    = ['AWS4-HMAC-SHA256', amzDate, credentialScope, sha256hex(canonicalReq)].join('\n')
  const sig             = createHmac('sha256', signingKey(secretKey, dateStamp)).update(stringToSign).digest('hex')
  const authHeader      =
    `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${sig}`

  try {
    const res = await fetch(`https://${PAAPI_HOST}${PAAPI_PATH}`, {
      method:  'POST',
      headers: {
        'Content-Type':  contentType,
        'Host':          PAAPI_HOST,
        'X-Amz-Date':   amzDate,
        'X-Amz-Target': PAAPI_TARGET,
        'Authorization': authHeader,
      },
      body: payload,
    })

    if (!res.ok) {
      console.warn('[amazonPA] HTTP', res.status)
      return null
    }

    const data = await res.json()
    return (data?.SearchResult?.Items?.[0]?.Images?.Primary?.Large?.URL as string) ?? null
  } catch (e) {
    console.warn('[amazonPA] fetch error:', e)
    return null
  }
}
