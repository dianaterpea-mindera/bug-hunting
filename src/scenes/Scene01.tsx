import { SceneIllustration } from '../components/SceneIllustration'
import { SceneShell } from '../components/SceneShell'

export function Scene01() {
  return (
    <SceneShell sceneId="scene-01">
      <SceneIllustration
        src="/scene01-arrival.png"
        alt="Barca de salvare ajunge la insulă"
        caption="Debarcader · Insula Coralilor · 08:14"
      />

      <div className="scene-lead">
        <h3 className="scene-lead-title">Obiectiv</h3>
        <p>Verifică detaliile misiunii înainte să cobori pe țărm.</p>
      </div>

      <div className="panel-box">
        <h3>Detalii misiune</h3>
        <div className="info-grid" style={{ marginTop: '0.85rem' }}>
          <div className="info-tile rich">
            <span className="icon" data-bug-zone="bug-01">
              🚗
            </span>
            <strong>Transport</strong>
            <span>Ai ajuns cu barca de salvare</span>
          </div>
          <div className="info-tile rich">
            <span className="icon">🏝️</span>
            <strong>Locație</strong>
            <span>Insula Coralilor · sector nord</span>
          </div>
          <div className="info-tile rich">
            <span className="icon">🎯</span>
            <strong>Obiectiv</strong>
            <span>Ajută animalele afectate de furtună</span>
          </div>
          <div className="info-tile rich">
            <span className="icon">🧭</span>
            <strong>Punct de start</strong>
            <span>Debarcaderul vechi</span>
          </div>
        </div>
      </div>
    </SceneShell>
  )
}
