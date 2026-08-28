import { useState } from 'react'
import { AnimalGlyph } from '../components/AnimalGlyph'
import { SceneIllustration } from '../components/SceneIllustration'
import { SceneShell } from '../components/SceneShell'

type ListStatus = 'ok' | 'warn' | 'hold'

type Candidate = {
  id: string
  name: string
  emoji: string
  icon?: string
  kind: string
  room: string
  listStatus: ListStatus
  listLabel: string
  status: string
  daysInCare: number
  caretaker: string
  diet: string
  nextCheck: string
  diagnosis: string
  treatment: string
  vitals: string
  medicalNote: string
  doctorNote: string
}

const ANIMALS: Candidate[] = [
  {
    id: 'tessa',
    name: 'Tessa',
    emoji: '🐢',
    kind: 'Țestoasă de mare',
    room: 'Baia caldă',
    listStatus: 'ok',
    listLabel: 'Pregătită pentru eliberare',
    status: 'Recuperare finalizată',
    daysInCare: 12,
    caretaker: 'Dr. Ioana',
    diet: 'Alge marine + legume verzi',
    nextCheck: 'Azi, 11:00 — control pre-eliberare',
    diagnosis: 'Fisură carapace (vindecată), deshidratare ușoară (rezolvată)',
    treatment: 'Pansamente zilnice oprite; carapace integră la examinare',
    vitals: 'Temperatură 28,4 °C · apetit bun · mobilă',
    medicalNote: 'Vindecată complet. Poate fi eliberată pe plaja nord.',
    doctorNote: 'Semnat: Dr. Ioana — eliberare aprobată pentru azi.',
  },
  {
    id: 'ruxi',
    name: 'Ruxi',
    emoji: '🦊',
    kind: 'Vulpe',
    room: 'Adăpostul de pădure',
    listStatus: 'warn',
    listLabel: 'În îngrijire',
    status: 'Recuperare activă',
    daysInCare: 6,
    caretaker: 'Vol. Andrei',
    diet: 'Carne slabă + apă proaspătă',
    nextCheck: 'Azi, 16:00 — schimb pansament',
    diagnosis: 'Plagă la laba dreaptă (închidere 80%)',
    treatment: 'Pansamente zilnice + antibiotic oral',
    vitals: 'Hidratare bună · apetit în creștere · mobilă cu precauție',
    medicalNote: 'Plaga se vindecă, dar încă are nevoie de pansamente.',
    doctorNote: 'Semnat: Dr. Ioana — rămâne în centru încă câteva zile.',
  },
  {
    id: 'nori',
    name: 'Nori',
    emoji: '🐬',
    kind: 'Delfin',
    room: 'Bazinul marin',
    listStatus: 'warn',
    listLabel: 'Monitorizare',
    status: 'Post-intervenție',
    daysInCare: 8,
    caretaker: 'Dr. Elena',
    diet: 'Pește proaspăt (sardine, macrou)',
    nextCheck: 'Mâine, 08:00 — ecografie',
    diagnosis: 'Entanglement (plase + resturi) — leziuni superficiale',
    treatment: 'Toaletare zilnică + monitorizare înot',
    vitals: 'Frecvență respiratorie stabilă · înoată 20 min/sesiune',
    medicalNote: 'Semnele vitale sunt stabile; monitorizare continuă în bazin.',
    doctorNote: 'Semnat: Dr. Elena — nu e încă gata de eliberare în golf.',
  },
  {
    id: 'pico',
    name: 'Pico',
    emoji: '🐦',
    icon: '/pico-seagull.svg',
    kind: 'Pescăruș',
    room: 'Voliera de coastă',
    listStatus: 'hold',
    listLabel: 'Observație',
    status: 'Observație',
    daysInCare: 5,
    caretaker: 'Vol. Mara',
    diet: 'Pește mic + electroliți',
    nextCheck: 'Poimâine, 10:00 — control aripă',
    diagnosis: 'Contuzie aripă dreaptă (fără fractură)',
    treatment: 'Odihnă în volieră mică; fără zbor forțat',
    vitals: 'Apetit bun · zboară scurt în volieră · fără semne de infecție',
    medicalNote: 'Progres bun, dar încă în observație — nu e candidat de eliberare.',
    doctorNote: 'Semnat: Vol. Mara — așteptăm încă 2 zile înainte de reevaluare.',
  },
  {
    id: 'kiko',
    name: 'Kiko',
    emoji: '🦜',
    kind: 'Papagal',
    room: 'Voliera tropicală',
    listStatus: 'ok',
    listLabel: 'Pregătit pentru eliberare',
    status: 'În tratament',
    daysInCare: 4,
    caretaker: 'Dr. Ioana',
    diet: 'Semințe + fructe moi',
    nextCheck: 'Mâine, 09:30 — reevaluare aripă',
    diagnosis: 'Fractură aripă stângă (imobilizată)',
    treatment: 'Bandaj + odihnă; zbor interzis încă 5–7 zile',
    vitals: 'Respirație normală · apetit moderat · stres redus',
    medicalNote: 'Încă are nevoie de îngrijire. Aripa nu e gata de zbor.',
    doctorNote: 'Semnat: Dr. Ioana — eliberarea se amână până la reevaluarea de mâine.',
  },
  {
    id: 'mina',
    name: 'Mina',
    emoji: '🦀',
    kind: 'Crab',
    room: 'Tanc de recif',
    listStatus: 'ok',
    listLabel: 'Pregătită pentru eliberare',
    status: 'Stabilă',
    daysInCare: 3,
    caretaker: 'Vol. Mara',
    diet: 'Algă + resturi de pește',
    nextCheck: 'Azi, 14:30 — eliberare în recif',
    diagnosis: 'Chelicere ușor deteriorate (regenerare în curs)',
    treatment: 'Izolare în tanc cald; fără intervenție suplimentară',
    vitals: 'Activă · mănâncă normal · carapace intactă',
    medicalNote: 'Complet recuperată. Poate fi eliberată în reciful mic de la est.',
    doctorNote: 'Semnat: Vol. Mara — eliberare aprobată pentru după-amiază.',
  },
  {
    id: 'lira',
    name: 'Lira',
    emoji: '🦎',
    kind: 'Iguană',
    room: 'Seră tropicală',
    listStatus: 'warn',
    listLabel: 'În îngrijire',
    status: 'Recuperare',
    daysInCare: 7,
    caretaker: 'Dr. Ioana',
    diet: 'Frunze verzi + fructe',
    nextCheck: 'Azi, 17:00 — control temperatură',
    diagnosis: 'Hipotermie după furtună (rezolvată parțial)',
    treatment: 'Încălzire controlată + UV zilnic',
    vitals: 'Temperatură 32,1 °C (țintă 34 °C) · apetit slab',
    medicalNote: 'Temperatura corpului încă sub normal — rămâne în seră.',
    doctorNote: 'Semnat: Dr. Ioana — eliberare amânată minimum 3 zile.',
  },
  {
    id: 'sori',
    name: 'Sori',
    emoji: '🦭',
    kind: 'Focă',
    room: 'Platformă marină',
    listStatus: 'hold',
    listLabel: 'Evaluare',
    status: 'Nutriție',
    daysInCare: 2,
    caretaker: 'Dr. Elena',
    diet: 'Lapte special + pește mărunțit',
    nextCheck: 'Mâine, 07:30 — cântărire',
    diagnosis: 'Pui separat de mamă; subponderal ușor',
    treatment: 'Hrănire la 4 ore + monitorizare comportament',
    vitals: 'Greutate 8,2 kg (țintă 9 kg) · activ · vocalizează normal',
    medicalNote: 'Prea tânăr pentru eliberare — necesită încă îngrijire intensivă.',
    doctorNote: 'Semnat: Dr. Elena — candidat de eliberare peste minimum 2 săptămâni.',
  },
]

const STATUS_PILL: Record<ListStatus, { className: string; icon: string }> = {
  ok: { className: 'status-ok', icon: '🟢' },
  warn: { className: 'status-warn', icon: '🟡' },
  hold: { className: 'status-warn', icon: '🔵' },
}

export function Scene09() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = ANIMALS.find((a) => a.id === selectedId)
  const kikoSheetOpen = selectedId === 'kiko'

  return (
    <SceneShell sceneId="scene-09">
      <SceneIllustration
        src="/scene09-verification.png"
        alt="Dr. Ioana verifică fișele medicale ale animalelor înainte de eliberare"
        caption="Centru salvare · verificare candidați eliberare"
      />

      <div className="scene-lead">
        <h3 className="scene-lead-title">Obiectiv</h3>
        <p>Deschide detaliile și citește fișele medicale înainte de eliberare.</p>
      </div>

      <div className="scene-layout">
        <div className="panel-box">
          <div className="panel-head">
            <h3>Candidați eliberare</h3>
            <span className="chip soft">{ANIMALS.length}</span>
          </div>
          <div className="animal-list" style={{ marginTop: '0.75rem' }}>
            {ANIMALS.map((a) => {
              const pill = STATUS_PILL[a.listStatus]
              return (
                <button
                  key={a.id}
                  type="button"
                  className={`animal-row${selectedId === a.id ? ' active' : ''}`}
                  onClick={() => setSelectedId(a.id)}
                >
                  <AnimalGlyph emoji={a.emoji} icon={a.icon} />
                  <div style={{ flex: 1 }}>
                    <strong>{a.name}</strong>
                    <div className="muted">
                      {a.kind} · {a.daysInCare} zile
                    </div>
                  </div>
                  <span
                    className={`status-pill ${pill.className}`}
                    data-bug-zone={a.id === 'kiko' && kikoSheetOpen ? 'bug-09' : undefined}
                  >
                    {pill.icon} {a.listLabel}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {selected ? (
          <div className="animal-card">
            <h3>Fișă medicală — {selected.name}</h3>
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
                <span className="label">Status clinic</span>
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
              <div
                className="mini-stat"
                data-bug-zone={kikoSheetOpen ? 'bug-09' : undefined}
              >
                <span className="label">Status listă</span>
                <span className="value">{selected.listLabel}</span>
              </div>
              <div className="mini-stat">
                <span className="label">Următorul control</span>
                <span className="value">{selected.nextCheck}</span>
              </div>
            </div>

            <div className="note-box" style={{ marginTop: '0.75rem' }}>
              <strong>Diagnostic:</strong> {selected.diagnosis}
            </div>
            <div className="note-box">
              <strong>Tratament:</strong> {selected.treatment}
            </div>
            <div className="note-box">
              <strong>Semne vitale:</strong> {selected.vitals}
            </div>
            <div
              className="note-box"
              data-bug-zone={kikoSheetOpen ? 'bug-09' : undefined}
            >
              <strong>Notă medicală:</strong> „{selected.medicalNote}”
            </div>
            <div className="note-box">{selected.doctorNote}</div>
          </div>
        ) : (
          <div className="panel-box">
            <h3>Panou detaliu</h3>
            <p className="muted" style={{ marginTop: '0.5rem' }}>
              Alege un candidat din listă ca să vezi fișa medicală completă.
            </p>
          </div>
        )}
      </div>
    </SceneShell>
  )
}
