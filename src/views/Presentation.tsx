import { useEffect, useState, type ReactNode } from 'react'
import { APP_NAME } from '../constants'
import { useGame } from '../context/GameContext'

type MismatchCard = {
  label: string
  left: { icon: string; caption: string }
  right: { icon: string; caption: string }
  tag: string
}

type BridgeStep = {
  game: string
  gameIcon: string
  qa: string
}

type LogicCard = {
  icon: string
  title: string
  expected: string
  actual: string
}

type TrustCard = {
  fake: string
  real: string
  icon: string
}

type PowerCard = {
  icon: string
  title: string
  blurb: string
}

type DayStep = {
  time: string
  icon: string
  label: string
}

type ChaosCard = {
  icon: string
  title: string
  vibe: string
}

type RealLifeCard = {
  icon: string
  where: string
  bug: string
  qaAsk: string
}

type Slide = {
  id: string
  eyebrow: string
  title: string
  titleWide?: boolean
  notes: string[]
  visual: ReactNode
}

function HookVisual() {
  return (
    <div className="pres-split" aria-hidden>
      <div className="pres-split-card is-story">
        <div className="pres-split-icons">
          <span>🐢</span>
          <span>🦜</span>
          <span>🦊</span>
        </div>
        <strong>Ce ați crezut</strong>
        <p>Salvatori în {APP_NAME}</p>
      </div>
      <div className="pres-split-vs">
        <span>VS</span>
      </div>
      <div className="pres-split-card is-mystery">
        <div className="pres-mystery-badge">?</div>
        <strong>Ce ați făcut de fapt</strong>
        <p>O meserie reală din IT…</p>
      </div>
    </div>
  )
}

function RevealVisual() {
  return (
    <div className="pres-reveal" aria-hidden>
      <div className="pres-magnifier">
        <div className="pres-magnifier-glass">
          <span className="pres-magnifier-bug">🐞</span>
        </div>
        <div className="pres-magnifier-handle" />
      </div>
      <div className="pres-reveal-badge">
        <span className="pres-reveal-code">QA</span>
        <div>
          <strong>Quality Assurance</strong>
          <p>Vânători de bug-uri profesioniști</p>
        </div>
      </div>
      <div className="pres-stamp">CERTIFICAT DETECTIV</div>
    </div>
  )
}

function BugWordVisual() {
  return (
    <div className="pres-bug-story" aria-hidden>
      <div className="pres-bug-panel">
        <div className="pres-computer">
          <div className="pres-computer-screen">
            <span className="pres-computer-bug">🐛</span>
            <span className="pres-computer-glitch">ERROR</span>
          </div>
          <div className="pres-computer-base" />
        </div>
        <p className="pres-bug-caption">Un gândac real a stricat un computer vechi</p>
      </div>
      <div className="pres-bug-arrow">→</div>
      <div className="pres-bug-panel is-today">
        <div className="pres-bug-today-icon">💻💥</div>
        <strong>Azi = „bug”</strong>
        <p>Orice greșeală în program — de găsit și reparat</p>
      </div>
    </div>
  )
}

function BridgeVisual({ steps }: { steps: BridgeStep[] }) {
  return (
    <div className="pres-bridge" aria-hidden>
      {steps.map((step, i) => (
        <div key={step.qa} className="pres-bridge-step">
          <div className="pres-bridge-game">
            <span className="pres-bridge-icon">{step.gameIcon}</span>
            <span>{step.game}</span>
          </div>
          <div className="pres-bridge-link">
            <span className="pres-bridge-num">{i + 1}</span>
            <span className="pres-bridge-line" />
          </div>
          <div className="pres-bridge-qa">{step.qa}</div>
        </div>
      ))}
    </div>
  )
}

function MismatchVisual({ cards }: { cards: MismatchCard[] }) {
  return (
    <div className="pres-mismatch-grid" aria-hidden>
      {cards.map((card) => (
        <div key={card.tag} className="pres-mismatch-card">
          <div className="pres-mismatch-tag">{card.tag}</div>
          <div className="pres-mismatch-row">
            <div className="pres-mismatch-side">
              <span className="pres-mismatch-icon">{card.left.icon}</span>
              <span>{card.left.caption}</span>
            </div>
            <div className="pres-mismatch-x">≠</div>
            <div className="pres-mismatch-side is-wrong">
              <span className="pres-mismatch-icon">{card.right.icon}</span>
              <span>{card.right.caption}</span>
            </div>
          </div>
          <p className="pres-mismatch-label">{card.label}</p>
        </div>
      ))}
    </div>
  )
}

function LogicVisual({ cards }: { cards: LogicCard[] }) {
  return (
    <div className="pres-logic-grid" aria-hidden>
      {cards.map((card) => (
        <div key={card.title} className="pres-logic-card">
          <div className="pres-logic-top">
            <span className="pres-logic-icon">{card.icon}</span>
            <strong>{card.title}</strong>
          </div>
          <div className="pres-logic-compare">
            <div className="pres-logic-box is-ok">
              <span className="pres-logic-label">Ar trebui</span>
              <span>{card.expected}</span>
            </div>
            <div className="pres-logic-box is-bad">
              <span className="pres-logic-label">În joc</span>
              <span>{card.actual}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function TrustVisual({ cards }: { cards: TrustCard[] }) {
  return (
    <div className="pres-trust-grid" aria-hidden>
      {cards.map((card) => (
        <div key={card.fake} className="pres-trust-card">
          <div className="pres-trust-fake">
            <span className="pres-trust-check">✓</span>
            <span>{card.fake}</span>
          </div>
          <div className="pres-trust-real">
            <span className="pres-trust-icon">{card.icon}</span>
            <span>{card.real}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function DayVisual({ steps }: { steps: DayStep[] }) {
  return (
    <div className="pres-day" aria-hidden>
      <div className="pres-day-track" />
      {steps.map((step) => (
        <div key={step.label} className="pres-day-step">
          <span className="pres-day-time">{step.time}</span>
          <span className="pres-day-dot">{step.icon}</span>
          <span className="pres-day-label">{step.label}</span>
        </div>
      ))}
    </div>
  )
}

function ChaosVisual({ cards }: { cards: ChaosCard[] }) {
  return (
    <div className="pres-chaos" aria-hidden>
      <div className="pres-phone">
        <div className="pres-phone-notch" />
        <div className="pres-phone-screen">
          <span className="pres-phone-crash">💥</span>
          <strong>App crashed</strong>
          <span className="pres-phone-sub">retry?</span>
        </div>
      </div>
      <div className="pres-chaos-cards">
        {cards.map((card) => (
          <div key={card.title} className="pres-chaos-card">
            <span>{card.icon}</span>
            <strong>{card.title}</strong>
            <p>{card.vibe}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function PowersVisual({ cards }: { cards: PowerCard[] }) {
  return (
    <div className="pres-powers" aria-hidden>
      {cards.map((card) => (
        <div key={card.title} className="pres-power-card">
          <div className="pres-power-icon">{card.icon}</div>
          <strong>{card.title}</strong>
          <p>{card.blurb}</p>
          <div className="pres-power-bar">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      ))}
    </div>
  )
}

function PathVisual() {
  return (
    <div className="pres-path" aria-hidden>
      <div className="pres-path-you">
        <span>🕵️</span>
        <strong>Ție ți-a plăcut?</strong>
      </div>
      <div className="pres-path-fork">
        <div className="pres-path-branch is-qa">
          <span className="pres-path-big">🐞</span>
          <strong>QA</strong>
          <p>Pui aplicația la încercare</p>
        </div>
        <div className="pres-path-branch is-code">
          <span className="pres-path-big">👩‍💻</span>
          <strong>sau altceva în IT</strong>
          <p>Curiozitatea rămâne arma ta</p>
        </div>
      </div>
    </div>
  )
}

function RealLifeVisual({ cards }: { cards: RealLifeCard[] }) {
  return (
    <div className="pres-real" aria-hidden>
      <p className="pres-real-lead">
        Dacă ți s-a întâmplat — un QA ar fi trebuit să prindă asta înainte
      </p>
      <div className="pres-real-grid">
        {cards.map((card) => (
          <div key={card.where + card.bug} className="pres-real-card">
            <div className="pres-real-top">
              <span className="pres-real-icon">{card.icon}</span>
              <strong>{card.where}</strong>
            </div>
            <p className="pres-real-bug">{card.bug}</p>
            <div className="pres-real-ask">
              <span>QA întreabă</span>
              <em>{card.qaAsk}</em>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FinaleVisual() {
  return (
    <div className="pres-finale" aria-hidden>
      <div className="pres-finale-stars">
        <span>⭐</span>
        <span className="is-big">🐞</span>
        <span>⭐</span>
      </div>
      <div className="pres-finale-banner">Junior QA — {APP_NAME}</div>
      <div className="pres-finale-q">Întrebări?</div>
    </div>
  )
}

const BRIDGE_STEPS: BridgeStep[] = [
  { gameIcon: '👀', game: 'Ai observat', qa: 'Bug detection' },
  { gameIcon: '🎯', game: 'Ai marcat zona', qa: 'Localizare' },
  { gameIcon: '📸', game: 'Screenshot', qa: 'Evidence' },
  { gameIcon: '✍️', game: 'Ai raportat', qa: 'Bug report' },
  { gameIcon: '⚖️', game: 'Așteptat vs real', qa: 'Expected / Actual' },
]

const MISMATCH_CARDS: MismatchCard[] = [
  {
    tag: 'Scena 1',
    label: 'Text vs iconiță',
    left: { icon: '🚤', caption: '„Ai ajuns cu barca”' },
    right: { icon: '🚗', caption: 'Pe ecran: mașină' },
  },
  {
    tag: 'Scena 3',
    label: 'Nume greșit',
    left: { icon: '🐢', caption: 'Tessa' },
    right: { icon: '📋', caption: 'Fișa zice Tina' },
  },
  {
    tag: 'Scena 10',
    label: 'Specie greșită',
    left: { icon: '🦜', caption: 'Kiko = papagal' },
    right: { icon: '🙈', caption: 'Etichetă: Maimuță' },
  },
]

const LOGIC_CARDS: LogicCard[] = [
  {
    icon: '➡️',
    title: 'Pădurea',
    expected: 'Dreapta → Centru',
    actual: 'Dreapta → Poiană ↑',
  },
  {
    icon: '💧',
    title: 'Rucsacul',
    expected: '3 sticle = ×3',
    actual: 'Contorul rămâne ×2',
  },
  {
    icon: '🏥',
    title: 'Filtrul „Toate”',
    expected: '5 animale',
    actual: '4 pe listă — Pico 👻',
  },
]

const TRUST_CARDS: TrustCard[] = [
  {
    icon: '🦊',
    fake: '„Gata, a băut apă”',
    real: 'Ruxi e tot însetată',
  },
  {
    icon: '🤖',
    fake: 'Bot: Habitat apt ✓',
    real: 'Dosarul are avertismente',
  },
  {
    icon: '📸',
    fake: '„Eliberare 17:20”',
    real: 'E poza de la prânz',
  },
]

const DAY_STEPS: DayStep[] = [
  { time: '09:00', icon: '🧪', label: 'Încerci app-ul' },
  { time: '11:00', icon: '🐞', label: 'Găsești bug-uri' },
  { time: '13:00', icon: '📝', label: 'Scrii rapoarte' },
  { time: '15:00', icon: '🤝', label: 'Cu programatorii' },
  { time: '17:00', icon: '🔁', label: 'Verifici din nou' },
]

const CHAOS_CARDS: ChaosCard[] = [
  { icon: '🎮', title: 'Jocul se blochează', vibe: 'exact în finală / rank' },
  { icon: '📱', title: 'Story-ul nu urcă', vibe: 'sau like-ul „dispare”' },
  { icon: '📚', title: 'Catalog online greșit', vibe: 'nota / absența e aiurea' },
  { icon: '🎵', title: 'Melodia sare', vibe: 'sau video-ul se blochează' },
]

const REAL_LIFE_CARDS: RealLifeCard[] = [
  {
    icon: '🎮',
    where: 'Jocuri',
    bug: 'Ai câștigat, dar scorul nu se salvează / skin-ul nu apare',
    qaAsk: '„Ce se întâmplă după ce apeși Continua?”',
  },
  {
    icon: '💬',
    where: 'Chat & social',
    bug: 'Mesajul apare de 2 ori, sau „trimis” — dar prietenul nu-l vede',
    qaAsk: '„Ce vede celălalt utilizator?”',
  },
  {
    icon: '📚',
    where: 'Școală / teme',
    bug: 'Ai predat tema online — profesoara zice „nu am primit-o”',
    qaAsk: '„Ce vede profesoara pe ecranul ei?”',
  },
  {
    icon: '🛒',
    where: 'Magazin în app',
    bug: 'Ai plătit / ai folosit monede — itemul tot lipsește',
    qaAsk: '„Banii au plecat, produsul a venit?”',
  },
  {
    icon: '🔔',
    where: 'Notificări',
    bug: 'Te anunță de 10 ori… sau deloc când chiar contează',
    qaAsk: '„Când e prea mult / prea puțin?”',
  },
  {
    icon: '🚌',
    where: 'Hărți & orare',
    bug: 'Autobuzul „vine în 2 min” — de 15 minute la rând',
    qaAsk: '„Informația e actualizată?”',
  },
]

const POWER_CARDS: PowerCard[] = [
  { icon: '🔎', title: 'Ochi de vultur', blurb: 'Vezi ce nu se potrivește' },
  { icon: '🧩', title: 'Detective mode', blurb: '„Hmm, ciudat…”' },
  { icon: '🗣️', title: 'Raport clar', blurb: 'Alții înțeleg din prima' },
  { icon: '💪', title: 'Retry power', blurb: 'Greșeala nu te oprește' },
]

const SLIDES: Slide[] = [
  {
    id: 'hook',
    eyebrow: 'După misiune',
    title: 'Ați salvat animale… sau?',
    notes: [
      'Întreabă grăbita: „Ce credeți că ați făcut azi, pe scurt?”',
      'Lasă-i să zică „am căutat greșeli / probleme pe ecrane”.',
      'Spune că aveți o surpriză: meseria pe care ați practicat-o are un nume.',
    ],
    visual: <HookVisual />,
  },
  {
    id: 'reveal',
    eyebrow: 'Revelație',
    title: 'Ați făcut Software Testing',
    titleWide: true,
    notes: [
      'Explică pe scurt: înainte ca o aplicație să ajungă pe telefonul lor, cineva o „vânează” de greșeli.',
      'QA = Quality Assurance = „ne asigurăm că e de calitate”.',
      `În joc ați fost exact echipa de QA din ${APP_NAME}.`,
    ],
    visual: <RevealVisual />,
  },
  {
    id: 'bug',
    eyebrow: 'Vocabular',
    title: 'De unde vine „bug”?',
    titleWide: true,
    notes: [
      'Poveste scurtă: acum mult timp, un gândac real a stricat un computer — de-asta zicem „bug”.',
      'În joc le-ați zis „probleme”. În job se numesc bug-uri.',
      'Întreabă: „Cui i s-a blocat un joc / un story / o temă online?” — treci apoi la slide-ul cu exemple.',
    ],
    visual: <BugWordVisual />,
  },
  {
    id: 'bridge',
    eyebrow: 'Joc → job',
    title: 'Aceiași pași, alt vocabular',
    titleWide: true,
    notes: [
      'Arată pe ecran (sau pe Review) un raport al lor: selecție + text.',
      'Leagă fiecare pas: observat = bug detection; marcat = localizare; screenshot = evidence; textul = bug report.',
      '„Ce ar fi trebuit” vs „ce s-a întâmplat” = expected vs actual — limba pe care o folosesc testerii în fiecare zi.',
    ],
    visual: <BridgeVisual steps={BRIDGE_STEPS} />,
  },
  {
    id: 'bugs-ui',
    eyebrow: 'Bug-uri din misiune',
    title: 'Când imaginea minte',
    titleWide: true,
    notes: [
      'Dacă ai al doilea ecran: deschide Mod Review → scenele 1, 3, 10.',
      'Spune: uneori bug-ul e o nepotrivire între ce scrie și ce vezi.',
      'În QA: verificăm UI-ul și datele — nu doar „merge butonul?”, ci „are sens ce scrie?”.',
    ],
    visual: <MismatchVisual cards={MISMATCH_CARDS} />,
  },
  {
    id: 'bugs-logic',
    eyebrow: 'Bug-uri din misiune',
    title: 'Când logica o ia razna',
    titleWide: true,
    notes: [
      'Review: scenele 5, 4, 8 — sau povestește din memorie dacă nu vrei să schimbi ecranul.',
      'Astea sunt bug-uri de logică / stare: programul „crede” ceva greșit.',
      'QA apasă, numără, schimbă filtrele — exact ce ați făcut voi.',
    ],
    visual: <LogicVisual cards={LOGIC_CARDS} />,
  },
  {
    id: 'bugs-trust',
    eyebrow: 'Bug-uri din misiune',
    title: 'Nu crede bifa verde!',
    titleWide: true,
    notes: [
      'Scenele 6, 11, 12 — perfecte pentru „nu crede orbeste ecranul”.',
      'Mesaj: un QA bun e curajos să zică „asta nu e corect”, chiar dacă aplicația arată un bife verde.',
      'În viața reală: alerte false, mesaje de succes greșite, poze greșit etichetate.',
    ],
    visual: <TrustVisual cards={TRUST_CARDS} />,
  },
  {
    id: 'real-life',
    eyebrow: 'Viața ta = jobul de QA',
    title: 'Le-ai trăit deja pe telefon',
    titleWide: true,
    notes: [
      'Nu numi branduri ca să „dai vina” — vorbește generic: joc, chat, catalog, magazin în app.',
      'Lasă 20–30 secunde: „Ridicați mâna dacă vi s-a întâmplat măcar unul.”',
      'Mesaj: QA e persoana care testează exact astea înainte să ajungă la milioane de utilizatori.',
      'Leagă de joc: „Succes pe ecran ≠ adevăr” — ca la Ruxi / bot / poza de eliberare.',
    ],
    visual: <RealLifeVisual cards={REAL_LIFE_CARDS} />,
  },
  {
    id: 'day-job',
    eyebrow: 'Jobul',
    title: 'O zi de QA arată cam așa',
    titleWide: true,
    notes: [
      'Nu e doar „apasă random”: e ca o misiune cu obiective — ca ecranele voastre.',
      'După ce developerii repară, QA verifică din nou (retest) — ca steaua plină din prima vs după greșeli.',
      'Nu trebuie să fii „cel mai bun la mate” — trebuie să fii curios și clar când explici.',
    ],
    visual: <DayVisual steps={DAY_STEPS} />,
  },
  {
    id: 'why',
    eyebrow: 'De ce contează',
    title: 'Fără QA… haos pe telefon',
    titleWide: true,
    notes: [
      'Reia 1–2 exemple de pe slide-ul anterior (joc, catalog, plată).',
      'Un bug mic pe ecran poate ascunde o problemă mare în spate.',
      `În ${APP_NAME} ați protejat „utilizatorii” de pe insulă — în job protejezi utilizatori reali.`,
    ],
    visual: <ChaosVisual cards={CHAOS_CARDS} />,
  },
  {
    id: 'skills',
    eyebrow: 'Superputerile voastre',
    title: 'Power-up-uri deblocate azi',
    titleWide: true,
    notes: [
      'Amintește-le: greșelile la selecție nu le-au luat stele — în QA e normal să explorezi.',
      'Raportul bun = colegul care repară înțelege din prima.',
      'Întreabă: „Care bug v-a plăcut cel mai mult să-l găsiți?”',
    ],
    visual: <PowersVisual cards={POWER_CARDS} />,
  },
  {
    id: 'you',
    eyebrow: 'Poate e pentru tine',
    title: 'Ți-a plăcut să cauți greșeli?',
    titleWide: true,
    notes: [
      'Ton ușor, fără presiune: e o meserie reală, cu salariu, echipe, proiecte.',
      'Poți menționa pe scurt că există cursuri / licee IT / facultăți — fără listă lungă.',
      `Închide cu: „Azi ați fost deja junior QA în ${APP_NAME}.”`,
    ],
    visual: <PathVisual />,
  },
  {
    id: 'thanks',
    eyebrow: 'Final',
    title: 'Misiune îndeplinită!',
    titleWide: true,
    notes: [
      'Lasă 2–3 minute pentru întrebări.',
      'Dacă se blochează: „Care a fost cel mai sneaky bug?” / „Ce ați verifica voi într-un joc sau la catalogul online?”',
      'Mulțumește-le și trimite-i înapoi la ecranul de start când termini.',
    ],
    visual: <FinaleVisual />,
  },
]

export function Presentation() {
  const { setView } = useGame()
  const [index, setIndex] = useState(0)
  const [notesOpen, setNotesOpen] = useState(true)

  const slide = SLIDES[index]
  const isFirst = index === 0
  const isLast = index === SLIDES.length - 1

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault()
        setIndex((i) => Math.min(i + 1, SLIDES.length - 1))
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        setIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'n' || e.key === 'N') {
        setNotesOpen((v) => !v)
      } else if (e.key === 'Home') {
        setIndex(0)
      } else if (e.key === 'End') {
        setIndex(SLIDES.length - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className={`presentation${notesOpen ? '' : ' notes-hidden'}`}>
      <header className="presentation-chrome">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setView('instructor')}
        >
          ← Dashboard
        </button>
        <div className="presentation-chrome-meta">
          <span className="presentation-progress">
            {index + 1} / {SLIDES.length}
          </span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setNotesOpen((v) => !v)}
            aria-pressed={notesOpen}
            title="Scurtătură: N"
          >
            {notesOpen ? 'Ascunde notele' : 'Arată notele'}
          </button>
        </div>
      </header>

      <div className="presentation-stage" aria-live="polite">
        <article
          className={`presentation-slide is-${slide.id}`}
          key={slide.id}
        >
          <div className="presentation-eyebrow">{slide.eyebrow}</div>
          <h1
            className={`presentation-title${slide.titleWide ? ' is-wide' : ''}`}
          >
            {slide.title}
          </h1>
          <div className="presentation-visual">{slide.visual}</div>
        </article>
      </div>

      <nav className="presentation-nav" aria-label="Navigare slide-uri">
        <button
          type="button"
          className="btn btn-ghost"
          disabled={isFirst}
          onClick={() => setIndex((i) => Math.max(i - 1, 0))}
        >
          ← Înapoi
        </button>
        <div className="presentation-dots" role="tablist" aria-label="Slide-uri">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              className={`presentation-dot${i === index ? ' is-current' : ''}`}
              onClick={() => setIndex(i)}
              title={`${i + 1}. ${s.title}`}
            />
          ))}
        </div>
        <button
          type="button"
          className="btn btn-success"
          disabled={isLast}
          onClick={() => setIndex((i) => Math.min(i + 1, SLIDES.length - 1))}
        >
          Înainte →
        </button>
      </nav>

      {notesOpen ? (
        <aside className="presentation-notes" aria-label="Note prezentator">
          <div className="presentation-notes-label">
            Note pentru tine (nu pe proiector)
          </div>
          <ol className="presentation-notes-list">
            {slide.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ol>
          <p className="presentation-notes-hint muted">
            ← → sau Spațiu = slide · N = note · Ideal: note pe laptop, slide pe ecranul clasei
          </p>
        </aside>
      ) : null}
    </div>
  )
}
