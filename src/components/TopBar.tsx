import { APP_NAME, INSTRUCTIONS_STEP, SCENES } from '../constants'
import {
  getFrontierSceneIndex,
  isSceneNavigable,
  useGame,
} from '../context/GameContext'
import { ResetGameButton } from './ResetGameButton'

export function TopBar() {
  const { session, currentSceneIndex, view } = useGame()
  if (!session) return null

  const onInstructions = view === 'instructions'

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <span className="topbar-brand-mark" aria-hidden>
          🌊
        </span>
        <span className="topbar-brand-name">{APP_NAME}</span>
      </div>

      <div className="topbar-agent" title={session.childName}>
        <span className="topbar-agent-name">
          <span className="topbar-agent-prefix">Salvator:</span>{' '}
          {session.childName}
        </span>
      </div>

      <div className="topbar-stats">
        <div className="topbar-stat">
          <span className="topbar-stat-label">Misiunea</span>
          <span className="topbar-stat-value">
            {onInstructions ? (
              '—'
            ) : (
              <>
                {currentSceneIndex + 1}
                <span className="topbar-stat-of">/{SCENES.length}</span>
              </>
            )}
          </span>
        </div>
        <div className="topbar-stat topbar-stat-score">
          <span className="topbar-stat-label">Scor</span>
          <span className="topbar-stat-value">
            <span aria-hidden>★</span> {session.score}
          </span>
        </div>
        <ResetGameButton className="btn topbar-reset" label="Reîncepe" />
      </div>
    </header>
  )
}

export function ProgressTrack() {
  const { session, currentSceneIndex, goToScene, view, setView } = useGame()
  if (!session) return null

  const frontierIndex = session.completedAt
    ? -1
    : getFrontierSceneIndex(session)
  const onInstructions = view === 'instructions'
  const instructionsNavigable = !session.completedAt
  const instructionsLabel = onInstructions
    ? `${INSTRUCTIONS_STEP.title} (vizualizat)`
    : INSTRUCTIONS_STEP.title

  return (
    <div className="progress-track" aria-label="Progres misiune">
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
          !onInstructions && index === frontierIndex
        const viewing =
          !onInstructions &&
          index === currentSceneIndex &&
          !session.completedAt &&
          index !== frontierIndex
        const navigable =
          !session.completedAt && isSceneNavigable(session, index)
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
    </div>
  )
}
