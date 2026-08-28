import { SceneIllustration } from '../components/SceneIllustration'
import {
  ISLAND_LANDMARKS,
  IslandMapLandmarkIcon,
  LEGEND_ITEMS,
} from '../components/IslandMapLandmarks'
import { SceneShell } from '../components/SceneShell'

export function Scene02() {
  return (
    <SceneShell sceneId="scene-02">
      <SceneIllustration
        src="/scene02-map.png"
        alt="Harta insulei cu toate zonele marcate"
        caption="Hartă topografică Insula Coralilor · scară 1:8.000"
      />

      <div className="scene-lead">
        <h3 className="scene-lead-title">Obiectiv</h3>
        <p>Folosește legenda și marcajele ca să te orientezi pe hartă.</p>
      </div>

      <div className="scene-layout">
        <div className="island-map" aria-label="Harta insulei">
          <svg className="island-map-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="island-sea" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#81d4fa" />
                <stop offset="45%" stopColor="#4dd0e1" />
                <stop offset="100%" stopColor="#26a69a" />
              </linearGradient>
              <linearGradient id="island-land" x1="20%" y1="10%" x2="80%" y2="90%">
                <stop offset="0%" stopColor="#aed581" />
                <stop offset="55%" stopColor="#66bb6a" />
                <stop offset="100%" stopColor="#43a047" />
              </linearGradient>
            </defs>

            <rect width="100" height="100" fill="url(#island-sea)" />

            <path
              className="island-coast-shape"
              d="M14 24
                 C10 34, 9 48, 12 62
                 C15 76, 28 86, 44 88
                 C58 90, 72 84, 80 72
                 C88 58, 90 42, 84 30
                 C78 18, 62 12, 46 14
                 C32 16, 18 18, 14 24 Z"
              fill="url(#island-land)"
              stroke="rgba(45,106,79,0.45)"
              strokeWidth="0.6"
            />

            <ellipse cx="48" cy="42" rx="11" ry="8" fill="#2e7d32" opacity="0.55" />

            <path
              className="island-trail"
              d="M20 30
                 C22 38, 20 48, 22 56
                 C26 66, 36 72, 48 76
                 C60 72, 70 62, 74 50
                 C76 40, 72 32, 62 28
                 C52 24, 42 26, 36 32
                 C32 36, 26 34, 20 30 Z"
              fill="none"
              stroke="#6d4c41"
              strokeWidth="0.85"
              strokeDasharray="2.2 1.8"
              strokeLinecap="round"
            />

            {[
              [20, 30],
              [22, 56],
              [48, 76],
              [74, 50],
              [62, 28],
            ].map(([cx, cy]) => (
              <circle
                key={`${cx}-${cy}`}
                className="island-trail-node"
                cx={cx}
                cy={cy}
                r="1.6"
                fill="#5d4037"
                stroke="#fff8e1"
                strokeWidth="0.35"
              />
            ))}
          </svg>

          <div className="map-compass">
            N
            <br />↑
          </div>
          <div className="map-scale">▌▌▌ 500 m</div>

          {ISLAND_LANDMARKS.map((landmark) => (
            <span
              key={landmark.id}
              className="map-pin"
              style={{ left: landmark.left, top: landmark.top }}
            >
              <IslandMapLandmarkIcon kind={landmark.kind} className="map-landmark-icon" />
              <span className="pin-label">{landmark.label}</span>
            </span>
          ))}

          <span className="map-pin map-pin--minor" style={{ left: '70%', top: '25%' }}>
            <IslandMapLandmarkIcon kind="watchtower" className="map-landmark-icon map-landmark-icon--sm" />
            <span className="pin-label">Turn</span>
          </span>
        </div>

        <div className="map-legend">
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Legendă</h3>
          {LEGEND_ITEMS.map((item) => (
            <div
              key={item.label}
              className="legend-row"
              data-bug-zone={item.bugZone ? 'bug-02' : undefined}
            >
              <IslandMapLandmarkIcon kind={item.kind} className="legend-landmark-icon" />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </SceneShell>
  )
}
