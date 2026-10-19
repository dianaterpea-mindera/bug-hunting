import { APP_NAME, INSTRUCTIONS_STEP, SCENES } from '../constants'
import {
  getFrontierSceneIndex,
  isSceneNavigable,
  isSessionFinished,
  useGame,
} from '../context/GameContext'
import { formatStars, starFillsForSession, starsFromReports } from '../lib/scoring'
import { MissionStars } from './Stars'
import { ResetGameButton } from './ResetGameButton'

export function TopBar() {
  const { session } = useGame()
  if (!session) return null

  const fills = starFillsForSession(session.bugReports)
  const earned = starsFromReports(session.bugReports)
  const initial =
    session.childName.trim().charAt(0).toLocaleUpperCase('ro-RO') || '?'

  return (
    <header className="topbar">
      <div className="topbar-main">
        <div className="topbar-cell topbar-brand">
          <span className="topbar-cell-icon topbar-brand-mark" aria-hidden>
            🌊
          </span>
          <span className="topbar-cell-text">
            <span className="topbar-cell-label">Aventură</span>
            <span className="topbar-cell-value">{APP_NAME}</span>
          </span>
        </div>

        <div
          className="topbar-cell topbar-user"
          title={`Salvator: ${session.childName}`}
        >
          <span className="topbar-cell-icon topbar-user-avatar" aria-hidden>
            {initial}
          </span>
          <span className="topbar-cell-text">
            <span className="topbar-cell-label">Salvator</span>
            <span className="topbar-cell-value">{session.childName}</span>
          </span>
        </div>

        <ResetGameButton className="btn topbar-reset" label="Reîncepe" />
      </div>

      <div className="topbar-score-track">
        <span className="topbar-score-track-label">Scor</span>
        <MissionStars
          fills={fills}
          size="md"
          showLevelNumbers
          showTotal={false}
        />
        <span className="topbar-score-track-total" aria-hidden>
          {formatStars(earned)}
          <span className="topbar-stat-of">/{SCENES.length}</span>
        </span>
      </div>
    </header>
  )
}

export function ProgressTrack() {
  const { session, currentSceneIndex, goToScene, view, setView } = useGame()
  if (!session) return null

  const finished = isSessionFinished(session)
  const frontierIndex = finished ? -1 : getFrontierSceneIndex(session)
  const onInstructions = view === 'instructions'
  const onCertificate = view === 'certificate'
  const instructionsNavigable = true
  const instructionsLabel = onInstructions
    ? `${INSTRUCTIONS_STEP.title} (vizualizat)`
    : INSTRUCTIONS_STEP.title

  return (
    <div className="progress-track" aria-label="Progres misiune">
      <div className="progress-track-dots">
        <button
          type="button"
          className={`progress-dot progress-dot-instructions${onInstructions ? ' current' : ''}${instructionsNavigable ? ' navigable' : ' locked'}`}
          title={instructionsLabel}
          aria-label={instructionsLabel}
          aria-current={onInstructions ? 'step' : undefined}
          disabled={!instructionsNavigable}
          onClick={() => setView('instructions')}
        >
          {INSTRUCTIONS_STEP.emoji}
        </button>

        {SCENES.map((scene, index) => {
          const done = session.scenesCompleted.includes(scene.id)
          const inProgress =
            !onInstructions &&
            !onCertificate &&
            !finished &&
            index === frontierIndex
          const viewing =
            !onInstructions &&
            !onCertificate &&
            index === currentSceneIndex &&
            (finished || index !== frontierIndex)
          const navigable = isSceneNavigable(session, index)
          const label = done
            ? viewing
              ? `${scene.title} (terminat · vizualizat)`
              : `${scene.title} (terminat)`
            : inProgress
              ? `${scene.title} (în curs)`
              : navigable
                ? scene.title
                : `${scene.title} (blocat)`

          return (
            <button
              key={scene.id}
              type="button"
              className={`progress-dot${done ? ' done' : ''}${inProgress ? ' current' : ''}${viewing ? ' viewing' : ''}${navigable ? ' navigable' : ' locked'}`}
              title={label}
              aria-label={label}
              aria-current={inProgress || viewing ? 'step' : undefined}
              disabled={!navigable}
              onClick={() => {
                setView('game')
                goToScene(index)
              }}
            >
              {scene.emoji}
            </button>
          )
        })}

        {finished ? (
          <button
            type="button"
            className={`progress-dot progress-dot-certificate done navigable${onCertificate ? ' current' : ''}`}
            title="Certificat de finalizare"
            aria-label="Certificat de finalizare"
            aria-current={onCertificate ? 'step' : undefined}
            onClick={() => setView('certificate')}
          >
            📜
          </button>
        ) : null}
      </div>

      <div className="progress-track-mission" aria-live="polite">
        <span className="progress-track-mission-label">Misiunea</span>
        <span className="progress-track-mission-value">
          {onInstructions ? (
            '—'
          ) : (
            <>
              {currentSceneIndex + 1}
              <span className="progress-track-mission-of">
                /{SCENES.length}
              </span>
            </>
          )}
        </span>
      </div>
    </div>
  )
}
