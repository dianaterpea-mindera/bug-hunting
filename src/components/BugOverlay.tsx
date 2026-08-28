import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from 'react'
import { createPortal } from 'react-dom'
import {
  clampSelectionPosition,
  createCenteredSelection,
  selectionFrameSize,
} from '../lib/utils'
import type { Area } from '../types'

type Props = {
  selection: Area | null
  onSelectionChange: (area: Area | null) => void
  onCancel: () => void
  onVerify: (area: Area) => void
  busy?: boolean
}

export function BugOverlay({
  selection,
  onSelectionChange,
  onCancel,
  onVerify,
  busy,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const selectionRef = useRef(selection)
  const [placed, setPlaced] = useState(false)

  selectionRef.current = selection

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const overlay = root

    function syncToBounds() {
      const rect = overlay.getBoundingClientRect()
      const bounds = { width: rect.width, height: rect.height }
      const size = selectionFrameSize(bounds)
      const current = selectionRef.current
      const next = current
        ? clampSelectionPosition(
            { x: current.x, y: current.y, width: size.width, height: size.height },
            bounds,
          )
        : createCenteredSelection(bounds)
      if (
        !current ||
        current.x !== next.x ||
        current.y !== next.y ||
        current.width !== next.width ||
        current.height !== next.height
      ) {
        onSelectionChange(next)
      }
    }

    syncToBounds()
    const observer = new ResizeObserver(syncToBounds)
    observer.observe(overlay)
    return () => observer.disconnect()
  }, [onSelectionChange])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape' || busy) return
      e.preventDefault()
      onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [busy, onCancel])

  function localPoint(e: PointerEvent) {
    const rect = rootRef.current!.getBoundingClientRect()
    return {
      x: Math.max(0, Math.min(e.clientX - rect.left, rect.width)),
      y: Math.max(0, Math.min(e.clientY - rect.top, rect.height)),
    }
  }

  function overlayBounds() {
    const rect = rootRef.current!.getBoundingClientRect()
    return { width: rect.width, height: rect.height }
  }

  function moveFrameToPoint(p: { x: number; y: number }) {
    const frame = selectionRef.current
    if (!frame) return
    onSelectionChange(
      clampSelectionPosition(
        {
          x: p.x - frame.width / 2,
          y: p.y - frame.height / 2,
          width: frame.width,
          height: frame.height,
        },
        overlayBounds(),
      ),
    )
  }

  function onPointerMove(e: PointerEvent) {
    if (busy || placed) return
    moveFrameToPoint(localPoint(e))
  }

  function onPointerDown(e: PointerEvent) {
    if (busy) return
    // Buttons are portaled to document.body, but React still bubbles their
    // pointer events to this overlay. Treat those as UI clicks, not a drop.
    if (e.target !== e.currentTarget) return
    e.preventDefault()
    moveFrameToPoint(localPoint(e))
    setPlaced((wasPlaced) => !wasPlaced)
  }

  const canVerify = Boolean(
    placed && selection && selection.width > 0 && selection.height > 0,
  )

  return (
    <div
      ref={rootRef}
      className={`bug-overlay${placed ? ' is-placed' : ' is-aiming'}`}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
    >
      {selection && selection.width > 0 && (
        <div
          className={`selection-rect${placed ? ' is-placed' : ''}`}
          style={{
            left: selection.x,
            top: selection.y,
            width: selection.width,
            height: selection.height,
          }}
        />
      )}
      {createPortal(
        <>
          <div className="bug-overlay-hint">
            {placed
              ? '🔎 Chenar plasat — apasă Verifică'
              : '🔎 Mută cursorul peste problemă, apoi fă click'}
          </div>
          <div
            className="bug-overlay-actions"
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onPointerMove={(e) => e.stopPropagation()}
          >
            <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={busy}>
              Anulează
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              disabled={!canVerify || busy}
              aria-busy={busy}
              onClick={() => selection && onVerify(selection)}
            >
              {busy ? (
                <>
                  <span className="btn-spinner" aria-hidden />
                  Verificăm...
                </>
              ) : (
                '🔍 Verifică'
              )}
            </button>
          </div>
        </>,
        document.body,
      )}
    </div>
  )
}
