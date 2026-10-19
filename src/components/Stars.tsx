import type { StarFill } from '../lib/scoring'
import { formatStars, maxStarsTotal } from '../lib/scoring'

const STAR_PATH =
  'M12 2.5l2.9 6.1 6.6.7-5 4.6 1.4 6.5L12 16.8 6.1 20.4l1.4-6.5-5-4.6 6.6-.7L12 2.5z'

type StarProps = {
  fill: StarFill
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

function StarSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path d={STAR_PATH} />
    </svg>
  )
}

function StarIcon({ fill, size = 'md', label }: StarProps) {
  const title =
    label ??
    (fill === 'full'
      ? 'Stea plină'
      : fill === 'half'
        ? 'Jumătate de stea'
        : 'Stea goală')

  return (
    <span
      className={`star-icon star-${fill} star-size-${size}`}
      role="img"
      aria-label={title}
      title={title}
    >
      <StarSvg className="star-svg star-svg-base" />
      {fill !== 'empty' ? (
        <span className={`star-fill-clip star-fill-${fill}`} aria-hidden>
          <StarSvg className="star-svg star-svg-fill" />
        </span>
      ) : null}
    </span>
  )
}

/** O singură stea pentru un ecran (plină sau jumătate). */
export function SceneStar({
  fill,
  size = 'lg',
  showLabel = true,
}: {
  fill: 'full' | 'half'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}) {
  return (
    <span className={`scene-star scene-star-${fill}`}>
      <StarIcon fill={fill} size={size} />
      {showLabel ? (
        <span className="scene-star-label">
          {fill === 'full' ? 'Stea plină' : 'Jumătate de stea'}
        </span>
      ) : null}
    </span>
  )
}

function starsEarned(fills: StarFill[]): number {
  return fills.reduce((sum, f) => {
    if (f === 'full') return sum + 1
    if (f === 'half') return sum + 0.5
    return sum
  }, 0)
}

function fillLabel(fill: StarFill, level?: number): string {
  const levelBit = level != null ? `Nivel ${level}: ` : ''
  if (fill === 'full') return `${levelBit}stea plină`
  if (fill === 'half') return `${levelBit}jumătate de stea`
  return `${levelBit}încă neluat`
}

/** Șir de stele pentru scorul total al misiunii. */
export function MissionStars({
  fills,
  size = 'sm',
  showTotal = true,
  /** Doar o stea + total — pentru bare înguste. */
  compact = false,
  /** Afișează numărul nivelului sub fiecare stea. */
  showLevelNumbers = false,
}: {
  fills: StarFill[]
  size?: 'sm' | 'md' | 'lg'
  showTotal?: boolean
  compact?: boolean
  showLevelNumbers?: boolean
}) {
  const earned = starsEarned(fills)
  const max = fills.length > 0 ? fills.length : maxStarsTotal()

  return (
    <span
      className={`mission-stars${compact ? ' is-compact' : ''}${showLevelNumbers ? ' has-levels' : ''}`}
      aria-label={`${formatStars(earned)} din ${max} stele`}
    >
      {compact ? (
        <StarIcon fill="full" size={size} label="Scor" />
      ) : (
        <span className="mission-stars-row" aria-hidden={!showLevelNumbers}>
          {fills.map((f, i) => {
            const level = i + 1
            return (
              <span key={i} className="mission-star-slot">
                <StarIcon
                  fill={f}
                  size={size}
                  label={fillLabel(f, level)}
                />
                {showLevelNumbers ? (
                  <span className="mission-star-level">{level}</span>
                ) : null}
              </span>
            )
          })}
        </span>
      )}
      {showTotal ? (
        <span className="mission-stars-total">
          {formatStars(earned)}/{max}
        </span>
      ) : null}
    </span>
  )
}
