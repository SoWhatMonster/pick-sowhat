import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'SO WHAT Pick',
  description: 'ウイスキー・焼酎のAIレコメンドサービス。シーン・気分・フレーバーから、あなたにぴったりの1本を提案します。',
  alternates: { canonical: 'https://pick.sowhat.monster/' },
}

export default function RootPage() {
  return (
    <main style={{ margin: 0, background: '#0a0a0a', color: '#f0f0f0', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '2rem' }}>
      <div>
        <p style={{ color: '#c8ff00', fontSize: '13px', letterSpacing: '0.1em', marginBottom: '1rem' }}>✦ SO WHAT PICK</p>
        <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.2 }}>
          Whisky &amp; Shochu
        </h1>
        <p style={{ color: '#999', fontSize: '15px', maxWidth: '400px', margin: '0 auto 2.5rem' }}>
          シーン・気分・フレーバーから、あなたにぴったりのウイスキー・焼酎をAIが提案します。
        </p>
        <Link
          href="/whisky"
          style={{
            display: 'inline-block',
            background: '#c8ff00',
            color: '#0a0a0a',
            padding: '0.75rem 2rem',
            borderRadius: '4px',
            fontWeight: 700,
            fontSize: '14px',
            textDecoration: 'none',
            letterSpacing: '0.05em',
          }}
        >
          今すぐ試す →
        </Link>
      </div>
    </main>
  )
}
