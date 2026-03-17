'use client'

import { useState, useCallback, useRef } from 'react'
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

export default function StepFlow() {
  const now = new Date()
  const month = now.getMonth() + 1
  const season = getSeason(month)

  const isFirstVisit = useRef(true)

  const [step, setStep] = useState<Step>(0)
  const [mode, setMode] = useState<'self' | 'gift'>('self')

  const [selectedScenes, setSelectedScenes] = useState<string[]>([])

  const [giftRelation, setGiftRelation] = useState<string[]>([])
  const [giftAge, setGiftAge] = useState<string>('')
  const [giftExperience, setGiftExperience] = useState<string>('')

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

  const goTo = useCallback((s: Step) => {
    setStep(s)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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

  const restart = () => {
    isFirstVisit.current = false
    setStep(0); setMode('self')
    setSelectedScenes([]); setGiftRelation([]); setGiftAge(''); setGiftExperience('')
    setFlavorValues({ ...DEFAULT_FLAVOR_VALUES }); setSpirit(DEFAULT_SPIRIT)
    setWhiskyRegions([]); setWhiskyStyles([]); setWhiskyCasks([]); setWhiskyAge(DEFAULT_WHISKY_AGE)
    setShochuRegions([]); setShochuIngredients([]); setShochuAging(DEFAULT_SHOCHU_AGING)
    setBudget(DEFAULT_BUDGET); setExperience(DEFAULT_EXPERIENCE)
    setResult(null); setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const totalDots = 5

  return (
    <div className={styles.frame}>
      <div className={styles.topbar}>
        <a
          href={TEXT.siteUrl}
          className={styles.wordmark}
          target="_blank"
          rel="noopener noreferrer"
        >{TEXT.siteTitle}</a>
        <div className={styles.dots}>
          {Array.from({ length: totalDots }).map((_, i) => (
            <div key={i} className={`${styles.dot} ${i === step ? styles.dotActive : i < step ? styles.dotDone : ''}`} />
          ))}
        </div>
      </div>

      {/* STEP 0 */}
      {step === 0 && (
        <div className={`${styles.panel} ${isFirstVisit.current ? styles.panelFadeIn : ''}`}>
          <div className={styles.label}>{TEXT.step0.label}</div>

          {/* ヒーローセクション */}
          <div className={styles.heroSection}>
            <h1 className={styles.heroTagline}>{TEXT.step0.tagline}</h1>
            <p className={styles.heroSub}>{TEXT.step0.sub}</p>
          </div>

          {/* 3ステップ */}
          <div className={styles.howSteps}>
            {TEXT.step0.howSteps.map((s, i) => (
              <div key={i} className={styles.howStep}>
                <span className={styles.howStepLabel}>{s.step}</span>
                <span className={styles.howIcon}>{s.icon}</span>
                <span className={styles.howText}>
                  {s.text.split('\n').map((line, j) => <span key={j}>{line}{j === 0 && <br />}</span>)}
                </span>
                {i < TEXT.step0.howSteps.length - 1 && <span className={styles.howArrow}>›</span>}
              </div>
            ))}
          </div>

          <div className={styles.divider} />

          <h2 className={styles.title}>
            {TEXT.step0.title.split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
          </h2>
          <div className={styles.splitGrid}>
            <button className={styles.choiceBtn} onClick={() => handleModeSelect('self')} type="button">
              <span className={styles.choiceIcon}>{TEXT.step0.selfIcon}</span>{TEXT.step0.selfLabel}
            </button>
            <button className={styles.choiceBtn} onClick={() => handleModeSelect('gift')} type="button">
              <span className={styles.choiceIcon}>{TEXT.step0.giftIcon}</span>{TEXT.step0.giftLabel}
            </button>
          </div>
        </div>
      )}

      {/* STEP 1A */}
      {step === 1 && mode === 'self' && (
        <div className={styles.panel}>
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
      )}

      {/* STEP 1B */}
      {step === 1 && mode === 'gift' && (
        <div className={styles.panel}>
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
          <button className={styles.nextBtn} onClick={() => goTo(2)} type="button">{TEXT.step1Gift.next}</button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className={styles.panel}>
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
      )}

      {/* STEP 3 */}
      {step === 3 && !isLoading && (
        <div className={styles.panel}>
          <button className={styles.backBtn} onClick={() => goTo(2)} type="button">{TEXT.step3.back}</button>
          <div className={styles.label}>{TEXT.step3.label}</div>
          <h2 className={styles.title}>
            {TEXT.step3.title.split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
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
      )}

      {/* LOADING */}
      {isLoading && (
        <div className={styles.loadingPanel}>
          <div className={styles.loadingRing} />
          <p className={styles.loadingMessage}>{TEXT.loading.message}</p>
          <p className={styles.loadingSub}>{TEXT.loading.sub}</p>
        </div>
      )}

      {/* RESULT */}
      {step === 4 && result && (
        <div className={styles.panel}>
          <button className={styles.backBtn} onClick={() => goTo(3)} type="button">{TEXT.result.back}</button>
          <div className={styles.label}>{TEXT.result.label}</div>
          <h2 className={`${styles.title} ${styles.resultTitle}`}>{TEXT.result.title}</h2>
          <div className={styles.reasonBar}>{result.reason}</div>
          {result.results.map((item) => (
            <ResultCard key={item.rank} rank={item.rank} name={item.name} tags={item.tags}
              description={item.description} amazonKeyword={item.amazonKeyword} rakutenKeyword={item.rakutenKeyword}
              onAmazonClick={() => pushGtmEvent('affiliate_click_amazon', { item_name: item.name })}
              onRakutenClick={() => pushGtmEvent('affiliate_click_rakuten', { item_name: item.name })} />
          ))}
          <button className={styles.ghostBtn} onClick={restart} type="button">{TEXT.result.restart}</button>
        </div>
      )}
      <footer className={styles.footer}>
        <a
          href={TEXT.brandUrl}
          className={styles.footerLink}
          target="_blank"
          rel="noopener noreferrer"
        >{TEXT.copyright}</a>
      </footer>
    </div>
  )
}
