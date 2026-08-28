import { useMemo, useState } from 'react'
import { AnimalGlyph } from '../components/AnimalGlyph'
import { SceneIllustration } from '../components/SceneIllustration'
import { SceneShell } from '../components/SceneShell'

type FilterId = 'all' | 'aviar' | 'boxa' | 'baie' | 'bazin'

type Animal = {
  id: string
  name: string
  kind: string
  room: string
  emoji: string
  icon?: string
  status: string
  daysInCare: number
  caretaker: string
  diet: string
  nextCheck: string
  note: string
  zone: Exclude<FilterId, 'all'>
}

const ANIMALS: Animal[] = [
  {
    id: 'a1',
    name: 'Tessa',
    kind: 'Țestoasă',
    room: 'Baia caldă',
    emoji: '🐢',
    status: 'Recuperare',
    daysInCare: 6,
    caretaker: 'Vol. Mara',
    diet: 'Alge + legume',
    nextCheck: 'Mâine, 09:00',
    note: 'Carapace tratată · evoluție bună',
    zone: 'baie',
  },
  {
    id: 'a2',
    name: 'Kiko',
    kind: 'Papagal',
    room: 'Voliera tropicală',
    emoji: '🦜',
    status: 'În tratament',
    daysInCare: 4,
    caretaker: 'Dr. Ioana',
    diet: 'Semințe + fructe',
    nextCheck: 'Azi, 16:30',
    note: 'Aripa stângă imobilizată',
    zone: 'aviar',
  },
  {
    id: 'a3',
    name: 'Ruxi',
    kind: 'Vulpe',
    room: 'Adăpostul de pădure',
    emoji: '🦊',
    status: 'Hidratare',
    daysInCare: 2,
    caretaker: 'Vol. Andrei',
    diet: 'Carne slabă + apă',
    nextCheck: 'Azi, 14:00',
    note: 'Hidratare în curs · apetit slab',
    zone: 'boxa',
  },
  {
    id: 'a4',
    name: 'Nori',
    kind: 'Delfin',
    room: 'Bazinul marin',
    emoji: '🐬',
    status: 'Monitorizare',
    daysInCare: 3,
    caretaker: 'Dr. Elena',
    diet: 'Pește proaspăt',
    nextCheck: 'Mâine, 11:00',
    note: 'Monitorizare post-intervenție',
    zone: 'bazin',
  },
  {
    id: 'a5',
    name: 'Pico',
    kind: 'Pescăruș',
    room: 'Voliera de coastă',
    emoji: '🐦',
    icon: '/pico-seagull.svg',
    status: 'Observație',
    daysInCare: 1,
    caretaker: 'Vol. Mara',
    diet: 'Pește mic',
    nextCheck: 'Poimâine, 10:00',
    note: 'Observație · fără tratament activ',
    zone: 'aviar',
  },
]

/** Intentional bug: Pico is dropped when the "Toate" filter is active. */
const HIDDEN_ON_ALL_ID = 'a5'

const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'Toate' },
  { id: 'aviar', label: 'Volieră' },
  { id: 'boxa', label: 'Adăpost' },
  { id: 'baie', label: 'Baie' },
  { id: 'bazin', label: 'Bazin' },
]

function applyFilter(filter: FilterId): Animal[] {
  if (filter === 'all') {
    return ANIMALS.filter((a) => a.id !== HIDDEN_ON_ALL_ID)
  }
  return ANIMALS.filter((a) => a.zone === filter)
}

export function Scene08() {
  const [filter, setFilter] = useState<FilterId>('all')
  const [selectedId, setSelectedId] = useState(ANIMALS[0].id)

  const visible = useMemo(() => applyFilter(filter), [filter])
  const selected = ANIMALS.find((a) => a.id === selectedId) ?? ANIMALS[0]
  const bugActive = filter === 'all'
  /** On "Toate": count shows 5 but only 4 appear — Pico is missing from the list. */
  const shownCount = bugActive ? ANIMALS.length : visible.length

  function chooseFilter(next: FilterId) {
    setFilter(next)
    const nextVisible = applyFilter(next)
    if (!nextVisible.some((a) => a.id === selectedId) && nextVisible[0]) {
      setSelectedId(nextVisible[0].id)
    }
  }

  return (
    <SceneShell sceneId="scene-08">
      <SceneIllustration
        src="/scene08-rescue-center.png"
        alt="Centrul de salvare cu animale și voluntari"
        caption="Centrul de salvare · internări"
      />

      <div className="scene-lead">
        <h3 className="scene-lead-title">Obiectiv</h3>
        <p>Explorează lista pe zone — fiecare pacient trebuie să apară corect.</p>
      </div>

      <div className="scene-layout">
        <div className="panel-box">
          <div className="panel-head">
            <h3>Lista pacienților</h3>
            <span
              className="chip"
              data-bug-zone={bugActive ? 'bug-08' : undefined}
            >
              {shownCount}
            </span>
          </div>

          <div className="patient-filters" role="group" aria-label="Filtrează după zonă">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`filter-btn${filter === f.id ? ' active' : ''}`}
                onClick={() => chooseFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div
            className="animal-list patient-animal-list"
            style={{ marginTop: '0.75rem' }}
            data-bug-zone={bugActive ? 'bug-08' : undefined}
          >
            {visible.map((a) => (
              <button
                key={a.id}
                type="button"
                className={`animal-row${selected.id === a.id ? ' active' : ''}`}
                onClick={() => setSelectedId(a.id)}
              >
                <AnimalGlyph emoji={a.emoji} icon={a.icon} />
                <div style={{ flex: 1 }}>
                  <strong>{a.name}</strong>
                  <div className="muted">
                    {a.kind} · {a.room}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="animal-card">
          <h3>Fișă pacient</h3>
          <div className="photo-frame dense" style={{ marginTop: '0.75rem' }}>
            <AnimalGlyph emoji={selected.emoji} icon={selected.icon} big />
            <div>
              <strong style={{ fontSize: '1.2rem' }}>{selected.name}</strong>
              <div className="muted">{selected.kind}</div>
              <div className="muted" style={{ marginTop: '0.25rem' }}>
                {selected.room}
              </div>
            </div>
          </div>

          <div className="mini-stat-grid" style={{ marginTop: '0.85rem' }}>
            <div className="mini-stat">
              <span className="label">Status</span>
              <span className="value">{selected.status}</span>
            </div>
            <div className="mini-stat">
              <span className="label">Zile în îngrijire</span>
              <span className="value">{selected.daysInCare}</span>
            </div>
            <div className="mini-stat">
              <span className="label">Îngrijitor</span>
              <span className="value">{selected.caretaker}</span>
            </div>
            <div className="mini-stat">
              <span className="label">Dietă</span>
              <span className="value">{selected.diet}</span>
            </div>
            <div className="mini-stat">
              <span className="label">Locație</span>
              <span className="value">{selected.room}</span>
            </div>
            <div className="mini-stat">
              <span className="label">Următorul control</span>
              <span className="value">{selected.nextCheck}</span>
            </div>
          </div>

          <div className="note-box">
            <strong>Notă medicală:</strong> {selected.note}
          </div>
        </div>
      </div>
    </SceneShell>
  )
}
