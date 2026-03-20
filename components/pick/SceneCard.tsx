// ============================================================
// SO WHAT Pick — SceneCard
// STEP 1A: シーン選択カード（マルチセレクト）
// ============================================================

import styles from './SceneCard.module.css'

type SceneCardProps = {
  icon: string
  label: string
  selected: boolean
  onClick: () => void
}

export default function SceneCard({ icon, label, selected, onClick }: SceneCardProps) {
  return (
    <button
      className={`${styles.card} ${selected ? styles.selected : ''}`}
      onClick={onClick}
      type="button"
      aria-pressed={selected}
    >
      <span className={styles.icon}>{icon}</span>
      <span className={styles.label}>{label}</span>
      <span className={styles.check}>✓</span>
    </button>
  )
}
