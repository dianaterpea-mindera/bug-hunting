type LandmarkKind =
  | 'pier'
  | 'turtle'
  | 'jungle'
  | 'gulf'
  | 'fox-cave'
  | 'clinic'
  | 'watchtower'

type Props = {
  kind: LandmarkKind
  className?: string
  title?: string
}

/** Simplified map glyphs matching the illustrated island map art. */
export function IslandMapLandmarkIcon({ kind, className, title }: Props) {
  if (kind === 'turtle') {
    return (
      <span
        className={[className, 'landmark-emoji'].filter(Boolean).join(' ')}
        role={title ? 'img' : undefined}
        aria-label={title}
        aria-hidden={title ? undefined : true}
      >
        🐢
      </span>
    )
  }

  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      width="40"
      height="40"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title ? <title>{title}</title> : null}
      {kind === 'pier' && (
        <>
          <rect x="4" y="26" width="22" height="6" rx="1" fill="#c4a574" stroke="#6b4423" strokeWidth="1.2" />
          <rect x="6" y="28" width="3" height="4" fill="#8d6e4c" />
          <rect x="11" y="28" width="3" height="4" fill="#8d6e4c" />
          <rect x="16" y="28" width="3" height="4" fill="#8d6e4c" />
          <rect x="21" y="28" width="3" height="4" fill="#8d6e4c" />
          <path d="M26 29h10v2H26z" fill="#4db6ac" opacity="0.55" />
          <path d="M28 24v5M32 24v5M36 24v5" stroke="#6b4423" strokeWidth="1.4" strokeLinecap="round" />
        </>
      )}
      {kind === 'jungle' && (
        <>
          <ellipse cx="20" cy="30" rx="14" ry="6" fill="#388e3c" opacity="0.35" />
          <circle cx="13" cy="22" r="8" fill="#2e7d32" stroke="#1b5e20" strokeWidth="1" />
          <circle cx="22" cy="19" r="9" fill="#388e3c" stroke="#1b5e20" strokeWidth="1" />
          <circle cx="30" cy="23" r="7" fill="#43a047" stroke="#1b5e20" strokeWidth="1" />
          <rect x="12" y="27" width="2.5" height="7" rx="1" fill="#5d4037" />
          <rect x="21" y="25" width="2.5" height="9" rx="1" fill="#5d4037" />
          <rect x="29" y="28" width="2.5" height="6" rx="1" fill="#5d4037" />
        </>
      )}
      {kind === 'gulf' && (
        <>
          <path
            d="M6 28c4-6 12-8 18-6 6 2 10 8 10 14H6z"
            fill="#4dd0e1"
            stroke="#00838f"
            strokeWidth="1.2"
          />
          <path
            d="M10 30c3-2 8-2 12 0M14 34c2-1 6-1 9 0"
            fill="none"
            stroke="#fff"
            strokeWidth="1.3"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path d="M28 14c0 4-2 7-5 9" fill="none" stroke="#00796b" strokeWidth="1.2" strokeLinecap="round" />
        </>
      )}
      {kind === 'fox-cave' && (
        <>
          <ellipse cx="20" cy="31" rx="13" ry="5" fill="#78909c" opacity="0.35" />
          <path
            d="M10 31c2-10 8-14 16-12 6 1.5 10 7 10 14H10z"
            fill="#546e7a"
            stroke="#37474f"
            strokeWidth="1.2"
          />
          <ellipse cx="20" cy="30" rx="6" ry="5" fill="#263238" />
          <ellipse cx="28" cy="28" rx="4.5" ry="3.5" fill="#ff8f00" stroke="#e65100" strokeWidth="0.9" />
          <path d="M24 26l4-3 1 4z" fill="#ff8f00" stroke="#e65100" strokeWidth="0.8" />
          <circle cx="29.5" cy="27.5" r="0.7" fill="#1a1a1a" />
          <path d="M31 29.5l2.5 0.5" stroke="#1a1a1a" strokeWidth="0.8" strokeLinecap="round" />
        </>
      )}
      {kind === 'clinic' && (
        <>
          <rect x="10" y="14" width="20" height="18" rx="1.5" fill="#e0f2f1" stroke="#00695c" strokeWidth="1.2" />
          <path d="M10 20h20" stroke="#00695c" strokeWidth="1" />
          <path d="M14 14v-4h12v4" fill="none" stroke="#00695c" strokeWidth="1.2" />
          <path
            d="M20 18c-3 0-5 2-5 4.5 0 3 5 6.5 5 6.5s5-3.5 5-6.5c0-2.5-2-4.5-5-4.5z"
            fill="#26a69a"
            stroke="#004d40"
            strokeWidth="0.9"
          />
          <path d="M20 20.5v4M18 22.5h4" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
        </>
      )}
      {kind === 'watchtower' && (
        <>
          <rect x="17" y="10" width="6" height="22" fill="#8d6e4c" stroke="#5d4037" strokeWidth="1.1" />
          <path d="M14 14h12l-2-4H16z" fill="#a1887f" stroke="#5d4037" strokeWidth="1" />
          <path d="M15 18h10M15 22h10M15 26h10" stroke="#5d4037" strokeWidth="0.9" />
          <rect x="12" y="30" width="16" height="3" rx="0.8" fill="#6d4c41" />
          <path d="M20 6v4" stroke="#5d4037" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M18 8h4" stroke="#5d4037" strokeWidth="1.2" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

export type IslandLandmark = {
  id: string
  kind: LandmarkKind
  label: string
  left: string
  top: string
}

export const ISLAND_LANDMARKS: IslandLandmark[] = [
  { id: 'plaja', kind: 'pier', label: 'Plaja nord', left: '16%', top: '26%' },
  { id: 'testoase-bug', kind: 'clinic', label: 'Centru salvare', left: '70%', top: '46%' },
  { id: 'padure', kind: 'jungle', label: 'Pădure', left: '44%', top: '38%' },
  { id: 'testoase', kind: 'turtle', label: 'Țestoase', left: '24%', top: '66%' },
  { id: 'vizuina', kind: 'fox-cave', label: 'Vizuina', left: '46%', top: '74%' },
]

export const LEGEND_ITEMS: {
  kind: LandmarkKind
  label: string
  bugZone?: boolean
}[] = [
  { kind: 'pier', label: 'Plaja' },
  { kind: 'turtle', label: 'Țestoase' },
  { kind: 'jungle', label: 'Pădurea' },
  { kind: 'clinic', label: 'Golful', bugZone: true },
  { kind: 'fox-cave', label: 'Vizuina vulpii' },
  { kind: 'watchtower', label: 'Turnul' },
]
