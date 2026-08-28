import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { SceneIllustration } from '../components/SceneIllustration'
import { SceneShell } from '../components/SceneShell'

type CutStep = {
  progress: number
  src: string
  alt: string
  caption: string
  /** Premature „liber” at 60% — the intentional bug */
  isBug?: boolean
}

/** Discrete 20% jumps; 60% shows free too early, then debris returns at 80%. */
const CUT_STEPS: CutStep[] = [
  {
    progress: 0,
    src: '/scene07-nori-debris-heavy.png',
    alt: 'Nori prins în multe resturi și plase',
    caption: 'Nori e prins în plase și resturi după furtună.',
  },
  {
    progress: 0.2,
    src: '/scene07-nori-debris-heavy-mid.png',
    alt: 'Nori cu ceva mai puține resturi',
    caption: 'Ai tăiat o parte din plase — mai rămân multe resturi.',
  },
  {
    progress: 0.4,
    src: '/scene07-nori-debris-medium.png',
    alt: 'Nori cu resturi medii pe corp',
    caption: 'Mai puține plase — tot mai e de tăiat.',
  },
  {
    progress: 0.6,
    src: '/scene07-nori-free.png',
    alt: 'Nori arată liber, deși progresul nu e gata',
    caption: 'Mai e de tăiat — încă mai sunt resturi pe Nori.',
    isBug: true,
  },
  {
    progress: 0.8,
    src: '/scene07-nori-debris-light.png',
    alt: 'Nori din nou cu resturi puține',
    caption: 'Aproape gata — mai e puțin de tăiat.',
  },
  {
    progress: 1,
    src: '/scene07-nori-free.png',
    alt: 'Nori eliberat complet de resturi',
    caption: 'Nori înoată liber — resturile au fost îndepărtate.',
  },
]

const STEP_VALUES = CUT_STEPS.map((s) => s.progress)

function snapToStep(raw: number): number {
  let best = STEP_VALUES[0]
  let bestDist = Math.abs(raw - best)
  for (const value of STEP_VALUES) {
    const dist = Math.abs(raw - value)
    if (dist < bestDist) {
      best = value
      bestDist = dist
    }
  }
  return best
}

function stepForProgress(progress: number): CutStep {
  return (
    CUT_STEPS.find((s) => Math.abs(s.progress - progress) < 0.001) ?? CUT_STEPS[0]
  )
}

export function Scene07() {
  const [cutProgress, setCutProgress] = useState(0)
  const [dragging, setDragging] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)

  const progressPct = Math.round(cutProgress * 100)
  const step = stepForProgress(cutProgress)
  const fullyDone = cutProgress >= 1
  const showBugZone = Boolean(step.isBug)
  const debrisRemovedLabel = fullyDone
    ? 'OK'
    : cutProgress > 0
      ? 'În curs'
      : 'Neînceput'

  function progressFromClientX(clientX: number) {
    const track = trackRef.current
    if (!track) return 0
    const rect = track.getBoundingClientRect()
    if (rect.width <= 0) return 0
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
  }

  function commitProgress(raw: number) {
    const value = snapToStep(raw)
    progressRef.current = value
    setCutProgress(value)
  }

  function onPointerDown(e: ReactPointerEvent<HTMLButtonElement>) {
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
    commitProgress(progressFromClientX(e.clientX))
  }

  function onPointerMove(e: ReactPointerEvent<HTMLButtonElement>) {
    if (!dragging) return
    commitProgress(progressFromClientX(e.clientX))
  }

  function onPointerUp(e: ReactPointerEvent<HTMLButtonElement>) {
    setDragging(false)
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  return (
    <SceneShell sceneId="scene-07">
      <SceneIllustration
        src="/scene07-bay.png"
        alt="Delfin prins lângă dig, barcă de salvare în fundal"
        caption="Golf sud · delfinul Nori · 11:03"
      />

      <div className="scene-lead">
        <h3 className="scene-lead-title">Obiectiv</h3>
        <p>Un delfin e prins în resturi lângă dig — taie resturile ca să-l eliberezi.</p>
      </div>

      <div className="scene-layout">
        <div className="animal-card nori-rescue">
          <div
            className="nori-portrait"
            data-bug-zone={showBugZone ? 'bug-07' : undefined}
          >
            <img src={step.src} alt={step.alt} className="nori-portrait-img" />
          </div>

          <p className="nori-caption">{step.caption}</p>

          <div className="cut-section">
            <label className="cut-label" htmlFor="nori-cut-handle">
              Taie resturile
            </label>
            <div
              ref={trackRef}
              className="cut-track"
              role="slider"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressPct}
              aria-valuetext={`${progressPct}%`}
              aria-label="Progres tăiere resturi"
            >
              <div className="cut-fill" style={{ width: `${progressPct}%` }} />
              <button
                id="nori-cut-handle"
                type="button"
                className="cut-handle"
                style={{ left: `${progressPct}%` }}
                aria-label="Trage foarfeca pe bară"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
              >
                ✂️
              </button>
            </div>
          </div>
        </div>

        <div className="panel-box">
          <h3>Verificări de urgență</h3>
          <div className="check-list" style={{ marginTop: '0.75rem' }}>
            <div className="check-row">
              <span>Perimetru de siguranță</span>
              <span className="status-pill status-ok">OK</span>
            </div>
            <div className="check-row">
              <span>Resturi îndepărtate</span>
              <span
                className={`status-pill ${fullyDone ? 'status-ok' : 'status-warn'}`}
              >
                {debrisRemovedLabel}
              </span>
            </div>
            <div className="check-row">
              <span>Status delfin</span>
              <span
                className={`status-pill ${fullyDone ? 'status-ok' : 'status-warn'}`}
              >
                {fullyDone ? 'Liber' : 'Prins în resturi'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </SceneShell>
  )
}
