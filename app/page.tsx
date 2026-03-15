import { redirect } from 'next/navigation'

// ルート (/) は /whisky にリダイレクト
// Phase 2: ブラウザ言語を自動検出して /en/whisky に振り分け
export default function RootPage() {
  redirect('/whisky')
}
