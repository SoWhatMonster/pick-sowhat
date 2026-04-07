'use client'

// ============================================================
// SO WHAT Pick — Journal : 円安記事 チャート群
// components/journal/WeakYenCharts.tsx
//
// エクスポート:
//   YamazakiPriceChart        — 山崎12年 定価推移（縦棒）
//   CategorySelectabilityChart — カテゴリー別・今の選びやすさ指数（グループ横棒）
//
// Chart.js は IranWarCharts.tsx と同一の CDN シングルトンで管理。
// ============================================================

import { useEffect, useRef } from 'react'

declare global {
  interface Window { Chart: any }
}

// ── CDN ロードユーティリティ（IranWarChartsと共有可だが独立して持つ）──
let _loadPromise: Promise<void> | null = null

function loadChartJs(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.Chart) return Promise.resolve()
  if (_loadPromise) return _loadPromise
  _loadPromise = new Promise((resolve) => {
    const s = document.createElement('script')
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js'
    s.onload = () => resolve()
    document.head.appendChild(s)
  })
  return _loadPromise
}

// ── デザイントークン ──────────────────────────────────────────
const D = {
  text1:  '#f0ede6',
  text2:  '#9a9888',
  text3:  '#4a4a42',
  grid:   'rgba(255,255,255,0.05)',
  border: 'rgba(255,255,255,0.10)',
  bg:     '#1c1c1a',
  accent: '#c8fe08',
}

const TOOLTIP_BASE = {
  backgroundColor: D.bg,
  borderColor:     D.border,
  borderWidth:     1,
  titleColor:      D.text1,
  bodyColor:       D.text2,
  padding:         10,
}

// ── Chart 1: 山崎12年 定価推移（縦棒グラフ）─────────────────────

export function YamazakiPriceChart() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let chart: any = null
    loadChartJs().then(() => {
      if (!ref.current) return
      const prev = window.Chart.getChart(ref.current)
      if (prev) prev.destroy()

      // 2014年頃は「5,000円未満」なので近似値として4,800円を使用
      const prices = [4800, 10000, 12000, 15000, 16000]
      const alphas = prices.map((p) => 0.25 + (p / 16000) * 0.70)

      chart = new window.Chart(ref.current, {
        type: 'bar',
        data: {
          labels: ['2014年頃', '2022年', '2024年', '2025年', '2026年4月〜'],
          datasets: [
            {
              label: '定価（税別・円）',
              data: prices,
              backgroundColor: alphas.map((a) => `rgba(200,254,8,${a})`),
              borderRadius:    6,
              borderSkipped:   false,
              maxBarThickness: 64,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              min: 0,
              max: 18000,
              grid:   { color: D.grid },
              border: { display: false },
              ticks: {
                color: D.text2,
                font:  { size: 11 },
                stepSize: 4000,
                callback: (v: number) => `¥${(v / 1000).toFixed(0)}k`,
              },
            },
            x: {
              grid:   { display: false },
              border: { color: D.border },
              ticks: {
                color:       D.text1,
                font:        { size: 11 },
                maxRotation: 0,
              },
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              ...TOOLTIP_BASE,
              callbacks: {
                label: (ctx: any) => {
                  const v = ctx.parsed.y
                  if (v === 4800) return ' ¥5,000未満（2014年頃）'
                  return ` ¥${v.toLocaleString()}`
                },
              },
            },
          },
        },
      })
    })
    return () => { if (chart) chart.destroy() }
  }, [])

  return (
    <div className="journalChart">
      <p className="journalChartTitle">山崎12年 定価の推移（税別）</p>
      <div className="journalChartWrap" style={{ height: '220px' }}>
        <canvas ref={ref} />
      </div>
      <p className="journalChartNote">
        出典：各種報道・メーカー発表をもとに SO WHAT 編集部作成。2026年4月時点の情報に基づく。
      </p>
    </div>
  )
}

// ── Chart 2: カテゴリー別・今の選びやすさ指数（グループ横棒）──────

export function CategorySelectabilityChart() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let chart: any = null
    loadChartJs().then(() => {
      if (!ref.current) return
      const prev = window.Chart.getChart(ref.current)
      if (prev) prev.destroy()

      // 円安影響度（高いほど影響大）/ 入手しやすさ（高いほど入手しやすい）
      const labels   = ['スコッチ', 'バーボン', 'ジャパニーズ', 'ニューワールド', '焼酎']
      const impact   = [5, 3, 3, 2, 1]  // 円安影響度
      const avail    = [2, 4, 1, 4, 5]  // 入手しやすさ

      chart = new window.Chart(ref.current, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label:           '円安影響度',
              data:            impact,
              backgroundColor: impact.map((v) => `rgba(200,254,8,${0.20 + (v / 5) * 0.70})`),
              borderRadius:    4,
              borderSkipped:   false,
            },
            {
              label:           '入手しやすさ',
              data:            avail,
              backgroundColor: avail.map((v) => `rgba(80,180,255,${0.20 + (v / 5) * 0.70})`),
              borderRadius:    4,
              borderSkipped:   false,
            },
          ],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              min: 0,
              max: 5,
              grid:   { color: D.grid },
              border: { color: D.border },
              ticks: {
                color:    D.text2,
                font:     { size: 11 },
                stepSize: 1,
                callback: (v: number) => `${v}`,
              },
            },
            y: {
              grid:   { display: false },
              border: { display: false },
              ticks: {
                color: D.text1,
                font:  { size: 13, weight: '600' },
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color:     D.text2,
                boxWidth:  18,
                boxHeight: 10,
                padding:   16,
                font:      { size: 11 },
              },
            },
            tooltip: {
              ...TOOLTIP_BASE,
              callbacks: {
                label: (ctx: any) => ` ${ctx.dataset.label}: ${ctx.parsed.x} / 5`,
              },
            },
          },
        },
      })
    })
    return () => { if (chart) chart.destroy() }
  }, [])

  return (
    <div className="journalChart">
      <p className="journalChartTitle">
        カテゴリー別・今の選びやすさ指数（SO WHAT 編集部）
      </p>
      <div className="journalChartWrap" style={{ height: '260px' }}>
        <canvas ref={ref} />
      </div>
      <p className="journalChartNote">
        ※2026年4月時点における編集部の定性評価。円安影響度は「高いほど影響が大きい」、入手しやすさは「高いほど定価・正規ルートで入手しやすい」を示す（各5段階）。
      </p>
    </div>
  )
}
