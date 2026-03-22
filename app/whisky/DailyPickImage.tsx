'use client'

// onError フォールバックが必要なため Client Component として分離

type Props = {
  bottleSlug: string | null
  name: string
}

const CATEGORY_EMOJI: Record<string, string> = {
  scotch: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', bourbon: '🇺🇸', japanese: '🇯🇵', irish: '🇮🇪',
  newworld: '🌍', imo: '🍠', mugi: '🌾', kome: '🍚', kokuto: '🍬', other: '🌿',
}

export default function DailyPickImage({ bottleSlug, name }: Props) {
  const ext = bottleSlug === 'chita' ? 'png' : 'jpg'

  return (
    <div className="dailyPickImgWrap">
      {bottleSlug ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/bottles/${bottleSlug}.${ext}`}
          alt={name}
          className="dailyPickImg"
          onError={(e) => {
            const img = e.currentTarget as HTMLImageElement
            img.style.display = 'none'
            const fallback = img.nextElementSibling as HTMLElement | null
            if (fallback) fallback.style.display = 'flex'
          }}
        />
      ) : null}
      <div
        className="dailyPickImgFallback"
        style={{ display: bottleSlug ? 'none' : 'flex' }}
      >
        🥃
      </div>
    </div>
  )
}
