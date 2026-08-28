import { useState } from 'react'
import { AnimalGlyph } from '../components/AnimalGlyph'
import { SceneIllustration } from '../components/SceneIllustration'
import { SceneShell } from '../components/SceneShell'

type Zone = {
  id: string
  label: string
  place: string
  seenEmoji: string
  seenIcon?: string
  seenName: string
  idEmoji: string
  idIcon?: string
  idName: string
  idKind: string
  idPlace: string
  confidence: number
  caption: string
  note: string
  lensTone: string
  buggy?: boolean
}

/** Zone 3 (index 2) has the intentional ID mismatch. */
const ZONES: Zone[] = [
  {
    id: 'z1',
    label: 'Zona 1',
    place: 'Plaja nord',
    seenEmoji: '🐢',
    seenName: 'Tessa',
    idEmoji: '🐢',
    idName: 'Tessa',
    idKind: 'Țestoasă',
    idPlace: 'Plajă',
    confidence: 97,
    caption: 'Țestoasa se odihnește pe nisipul uscat.',
    note: 'Tessa a fost eliberată pe plaja nord după recuperare. Semnele vitale sunt stabile.',
    lensTone: 'beach',
  },
  {
    id: 'z2',
    label: 'Zona 2',
    place: 'Centru salvare',
    seenEmoji: '🏥',
    seenName: 'Clădirea centrului',
    idEmoji: '🏥',
    idName: 'Centru salvare',
    idKind: 'Clădire',
    idPlace: 'Sector central',
    confidence: 99,
    caption: 'Intrarea în centrul de salvare e liberă.',
    note: 'Centrul funcționează normal. Echipele de îngrijire sunt pe poziții.',
    lensTone: 'center',
  },
  {
    id: 'z3',
    label: 'Zona 3',
    place: 'Aviar',
    seenEmoji: '🦜',
    seenName: 'Kiko',
    idEmoji: '🦜',
    idName: 'Kiko',
    idKind: 'Maimuță',
    idPlace: 'Aviar',
    confidence: 62,
    caption: 'Vedere clară din turn — animalul e în cadru.',
    note: 'Kiko e în voliera tropicală. Aripa stângă e încă în recuperare.',
    lensTone: 'aviary',
    buggy: true,
  },
  {
    id: 'z4',
    label: 'Zona 4',
    place: 'Boxă',
    seenEmoji: '🦊',
    seenName: 'Ruxi',
    idEmoji: '🦊',
    idName: 'Ruxi',
    idKind: 'Vulpe',
    idPlace: 'Boxă',
    confidence: 96,
    caption: 'Vulpea stă la umbra adăpostului.',
    note: 'Ruxi rămâne în boxă pentru hidratare și odihnă. Apetitul e în creștere.',
    lensTone: 'den',
  },
  {
    id: 'z5',
    label: 'Zona 5',
    place: 'Golf sud',
    seenEmoji: '🐬',
    seenName: 'Nori',
    idEmoji: '🐬',
    idName: 'Nori',
    idKind: 'Delfin',
    idPlace: 'Golf',
    confidence: 95,
    caption: 'Delfinul înoată aproape de dig.',
    note: 'Nori înoată liber lângă dig după intervenție. Monitorizare de pe țărm.',
    lensTone: 'bay',
  },
  {
    id: 'z6',
    label: 'Zona 6',
    place: 'Poiana',
    seenEmoji: '🐦',
    seenIcon: '/pico-seagull.svg',
    seenName: 'Pico',
    idEmoji: '🐦',
    idIcon: '/pico-seagull.svg',
    idName: 'Pico',
    idKind: 'Pescăruș',
    idPlace: 'Poiană',
    confidence: 91,
    caption: 'Pescărușul stă pe o creangă uscată.',
    note: 'Pico e în observație în poiană. Fără tratament activ, doar urmărire.',
    lensTone: 'clearing',
  },
  {
    id: 'z7',
    label: 'Zona 7',
    place: 'Debarcader',
    seenEmoji: '🚤',
    seenName: 'Barca de salvare',
    idEmoji: '🚤',
    idName: 'Barca de salvare',
    idKind: 'Ambarcațiune',
    idPlace: 'Debarcader',
    confidence: 98,
    caption: 'Barca e ancorată la ponton.',
    note: 'Barca de salvare e pregătită la ponton pentru o nouă ieșire.',
    lensTone: 'dock',
  },
]

export function Scene10() {
  const [zoneIndex, setZoneIndex] = useState(0)
  const zone = ZONES[zoneIndex]
  const atStart = zoneIndex === 0
  const atEnd = zoneIndex === ZONES.length - 1

  function pan(delta: -1 | 1) {
    setZoneIndex((i) => Math.min(ZONES.length - 1, Math.max(0, i + delta)))
  }

  return (
    <SceneShell sceneId="scene-10">
      <SceneIllustration
        src="/scene10-observation.png"
        alt="Turn de observație cu vedere spre insulă"
        caption="Punct de observație · 12:40"
      />

      <div className="scene-lead">
        <h3 className="scene-lead-title">Obiectiv</h3>
        <p>Mișcă binoclul pe zone și verifică identificarea automată.</p>
      </div>

      <div className="scene-layout">
        <div className="obs-feed">
          <div className="obs-feed-bar">
            <span className="obs-live">● LIVE</span>
            <span className="obs-feed-meta">
              Binoclu turn · Zoom 4× · {zone.place}
            </span>
          </div>

          <div className="obs-pan-row">
            <button
              type="button"
              className="btn btn-secondary obs-pan-btn"
              onClick={() => pan(-1)}
              disabled={atStart}
              aria-label="Mișcă binoclul spre stânga"
            >
              ←
            </button>

            <div
              className={`obs-lenses tone-${zone.lensTone}`}
              aria-label={`Imagine prin binoclu: ${zone.seenName}`}
            >
              <div className="obs-lens">
                <span className="obs-subject" aria-hidden>
                  <AnimalGlyph
                    emoji={zone.seenEmoji}
                    icon={zone.seenIcon}
                    big
                  />
                </span>
              </div>
              <div className="obs-lens">
                <span className="obs-subject" aria-hidden>
                  <AnimalGlyph
                    emoji={zone.seenEmoji}
                    icon={zone.seenIcon}
                    big
                  />
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-secondary obs-pan-btn"
              onClick={() => pan(1)}
              disabled={atEnd}
              aria-label="Mișcă binoclul spre dreapta"
            >
              →
            </button>
          </div>

          <p className="obs-feed-caption">{zone.caption}</p>

          <div className="obs-zone-strip" role="tablist" aria-label="Zone vizibile">
            {ZONES.map((z, i) => (
              <button
                key={z.id}
                type="button"
                role="tab"
                aria-selected={i === zoneIndex}
                className={`obs-zone-dot${i === zoneIndex ? ' active' : ''}`}
                onClick={() => setZoneIndex(i)}
                title={`${z.label} · ${z.place}`}
              >
                <span className="obs-zone-num">{i + 1}</span>
                <span className="obs-zone-place">{z.place}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="panel-box">
          <h3>Identificare automată</h3>
          <p className="muted" style={{ marginTop: '0.35rem' }}>
            Sistemul etichetează ce e în binoclu — {zone.label} din 7.
          </p>

          <div
            className="obs-id-card"
            data-bug-zone={zone.buggy ? 'bug-10' : undefined}
          >
            <span className="obs-id-emoji" aria-hidden>
              <AnimalGlyph emoji={zone.idEmoji} icon={zone.idIcon} />
            </span>
            <div>
              <strong>{zone.idName}</strong>
              <div className="muted">
                {zone.idKind} · {zone.idPlace}
              </div>
              <div className="obs-id-confidence">
                Încredere sistem: {zone.confidence}%
              </div>
            </div>
          </div>

          <div className="note-box">{zone.note}</div>
        </div>
      </div>
    </SceneShell>
  )
}
