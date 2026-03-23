'use client'

// ============================================================
// SceneCarousel — シーン別カルーセル（PC用左右ボタン付き）
// ============================================================

import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

type SceneCard = {
  icon: string
  name: string
  catch: string
  styles: string
  scenePath: string | null
}

type Props = {
  cards: SceneCard[]
}

export default function SceneCarousel({ cards }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const update = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [update])

  const scroll = (dir: 1 | -1) => {
    const el = scrollRef.current
    if (!el) return
    // カード幅 + gap ≈ 1カード2.5枚分スクロール
    const amount = Math.round(el.clientWidth * 0.7)
    el.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  return (
    <div className="sceneCarouselOuter">
      {/* PC用左ボタン */}
      <button
        className={`carouselBtn carouselBtnLeft${canLeft ? '' : ' carouselBtnHidden'}`}
        onClick={() => scroll(-1)}
        aria-label="前へ"
      >
        ‹
      </button>

      <div ref={scrollRef} className="sceneScrollWrapper">
        <div className="sceneGrid">
          {cards.map((c) =>
            c.scenePath ? (
              <Link key={c.name} href={c.scenePath} className="sceneCard sceneCardLink">
                <span className="sceneIcon">{c.icon}</span>
                <p className="sceneName">{c.name}</p>
                <p className="sceneCatch">{c.catch}</p>
                <p className="sceneStyles">{c.styles}</p>
                <span className="sceneArrow">詳しく →</span>
              </Link>
            ) : (
              <div key={c.name} className="sceneCard">
                <span className="sceneIcon">{c.icon}</span>
                <p className="sceneName">{c.name}</p>
                <p className="sceneCatch">{c.catch}</p>
                <p className="sceneStyles">{c.styles}</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* PC用右ボタン */}
      <button
        className={`carouselBtn carouselBtnRight${canRight ? '' : ' carouselBtnHidden'}`}
        onClick={() => scroll(1)}
        aria-label="次へ"
      >
        ›
      </button>
    </div>
  )
}
