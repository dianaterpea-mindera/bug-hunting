import { FinalNav } from '../components/FinalNav'
import { MissionStars, SceneStar } from '../components/Stars'
import { SCENES } from '../constants'
import { useGame } from '../context/GameContext'
import {
  isMaxSceneScore,
  maxStarsTotal,
  starFillForAttempt,
  starFillsForSession,
  starsFromReports,
} from '../lib/scoring'
import { evidenceScreenshot, formatDuration } from '../lib/utils'

export function Journal() {
  const { session } = useGame()
  if (!session) return null

  const found = session.bugReports.length
  const stars = starsFromReports(session.bugReports)
  const maxTotal = maxStarsTotal()
  const maxCount = session.bugReports.filter((r) =>
    isMaxSceneScore(r.attemptNumber),
  ).length

  return (
    <div className="shell">
      <FinalNav active="journal" />

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
          <div className="stat stat-stars">
            <MissionStars
              fills={starFillsForSession(session.bugReports)}
              size="md"
            />
          </div>
          <div className="stat">
            ⏱️ Timp: {formatDuration(session.startedAt, session.completedAt)}
          </div>
        </div>
        {found > 0 && (
          <p className="muted score-summary">
            Stele pline pe {maxCount}/{found} ecrane
            {stars === maxTotal
              ? ' — scor perfect!'
              : ' (stea plină = din prima, jumătate = după greșeli).'}
          </p>
        )}

        {session.bugReports.length === 0 && (
          <p className="muted">Nu ai raportat încă niciun bug.</p>
        )}

        {session.bugReports.map((report) => {
          const scene = SCENES.find((s) => s.id === report.sceneId)
          const shot = evidenceScreenshot(report)
          const fill = starFillForAttempt(report.attemptNumber)
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
              <div className="report-score-row">
                <SceneStar fill={fill} size="md" />
                {report.attemptNumber > 1 ? (
                  <span className="muted">
                    încercarea {report.attemptNumber}
                  </span>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
