'use client'

// ============================================================
// SO WHAT Pick — Journal : イラン戦争記事 チャート群
// components/journal/IranWarCharts.tsx
//
// エクスポート:
//   OilPriceChart    — ブレント原油価格の推移（折れ線）
//   HormuzChart      — ホルムズ海峡 通航隻数（棒グラフ）
//   CategoryRiskChart — カテゴリー別 価格上昇リスク（横棒）
//
// Chart.js は CDN (cdn.jsdelivr.net) を useEffect で動的ロード。
// loadChartJs() はモジュール内シングルトン Promise で管理し、
// 3 コンポーネントが同時マウントされてもスクリプトは 1 回のみ追加。
// ============================================================

import { useEffect, useRef } from 'react'

declare global {
  interface Window { Chart: any }
}

// ── CDN ロードユーティリティ ──────────────────────────────────
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

// ── Chart 1: ブレント原油価格の推移（折れ線） ─────────────────

export function OilPriceChart() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let chart: any = null
    loadChartJs().then(() => {
      if (!ref.current) return
      const prev = window.Chart.getChart(ref.current)
      if (prev) prev.destroy()

      chart = new window.Chart(ref.current, {
        type: 'line',
        data: {
          labels: [
            ['開戦前', '(2/28)'],
            ['3月9日', '(ピーク)'],
            ['3月26日', '(執筆時)'],
            ['悲観', 'シナリオ'],
          ],
          datasets: [
            {
              label: '実績・現状（$/bbl）',
              data: [70, 120, 108, null],
              borderColor:       D.accent,
              backgroundColor:   'rgba(200,254,8,0.07)',
              borderWidth:       2.5,
              pointRadius:       5,
              pointHoverRadius:  7,
              pointBackgroundColor: D.accent,
              tension:  0.25,
              fill:     true,
              spanGaps: false,
            },
            {
              label: '悲観シナリオ（想定）',
              data: [null, null, 108, 140],
              borderColor:       'rgba(200,254,8,0.45)',
              borderWidth:       2,
              borderDash:        [7, 5],
              pointRadius:       [0, 0, 0, 5],
              pointBackgroundColor: 'rgba(200,254,8,0.45)',
              tension:  0,
              fill:     false,
              spanGaps: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              min: 50, max: 160,
              grid:   { color: D.grid },
              border: { display: false },
              ticks: {
                color: D.text2,
                font:  { size: 11 },
                callback: (v: number) => `$${v}`,
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
            legend: {
              labels: {
                color:     D.text2,
                boxWidth:  24,
                boxHeight: 2,
                padding:   16,
                font:      { size: 11 },
              },
            },
            tooltip: {
              ...TOOLTIP_BASE,
              callbacks: {
                label: (ctx: any) => ` $${ctx.parsed.y} /bbl`,
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
      <p className="journalChartTitle">ブレント原油価格の推移（2026年）</p>
      <div className="journalChartWrap" style={{ height: '240px' }}>
        <canvas ref={ref} />
      </div>
      <p className="journalChartNote">
        単位：ドル/バレル　出典：野村総合研究所・各種報道をもとに SO WHAT 編集部作成
      </p>
    </div>
  )
}

// ── Chart 2: ホルムズ海峡 通航隻数（棒グラフ） ────────────────

export function HormuzChart() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let chart: any = null
    loadChartJs().then(() => {
      if (!ref.current) return
      const prev = window.Chart.getChart(ref.current)
      if (prev) prev.destroy()

      chart = new window.Chart(ref.current, {
        type: 'bar',
        data: {
          labels: ['2025年平均', '2026年3月\n(9〜15日)'],
          datasets: [
            {
              label: '通航隻数',
              data:  [93.7, 5.9],
              backgroundColor: [
                'rgba(200,254,8,0.30)',
                'rgba(200,254,8,0.88)',
              ],
              borderRadius:  5,
              borderSkipped: false,
              maxBarThickness: 72,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              min: 0, max: 110,
              grid:   { color: D.grid },
              border: { display: false },
              ticks: {
                color: D.text2,
                font:  { size: 11 },
                callback: (v: number) => `${v}隻`,
              },
            },
            x: {
              grid:   { display: false },
              border: { color: D.border },
              ticks: {
                color: D.text1,
                font:  { size: 12, weight: '500' },
              },
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              ...TOOLTIP_BASE,
              callbacks: {
                label: (ctx: any) => ` ${ctx.parsed.y} 隻`,
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
      <p className="journalChartTitle">ホルムズ海峡 1日あたり通航隻数</p>
      <div className="journalChartWrap" style={{ height: '180px' }}>
        <canvas ref={ref} />
      </div>
      <p className="journalChartNote">
        単位：隻　出典：IMF PortWatch をもとに SO WHAT 編集部作成
      </p>
    </div>
  )
}

// ── Chart 3: カテゴリー別 価格上昇リスク早見表（横棒） ─────────

export function CategoryRiskChart() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let chart: any = null
    loadChartJs().then(() => {
      if (!ref.current) return
      const prev = window.Chart.getChart(ref.current)
      if (prev) prev.destroy()

      // スコアの高い順に並べて視認性を高める
      const scores = [5, 3, 3, 3, 2]
      const alphas = scores.map((s) => 0.18 + (s / 5) * 0.72)

      chart = new window.Chart(ref.current, {
        type: 'bar',
        data: {
          labels: ['スコッチ', 'アイリッシュ', 'バーボン', 'ニューワールド', 'ジャパニーズ'],
          datasets: [
            {
              label: 'リスク指数（/ 5）',
              data:  scores,
              backgroundColor: alphas.map((a) => `rgba(200,254,8,${a})`),
              borderRadius:    5,
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
              min: 0, max: 5,
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
            legend: { display: false },
            tooltip: {
              ...TOOLTIP_BASE,
              callbacks: {
                label: (ctx: any) => ` リスク指数 ${ctx.parsed.x} / 5`,
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
        カテゴリー別・価格上昇リスク評価（SO WHAT 編集部）
      </p>
      <div className="journalChartWrap" style={{ height: '220px' }}>
        <canvas ref={ref} />
      </div>
      <p className="journalChartNote">
        ※編集部による定性評価。物流・エネルギー・為替・包装の4因数を総合したリスク指数（満点5）。
      </p>
    </div>
  )
}

// default export（後方互換）
export default CategoryRiskChart
