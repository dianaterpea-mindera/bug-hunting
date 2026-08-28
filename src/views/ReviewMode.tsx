import { useMemo, useState } from 'react'
import { EvidenceShot } from '../components/EvidenceShot'
import { SCENES } from '../constants'
import { useGame } from '../context/GameContext'
import { evidenceScreenshot } from '../lib/utils'

export function ReviewMode() {
  const { sessions, setView } = useGame()
  const [sceneId, setSceneId] = useState(SCENES[5]?.id ?? SCENES[0].id)

  const reports = useMemo(
    () =>
      sessions
        .flatMap((s) =>
          s.bugReports
            .filter((r) => r.sceneId === sceneId)
            .map((r) => ({ ...r, childName: s.childName })),
        )
        .sort((a, b) => a.childName.localeCompare(b.childName)),
    [sceneId, sessions],
  )

  const scene = SCENES.find((s) => s.id === sceneId)

  return (
    <div className="shell">
      <div className="scene-panel" style={{ paddingBottom: '1.75rem' }}>
        <button type="button" className="btn btn-ghost" onClick={() => setView('instructor')}>
          ← Dashboard
        </button>
        <h2 className="scene-title" style={{ marginTop: '1rem' }}>
          👩‍🏫 Review
        </h2>
        <div className="field">
          <label htmlFor="scene">Alege scena</label>
          <select
            id="scene"
            value={sceneId}
            onChange={(e) => setSceneId(e.target.value)}
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              borderRadius: 14,
              border: '2px solid rgba(26,107,122,0.2)',
              font: 'inherit',
            }}
          >
            {SCENES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.emoji} Scena {s.number} — {s.title}
              </option>
            ))}
          </select>
        </div>

        <h3>
          {scene?.emoji} {scene?.title}
        </h3>

        {reports.length === 0 && (
          <p className="muted">Niciun raport pentru această scenă încă.</p>
        )}

        {reports.map((r) => {
          const shot = evidenceScreenshot(r)
          return (
            <div key={r.id} className="report-block">
              <h3>{r.childName}</h3>
              {shot && <EvidenceShot src={shot} />}
              <p>„{r.description}”</p>
            </div>
          )
        })}

        <div className="panel-box" style={{ marginTop: '1rem' }}>
          <h3>Întrebări pentru grupă</h3>
          <ul>
            <li>Ce a observat fiecare?</li>
            <li>Care raport este mai clar?</li>
            <li>Ce ar trebui să știe programatorul ca să poată rezolva problema?</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
