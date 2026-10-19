import { FinalNav } from '../components/FinalNav'
import { MissionStars } from '../components/Stars'
import { APP_NAME, SCENES } from '../constants'
import { useGame } from '../context/GameContext'
import {
  maxStarsTotal,
  starFillsForSession,
  starsFromReports,
} from '../lib/scoring'
import { formatDuration } from '../lib/utils'

function formatDateRo(iso?: string): string {
  const d = iso ? new Date(iso) : new Date()
  return d.toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function Certificate() {
  const { session } = useGame()
  if (!session) return null

  const found = session.bugReports.length
  const stars = starsFromReports(session.bugReports)
  const maxTotal = maxStarsTotal()
  const fills = starFillsForSession(session.bugReports)
  const completedOn = formatDateRo(session.completedAt ?? session.startedAt)
  const duration = formatDuration(session.startedAt, session.completedAt)

  return (
    <div className="shell certificate-shell">
      <FinalNav active="certificate" />

      <article
        className="certificate-page"
        aria-label="Certificat de finalizare"
      >
        <div className="certificate-frame" aria-hidden>
          <span className="certificate-corner certificate-corner-tl" />
          <span className="certificate-corner certificate-corner-tr" />
          <span className="certificate-corner certificate-corner-bl" />
          <span className="certificate-corner certificate-corner-br" />
        </div>

        <div className="certificate-monogram" aria-hidden>
          <span className="certificate-monogram-bug">🐞</span>
        </div>

        <p className="certificate-eyebrow">Academie de explorare · {APP_NAME}</p>
        <div className="certificate-rule" aria-hidden />
        <h1 className="certificate-heading">Certificat de finalizare</h1>
        <p className="certificate-lead">Se acordă cu onoare lui</p>

        <p className="certificate-name">{session.childName}</p>

        <p className="certificate-body">
          pentru că a încheiat misiunea de salvare pe{' '}
          <em>{APP_NAME}</em> — a observat, a localizat și a raportat
          problemele din teren, ca un adevărat detectiv de software.
        </p>

        <div className="certificate-stars-band">
          <MissionStars fills={fills} size="md" />
          <span>
            {stars} din {maxTotal} stele
          </span>
        </div>

        <dl className="certificate-meta">
          <div>
            <dt>Probleme găsite</dt>
            <dd>
              {found} / {SCENES.length}
            </dd>
          </div>
          <div>
            <dt>Durata misiunii</dt>
            <dd>{duration}</dd>
          </div>
          <div>
            <dt>Data</dt>
            <dd>{completedOn}</dd>
          </div>
        </dl>

        <div className="certificate-footer">
          <div className="certificate-sign">
            <span className="certificate-sign-line" aria-hidden />
            <span className="certificate-sign-label">Salvator atestat</span>
            <strong>{session.childName}</strong>
          </div>

          <div className="certificate-wax" aria-hidden>
            <div className="certificate-wax-inner">
              <span>QA</span>
            </div>
          </div>

          <div className="certificate-sign certificate-sign-right">
            <span className="certificate-sign-line" aria-hidden />
            <span className="certificate-sign-label">Titlu acordat</span>
            <strong>Salvator QA</strong>
          </div>
        </div>
      </article>
    </div>
  )
}
