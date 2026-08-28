import { ResetGameButton } from '../components/ResetGameButton'
import { SCENES } from '../constants'
import { useGame } from '../context/GameContext'
import { evidenceScreenshot, formatDuration } from '../lib/utils'

export function Journal() {
  const { session, setView } = useGame()
  if (!session) return null

  const found = session.bugReports.length

  return (
    <div className="shell">
      <div className="scene-panel" style={{ paddingBottom: '1.75rem' }}>
        <div className="scene-eyebrow">📓 Final</div>
        <h2 className="scene-title">Jurnalul meu de salvare</h2>
        <p className="scene-lead">
          Salvator: <strong>{session.childName}</strong>
        </p>
        <div className="stat-row">
          <div className="stat">
            🐞 Probleme: {found}/{SCENES.length}
          </div>
          <div className="stat">⭐ Scor: {session.score}</div>
          <div className="stat">
            ⏱️ Timp: {formatDuration(session.startedAt, session.completedAt)}
          </div>
        </div>

        {session.bugReports.length === 0 && (
          <p className="muted">Nu ai raportat încă niciun bug.</p>
        )}

        {session.bugReports.map((report) => {
          const scene = SCENES.find((s) => s.id === report.sceneId)
          const shot = evidenceScreenshot(report)
          return (
            <div key={report.id} className="report-block">
              <h3>
                {scene?.emoji} Problema #{scene?.number} — {scene?.title}
              </h3>
              {shot && (
                <div className="evidence-shot">
                  <img src={shot} alt="Zona identificată" />
                </div>
              )}
              <p>
                <strong>Ce ai observat?</strong>
              </p>
              <p>„{report.description}”</p>
              <p className="muted">+{report.score} XP · încercarea {report.attemptNumber}</p>
            </div>
          )
        })}

        <div className="scene-actions">
          <ResetGameButton label="Înapoi la start" />
          <button type="button" className="btn btn-secondary" onClick={() => setView('qa-reveal')}>
            Ce am învățat? 🐞
          </button>
        </div>
      </div>
    </div>
  )
}
