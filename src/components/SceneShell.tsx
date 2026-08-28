import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { SCENES } from '../constants'
import { useGame } from '../context/GameContext'
import { captureElement } from '../lib/screenshots'
import {
  areasEqual,
  getBugZoneAreas,
  isValidBugSelectionAny,
  padAreaWithin,
} from '../lib/utils'
import type { Area } from '../types'
import { BugOverlay } from './BugOverlay'
import { FeedbackModal } from './FeedbackModal'
import { ReportModal } from './ReportModal'

type Props = {
  sceneId: string
  children: ReactNode
}

type Mode = 'play' | 'select' | 'report'

export function SceneShell({ sceneId, children }: Props) {
  const { session, recordAttempt, markSceneComplete } = useGame()
  const panelRef = useRef<HTMLDivElement>(null)
  const capturePromiseRef = useRef<Promise<string> | null>(null)
  const captureGenRef = useRef(0)
  const meta = SCENES.find((s) => s.id === sceneId)!

  const [mode, setMode] = useState<Mode>('play')
  const [selection, setSelection] = useState<Area | null>(null)
  const [pendingShot, setPendingShot] = useState<{
    screenshot: string
    area: Area
  } | null>(null)
  const [feedback, setFeedback] = useState<'wrong' | null>(null)
  const [showReportedToast, setShowReportedToast] = useState(false)
  const [busy, setBusy] = useState(false)
  const [foundHighlight, setFoundHighlight] = useState<Area[]>([])

  const foundReport = session?.bugReports.find((r) => r.bugId === meta.bugId)
  const alreadyFound = Boolean(foundReport)
  const isLastScene = session
    ? session.currentSceneIndex >= SCENES.length - 1
    : sceneId === SCENES[SCENES.length - 1]?.id

  async function captureEvidence(area: Area): Promise<string> {
    const panel = panelRef.current
    if (!panel) return ''
    setSelection(area)
    await new Promise<void>((r) =>
      requestAnimationFrame(() => requestAnimationFrame(() => r())),
    )
    return captureElement(panel)
  }

  function handleVerify(area: Area) {
    if (!panelRef.current || !session || busy) return

    const zones = getBugZoneAreas(panelRef.current, meta.bugId)
    const isCorrect = isValidBugSelectionAny(area, zones)
    const gen = ++captureGenRef.current
    const capture = captureEvidence(area)
    capturePromiseRef.current = capture

    if (!isCorrect) {
      setFeedback('wrong')
      void capture
        .then((screenshot) =>
          recordAttempt({
            sceneId,
            bugId: meta.bugId,
            selectedArea: area,
            isCorrect: false,
            screenshot,
          }),
        )
        .catch((err) => {
          console.warn('Evidence save failed', err)
        })
        .finally(() => {
          if (captureGenRef.current === gen) setSelection(null)
        })
      return
    }

    setSelection(area)
    setMode('report')
    void capture
      .then((screenshot) => {
        if (captureGenRef.current !== gen) return
        setPendingShot({ screenshot, area })
      })
      .catch((err) => {
        console.warn('Evidence capture failed', err)
      })
  }

  async function handleReport(description: string) {
    if (!session || busy) return
    const area = pendingShot?.area ?? selection
    if (!area) return

    setBusy(true)
    try {
      const screenshot =
        pendingShot?.screenshot || (await capturePromiseRef.current) || ''
      await recordAttempt({
        sceneId,
        bugId: meta.bugId,
        selectedArea: area,
        isCorrect: true,
        screenshot,
        description,
      })
      setShowReportedToast(true)
      setPendingShot(null)
      setSelection(null)
      setMode('play')
      capturePromiseRef.current = null
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    if (!showReportedToast) return
    const timer = window.setTimeout(() => setShowReportedToast(false), 10_000)
    return () => window.clearTimeout(timer)
  }, [showReportedToast])

  useLayoutEffect(() => {
    if (!alreadyFound) {
      setFoundHighlight([])
      return
    }

    const panel = panelRef.current
    if (!panel) return

    const measure = () => {
      const zoneEls = panel.querySelectorAll(`[data-bug-zone="${meta.bugId}"]`)
      const zones = getBugZoneAreas(panel, meta.bugId)
      const next =
        zones.length > 0
          ? zones.map((zone) =>
              padAreaWithin(zone, 8, {
                width: panel.clientWidth,
                height: panel.clientHeight,
              }),
            )
          : foundReport?.selectedArea
            ? [foundReport.selectedArea]
            : []
      setFoundHighlight((prev) =>
        prev.length === next.length &&
        prev.every((area, i) => areasEqual(area, next[i] ?? null))
          ? prev
          : next,
      )
      zoneEls.forEach((el) => resizeObserver.observe(el))
    }

    const resizeObserver = new ResizeObserver(measure)
    measure()
    resizeObserver.observe(panel)
    const mutationObserver = new MutationObserver(measure)
    mutationObserver.observe(panel, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-bug-zone'],
    })

    return () => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [alreadyFound, foundReport?.id, foundReport?.selectedArea, meta.bugId])

  useEffect(() => {
    if (!alreadyFound) return
    const zone = panelRef.current?.querySelector(
      `[data-bug-zone="${meta.bugId}"]`,
    )
    zone?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [alreadyFound, meta.bugId])

  const showSelectionRect = Boolean(
    selection && selection.width > 0 && (mode !== 'select' || feedback),
  )

  return (
    <div
      className={`scene-panel${alreadyFound ? ' has-found-bug' : ''}`}
      ref={panelRef}
      data-scene={sceneId}
    >
      <div className="scene-eyebrow">
        {meta.emoji} {meta.eyebrow}
      </div>
      <h2 className="scene-title">{meta.title}</h2>
      <div className="scene-body">{children}</div>

      {alreadyFound &&
        createPortal(
          <button
            type="button"
            className="btn btn-success floating-action"
            onClick={() => void markSceneComplete()}
          >
            {isLastScene ? 'Finalizare' : 'Continuă misiunea →'}
          </button>,
          document.body,
        )}

      {!alreadyFound &&
        mode === 'play' &&
        !feedback &&
        createPortal(
          <button
            type="button"
            className="btn-find-bug floating-action"
            onClick={() => {
              setSelection(null)
              setMode('select')
            }}
          >
            <span className="btn-find-bug-icon" aria-hidden>
              🐞
            </span>
            <span className="btn-find-bug-copy">
              <span className="btn-find-bug-label">Am găsit o problemă</span>
              <span className="btn-find-bug-hint">Marchează zona pe ecran</span>
            </span>
          </button>,
          document.body,
        )}

      {mode === 'select' && !feedback && (
        <BugOverlay
          selection={selection}
          onSelectionChange={setSelection}
          onCancel={() => {
            setMode('play')
            setSelection(null)
          }}
          onVerify={handleVerify}
          busy={busy}
        />
      )}

      {alreadyFound &&
        foundHighlight.map((area, index) => (
          <div
            key={`found-${index}`}
            className="found-bug-rect"
            style={{
              left: area.x,
              top: area.y,
              width: area.width,
              height: area.height,
            }}
            aria-hidden
          >
            {index === 0 ? <span className="found-bug-badge">🐞 Găsit</span> : null}
          </div>
        ))}

      {showSelectionRect && selection && (
        <div
          className="selection-rect"
          style={{
            left: selection.x,
            top: selection.y,
            width: selection.width,
            height: selection.height,
          }}
        />
      )}

      {feedback === 'wrong' && (
        <FeedbackModal
          variant="retry"
          title="Mai caută puțin!"
          body="Ai observat ceva interesant, dar problema pe care o căutăm este alta."
          onCancel={() => {
            setFeedback(null)
            setSelection(null)
            setMode('play')
          }}
          onClose={() => {
            setFeedback(null)
            setSelection(null)
            setMode('select')
          }}
        />
      )}

      {busy &&
        !pendingShot?.screenshot &&
        createPortal(
          <div className="verify-loading" role="status" aria-live="polite">
            <div className="verify-loading-card">
              <span className="verify-bug" aria-hidden>
                🐞
              </span>
              <p className="verify-loading-title">Un moment…</p>
              <p className="verify-loading-body">Pregătim fotografia pentru jurnal.</p>
            </div>
          </div>,
          document.body,
        )}

      {mode === 'report' && (
        <ReportModal
          onSubmit={(description) => void handleReport(description)}
          onCancel={() => {
            captureGenRef.current += 1
            setMode('play')
            setPendingShot(null)
            setSelection(null)
            capturePromiseRef.current = null
          }}
          busy={busy}
        />
      )}

      {showReportedToast &&
        createPortal(
          <div className="toast" role="status" aria-live="polite">
            <span>🐞 Bug raportat — misiunea poate continua.</span>
            <button
              type="button"
              className="toast-close"
              aria-label="Închide"
              onClick={() => setShowReportedToast(false)}
            >
              ×
            </button>
          </div>,
          document.body,
        )}
    </div>
  )
}
