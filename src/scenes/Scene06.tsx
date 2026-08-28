import { useState } from 'react'
import { SceneIllustration } from '../components/SceneIllustration'
import { SceneShell } from '../components/SceneShell'
import { publicAsset } from '../lib/publicAsset'

type CareKey = 'food' | 'water' | 'shelter'

type CareState = Record<CareKey, boolean>

type Portrait = {
  src: string
  alt: string
  caption: string
}

const CARE_SECTIONS: {
  key: CareKey
  label: string
  emoji: string
  idleLabel: string
  doneLabel: string
  idle: Portrait
  done: Portrait
}[] = [
  {
    key: 'food',
    label: 'Hrană',
    emoji: '🍎',
    idleLabel: 'Hrănește',
    doneLabel: 'Hrănit',
    idle: {
      src: '/scene06-ruxi-needy.png',
      alt: 'Ruxi e foame, limba scoasă',
      caption: 'Ruxi e flămândă — stomacul îi chiorăie.',
    },
    done: {
      src: '/scene06-ruxi-fed.png',
      alt: 'Ruxi mulțumită după ce a mâncat',
      caption: 'Ruxi se simte mai bine după hrană.',
    },
  },
  {
    key: 'water',
    label: 'Apă',
    emoji: '💧',
    idleLabel: 'Oferă apă',
    doneLabel: 'Băut apă',
    idle: {
      src: '/scene06-ruxi-water-need.png',
      alt: 'Ruxi e însetată, privește o picătură de apă',
      caption: 'Ruxi e însetată — limba îi e uscată.',
    },
    done: {
      src: '/scene06-ruxi-thirsty.png',
      alt: 'Ruxi încă arată sete și disconfort',
      caption: 'Ruxi e însetată — limba îi e uscată.',
    },
  },
  {
    key: 'shelter',
    label: 'Adăpost',
    emoji: '🏠',
    idleLabel: 'Adăpostește',
    doneLabel: 'Adăpostit',
    idle: {
      src: '/scene06-ruxi-cold.png',
      alt: 'Ruxi tremură de frig',
      caption: 'Ruxi tremură — nu are un loc cald și sigur.',
    },
    done: {
      src: '/scene06-ruxi-cozy.png',
      alt: 'Ruxi confortabilă în adăpost',
      caption: 'Ruxi e la căldură și în siguranță în vizuină.',
    },
  },
]

export function Scene06() {
  const [care, setCare] = useState<CareState>({
    food: false,
    water: false,
    shelter: false,
  })

  function toggle(key: CareKey) {
    setCare((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <SceneShell sceneId="scene-06">
      <SceneIllustration
        src="/scene06-fox.png"
        alt="Pui de vulpe la intrarea în vizuină"
        caption="Vizuina vest · puiul Ruxi · ~8 săptămâni"
      />

      <div className="scene-lead">
        <h3 className="scene-lead-title">Obiectiv</h3>
        <p>Îngrijește puiul Ruxi — dă-i hrană, apă și adăpost.</p>
      </div>

      <div className="ruxi-care-grid">
        {CARE_SECTIONS.map((section) => {
          const done = care[section.key]
          const portrait = done ? section.done : section.idle
          const isWaterBug = section.key === 'water' && done

          return (
            <div
              key={section.key}
              className="animal-card ruxi-care-card"
              data-bug-zone={isWaterBug ? 'bug-06' : undefined}
            >
              <h3>
                {section.emoji} {section.label}
              </h3>
              <div className="ruxi-portrait">
                <img src={publicAsset(portrait.src)} alt={portrait.alt} />
              </div>
              <p className="ruxi-caption">{portrait.caption}</p>
              <button
                type="button"
                className={`btn ${done ? 'btn-success' : 'btn-secondary'}`}
                onClick={() => toggle(section.key)}
                aria-pressed={done}
              >
                {done ? (
                  <>
                    <span aria-hidden>✓</span> {section.doneLabel}
                  </>
                ) : (
                  section.idleLabel
                )}
              </button>
            </div>
          )
        })}
      </div>
    </SceneShell>
  )
}
