# Cowork指示書：ウイスキー・焼酎レコメンドツール
**プロジェクト名**: SO WHAT Pick — Whisky & Shochu  
**URL**: `pick.sowhat.monster/whisky`  
**作成日**: 2026-03-14  
**バージョン**: v1.0

---

## 1. 概要

ユーザーのシーン・気分・フレーバーの好みをもとに、Anthropic APIがウイスキーまたは焼酎の銘柄を3件レコメンドするWebツール。Amazon・楽天のアフィリエイトリンクで収益化する。

**Phase 1（今回）**: 日本語のみ・日本向けアフィリエイト  
**Phase 2（将来）**: `/en/whisky` に英語版を追加。ブラウザ言語を自動検出してリダイレクト。アフィリエイトリンクも言語に紐づけて出し分け。

---

## 2. 技術スタック

| 要素 | 採用技術 |
|---|---|
| フレームワーク | Next.js（App Router） |
| ホスティング | Vercel |
| AI | Anthropic API（`claude-sonnet-4-20250514`） |
| 商品画像 | Amazon PA-API（Product Advertising API） |
| アフィリエイト | Amazon Associates / 楽天アフィリエイト |
| スタイリング | CSS Modules |
| 分析 | Google Tag Manager（GTM-MDDFMDK9） |

---

## 3. ファイル構成

```
pick.sowhat.monster/
├── app/
│   └── whisky/
│       └── page.tsx          ← 今回の実装対象
├── components/
│   └── pick/                 ← 将来の横展開（/beer, /wine等）で共通化
│       ├── StepFlow.tsx
│       ├── SceneCard.tsx
│       ├── FlavorSlider.tsx
│       └── ResultCard.tsx
├── constants/
│   ├── ja.ts                 ← 日本語テキスト定数（Phase 2でen.tsを追加）
│   └── whisky.ts             ← ステップの選択肢定数
└── lib/
    ├── anthropic.ts          ← AI呼び出しロジック
    └── affiliate.ts          ← アフィリエイトリンク生成（言語別切り替え対応）
```

> **重要**: UIテキスト・選択肢はすべて定数ファイルで管理し、ハードコードしないこと。Phase 2で `en.ts` を追加するだけで英語対応できる構造にする。

---

## 4. ブランド・デザイン仕様

### カラー
```css
--accent: #c8fe08;
--accent-dim: rgba(200,254,8,0.15);
--surface: #1a1a18;
--surface2: #242420;
--surface3: #2e2e28;
--border: rgba(255,255,255,0.1);
--text1: #f0ede6;
--text2: #9a9888;
--text3: #5a5a52;
--rakuten-red: #bf0000;
```

### タイポグラフィ
- ワードマーク・見出し: `'Arial Narrow', Arial, sans-serif`、letter-spacing広め
- UI・ラベル: `Arial, sans-serif`
- 説明文: `'Georgia', serif`

### ロゴ表記
```
✦ SO WHAT
```

---

## 5. 画面フローと各ステップ仕様

### フロー概要

```
STEP 0: 自分用 / ギフト用 の分岐
  ↓ 自分用              ↓ ギフト用
STEP 1A: シーン選択    STEP 1B: 相手情報入力
         ↓                      ↓
       STEP 2: フレーバースライダー ＋ 酒種選択
                        ↓
              STEP 3: 予算 ＋ 経験値
                        ↓
              RESULT: レコメンド結果（3銘柄）
```

各ステップに「← 戻る」ボタンを設置。STEP 2の「戻る」は自分用/ギフト用に応じて1A/1Bに正しく戻ること。

---

### STEP 0：モード選択

- 選択肢: 「🥃 自分用」「🎁 ギフト用」（2カラムグリッド）
- シングルセレクト・タップ後180ms遅延でSTEP 1へ遷移

---

### STEP 1A：シーン選択（自分用）

**タイトル**: `今はどんなシーンですか？`  
**サブノート**: `📍 現在の季節を自動で考慮します`

現在の月をJSで取得し、AIプロンプトに「現在◯月（季節）」として自動で渡す。ユーザーには季節名のみ表示（例：「冬」）。

**選択肢（`constants/whisky.ts` で管理・マルチセレクト可）**:

```ts
export const SCENES = [
  { icon: '🌙', label: 'ひとりで静かに' },
  { icon: '🔥', label: '誰かと語りたい' },
  { icon: '🍽', label: '食事と合わせたい' },
  { icon: '☀️', label: '昼からゆっくりと' },
  { icon: '😤', label: '仕事終わり、気分転換' },
  { icon: '🌊', label: '自然の中で飲みたい' },
]
```

---

### STEP 1B：相手情報（ギフト用）

**タイトル**: `誰に贈りますか？`

| フィールド | 選択肢 | セレクト種別 |
|---|---|---|
| 関係性 | 上司・先輩 / 父・母 / 友人・同僚 / 恋人・パートナー / 自分へのご褒美 | マルチセレクト |
| 相手の年代 | 20代 / 30代 / 40代 / 50代〜 | シングルセレクト |
| 相手の経験値 | ほぼ飲まない / たまに飲む / 好きだと思う / かなり詳しい | シングルセレクト |

---

### STEP 2：フレーバー ＋ 酒種

**タイトル**: `どんな味わいが好きですか？`

**フレーバースライダー（各0〜10、`constants/whisky.ts` で管理）**:
```ts
export const FLAVORS = ['甘い', 'スモーキー', 'フルーティ', '穀物・ドライ']
```

**酒種（シングルセレクト・デフォルト: ウイスキー）**:
- ウイスキー / 焼酎 / どちらでも

---

### STEP 3：予算・経験値

**タイトル**: `予算とこだわりを教えて`

**予算（シングルセレクト・デフォルト: 〜5,000円）**:
- 〜2,000円 / 〜5,000円 / 〜10,000円 / こだわらない

**あなたの経験値（シングルセレクト・デフォルト: たまに飲む）**:
- 初めてに近い / たまに飲む / 結構好き / 詳しい

---

### RESULT：レコメンド結果

**タイトル**: `あなたの一本。`  
**レコメンド件数**: 3件（`constants/whisky.ts` の定数 `RESULT_COUNT` で変更可能）

**レイアウト**: 商品画像（左64px）＋ 商品情報（右）の横並び

**各カードの表示内容**:

| 要素 | 内容 |
|---|---|
| バッジ | `BEST MATCH` / `ALSO GREAT` / `WILD CARD` |
| 商品画像 | Amazon PA-API取得。失敗時はボトルシルエットSVGをフォールバック表示 |
| 銘柄名 | AIが返す銘柄名 |
| タグ | 産地・フレーバー特徴・価格帯（AIが生成） |
| 説明文 | AIが生成（2〜3文） |
| Amazonボタン | アフィリエイトリンク（`--accent` カラー） |
| 楽天ボタン | アフィリエイトリンク（`--rakuten-red` カラー） |

**理由バー**: 結果タイトルの下に、AIが選んだ理由を1〜2文で表示（`border-left: 2px solid var(--accent)`）

**「最初からやり直す」ボタン**: 全ステップをリセットしてSTEP 0へ戻る

---

## 6. Anthropic API 仕様

### エンドポイント
`/api/recommend`（Next.js API Route）

### リクエスト構造

```ts
type RecommendRequest = {
  mode: 'self' | 'gift'
  // 自分用
  scenes?: string[]
  // ギフト用
  giftRelation?: string[]
  giftAge?: string
  giftExperience?: string
  // 共通
  flavors: { name: string; value: number }[]
  spirit: 'ウイスキー' | '焼酎' | 'どちらでも'
  budget: string
  experience: string
  season: string    // 例: '冬'
  month: number     // 例: 12
}
```

### システムプロンプト

```
あなたはウイスキーと焼酎の専門家です。
ユーザーの条件に合う銘柄を正確にレコメンドしてください。

必ずJSON形式のみで返答してください。前置きや説明文は不要です。
マークダウンのコードブロック（```）も使わないでください。

以下のJSON構造で返してください:
{
  "reason": "選んだ理由（1〜2文）",
  "results": [
    {
      "rank": "BEST MATCH",
      "name": "銘柄名（正式名称）",
      "tags": ["産地", "フレーバー特徴", "価格帯"],
      "description": "説明文（2〜3文）",
      "amazonKeyword": "Amazon検索用キーワード（例: グレンフィディック 12年 700ml）",
      "rakutenKeyword": "楽天検索用キーワード"
    },
    { "rank": "ALSO GREAT", ... },
    { "rank": "WILD CARD", ... }
  ]
}
```

### APIコール実装

```ts
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildUserPrompt(req) }],
  }),
})

// レスポンスのパース
const text = data.content
  .filter((b: any) => b.type === 'text')
  .map((b: any) => b.text)
  .join('')
const clean = text.replace(/```json|```/g, '').trim()
const parsed = JSON.parse(clean)
```

---

## 7. 商品画像：Amazon PA-API

### 取得フロー

1. AIが返した `amazonKeyword` でPA-APIの `SearchItems` を呼ぶ
2. 最初のヒット商品の `Images.Primary.Medium.URL` を取得
3. 取得失敗・タイムアウト時はボトルシルエットSVGをフォールバック表示

### 環境変数

```
AMAZON_ACCESS_KEY=
AMAZON_SECRET_KEY=
AMAZON_PARTNER_TAG=
AMAZON_REGION=jp
```

### 注意事項

- PA-APIはAmazonアソシエイト審査通過後に利用可能
- 審査通過前はSVGフォールバックのみで動作するよう実装すること
- 画像はAPIルート経由でプロキシ取得し、クライアントにAPIキーを渡さないこと

---

## 8. アフィリエイトリンク生成（`lib/affiliate.ts`）

```ts
// Amazon
export function buildAmazonUrl(keyword: string, tag: string): string {
  const q = encodeURIComponent(keyword)
  return `https://www.amazon.co.jp/s?k=${q}&tag=${tag}`
}

// 楽天
export function buildRakutenUrl(keyword: string, affiliateId: string): string {
  const q = encodeURIComponent(keyword)
  return `https://search.rakuten.co.jp/search/mall/${q}/?af=${affiliateId}`
}
```

### 環境変数

```
AMAZON_ASSOCIATE_TAG=
RAKUTEN_AFFILIATE_ID=
```

### Phase 2への拡張ポイント

`affiliate.ts` に `locale` 引数を追加し、`ja` → Amazon.co.jp・楽天、`en` → Amazon US/UK・The Whisky Exchange など、言語に紐づいてリンク先を切り替えられる構造にしておくこと。

---

## 9. GTMイベント設計

GTMコンテナID: `GTM-MDDFMDK9`

| イベント名 | タイミング |
|---|---|
| `pick_start` | STEP 0でモード選択時 |
| `pick_complete` | RESULT画面表示時 |
| `affiliate_click_amazon` | Amazonボタンクリック時 |
| `affiliate_click_rakuten` | 楽天ボタンクリック時 |

---

## 10. 定数ファイル仕様

### `constants/whisky.ts`

```ts
export const RESULT_COUNT = 3       // レコメンド件数（変更可）
export const SCENES = [...]         // STEP 1Aの選択肢
export const FLAVORS = [...]        // STEP 2のスライダー項目
export const SPIRITS = [...]        // STEP 2の酒種
export const BUDGETS = [...]        // STEP 3の予算
export const EXPERIENCES = [...]    // STEP 3の経験値
```

### `constants/ja.ts`

```ts
export const TEXT = {
  siteTitle: '✦ SO WHAT',
  step0: { label: 'あなたの一本を見つける', title: '誰のために\n選びますか？', ... },
  step1Self: { label: 'STEP 1 / シーン', title: '今はどんな\nシーンですか？' },
  step1Gift: { label: 'STEP 1 / 相手の情報', title: '誰に\n贈りますか？' },
  step2: { label: 'STEP 2 / フレーバー', title: 'どんな味わいが\n好きですか？' },
  step3: { label: 'STEP 3 / 最後の調整', title: '予算と\nこだわりを教えて' },
  result: {
    label: 'RESULT / あなたの3本',
    title: 'あなたの一本。',
    amazon: 'Amazon →',
    rakuten: '楽天 →',
    restart: '最初からやり直す',
    back: '← 条件を変える',
  },
}
```

> すべての選択肢・ラベルはこの定数ファイルを編集するだけで変更できること。コンポーネント内にハードコードしないこと。

---

## 11. 将来の横展開

`pick.sowhat.monster` は以下のカテゴリに展開予定。共通コンポーネントは `components/pick/` で管理し、各カテゴリで再利用する。

```
pick.sowhat.monster/whisky   ← 今回（ウイスキー・焼酎）
pick.sowhat.monster/beer     ← 将来（クラフトビール）
pick.sowhat.monster/wine     ← 将来（ワイン）
pick.sowhat.monster/book     ← 将来（お酒以外への展開例）
```

各カテゴリは `constants/[category].ts` と `constants/[lang].ts` を用意するだけで追加できる構造にすること。

---

## 12. 環境変数一覧

```
ANTHROPIC_API_KEY=
AMAZON_ACCESS_KEY=
AMAZON_SECRET_KEY=
AMAZON_PARTNER_TAG=
AMAZON_REGION=jp
AMAZON_ASSOCIATE_TAG=
RAKUTEN_AFFILIATE_ID=
```

---

## 13. 未決定事項（実装前に確認が必要）

| 項目 | 状況 |
|---|---|
| Amazon PA-API審査 | 申請・通過後に実装。それまでSVGフォールバックで動作 |
| 最終的な選択肢のラベル・数 | 定数ファイルで後から変更可。初期値は本指示書の通り |
| レコメンド件数 | 初期値3件。`RESULT_COUNT` 定数で変更可 |
| AdSense配置 | トラフィック増加後に検討。現時点では実装不要 |

---

*以上が実装指示書の全内容です。*
