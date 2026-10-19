import { useState } from 'react'
import { EvidenceShot } from '../components/EvidenceShot'
import { MissionStars, SceneStar } from '../components/Stars'
import { DEMO_PLAYER_NAME, SCENES } from '../constants'
import { useGame } from '../context/GameContext'
import {
  starFillForAttempt,
  starFillsForSession,
} from '../lib/scoring'
import { deleteSession } from '../lib/storage'
import { evidenceScreenshot, formatDuration } from '../lib/utils'

export function InstructorDashboard() {
  const {
    sessions,
    refreshSessions,
    setView,
    lockInstructor,
    setSelectedInstructorSessionId,
    selectedInstructorSessionId,
    cloudEnabled,
    enterAsDemoPlayer,
  } = useGame()
  const [demoError, setDemoError] = useState<string | null>(null)
  const [enteringDemo, setEnteringDemo] = useState(false)

  const selected = selectedInstructorSessionId
    ? sessions.find((s) => s.id === selectedInstructorSessionId)
    : null

  if (selected) {
    return (
      <div className="shell">
        <div className="scene-panel instructor-panel">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setSelectedInstructorSessionId(null)}
          >
            ← Lista participanților
          </button>
          <h2 className="scene-title instructor-title">
            {selected.childName} — Jurnalul investigației
          </h2>
          <div className="stat-row instructor-stats">
            <div className="stat">
              🐞 {selected.bugReports.length}/{SCENES.length}
            </div>
            <div className="stat stat-stars">
              <MissionStars
                fills={starFillsForSession(selected.bugReports)}
                size="md"
              />
            </div>
            <div className="stat">
              ⏱️ {formatDuration(selected.startedAt, selected.completedAt)}
            </div>
          </div>
          {selected.bugReports.map((report) => {
            const scene = SCENES.find((s) => s.id === report.sceneId)
            const shot = evidenceScreenshot(report)
            const fill = starFillForAttempt(report.attemptNumber)
            return (
              <div key={report.id} className="report-block">
                <h3>
                  {scene?.emoji} #{scene?.number} {scene?.title}
                </h3>
                {shot && <EvidenceShot src={shot} />}
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

  return (
    <div className="shell">
      <div className="scene-panel instructor-panel">
        <div className="scene-eyebrow">Instructor</div>
        <h2 className="scene-title">Lista participanților</h2>

        <div className="instructor-toolbar">
          <button type="button" className="btn btn-secondary" onClick={() => setView('review')}>
            👩‍🏫 Mod Review
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={() => setView('presentation')}
          >
            🎤 Prezentare QA
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => setView('qa-reveal')}>
            Revelație (scurtă)
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={enteringDemo}
            onClick={() => {
              setDemoError(null)
              setEnteringDemo(true)
              void enterAsDemoPlayer().then((result) => {
                setEnteringDemo(false)
                if (!result.ok) setDemoError(result.error)
              })
            }}
          >
            {enteringDemo
              ? 'Se încarcă…'
              : `🎮 Intră ca ${DEMO_PLAYER_NAME}`}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              lockInstructor()
              setView('welcome')
            }}
          >
            Ieșire
          </button>
        </div>

        {demoError && (
          <p className="field-error" role="alert">
            {demoError}
          </p>
        )}

        {!cloudEnabled && (
          <p className="instructor-note">
            Mod local — configurează VITE_SUPABASE_URL și VITE_SUPABASE_ANON_KEY în .env.local.
          </p>
        )}

        <div className="instructor-list-header">
          <button
            type="button"
            className="btn btn-ghost btn-sm instructor-reload-btn"
            onClick={() => void refreshSessions()}
            aria-label="Reîncarcă"
            title="Reîncarcă"
          >
            🔄
          </button>
        </div>

        {sessions.length === 0 ? (
          <p className="muted instructor-empty">Nicio sesiune salvată încă.</p>
        ) : (
          <>
            <div className="table-wrap instructor-table">
              <table>
                <thead>
                  <tr>
                    <th>Copil</th>
                    <th>Bug-uri</th>
                    <th>Scor</th>
                    <th>Durată</th>
                    <th aria-label="Acțiuni" />
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => (
                    <tr key={s.id} className="clickable">
                      <td
                        className="instructor-name"
                        onClick={() => setSelectedInstructorSessionId(s.id)}
                      >
                        {s.childName}
                      </td>
                      <td onClick={() => setSelectedInstructorSessionId(s.id)}>
                        {s.bugReports.length}/{SCENES.length}
                      </td>
                      <td
                        className="instructor-stars-cell"
                        onClick={() => setSelectedInstructorSessionId(s.id)}
                      >
                        <MissionStars
                          fills={starFillsForSession(s.bugReports)}
                          size="sm"
                        />
                      </td>
                      <td onClick={() => setSelectedInstructorSessionId(s.id)}>
                        {formatDuration(s.startedAt, s.completedAt)}
                      </td>
                      <td className="instructor-actions-cell">
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => {
                            if (confirm(`Ștergi sesiunea lui ${s.childName}?`)) {
                              void deleteSession(s.id).then(() => refreshSessions())
                            }
                          }}
                        >
                          Șterge
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="instructor-cards">
              {sessions.map((s) => (
                <article key={s.id} className="instructor-card">
                  <button
                    type="button"
                    className="instructor-card-main"
                    onClick={() => setSelectedInstructorSessionId(s.id)}
                  >
                    <strong>{s.childName}</strong>
                    <div className="instructor-card-stats">
                      <span>🐞 {s.bugReports.length}/{SCENES.length}</span>
                      <span className="instructor-card-stars">
                        <MissionStars
                          fills={starFillsForSession(s.bugReports)}
                          size="sm"
                        />
                      </span>
                      <span>⏱️ {formatDuration(s.startedAt, s.completedAt)}</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      if (confirm(`Ștergi sesiunea lui ${s.childName}?`)) {
                        void deleteSession(s.id).then(() => refreshSessions())
                      }
                    }}
                  >
                    Șterge
                  </button>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
