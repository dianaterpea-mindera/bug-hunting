import { useState } from 'react'
import { AnimalGlyph } from '../components/AnimalGlyph'
import { SceneIllustration } from '../components/SceneIllustration'
import { SceneShell } from '../components/SceneShell'

type BeachAnimal = {
  id: string
  name: string
  kind: string
  place: string
  emoji: string
  icon?: string
  status: 'ok' | 'warn'
  statusLabel: string
}

const ANIMALS: BeachAnimal[] = [
  {
    id: 'tessa',
    name: 'Tessa',
    kind: 'Țestoasă de mare',
    place: 'Plaja de nord',
    emoji: '🐢',
    status: 'warn',
    statusLabel: 'Necesită ajutor',
  },
  {
    id: 'pico',
    name: 'Pico',
    kind: 'Pescăruș',
    place: 'Stâncile est',
    emoji: '🐦',
    icon: '/pico-seagull.svg',
    status: 'ok',
    statusLabel: 'Stabil',
  },
  {
    id: 'mina',
    name: 'Mina',
    kind: 'Crab',
    place: 'Recif mic',
    emoji: '🦀',
    status: 'ok',
    statusLabel: 'Observație',
  },
]

export function Scene03() {
  const [selected, setSelected] = useState<string | null>(null)

  const animal = ANIMALS.find((a) => a.id === selected)

  return (
    <SceneShell sceneId="scene-03">
      <SceneIllustration
        src="/scene03-beach.png"
        alt="Plaja de nord la maree joasă, cu țestoasă de mare, pescăruș și crab"
        caption="Plaja de nord · maree joasă · 09:20"
      />

      <div className="scene-lead">
        <h3 className="scene-lead-title">Obiectiv</h3>
        <p>Deschide fișele și verifică datele animalelor de pe plajă.</p>
      </div>

      <div className="scene-layout">
        <div className="panel-box">
          <h3>Animale pe plajă</h3>
          <div className="animal-list" style={{ marginTop: '0.75rem' }}>
            {ANIMALS.map((a) => (
              <button
                key={a.id}
                type="button"
                className={`animal-row${selected === a.id ? ' active' : ''}`}
                onClick={() => setSelected(a.id)}
              >
                <AnimalGlyph emoji={a.emoji} icon={a.icon} />
                <div style={{ flex: 1 }}>
                  <strong>{a.name}</strong>
                  <div className="muted">
                    {a.kind} · {a.place}
                  </div>
                </div>
                <span
                  className={`status-pill ${a.status === 'ok' ? 'status-ok' : 'status-warn'}`}
                >
                  {a.statusLabel}
                </span>
              </button>
            ))}
          </div>
        </div>

        {animal ? (
          <div
            className="animal-card"
            data-bug-zone={animal.id === 'tessa' ? 'bug-03' : undefined}
          >
            <h3 className="patient-sheet-title">
              <AnimalGlyph emoji={animal.emoji} icon={animal.icon} /> Fișa — {animal.name}
            </h3>
            <p>
              <strong>Nume:</strong> {animal.id === 'tessa' ? 'Tina' : animal.name}
            </p>
            <p>
              <strong>Specie:</strong> {animal.kind}
            </p>
            <p>
              <strong>Locație:</strong> {animal.place}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              <span
                className={`status-pill ${
                  animal.status === 'ok' ? 'status-ok' : 'status-warn'
                }`}
              >
                {animal.statusLabel}
              </span>
            </p>
          </div>
        ) : (
          <div className="panel-box">
            <h3>Detaliu fișă</h3>
            <p className="muted" style={{ marginTop: '0.5rem' }}>
              Alege un animal din listă ca să vezi datele complete.
            </p>
          </div>
        )}
      </div>
    </SceneShell>
  )
}
