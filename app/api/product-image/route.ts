// ============================================================
// SO WHAT Pick — Whisky & Shochu
// app/api/product-image/route.ts
// Amazon PA-API から商品画像URLを取得するプロキシ
// ※ APIキーをクライアントに渡さないためサーバーサイドで処理
// ※ PA-API審査通過前はフォールバック（null）を返す
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const REGION = process.env.AMAZON_REGION ?? 'jp'
const SERVICE = 'ProductAdvertisingAPI'
const HOST = REGION === 'jp' ? 'webservices.amazon.co.jp' : 'webservices.amazon.com'
const ENDPOINT = `https://${HOST}/paapi5/searchitems`

/**
 * AWS Signature Version 4 署名を生成する
 */
function sign(key: Buffer, msg: string): Buffer {
  return crypto.createHmac('sha256', key).update(msg).digest()
}

function getSignatureKey(
  secretKey: string,
  dateStamp: string,
  regionName: string,
  serviceName: string
): Buffer {
  const kDate = sign(Buffer.from('AWS4' + secretKey, 'utf8'), dateStamp)
  const kRegion = sign(kDate, regionName)
  const kService = sign(kRegion, serviceName)
  const kSigning = sign(kService, 'aws4_request')
  return kSigning
}

async function searchAmazonProduct(keyword: string): Promise<string | null> {
  const accessKey = process.env.AMAZON_ACCESS_KEY
  const secretKey = process.env.AMAZON_SECRET_KEY
  const partnerTag = process.env.AMAZON_PARTNER_TAG

  // PA-API審査前はフォールバックを返す
  if (!accessKey || !secretKey || !partnerTag) {
    return null
  }

  const now = new Date()
  const amzDate = now.toISOString().replace(/[:\-]|\.\d{3}/g, '').substring(0, 15) + 'Z'
  const dateStamp = amzDate.substring(0, 8)

  const requestBody = JSON.stringify({
    Keywords: keyword,
    Resources: ['Images.Primary.Medium'],
    SearchIndex: 'All',
    ItemCount: 1,
    PartnerTag: partnerTag,
    PartnerType: 'Associates',
    Marketplace: `www.amazon.${REGION}`,
  })

  const contentHash = crypto
    .createHash('sha256')
    .update(requestBody)
    .digest('hex')

  // Canonical request
  const canonicalUri = '/paapi5/searchitems'
  const canonicalQueryString = ''
  const canonicalHeaders =
    `content-encoding:amz-1.0\n` +
    `content-type:application/json; charset=utf-8\n` +
    `host:${HOST}\n` +
    `x-amz-date:${amzDate}\n` +
    `x-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems\n`
  const signedHeaders =
    'content-encoding;content-type;host;x-amz-date;x-amz-target'
  const canonicalRequest = [
    'POST',
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    contentHash,
  ].join('\n')

  // String to sign
  const algorithm = 'AWS4-HMAC-SHA256'
  const credentialScope = `${dateStamp}/${REGION}/${SERVICE}/aws4_request`
  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    crypto.createHash('sha256').update(canonicalRequest).digest('hex'),
  ].join('\n')

  // Signature
  const signingKey = getSignatureKey(secretKey, dateStamp, REGION, SERVICE)
  const signature = crypto
    .createHmac('sha256', signingKey)
    .update(stringToSign)
    .digest('hex')

  const authorizationHeader =
    `${algorithm} Credential=${accessKey}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Encoding': 'amz-1.0',
        'Content-Type': 'application/json; charset=utf-8',
        Host: HOST,
        'X-Amz-Date': amzDate,
        'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems',
        Authorization: authorizationHeader,
      },
      body: requestBody,
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      console.warn('[product-image] PA-API error:', response.status)
      return null
    }

    const data = await response.json()
    const imageUrl =
      data?.SearchResult?.Items?.[0]?.Images?.Primary?.Medium?.URL ?? null
    return imageUrl
  } catch (err) {
    console.warn('[product-image] Fetch failed:', err)
    return null
  }
}

export async function GET(req: NextRequest) {
  const keyword = req.nextUrl.searchParams.get('keyword')

  if (!keyword) {
    return NextResponse.json({ imageUrl: null }, { status: 400 })
  }

  const imageUrl = await searchAmazonProduct(keyword)
  return NextResponse.json({ imageUrl })
}
