import type { Metadata } from 'next'
import StepFlow from '@/components/pick/StepFlow'

export const metadata: Metadata = {
  title: 'SO WHAT Pick — Whisky & Shochu | あなたの一本を見つける',
  description:
    'シーン・気分・フレーバーをもとに、ウイスキーと焼酎の銘柄を3件レコメンド。Amazon・楽天で今すぐ購入できます。',
  alternates: {
    canonical: 'https://pick.sowhat.monster/whisky',
    // Phase 2: { 'en': 'https://pick.sowhat.monster/en/whisky' }
  },
}

export default function WhiskyPage() {
  return <StepFlow />
}
