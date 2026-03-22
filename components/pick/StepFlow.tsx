'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import SceneCard from './SceneCard'
import FlavorSlider from './FlavorSlider'
import ResultCard from './ResultCard'
import { TEXT } from '@/constants/ja'
import {
  SCENES, FLAVORS, SPIRITS, BUDGETS, EXPERIENCES,
  DEFAULT_SPIRIT, DEFAULT_BUDGET, DEFAULT_EXPERIENCE, DEFAULT_FLAVOR_VALUES,
  GIFT_RELATIONS, GIFT_AGES, GIFT_EXPERIENCES,
  WHISKY_REGIONS, WHISKY_STYLES, WHISKY_CASKS, WHISKY_AGES, DEFAULT_WHISKY_AGE,
  SHOCHU_REGIONS, SHOCHU_INGREDIENTS, SHOCHU_AGING, DEFAULT_SHOCHU_AGING,
} from '@/constants/whisky'
import type { RecommendRequest, RecommendResponse } from '@/lib/anthropic'
import type { OmikujiResult } from '@/app/api/omikuji/route'
import { buildAmazonUrl, buildRakutenUrl } from '@/lib/affiliate'
import styles from './StepFlow.module.css'

function getSeason(month: number): string {
  if (month >= 3 && month <= 5) return '春'
  if (month >= 6 && month <= 8) return '夏'
  if (month >= 9 && month <= 11) return '秋'
  return '冬'
}

function pushGtmEvent(eventName: string, params?: Record<string, string>) {
  if (typeof window !== 'undefined' && Array.isArray((window as any).dataLayer)) {
    ;(window as any).dataLayer.push({ event: eventName, ...params })
  }
}

function toggleMulti(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]
}

// マルチセレクト用「お任せ」ボタン付きタググループ
function MultiTagGroup({
  items,
  selected,
  onToggle,
  onOmakase,
  className,
}: {
  items: string[]
  selected: string[]
  onToggle: (v: string) => void
  onOmakase: () => void
  className: string
}) {
  const isOmakase = selected.length === 0
  return (
    <div className={styles.tagGroup}>
      <button
        type="button"
        className={`${className} ${isOmakase ? styles.tagSelected : ''}`}
        onClick={onOmakase}
      >
        お任せ
      </button>
      {items.map((item) => (
        <button
          key={item}
          type="button"
          className={`${className} ${selected.includes(item) ? styles.tagSelected : ''}`}
          onClick={() => onToggle(item)}
        >
          {item}
        </button>
      ))}
    </div>
  )
}

type Step = 0 | 1 | 2 | 3 | 4

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1640877434990-329af580d250?w=1200&q=85&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1609330578888-d7d34c3f8718?w=1200&q=85&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1615887023544-3a566f29d822?w=1200&q=85&auto=format&fit=crop',
]

export default function StepFlow() {
  const now = new Date()
  const month = now.getMonth() + 1
  const season = getSeason(month)

  const heroImage = useRef(HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)])
  const carouselRef = useRef<HTMLDivElement>(null)
  const [activeDot, setActiveDot] = useState(0)

  const [step, setStep] = useState<Step>(0)
  const [mode, setMode] = useState<'self' | 'gift'>('self')

  const [selectedScenes, setSelectedScenes] = useState<string[]>([])

  const [giftRelation, setGiftRelation] = useState<string[]>([])
  const [giftAge, setGiftAge] = useState<string>('')
  const [giftExperience, setGiftExperience] = useState<string>('')
  const [giftNomikurabe, setGiftNomikurabe] = useState<boolean>(false)

  const [flavorValues, setFlavorValues] = useState<Record<string, number>>(
    () => ({ ...DEFAULT_FLAVOR_VALUES })
  )
  const [spirit, setSpirit] = useState<string>(DEFAULT_SPIRIT)

  const [whiskyRegions, setWhiskyRegions] = useState<string[]>([])
  const [whiskyStyles, setWhiskyStyles] = useState<string[]>([])
  const [whiskyCasks, setWhiskyCasks] = useState<string[]>([])
  const [whiskyAge, setWhiskyAge] = useState<string>(DEFAULT_WHISKY_AGE)

  const [shochuRegions, setShochuRegions] = useState<string[]>([])
  const [shochuIngredients, setShochuIngredients] = useState<string[]>([])
  const [shochuAging, setShochuAging] = useState<string>(DEFAULT_SHOCHU_AGING)

  const [budget, setBudget] = useState<string>(DEFAULT_BUDGET)
  const [experience, setExperience] = useState<string>(DEFAULT_EXPERIENCE)

  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<RecommendResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  // おみくじ
  const [omikujiOpen, setOmikujiOpen] = useState(false)
  const [omikujiLoading, setOmikujiLoading] = useState(false)
  const [omikujiResult, setOmikujiResult] = useState<OmikujiResult | null>(null)
  const [omikujiError, setOmikujiError] = useState<string | null>(null)
  const [omikujiSeed, setOmikujiSeed] = useState<string | undefined>(undefined)

  // 銘柄検索
  const [searchQuery, setSearchQuery] = useState('')
  const [searchSubmitted, setSearchSubmitted] = useState(false)

  const amazonTag = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG ?? ''
  const rakutenAfId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID ?? ''

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) setSearchSubmitted(true)
  }, [searchQuery])

  const goTo = useCallback((s: Step) => {
    setStep(s)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const handleModeSelect = (m: 'self' | 'gift') => {
    setMode(m)
    pushGtmEvent('pick_start', { pick_mode: m })
    setTimeout(() => goTo(1), 180)
  }

  const fetchRecommendations = async () => {
    setIsLoading(true)
    setError(null)

    const flavors = FLAVORS.map((name) => ({ name, value: flavorValues[name] ?? 5 }))

    const reqBody: RecommendRequest = {
      mode,
      scenes: mode === 'self' ? selectedScenes : undefined,
      giftRelation: mode === 'gift' ? giftRelation : undefined,
      giftAge: mode === 'gift' ? giftAge : undefined,
      giftExperience: mode === 'gift' ? giftExperience : undefined,
      giftNomikurabe: mode === 'gift' ? giftNomikurabe : undefined,
      flavors,
      spirit: spirit as RecommendRequest['spirit'],
      whiskyRegions: spirit === 'ウイスキー' ? whiskyRegions : undefined,
      whiskyStyles: spirit === 'ウイスキー' ? whiskyStyles : undefined,
      whiskyCasks: spirit === 'ウイスキー' ? whiskyCasks : undefined,
      whiskyAge: spirit === 'ウイスキー' ? whiskyAge : undefined,
      shochuRegions: spirit === '焼酎' ? shochuRegions : undefined,
      shochuIngredients: spirit === '焼酎' ? shochuIngredients : undefined,
      shochuAging: spirit === '焼酎' ? shochuAging : undefined,
      budget,
      experience: mode === 'self' ? experience : undefined,
      season,
      month,
    }

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'エラーが発生しました')
      }
      const data: RecommendResponse = await res.json()
      setResult(data)
      goTo(4)
      pushGtmEvent('pick_complete')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchOmikuji = useCallback(async (seed?: string) => {
    setOmikujiLoading(true)
    setOmikujiError(null)
    setOmikujiResult(null)
    const date = new Date().toISOString().split('T')[0]
    try {
      const res = await fetch('/api/omikuji', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, seed }),
      })
      if (!res.ok) throw new Error('おみくじに失敗しました')
      const data: OmikujiResult = await res.json()
      setOmikujiResult(data)
    } catch (err) {
      setOmikujiError(err instanceof Error ? err.message : 'おみくじに失敗しました')
    } finally {
      setOmikujiLoading(false)
    }
  }, [])

  const openOmikuji = useCallback(() => {
    setOmikujiOpen(true)
    setOmikujiSeed(undefined)
    fetchOmikuji(undefined)
    pushGtmEvent('omikuji_open')
  }, [fetchOmikuji])

  const rerollOmikuji = useCallback(() => {
    const newSeed = Math.random().toString(36).slice(2)
    setOmikujiSeed(newSeed)
    fetchOmikuji(newSeed)
    pushGtmEvent('omikuji_reroll')
  }, [fetchOmikuji])

  const restart = () => {
    setStep(0); setMode('self')
    setSelectedScenes([]); setGiftRelation([]); setGiftAge(''); setGiftExperience('')
    setGiftNomikurabe(false)
    setFlavorValues({ ...DEFAULT_FLAVOR_VALUES }); setSpirit(DEFAULT_SPIRIT)
    setWhiskyRegions([]); setWhiskyStyles([]); setWhiskyCasks([]); setWhiskyAge(DEFAULT_WHISKY_AGE)
    setShochuRegions([]); setShochuIngredients([]); setShochuAging(DEFAULT_SHOCHU_AGING)
    setBudget(DEFAULT_BUDGET); setExperience(DEFAULT_EXPERIENCE)
    setResult(null); setError(null)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  // カルーセルスクロールでドット同期
  useEffect(() => {
    const el = carouselRef.current
    if (!el) return
    const handleScroll = () => {
      const cards = el.querySelectorAll<HTMLElement>('[data-card]')
      let closest = 0, minDist = Infinity
      cards.forEach((card, i) => {
        const dist = Math.abs(card.getBoundingClientRect().left - el.getBoundingClientRect().left)
        if (dist < minDist) { minDist = dist; closest = i }
      })
      setActiveDot(closest)
    }
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [step, result])

  // SNSシェア
  const handleShare = useCallback(() => {
    const best = result?.results[0]
    const text = `AIが私に「${best?.name ?? ''}」をおすすめしました 🥃\n#SOWHATpick`
    const url = TEXT.siteUrl
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: TEXT.siteTitle, text, url }).catch(() => {})
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
    }
  }, [result])

  const totalDots = 5

  return (
    <div className={styles.appShell}>

      {/* ── 固定トップバー ── */}
      <div className={styles.topbar}>
        <a href={TEXT.siteUrl} className={styles.wordmark}>
          {TEXT.siteTitle}
          <span className={styles.betaBadge}>BETA</span>
        </a>
        <div className={styles.topbarRight}>
          <a href="#feedback" className={styles.feedbackLink}>フィードバック →</a>
          <div className={styles.dots}>
            {Array.from({ length: totalDots }).map((_, i) => (
              <div
                key={i}
                className={`${styles.dot} ${i === step ? styles.dotActive : i < step ? styles.dotDone : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── STEP 0: ヒーロー ── */}
      {step === 0 && (
        <div
          className={styles.heroScreen}
          style={{ backgroundImage: `url(${heroImage.current})` }}
        >
          <div className={styles.heroContent}>
            <div className={styles.label}>{TEXT.step0.label}</div>

            <div className={styles.heroSection}>
              <div className={styles.spiritBadges}>
                {TEXT.step0.spirits.map((s) => (
                  <span key={s} className={styles.spiritBadge}>{s}</span>
                ))}
              </div>
              <h1 className={styles.heroTagline}>{TEXT.step0.tagline}</h1>
              <p className={styles.heroSub}>{TEXT.step0.sub}</p>
            </div>

            <div className={styles.divider} />

            <div className={styles.ctaGrid}>
              {/* こだわり診断 */}
              <div className={styles.ctaBlock}>
                <div className={styles.ctaBlockLabel}>条件を指定して探す</div>
                <div className={styles.splitGrid}>
                  <button className={styles.choiceBtn} onClick={() => handleModeSelect('self')} type="button">
                    <span className={styles.choiceIcon}>{TEXT.step0.selfIcon}</span>
                    <span className={styles.choiceLabel}>{TEXT.step0.selfLabel}</span>
                    <span className={styles.choiceDesc}>シーン・気分・フレーバーから</span>
                  </button>
                  <button className={styles.choiceBtn} onClick={() => handleModeSelect('gift')} type="button">
                    <span className={styles.choiceIcon}>{TEXT.step0.giftIcon}</span>
                    <span className={styles.choiceLabel}>{TEXT.step0.giftLabel}</span>
                    <span className={styles.choiceDesc}>相手の好みに合わせて選ぶ</span>
                  </button>
                </div>
              </div>

              {/* おみくじ */}
              <div className={styles.ctaBlock}>
                <div className={styles.ctaBlockLabel}>✦ AIに全部まかせる</div>
                <button className={styles.omikujiCta} onClick={openOmikuji} type="button">
                  <span className={styles.omikujiCtaTitle}>今日の運勢で一発回答</span>
                  <span className={styles.omikujiCtaSub}>条件なし。今すぐ1本出てくる。</span>
                </button>
              </div>
            </div>

            {/* ── 銘柄直接検索 ── */}
            <div className={styles.searchDivider}>{TEXT.search.divider}</div>
            <div className={styles.searchSection}>
              <div className={styles.searchRow}>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder={TEXT.search.placeholder}
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setSearchSubmitted(false) }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button className={styles.searchBtn} onClick={handleSearch} type="button">
                  {TEXT.search.btn}
                </button>
              </div>
              {searchSubmitted && searchQuery.trim() && (
                <div className={styles.searchResult}>
                  <span className={styles.searchResultLabel}>「{searchQuery.trim()}」を探す</span>
                  <div className={styles.searchResultBtns}>
                    <a
                      href={buildAmazonUrl(searchQuery.trim(), amazonTag)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.searchResultBtn}
                    >{TEXT.search.amazonBtn}</a>
                    <a
                      href={buildRakutenUrl(searchQuery.trim(), rakutenAfId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles.searchResultBtn} ${styles.searchResultRakuten}`}
                    >{TEXT.search.rakutenBtn}</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 1A: シーン ── */}
      {step === 1 && mode === 'self' && (
        <div className={styles.stepScreen}>
          <div className={styles.stepContent}>
            <button className={styles.backBtn} onClick={() => goTo(0)} type="button">{TEXT.step1Self.back}</button>
            <div className={styles.label}>{TEXT.step1Self.label}</div>
            <h2 className={styles.title}>
              {TEXT.step1Self.title.split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
            </h2>
            <div className={styles.autoNote}>{TEXT.step1Self.seasonNote(season)}</div>
            <div className={styles.sceneGrid}>
              {SCENES.map((s) => (
                <SceneCard key={s.label} icon={s.icon} label={s.label}
                  selected={selectedScenes.includes(s.label)}
                  onClick={() => setSelectedScenes((prev) => toggleMulti(prev, s.label))} />
              ))}
            </div>
            <button className={styles.nextBtn} onClick={() => goTo(2)} type="button">{TEXT.step1Self.next}</button>
          </div>
        </div>
      )}

      {/* ── STEP 1B: ギフト ── */}
      {step === 1 && mode === 'gift' && (
        <div className={styles.stepScreen}>
          <div className={styles.stepContent}>
            <button className={styles.backBtn} onClick={() => goTo(0)} type="button">{TEXT.step1Gift.back}</button>
            <div className={styles.label}>{TEXT.step1Gift.label}</div>
            <h2 className={styles.title}>
              {TEXT.step1Gift.title.split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
            </h2>
            <div className={styles.giftField}>
              <div className={styles.giftLabel}>{TEXT.step1Gift.relationLabel}</div>
              <div className={styles.tagGroup}>
                {GIFT_RELATIONS.map((r) => (
                  <button key={r} type="button"
                    className={`${styles.tag} ${giftRelation.includes(r) ? styles.tagSelected : ''}`}
                    onClick={() => setGiftRelation((prev) => toggleMulti(prev, r))}>{r}</button>
                ))}
              </div>
            </div>
            <div className={styles.giftField}>
              <div className={styles.giftLabel}>{TEXT.step1Gift.ageLabel}</div>
              <div className={styles.tagGroup}>
                {GIFT_AGES.map((a) => (
                  <button key={a} type="button"
                    className={`${styles.tag} ${giftAge === a ? styles.tagSelected : ''}`}
                    onClick={() => setGiftAge(a)}>{a}</button>
                ))}
              </div>
            </div>
            <div className={styles.giftField}>
              <div className={styles.giftLabel}>{TEXT.step1Gift.experienceLabel}</div>
              <div className={styles.tagGroup}>
                {GIFT_EXPERIENCES.map((e) => (
                  <button key={e} type="button"
                    className={`${styles.tag} ${giftExperience === e ? styles.tagSelected : ''}`}
                    onClick={() => setGiftExperience(e)}>{e}</button>
                ))}
              </div>
            </div>
            <div className={styles.giftField}>
              <button
                type="button"
                className={`${styles.tag} ${giftNomikurabe ? styles.tagSelected : ''}`}
                style={{ width: '100%', textAlign: 'left' }}
                onClick={() => setGiftNomikurabe((prev) => !prev)}
              >{TEXT.step1Gift.nomikurabeLabel}</button>
            </div>

            <button
              className={styles.nextBtn}
              onClick={() => goTo(2)}
              type="button"
              disabled={giftRelation.length === 0 || giftAge === '' || giftExperience === ''}
            >{TEXT.step1Gift.next}</button>
          </div>
        </div>
      )}

      {/* ── STEP 2: フレーバー ── */}
      {step === 2 && (
        <div className={styles.stepScreen}>
          <div className={styles.stepContent}>
            <button className={styles.backBtn} onClick={() => goTo(1)} type="button">{TEXT.step2.back}</button>
            <div className={styles.label}>{TEXT.step2.label}</div>
            <h2 className={styles.title}>
              {TEXT.step2.title.split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
            </h2>

            {FLAVORS.map((name) => (
              <FlavorSlider key={name} label={name} value={flavorValues[name] ?? 5}
                onChange={(v) => setFlavorValues((prev) => ({ ...prev, [name]: v }))} />
            ))}

            <div className={styles.divider} />
            <div className={styles.subLabel}>{TEXT.step2.spiritLabel}</div>
            <div className={styles.tagGroup} style={{ marginBottom: '16px' }}>
              {SPIRITS.map((s) => (
                <button key={s} type="button"
                  className={`${styles.tag} ${spirit === s ? styles.tagSelected : ''}`}
                  onClick={() => setSpirit(s)}>{s}</button>
              ))}
            </div>

            {/* ウイスキー詳細 */}
            {spirit === 'ウイスキー' && (
              <>
                <div className={styles.divider} />
                <div className={styles.detailNote}>{TEXT.step2.optionalNote}</div>

                <div className={styles.giftField}>
                  <div className={styles.giftLabel}>{TEXT.step2.whiskyRegionLabel}</div>
                  <MultiTagGroup items={WHISKY_REGIONS} selected={whiskyRegions}
                    onToggle={(v) => setWhiskyRegions((prev) => toggleMulti(prev, v))}
                    onOmakase={() => setWhiskyRegions([])} className={styles.tag} />
                </div>

                <div className={styles.giftField}>
                  <div className={styles.giftLabel}>{TEXT.step2.whiskyStyleLabel}</div>
                  <MultiTagGroup items={WHISKY_STYLES} selected={whiskyStyles}
                    onToggle={(v) => setWhiskyStyles((prev) => toggleMulti(prev, v))}
                    onOmakase={() => setWhiskyStyles([])} className={styles.tag} />
                </div>

                <div className={styles.giftField}>
                  <div className={styles.giftLabel}>{TEXT.step2.whiskyCaskLabel}</div>
                  <MultiTagGroup items={WHISKY_CASKS} selected={whiskyCasks}
                    onToggle={(v) => setWhiskyCasks((prev) => toggleMulti(prev, v))}
                    onOmakase={() => setWhiskyCasks([])} className={styles.tag} />
                </div>

                <div className={styles.giftField}>
                  <div className={styles.giftLabel}>{TEXT.step2.whiskyAgeLabel}</div>
                  <div className={styles.tagGroup}>
                    {WHISKY_AGES.map((a) => (
                      <button key={a} type="button"
                        className={`${styles.tag} ${whiskyAge === a ? styles.tagSelected : ''}`}
                        onClick={() => setWhiskyAge(a)}>{a}</button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* 焼酎詳細 */}
            {spirit === '焼酎' && (
              <>
                <div className={styles.divider} />
                <div className={styles.detailNote}>{TEXT.step2.optionalNote}</div>

                <div className={styles.giftField}>
                  <div className={styles.giftLabel}>{TEXT.step2.shochuRegionLabel}</div>
                  <MultiTagGroup items={SHOCHU_REGIONS} selected={shochuRegions}
                    onToggle={(v) => setShochuRegions((prev) => toggleMulti(prev, v))}
                    onOmakase={() => setShochuRegions([])} className={styles.tag} />
                </div>

                <div className={styles.giftField}>
                  <div className={styles.giftLabel}>{TEXT.step2.shochuIngredientLabel}</div>
                  <MultiTagGroup items={SHOCHU_INGREDIENTS} selected={shochuIngredients}
                    onToggle={(v) => setShochuIngredients((prev) => toggleMulti(prev, v))}
                    onOmakase={() => setShochuIngredients([])} className={styles.tag} />
                </div>

                <div className={styles.giftField}>
                  <div className={styles.giftLabel}>{TEXT.step2.shochuAgingLabel}</div>
                  <div className={styles.tagGroup}>
                    {SHOCHU_AGING.map((a) => (
                      <button key={a} type="button"
                        className={`${styles.tag} ${shochuAging === a ? styles.tagSelected : ''}`}
                        onClick={() => setShochuAging(a)}>{a}</button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <button className={styles.nextBtn} onClick={() => goTo(3)} type="button">{TEXT.step2.next}</button>
          </div>
        </div>
      )}

      {/* ── STEP 3: 予算 ── */}
      {step === 3 && !isLoading && (
        <div className={styles.stepScreen}>
          <div className={styles.stepContent}>
            <button className={styles.backBtn} onClick={() => goTo(2)} type="button">{TEXT.step3.back}</button>
            <div className={styles.label}>{TEXT.step3.label}</div>
            <h2 className={styles.title}>
              {(mode === 'gift' ? TEXT.step3.titleGift : TEXT.step3.title).split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
            </h2>

            <div className={styles.giftField}>
              <div className={styles.giftLabel}>{TEXT.step3.budgetLabel}</div>
              <div className={styles.budgetRow}>
                {BUDGETS.map((b) => (
                  <button key={b} type="button"
                    className={`${styles.budgetTag} ${budget === b ? styles.budgetSelected : ''}`}
                    onClick={() => setBudget(b)}>{b}</button>
                ))}
              </div>
            </div>

            {mode === 'self' && (
              <>
                <div className={styles.divider} />
                <div className={styles.giftField}>
                  <div className={styles.giftLabel}>{TEXT.step3.experienceLabel}</div>
                  <div className={styles.tagGroup}>
                    {EXPERIENCES.map((e) => (
                      <button key={e} type="button"
                        className={`${styles.tag} ${experience === e ? styles.tagSelected : ''}`}
                        onClick={() => setExperience(e)}>{e}</button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {error && <div className={styles.errorMsg}>{error}</div>}

            <button className={styles.nextBtn} onClick={fetchRecommendations} type="button">
              {TEXT.step3.next}
            </button>
          </div>
        </div>
      )}

      {/* ── LOADING ── */}
      {isLoading && (
        <div className={styles.loadingScreen}>
          <div className={styles.loadingRingWrap}>
            <div className={styles.loadingRing} />
            <div className={styles.loadingDot} />
          </div>
          <p className={styles.loadingMessage}>{TEXT.loading.message}</p>
          <p className={styles.loadingSub}>{TEXT.loading.sub}</p>
        </div>
      )}

      {/* ── RESULT ── */}
      {step === 4 && result && (
        <div className={styles.stepScreen}>
          <div className={styles.stepContent}>
            <button className={styles.backBtn} onClick={() => goTo(3)} type="button">{TEXT.result.back}</button>
            <div className={styles.label}>{TEXT.result.label}</div>
            <h2 className={`${styles.title} ${styles.resultTitle}`}>{TEXT.result.title}</h2>
            <div className={styles.reasonBar}>{result.reason}</div>

            {/* カルーセル */}
            <div className={styles.carousel} ref={carouselRef}>
              {result.results.map((item) => (
                <div key={item.rank} data-card="1" style={{ flex: '0 0 72vw', maxWidth: '280px', minWidth: '220px', scrollSnapAlign: 'start' }}>
                  <ResultCard rank={item.rank} name={item.name} tags={item.tags}
                    description={item.description} amazonKeyword={item.amazonKeyword} rakutenKeyword={item.rakutenKeyword}
                    onAmazonClick={() => pushGtmEvent('affiliate_click_amazon', { item_name: item.name })}
                    onRakutenClick={() => pushGtmEvent('affiliate_click_rakuten', { item_name: item.name })} />
                </div>
              ))}
            </div>

            {/* ドットインジケーター */}
            <div className={styles.carouselDots}>
              {result.results.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`${styles.carouselDot} ${i === activeDot ? styles.carouselDotActive : ''}`}
                  onClick={() => {
                    const el = carouselRef.current
                    const cards = el?.querySelectorAll<HTMLElement>('[data-card]')
                    cards?.[i]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
                  }}
                />
              ))}
            </div>

            {/* シェアボタン */}
            <button className={styles.shareBtn} onClick={handleShare} type="button">
              𝕏 結果をシェアする
            </button>

            <button className={styles.ghostBtn} onClick={restart} type="button">{TEXT.result.restart}</button>

            <footer className={styles.footer}>
              <a
                href={TEXT.brandUrl}
                className={styles.footerLink}
                target="_blank"
                rel="noopener noreferrer"
              >{TEXT.copyright}</a>
            </footer>
          </div>
        </div>
      )}

      {/* ── おみくじモーダル ── */}
      {omikujiOpen && (
        <div className={styles.omikujiOverlay} onClick={() => setOmikujiOpen(false)}>
          <div className={styles.omikujiModal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.omikujiClose} onClick={() => setOmikujiOpen(false)} type="button">✕</button>
            <div className={styles.omikujiEyebrow}>✦ 今日のあなたの1本</div>

            {omikujiLoading && (
              <div className={styles.omikujiLoading}>
                <div className={styles.loadingRingWrap}>
                  <div className={styles.loadingRing} />
                  <div className={styles.loadingDot} />
                </div>
                <p className={styles.omikujiLoadingText}>おみくじを引いています…</p>
              </div>
            )}

            {omikujiError && (
              <p className={styles.omikujiErrorText}>{omikujiError}</p>
            )}

            {omikujiResult && !omikujiLoading && (
              <>
                <h2 className={styles.omikujiName}>{omikujiResult.name}</h2>
                <div className={styles.omikujiTags}>
                  {omikujiResult.tags.map((tag) => (
                    <span key={tag} className={styles.omikujiTag}>{tag}</span>
                  ))}
                </div>
                <p className={styles.omikujiComment}>{omikujiResult.comment}</p>
                <div className={styles.omikujiActions}>
                  <a
                    href={buildAmazonUrl(omikujiResult.amazonKeyword, amazonTag)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.omikujiAmazon}
                    onClick={() => pushGtmEvent('omikuji_amazon_click', { item_name: omikujiResult.name })}
                  >Amazon →</a>
                  <a
                    href={buildRakutenUrl(omikujiResult.rakutenKeyword, rakutenAfId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.omikujiRakuten}
                    onClick={() => pushGtmEvent('omikuji_rakuten_click', { item_name: omikujiResult.name })}
                  >楽天 →</a>
                </div>
                <div className={styles.omikujiFooter}>
                  <button className={styles.omikujiReroll} onClick={rerollOmikuji} type="button">もう1本引く ✦</button>
                  <button className={styles.omikujiCloseBtn} onClick={() => setOmikujiOpen(false)} type="button">閉じる</button>
                </div>
              </>
            )}

            <p className={styles.omikujiDisclaimer}>AIによるランダム提案です</p>
          </div>
        </div>
      )}

    </div>
  )
}
