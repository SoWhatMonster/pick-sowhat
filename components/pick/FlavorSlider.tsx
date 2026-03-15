// ============================================================
// SO WHAT Pick — FlavorSlider
// STEP 2: フレーバースライダー（0〜10）
// ============================================================

import styles from './FlavorSlider.module.css'

type FlavorSliderProps = {
  label: string
  value: number
  onChange: (value: number) => void
}

export default function FlavorSlider({ label, value, onChange }: FlavorSliderProps) {
  return (
    <div className={styles.block}>
      <div className={styles.labelRow}>
        <span className={styles.name}>{label}</span>
        <span className={styles.value}>{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={`${label}の強さ: ${value}/10`}
        className={styles.slider}
      />
    </div>
  )
}
