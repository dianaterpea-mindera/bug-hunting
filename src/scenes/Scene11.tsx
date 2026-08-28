import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { SceneIllustration } from '../components/SceneIllustration'
import { SceneShell } from '../components/SceneShell'
import { useGame } from '../context/GameContext'
import { publicAsset } from '../lib/publicAsset'

type Stamp = 'ok' | 'warn'

type Photo = {
  id: string
  title: string
  caption: string
  /** Very short what-you-see blurb for the modal */
  summary: string
  src: string
  alt: string
  rotate: number
}

type DossierEntry = {
  photoId: string
  stamp: Stamp
}

const PHOTOS: Photo[] = [
  {
    id: 'gazebo',
    title: 'Foișorul',
    caption: 'Inspecție · 15:40',
    summary: 'Foișor de lemn cu masă și bancă.',
    src: '/scene11-gazebo.png?v=5',
    alt: 'Foișor din lemn văzut de aproape',
    rotate: -6,
  },
  {
    id: 'water',
    title: 'Apă potabilă',
    caption: 'Inspecție · 15:48',
    summary: 'Baltă limpede cu păsări pe mal.',
    src: '/scene11-water.png?v=2',
    alt: 'Baltă cu apă limpede și păsări',
    rotate: 4,
  },
  {
    id: 'trough',
    title: 'Jgheabul de piatră',
    caption: 'Inspecție · 15:55',
    summary: 'Jgheab de piatră din care curge apa.',
    src: '/scene11-trough.png?v=5',
    alt: 'Jgheab spart din care curge apa',
    rotate: -3,
  },
  {
    id: 'shelter',
    title: 'Adăpost animale',
    caption: 'Inspecție · 16:02',
    summary: 'Adăpost din lemn pentru animale.',
    src: '/scene11-shelter-damaged.png?v=4',
    alt: 'Adăpost din lemn cu acoperiș spart',
    rotate: 7,
  },
  {
    id: 'food',
    title: 'Stație de hrană',
    caption: 'Inspecție · 16:08',
    summary: 'Hrănitoare cu fructe și semințe.',
    src: '/scene11-food.png?v=5',
    alt: 'Stație de hrană cu fructe și păsări',
    rotate: -8,
  },
  {
    id: 'fence',
    title: 'Gard perimetral',
    caption: 'Inspecție · 16:12',
    summary: 'Gard de lemn de-a lungul potecii.',
    src: '/scene11-fence.png?v=4',
    alt: 'Gard din lemn văzut de aproape',
    rotate: 5,
  },
  {
    id: 'vegetation',
    title: 'Vegetație de acoperire',
    caption: 'Inspecție · 16:18',
    summary: 'Tufișuri dese cu cuiburi.',
    src: '/scene11-vegetation.png?v=6',
    alt: 'Tufișuri dense cu cuiburi de păsări',
    rotate: -4,
  },
  {
    id: 'bridge',
    title: 'Podul de lemn',
    caption: 'Inspecție · 16:22',
    summary: 'Pod de lemn peste un pârâu.',
    src: '/scene11-bridge.png?v=4',
    alt: 'Pod de lemn peste un pârâu',
    rotate: 3,
  },
  {
    id: 'birds',
    title: 'Platformă păsări',
    caption: 'Inspecție · 16:28',
    summary: 'Platformă plină cu păsări colorate.',
    src: '/scene11-birds.png?v=6',
    alt: 'Platformă cu papagali și alte păsări',
    rotate: -5,
  },
]

const MIN_DOSSIER = 4
const DOSSIER_SLOTS = PHOTOS.length

export function Scene11() {
  const { session } = useGame()
  const [viewingId, setViewingId] = useState<string | null>(null)
  const [stamps, setStamps] = useState<Partial<Record<string, Stamp>>>({})
  const [dossier, setDossier] = useState<DossierEntry[]>([])
  const [reportOpen, setReportOpen] = useState(false)
  const [reportGeneratedAt, setReportGeneratedAt] = useState<Date | null>(null)

  const viewingIndex = viewingId
    ? PHOTOS.findIndex((p) => p.id === viewingId)
    : -1
  const viewing = viewingIndex >= 0 ? PHOTOS[viewingIndex] : undefined
  const draftStamp = viewingId ? stamps[viewingId] ?? null : null
  const dossierIds = useMemo(() => new Set(dossier.map((d) => d.photoId)), [dossier])
  const dossierProblems = useMemo(
    () =>
      dossier
        .filter((d) => d.stamp === 'warn')
        .map((d) => PHOTOS.find((p) => p.id === d.photoId)!)
        .filter(Boolean),
    [dossier],
  )
  const dossierReady = dossier.length >= MIN_DOSSIER
  const dossierNeeded = Math.max(0, MIN_DOSSIER - dossier.length)

  function openPhoto(id: string) {
    setViewingId(id)
  }

  function closeViewer() {
    setViewingId(null)
  }

  function setStamp(stamp: Stamp) {
    if (!viewingId) return
    setStamps((prev) => ({ ...prev, [viewingId]: stamp }))
    setDossier((prev) =>
      prev.map((entry) =>
        entry.photoId === viewingId ? { ...entry, stamp } : entry,
      ),
    )
  }

  function goToIndex(index: number) {
    const next = PHOTOS[(index + PHOTOS.length) % PHOTOS.length]
    openPhoto(next.id)
  }

  function goPrev() {
    if (viewingIndex < 0) return
    goToIndex(viewingIndex - 1)
  }

  function goNext() {
    if (viewingIndex < 0) return
    goToIndex(viewingIndex + 1)
  }

  function addToDossier(photoId?: string) {
    const id = photoId ?? viewingId
    const stamp = id ? stamps[id] : undefined
    if (!id || !stamp) return
    setDossier((prev) => {
      const without = prev.filter((d) => d.photoId !== id)
      return [...without, { photoId: id, stamp }]
    })
    if (reportOpen) setReportOpen(false)
  }

  function removeFromDossier(photoId: string) {
    setDossier((prev) => prev.filter((d) => d.photoId !== photoId))
    if (reportOpen) setReportOpen(false)
  }

  function generateReport() {
    if (dossier.length < MIN_DOSSIER) return
    setReportGeneratedAt(new Date())
    setReportOpen(true)
    setViewingId(null)
  }

  const reportDateLabel = reportGeneratedAt
    ? reportGeneratedAt.toLocaleDateString('ro-RO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '—'
  const reportTimeLabel = reportGeneratedAt
    ? reportGeneratedAt.toLocaleTimeString('ro-RO', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—'

  useEffect(() => {
    if (viewingIndex < 0) return

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setViewingId(null)
        return
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
        const delta = e.key === 'ArrowLeft' ? -1 : 1
        const next = PHOTOS[(viewingIndex + delta + PHOTOS.length) % PHOTOS.length]
        setViewingId(next.id)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [viewingIndex])

  return (
    <SceneShell sceneId="scene-11">
      <SceneIllustration
        src="/scene11-reserve.png"
        alt="Intrarea în rezervație la apus, cu adăpost și păsări"
        caption="Rezervația Coral · album inspecție · 16:05"
      />

      <div className="scene-lead">
        <h3 className="scene-lead-title">Obiectiv</h3>
        <p>
          Înainte de eliberarea animalelor, trebuie un raport oficial: habitatul e
          pregătit sau nu? Inspectează zonele din poze, pune verdictul tău, adună
          dovezile în dosar, apoi cere raportul automat.
        </p>
        <ul className="scene-lead-list">
          <li>Deschide pozele și ștampilează fiecare zonă: OK sau problemă.</li>
          <li>Adaugă cel puțin {MIN_DOSSIER} dovezi în dosar.</li>
          <li>
            Generează raportul — ar trebui să reflecte ce ai găsit tu pe teren.
          </li>
        </ul>
      </div>

      <div className="album-layout">
        <div className="panel-box album-table-panel">
          <div className="panel-head">
            <h3>Album misiune</h3>
            <span className="chip soft">{PHOTOS.length} poze</span>
          </div>
          <p className="muted album-hint">
            Deschide o fotografie → analizează ce vezi → ștampilează verdictul tău de
            inspector → adaug-o în dosar.
          </p>
          <div className="stamp-legend" aria-hidden>
            <span className="stamp-legend-item ok">
              <span className="stamp-mark ok" aria-hidden />
              OK = zonă în regulă
            </span>
            <span className="stamp-legend-item warn">
              <span className="stamp-mark warn" aria-hidden />
              Problemă = ceva nu e în regulă
            </span>
          </div>
          <div className="polaroid-table" aria-label="Fotografii Polaroid pe masă">
            {PHOTOS.map((photo) => {
              const inDossier = dossierIds.has(photo.id)
              const stamp = stamps[photo.id]
              return (
                <article
                  key={photo.id}
                  className={`polaroid${viewingId === photo.id ? ' is-open' : ''}${
                    inDossier ? ' in-dossier' : ''
                  }`}
                  style={{ ['--tilt' as string]: `${photo.rotate}deg` }}
                >
                  <div className="polaroid-media">
                    <button
                      type="button"
                      className="polaroid-open"
                      onClick={() => openPhoto(photo.id)}
                      aria-label={`Deschide ${photo.title}`}
                    >
                      <img src={publicAsset(photo.src)} alt={photo.alt} draggable={false} />
                    </button>
                    {stamp ? (
                      <button
                        type="button"
                        className={`polaroid-dossier-btn${
                          inDossier ? ' is-added' : ''
                        }`}
                        disabled={inDossier}
                        onClick={() => addToDossier(photo.id)}
                        aria-label={
                          inDossier
                            ? `${photo.title} e deja în dosar`
                            : `Adaugă ${photo.title} la dosar`
                        }
                      >
                        {inDossier ? '✓' : '+'}
                      </button>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className="polaroid-label"
                    onClick={() => openPhoto(photo.id)}
                  >
                    <strong>{photo.title}</strong>
                    <span>{photo.caption}</span>
                  </button>
                  {stamp ? (
                    <span
                      className={`polaroid-stamp-badge ${
                        stamp === 'ok' ? 'ok' : 'warn'
                      }`}
                      aria-hidden
                    >
                      {stamp === 'ok' ? 'OK' : '!'}
                    </span>
                  ) : null}
                </article>
              )
            })}
          </div>
        </div>

        <div className="album-side">
          <div className="panel-box">
            <div className="panel-head">
              <h3>Dosar inspecție</h3>
              <div
                className={`dossier-meter${dossierReady ? ' is-ready' : ''}`}
                aria-label={`${dossier.length} din ${DOSSIER_SLOTS} dovezi`}
              >
                <div className="dossier-meter-slots" aria-hidden>
                  {Array.from({ length: DOSSIER_SLOTS }, (_, i) => {
                    const entry = dossier[i]
                    return (
                      <span
                        key={i}
                        className={`dossier-meter-slot${
                          entry
                            ? entry.stamp === 'warn'
                              ? ' filled warn'
                              : ' filled'
                            : ''
                        }`}
                      />
                    )
                  })}
                </div>
                <span className="dossier-meter-label">
                  {dossier.length === 0
                    ? `0 / ${DOSSIER_SLOTS}`
                    : dossierReady
                      ? `${dossier.length} / ${DOSSIER_SLOTS} · gata`
                      : `${dossier.length} / ${DOSSIER_SLOTS} · încă ${dossierNeeded}`}
                </span>
              </div>
            </div>
            {dossier.length === 0 ? (
              <p className="muted" style={{ marginTop: '0.5rem' }}>
                Nu ai adăugat dovezi. Aici intră pozele pe care le-ai analizat: fiecare vine cu
                verdictul tău (OK sau problemă).
              </p>
            ) : (
              <ul className="dossier-list">
                {dossier.map((entry) => {
                  const photo = PHOTOS.find((p) => p.id === entry.photoId)!
                  return (
                    <li key={entry.photoId} className="dossier-item">
                      <img src={publicAsset(photo.src)} alt="" />
                      <div className="dossier-item-meta">
                        <strong>{photo.title}</strong>
                        <span
                          className={`status-pill ${
                            entry.stamp === 'ok' ? 'status-ok' : 'status-warn'
                          }`}
                        >
                          <span
                            className={`stamp-mark ${
                              entry.stamp === 'ok' ? 'ok' : 'warn'
                            }`}
                            aria-hidden
                          />
                          {entry.stamp === 'ok' ? 'OK' : 'Problemă'}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="btn btn-ghost dossier-remove"
                        onClick={() => removeFromDossier(entry.photoId)}
                        aria-label={`Scoate ${photo.title}`}
                      >
                        ✕
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
            <button
              type="button"
              className="btn btn-success album-report-btn"
              disabled={dossier.length < MIN_DOSSIER}
              onClick={generateReport}
            >
              Generează raport
            </button>
          </div>

          {reportOpen ? (
            <article className="habitat-report">
              <header className="habitat-report-head">
                <div>
                  <p className="habitat-report-org">Rezervația Coral · Serviciul Habitat</p>
                  <h3 className="habitat-report-title">
                    Raport de inspecție — eliberare
                  </h3>
                </div>
                <div className="habitat-report-meta">
                  <div>
                    <span>Cod</span>
                    <strong>RH-{String(dossier.length).padStart(2, '0')}-11</strong>
                  </div>
                  <div>
                    <span>Data</span>
                    <strong>{reportDateLabel}</strong>
                  </div>
                  <div>
                    <span>Ora</span>
                    <strong>{reportTimeLabel}</strong>
                  </div>
                </div>
              </header>

              <section className="habitat-report-section">
                <h4>1. Dovezi din teren</h4>
                <p className="habitat-report-lead">
                  Inspecție realizată de {session?.childName ?? 'inspector'} ·{' '}
                  {dossier.length} zone atașate la dosar
                </p>
                <table className="habitat-report-table">
                  <thead>
                    <tr>
                      <th>Zonă</th>
                      <th>Verdict inspector</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dossier.map((entry) => {
                      const photo = PHOTOS.find((p) => p.id === entry.photoId)!
                      return (
                        <tr key={entry.photoId}>
                          <td>{photo.title}</td>
                          <td>
                            <span
                              className={`status-pill ${
                                entry.stamp === 'ok' ? 'status-ok' : 'status-warn'
                              }`}
                            >
                              <span
                                className={`stamp-mark ${
                                  entry.stamp === 'ok' ? 'ok' : 'warn'
                                }`}
                                aria-hidden
                              />
                              {entry.stamp === 'ok' ? 'OK' : 'Problemă'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </section>

              <section
                className={`habitat-report-section habitat-report-verdict${
                  dossierProblems.length > 0 ? ' is-buggy' : ''
                }`}
                data-bug-zone={dossierProblems.length > 0 ? 'bug-11' : undefined}
              >
                <h4>2. Concluzie automată (InspectorBot)</h4>
                <div className="habitat-report-status ok">
                  <span className="stamp-mark ok" aria-hidden />
                  Habitat apt pentru eliberare
                </div>
                {dossierProblems.length > 0 ? (
                  <div className="habitat-report-annex">
                    <img
                      src={publicAsset('/scene11-shelter-ok.png?v=4')}
                      alt="Adăpost aparent intact folosit ca dovadă în raport"
                    />
                    <div>
                      <p className="habitat-report-annex-label">Anexă A — Adăpost</p>
                      <p className="habitat-report-annex-status">
                        Evaluare: OK — nu sunt necesare intervenții
                      </p>
                      <p className="muted" style={{ marginBottom: 0 }}>
                        Analiza automată nu a detectat nicio neconformitate, chiar
                        dacă dosarul include {dossierProblems.length}{' '}
                        {dossierProblems.length === 1
                          ? 'observație a inspectorului'
                          : 'observații ale inspectorului'}
                        . Procedura de eliberare rămâne aprobată.
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="muted" style={{ marginBottom: 0 }}>
                    Conform dovezilor din dosar, toate zonele sunt în regulă.
                    Habitatul poate primi animalele.
                  </p>
                )}
              </section>

              <footer className="habitat-report-sign">
                <div>
                  <p>Generat automat</p>
                  <strong>InspectorBot</strong>
                </div>
                <div className="habitat-report-stamp" aria-hidden>
                  APROBAT
                </div>
              </footer>
            </article>
          ) : (
            <div className="panel-box">
              <h3>Raport de inspecție</h3>
              <p className="muted" style={{ marginTop: '0.5rem' }}>
                După ce ai cel puțin {MIN_DOSSIER} dovezi în dosar, genereză
                raportul oficial de eliberare.
              </p>
            </div>
          )}
        </div>
      </div>

      {viewing
        ? createPortal(
            <div className="polaroid-viewer" role="dialog" aria-modal="true">
              <button
                type="button"
                className="polaroid-viewer-backdrop"
                aria-label="Închide"
                onClick={closeViewer}
              />
              <div className="polaroid-viewer-stage">
                <button
                  type="button"
                  className="viewer-nav viewer-nav-prev"
                  onClick={goPrev}
                  aria-label="Fotografia anterioară"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="viewer-nav viewer-nav-next"
                  onClick={goNext}
                  aria-label="Fotografia următoare"
                >
                  ›
                </button>
                <div className="polaroid-viewer-card">
                <div className="polaroid-viewer-photo">
                  <img src={publicAsset(viewing.src)} alt={viewing.alt} />
                  {draftStamp ? (
                    <span
                      className={`viewer-stamp ${draftStamp === 'ok' ? 'ok' : 'warn'}`}
                    >
                      {draftStamp === 'ok' ? 'OK' : 'PROBLEMĂ'}
                    </span>
                  ) : null}
                  <span className="viewer-counter">
                    {viewingIndex + 1} / {PHOTOS.length}
                  </span>
                </div>
                <div className="polaroid-viewer-body">
                  <h3>{viewing.title}</h3>
                  <p className="muted">{viewing.caption}</p>
                  <div className="viewer-summary">
                    <span className="viewer-summary-label">În poză</span>
                    <p>{viewing.summary}</p>
                  </div>
                  <div className="viewer-question">
                    <span className="viewer-question-label">Întrebare</span>
                    <p>
                      Habitatul din această zonă e pregătit pentru animale?
                    </p>
                  </div>
                  <p className="stamp-prompt">Alege verdictul tău de inspector</p>
                  <div className="stamp-row" role="group" aria-label="Verdict inspecție">
                    <button
                      type="button"
                      className={`verdict-btn ok${
                        draftStamp === 'ok' ? ' is-selected' : ''
                      }`}
                      onClick={() => setStamp('ok')}
                      aria-pressed={draftStamp === 'ok'}
                    >
                      <span className="verdict-btn-icon" aria-hidden>
                        <span className="stamp-mark ok" />
                      </span>
                      <span className="verdict-btn-copy">
                        <span className="verdict-btn-title">OK</span>
                        <span className="verdict-btn-desc">
                          Zona e în regulă
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      className={`verdict-btn warn${
                        draftStamp === 'warn' ? ' is-selected' : ''
                      }`}
                      onClick={() => setStamp('warn')}
                      aria-pressed={draftStamp === 'warn'}
                    >
                      <span className="verdict-btn-icon" aria-hidden>
                        <span className="stamp-mark warn" />
                      </span>
                      <span className="verdict-btn-copy">
                        <span className="verdict-btn-title">Problemă</span>
                        <span className="verdict-btn-desc">
                          Trebuie semnalat
                        </span>
                      </span>
                    </button>
                  </div>
                  <div className="viewer-actions">
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={closeViewer}
                    >
                      Închide
                    </button>
                    <button
                      type="button"
                      className="btn btn-success"
                      disabled={!draftStamp || dossierIds.has(viewing.id)}
                      onClick={() => addToDossier()}
                    >
                      {dossierIds.has(viewing.id)
                        ? 'Deja în dosar'
                        : 'Adaugă la dosar'}
                    </button>
                  </div>
                </div>
              </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </SceneShell>
  )
}
