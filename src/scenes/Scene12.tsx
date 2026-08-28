import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { SceneIllustration } from '../components/SceneIllustration'
import { SceneShell } from '../components/SceneShell'
import { publicAsset } from '../lib/publicAsset'

type JournalPhoto = {
  id: string
  time: string
  title: string
  caption: string
  summary: string
  src: string
  alt: string
  /** Intentional bug: label says sunset release, image is midday elsewhere */
  buggy?: boolean
}

type DragOrigin = 'tray' | number

type PendingDrag = {
  photoId: string
  from: DragOrigin
  startX: number
  startY: number
  offsetX: number
  offsetY: number
}

type ActiveDrag = PendingDrag & {
  x: number
  y: number
  width: number
  height: number
}

/** Chronological day journal — one entry is mislabeled vs. what the photo shows. */
const PHOTOS: JournalPhoto[] = [
  {
    id: '0815',
    time: '08:15',
    title: 'Dimineață pe dig',
    caption: 'Început de zi · dig nord',
    summary: 'Lumină blândă de dimineață pe digul liniștit.',
    src: '/scene12-journal-0815.png',
    alt: 'Dig pe golf dimineața devreme, barcă de salvare',
  },
  {
    id: '0940',
    time: '09:40',
    title: 'Hrănire la centru',
    caption: 'Îngrijire · centru salvare',
    summary: 'Echipa hrănește păsările și vulpea dimineața.',
    src: '/scene12-journal-0940.png',
    alt: 'Hrănire papagal și vulpe la centrul de salvare',
  },
  {
    id: '1105',
    time: '11:05',
    title: 'Control Tessa',
    caption: 'Verificare · plaja nord',
    summary: 'Țestoasa Tessa e verificată pe plajă, înainte de prânz.',
    src: '/scene12-journal-1105.png',
    alt: 'Țestoasă pe plajă verificată de îngrijitori',
  },
  {
    id: '1250',
    time: '12:50',
    title: 'Pauză la amiază',
    caption: 'Prânz · umbrar',
    summary: 'Echipa ia pauza de masă sub umbrar, soare puternic de amiază.',
    src: '/scene12-journal-1250.png',
    alt: 'Echipa la masa de prânz sub umbrar la amiază',
  },
  {
    id: '1420',
    time: '14:20',
    title: 'Ruxi pe potecă',
    caption: 'Observație · pădure',
    summary: 'Vulpea Ruxi pe poteca din pădure, după-amiază.',
    src: '/scene12-journal-1420.png',
    alt: 'Vulpe pe potecă în pădurea tropicală',
  },
  {
    id: '1545',
    time: '15:45',
    title: 'Pregătire porți',
    caption: 'Înainte de eliberare · habitat',
    summary: 'Porțile și boxele sunt pregătite pentru eliberare.',
    src: '/scene12-journal-1545.png',
    alt: 'Pregătirea porților de lemn pentru eliberare',
  },
  {
    id: '1720',
    time: '17:20',
    title: 'Eliberare',
    caption: 'Moment oficial · eliberare',
    summary: 'Echipa stă la masă sub umbrar, cu soare puternic deasupra.',
    src: '/scene12-journal-1720-bug.png?v=2',
    alt: 'Echipa la prânz sub umbrar, soare puternic de amiază',
    buggy: true,
  },
  {
    id: '1810',
    time: '18:10',
    title: 'Ceremonie pe plajă',
    caption: 'Final de zi · apus',
    summary: 'Ceremonie pe plajă la apus, animalele libere.',
    src: '/scene12-journal-1810.png',
    alt: 'Ceremonie de eliberare pe plajă la apus',
  },
]

/** Fixed tray order (not chronological) so classrooms see the same start state. */
const TRAY_ORDER = ['1420', '0815', '1720', '1105', '1810', '1250', '1545', '0940']

const DRAG_THRESHOLD_PX = 8

function uniqueIds(ids: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const id of ids) {
    if (seen.has(id)) continue
    seen.add(id)
    out.push(id)
  }
  return out
}

function computeMove(
  tray: string[],
  slots: (string | null)[],
  photoId: string,
  from: DragOrigin,
  to: DragOrigin,
): { tray: string[]; slots: (string | null)[] } {
  if (from === to) return { tray, slots }

  let nextTray = tray.filter((id) => id !== photoId)
  const nextSlots = slots.map((id) => (id === photoId ? null : id))

  if (to === 'tray') {
    return {
      tray: uniqueIds([...nextTray, photoId]),
      slots: nextSlots,
    }
  }

  const existing = nextSlots[to]
  nextSlots[to] = photoId

  if (existing && existing !== photoId) {
    if (from === 'tray') {
      nextTray = uniqueIds([...nextTray, existing])
    } else if (typeof from === 'number') {
      nextSlots[from] = existing
    }
  }

  // A photo must never sit in both tray and a slot
  const inSlots = new Set(nextSlots.filter(Boolean) as string[])
  nextTray = uniqueIds(nextTray.filter((id) => !inSlots.has(id)))

  return { tray: nextTray, slots: nextSlots }
}

export function Scene12() {
  const [trayIds, setTrayIds] = useState<string[]>(() => [...TRAY_ORDER])
  const [slots, setSlots] = useState<(string | null)[]>(() =>
    Array(PHOTOS.length).fill(null),
  )
  const [viewingId, setViewingId] = useState<string | null>(null)
  const [validated, setValidated] = useState(false)
  const [drag, setDrag] = useState<ActiveDrag | null>(null)
  const [dropTarget, setDropTarget] = useState<DragOrigin | null>(null)

  const trayRef = useRef(trayIds)
  const slotsRef = useRef(slots)
  trayRef.current = trayIds
  slotsRef.current = slots

  const pendingRef = useRef<PendingDrag | null>(null)
  const dragRef = useRef<ActiveDrag | null>(null)
  const dropTargetRef = useRef<DragOrigin | null>(null)
  const pointerIdRef = useRef<number | null>(null)
  const captureElRef = useRef<HTMLElement | null>(null)
  const listeningRef = useRef(false)
  const ghostRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const sourceSizeRef = useRef({ width: 0, height: 0 })

  const apiRef = useRef({
    placeGhost(_x: number, _y: number, _ox: number, _oy: number) {},
    updateDropTarget(_next: DragOrigin | null) {},
    readDropTarget(_x: number, _y: number): DragOrigin | null {
      return null
    },
    movePhoto(_id: string, _from: DragOrigin, _to: DragOrigin) {},
    openViewer(_id: string) {},
    clearDrag() {},
    setDragState(_value: ActiveDrag | null) {},
  })

  // Stable identities for window listeners (add/remove must match).
  const windowListenersRef = useRef({
    move(e: PointerEvent) {
      if (pointerIdRef.current !== e.pointerId) return
      const pending = pendingRef.current
      if (!pending) return

      const dx = e.clientX - pending.startX
      const dy = e.clientY - pending.startY
      const distance = Math.hypot(dx, dy)

      let active = dragRef.current
      if (!active) {
        if (distance < DRAG_THRESHOLD_PX) return
        const { width, height } = sourceSizeRef.current
        active = {
          ...pending,
          x: e.clientX,
          y: e.clientY,
          width,
          height,
        }
        dragRef.current = active
        document.body.classList.add('is-journal-dragging')
        apiRef.current.setDragState(active)
      } else {
        active.x = e.clientX
        active.y = e.clientY
        if (rafRef.current == null) {
          rafRef.current = requestAnimationFrame(() => {
            rafRef.current = null
            const current = dragRef.current
            if (!current) return
            apiRef.current.placeGhost(
              current.x,
              current.y,
              current.offsetX,
              current.offsetY,
            )
          })
        }
      }

      apiRef.current.updateDropTarget(
        apiRef.current.readDropTarget(e.clientX, e.clientY),
      )
    },
    up(e: PointerEvent) {
      if (pointerIdRef.current !== e.pointerId) return

      const active = dragRef.current
      const pending = pendingRef.current

      if (active) {
        const to = apiRef.current.readDropTarget(e.clientX, e.clientY)
        if (to !== null) {
          apiRef.current.movePhoto(active.photoId, active.from, to)
        }
        apiRef.current.clearDrag()
        return
      }

      if (pending) {
        const photoId = pending.photoId
        apiRef.current.clearDrag()
        apiRef.current.openViewer(photoId)
        return
      }

      apiRef.current.clearDrag()
    },
    cancel(e: PointerEvent) {
      if (pointerIdRef.current !== e.pointerId) return
      apiRef.current.clearDrag()
    },
  })

  const photoById = useMemo(
    () =>
      Object.fromEntries(PHOTOS.map((p) => [p.id, p])) as Record<
        string,
        JournalPhoto
      >,
    [],
  )

  const viewerOrder = useMemo(() => {
    if (trayIds.length > 0) return trayIds
    return slots.filter((id): id is string => Boolean(id))
  }, [trayIds, slots])

  const placedCount = slots.filter(Boolean).length
  const allPlaced = placedCount === PHOTOS.length
  const viewingIndex = viewingId ? viewerOrder.indexOf(viewingId) : -1
  const viewing = viewingId ? photoById[viewingId] : undefined
  const canNavigateViewer = viewerOrder.length > 1 && viewingIndex >= 0
  const buggyInTimeline = slots.some((id) => id && photoById[id]?.buggy)
  const draggingPhoto = drag ? photoById[drag.photoId] : undefined

  function openViewer(id: string) {
    setViewingId(id)
  }

  function closeViewer() {
    setViewingId(null)
  }

  function goToIndex(index: number) {
    if (viewerOrder.length === 0) return
    const next = viewerOrder[(index + viewerOrder.length) % viewerOrder.length]
    openViewer(next)
  }

  function goPrev() {
    if (!canNavigateViewer) return
    goToIndex(viewingIndex - 1)
  }

  function goNext() {
    if (!canNavigateViewer) return
    goToIndex(viewingIndex + 1)
  }

  function validateJournal() {
    if (!allPlaced) return
    setValidated(true)
  }

  function movePhoto(photoId: string, from: DragOrigin, to: DragOrigin) {
    if (from === to) return
    const result = computeMove(
      trayRef.current,
      slotsRef.current,
      photoId,
      from,
      to,
    )
    trayRef.current = result.tray
    slotsRef.current = result.slots
    setTrayIds(result.tray)
    setSlots(result.slots)
    setValidated(false)
  }

  function removeFromSlot(slotIndex: number) {
    const id = slotsRef.current[slotIndex]
    if (!id) return
    movePhoto(id, slotIndex, 'tray')
  }

  function readDropTarget(clientX: number, clientY: number): DragOrigin | null {
    const el = document.elementFromPoint(clientX, clientY)
    if (!el || !(el instanceof Element)) return null
    const slot = el.closest('[data-journal-drop-slot]')
    if (slot) {
      const index = Number(slot.getAttribute('data-journal-drop-slot'))
      return Number.isFinite(index) ? index : null
    }
    if (el.closest('[data-journal-drop-tray]')) return 'tray'
    return null
  }

  function placeGhost(x: number, y: number, offsetX: number, offsetY: number) {
    const ghost = ghostRef.current
    if (!ghost) return
    ghost.style.transform = `translate3d(${x - offsetX}px, ${y - offsetY}px, 0) rotate(-5deg) scale(1.08)`
  }

  function updateDropTarget(next: DragOrigin | null) {
    if (dropTargetRef.current === next) return
    dropTargetRef.current = next
    setDropTarget(next)
  }

  function detachWindowListeners() {
    if (!listeningRef.current) return
    const { move, up, cancel } = windowListenersRef.current
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
    window.removeEventListener('pointercancel', cancel)
    listeningRef.current = false
  }

  function clearDrag() {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    const el = captureElRef.current
    const pid = pointerIdRef.current
    if (el && pid != null) {
      try {
        if (el.hasPointerCapture(pid)) el.releasePointerCapture(pid)
      } catch {
        // ignore
      }
    }
    detachWindowListeners()
    pendingRef.current = null
    dragRef.current = null
    pointerIdRef.current = null
    captureElRef.current = null
    dropTargetRef.current = null
    setDrag(null)
    setDropTarget(null)
    document.body.classList.remove('is-journal-dragging')
  }

  apiRef.current = {
    placeGhost,
    updateDropTarget,
    readDropTarget,
    movePhoto,
    openViewer,
    clearDrag,
    setDragState: setDrag,
  }

  function onPhotoPointerDown(
    e: ReactPointerEvent,
    photoId: string,
    from: DragOrigin,
  ) {
    if (e.button !== 0 && e.pointerType === 'mouse') return
    if ((e.target as Element).closest?.('.journal-slot-remove')) return

    e.preventDefault()
    e.stopPropagation()

    // Recover from a stuck drag before starting a new gesture
    if (pendingRef.current || dragRef.current || listeningRef.current) {
      clearDrag()
    }

    const target = e.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    sourceSizeRef.current = { width: rect.width, height: rect.height }

    pendingRef.current = {
      photoId,
      from,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    }
    pointerIdRef.current = e.pointerId
    captureElRef.current = target

    if (!listeningRef.current) {
      const { move, up, cancel } = windowListenersRef.current
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)
      window.addEventListener('pointercancel', cancel)
      listeningRef.current = true
    }

    try {
      target.setPointerCapture(e.pointerId)
    } catch {
      // Window listeners still handle the gesture
    }
  }

  useLayoutEffect(() => {
    if (!drag) return
    placeGhost(drag.x, drag.y, drag.offsetX, drag.offsetY)
  }, [drag?.photoId])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      if (dragRef.current || pendingRef.current || listeningRef.current) {
        clearDrag()
        return
      }
      setViewingId(null)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      detachWindowListeners()
      document.body.classList.remove('is-journal-dragging')
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  useEffect(() => {
    if (!canNavigateViewer) return

    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
        const delta = e.key === 'ArrowLeft' ? -1 : 1
        const next =
          viewerOrder[
            (viewingIndex + delta + viewerOrder.length) % viewerOrder.length
          ]
        setViewingId(next)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [canNavigateViewer, viewingIndex, viewerOrder])

  return (
    <SceneShell sceneId="scene-12">
      <SceneIllustration
        src="/scene12-finale.png"
        alt="Ceremonie de eliberare la apus pe plajă"
        caption="Eliberare finală · jurnalul zilei"
      />

      <div className="scene-lead">
        <h3 className="scene-lead-title">Obiectiv</h3>
        <p>
          Închide misiunea cu jurnalul foto al zilei: așază fiecare poză pe
          cronologie, de dimineață până la eliberare. Deschide pozele și
          verifică dacă descrierea, ora și locul de pe etichetă se potrivesc cu
          ce vezi.
        </p>
        <ul className="scene-lead-list">
          <li>Fă click pe o poză ca s-o vezi mare.</li>
          <li>Trage poza pe locul potrivit din cronologie (sau înapoi în teanc).</li>
          <li>Când toate sunt adăugate la cronologie, validează jurnalul.</li>
        </ul>
      </div>

      <div className="journal-layout">
        <div
          className={`panel-box journal-tray-panel${
            dropTarget === 'tray' && drag ? ' is-drop-target' : ''
          }`}
          data-journal-drop-tray=""
        >
          <div className="panel-head">
            <h3>Poze de azi</h3>
            <span className="chip soft">{trayIds.length} în teanc</span>
          </div>
          <p className="muted album-hint">
            Click pe o poză ca s-o mărești. Trage poza pe cronologie ca s-o așezi.
          </p>
          {trayIds.length === 0 ? (
            <p className="journal-tray-empty">
              Teancul e gol — trage aici ca să scoți o poză din cronologie.
            </p>
          ) : (
            <div className="journal-tray" aria-label="Teanc de fotografii">
              {trayIds.map((id) => {
                const photo = photoById[id]
                const isDragging = drag?.photoId === id
                return (
                  <article
                    key={id}
                    className={`journal-card${isDragging ? ' is-dragging' : ''}`}
                    onPointerDown={(e) => onPhotoPointerDown(e, id, 'tray')}
                    style={{ touchAction: 'none' }}
                  >
                    <div className="journal-card-open" aria-hidden={isDragging}>
                      <img src={publicAsset(photo.src)} alt={photo.alt} draggable={false} />
                    </div>
                    <div className="journal-card-meta">
                      <strong>{photo.time}</strong>
                      <span>{photo.title}</span>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>

        <div className="journal-side">
          <div className="panel-box">
            <div className="panel-head">
              <h3>Cronologie — jurnalul zilei</h3>
              <span className={`chip${allPlaced ? ' soft' : ''}`}>
                {placedCount} / {PHOTOS.length}
              </span>
            </div>
            <ol
              className={`journal-timeline${drag ? ' is-receiving' : ''}`}
              aria-label="Cronologia zilei"
            >
              {PHOTOS.map((slotPhoto, index) => {
                const placedId = slots[index]
                const placed = placedId ? photoById[placedId] : null
                const showBug =
                  Boolean(placed?.buggy) && (validated || buggyInTimeline)
                const isDropTarget = dropTarget === index && Boolean(drag)
                const isDraggingHere =
                  drag?.photoId === placedId && drag.from === index
                return (
                  <li
                    key={slotPhoto.time}
                    className={`journal-slot${placed ? ' is-filled' : ''}${
                      isDropTarget ? ' is-drop-hover' : ''
                    }${drag && !isDraggingHere ? ' is-drop-ready' : ''}`}
                  >
                    <div className="journal-slot-time" aria-hidden>
                      <span className="journal-slot-dot" />
                      <span>{slotPhoto.time}</span>
                    </div>
                    {placed ? (
                      <div
                        className={`journal-slot-card${
                          isDraggingHere ? ' is-dragging' : ''
                        }${isDropTarget ? ' is-drop-hover' : ''}`}
                        data-bug-zone={showBug ? 'bug-12' : undefined}
                        data-journal-drop-slot={index}
                        onPointerDown={(e) =>
                          onPhotoPointerDown(e, placed.id, index)
                        }
                        style={{ touchAction: 'none' }}
                      >
                        <div className="journal-slot-thumb">
                          <img
                            src={publicAsset(placed.src)}
                            alt={placed.alt}
                            draggable={false}
                          />
                        </div>
                        <div className="journal-slot-meta">
                          <strong>
                            {placed.time} · {placed.title}
                          </strong>
                          <span className="muted">{placed.caption}</span>
                        </div>
                        <button
                          type="button"
                          className="btn btn-ghost journal-slot-remove"
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFromSlot(index)
                          }}
                          aria-label={`Scoate ${placed.title} din cronologie`}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div
                        className={`journal-slot-empty${
                          isDropTarget ? ' is-drop-hover' : ''
                        }`}
                        data-journal-drop-slot={index}
                        aria-label={`Loc liber pentru ${slotPhoto.time}`}
                      >
                        <span className="journal-slot-empty-label">
                          {isDropTarget ? 'Lasă poza aici' : 'Loc liber'}
                        </span>
                      </div>
                    )}
                  </li>
                )
              })}
            </ol>

            <button
              type="button"
              className="btn btn-success journal-validate-btn"
              disabled={!allPlaced}
              onClick={validateJournal}
            >
              Validează jurnalul
            </button>
          </div>

          {validated ? (
            <article className="journal-verdict is-buggy" data-bug-zone="bug-12">
              <div className="journal-verdict-stamp" aria-hidden>
                VALIDAT
              </div>
              <h3>Jurnalul zilei — aprobat</h3>
              <p>
                Sistemul a verificat automat cele {PHOTOS.length} cadre. Cronologia
                e considerată completă și corectă — procedura de eliberare rămâne
                închisă cu succes.
              </p>
              <p className="muted" style={{ marginBottom: 0 }}>
                Notă automată: nu s-a detectat nicio nepotrivire între eticheta orei
                și conținutul pozelor.
              </p>
            </article>
          ) : (
            <div className="panel-box">
              <h3>Validare</h3>
              <p className="muted" style={{ marginTop: '0.5rem' }}>
                După ce așezi toate pozele pe cronologie, validează jurnalul ca să
                închizi misiunea.
              </p>
            </div>
          )}
        </div>
      </div>

      {draggingPhoto && drag
        ? createPortal(
            <div
              ref={ghostRef}
              className="journal-drag-ghost"
              style={{ width: drag.width }}
              aria-hidden
            >
              <img src={publicAsset(draggingPhoto.src)} alt="" draggable={false} />
              <div className="journal-drag-ghost-meta">
                <strong>{draggingPhoto.time}</strong>
                <span>{draggingPhoto.title}</span>
              </div>
            </div>,
            document.body,
          )
        : null}

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
                {canNavigateViewer ? (
                  <>
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
                  </>
                ) : null}
                <div className="polaroid-viewer-card">
                  <div
                    className="polaroid-viewer-photo"
                    data-bug-zone={viewing.buggy ? 'bug-12' : undefined}
                  >
                    <img src={publicAsset(viewing.src)} alt={viewing.alt} />
                    <span className="viewer-counter">
                      {canNavigateViewer
                        ? `${viewingIndex + 1} / ${viewerOrder.length}`
                        : viewing.time}
                    </span>
                  </div>
                  <div className="polaroid-viewer-body">
                    <h3>
                      {viewing.time} · {viewing.title}
                    </h3>
                    <p className="muted">{viewing.caption}</p>
                    <div className="viewer-summary">
                      <span className="viewer-summary-label">În poză</span>
                      <p>{viewing.summary}</p>
                    </div>
                    <div className="viewer-actions">
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={closeViewer}
                      >
                        Închide
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
