import { useState } from 'react'
import { SceneIllustration } from '../components/SceneIllustration'
import { SceneShell } from '../components/SceneShell'

type Dir = 'up' | 'down' | 'left' | 'right'
type Cell = { row: number; col: number }

/** Cross: N Poiana · W Pădure (start) · E Centru · S Plaja · center junction */
const CELLS: Cell[] = [
  { row: 0, col: 1 },
  { row: 1, col: 0 },
  { row: 1, col: 1 },
  { row: 1, col: 2 },
  { row: 2, col: 1 },
]

const POIANA: Cell = { row: 0, col: 1 }
const CENTER: Cell = { row: 1, col: 1 }
const START: Cell = { row: 1, col: 0 }

const LANDMARKS: { row: number; col: number; emoji: string; label: string }[] = [
  { row: 0, col: 1, emoji: '🦜', label: 'Poiana' },
  { row: 1, col: 0, emoji: '🌴', label: 'Pădure' },
  { row: 1, col: 2, emoji: '🏥', label: 'Centru' },
  { row: 2, col: 1, emoji: '🏖️', label: 'Plaja' },
]

const DELTA: Record<Dir, Cell> = {
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
}

/** → maps to ↑ only from the center cell — the intentional bug */
function resolveMove(from: Cell, dir: Dir): Dir {
  if (dir === 'right' && sameCell(from, CENTER)) return 'up'
  return dir
}

function cellKey(cell: Cell) {
  return `${cell.row}-${cell.col}`
}

function sameCell(a: Cell, b: Cell) {
  return a.row === b.row && a.col === b.col
}

function tryMove(from: Cell, dir: Dir): Cell {
  const d = DELTA[resolveMove(from, dir)]
  const next = { row: from.row + d.row, col: from.col + d.col }
  return CELLS.some((c) => sameCell(c, next)) ? next : from
}

const ARROWS: { dir: Dir; glyph: string; label: string; buggy?: boolean }[] = [
  { dir: 'up', glyph: '↑', label: 'Sus' },
  { dir: 'left', glyph: '←', label: 'Stânga' },
  { dir: 'right', glyph: '→', label: 'Dreapta', buggy: true },
  { dir: 'down', glyph: '↓', label: 'Jos' },
]

export function Scene05() {
  const [pawn, setPawn] = useState<Cell>(START)
  const [wrongMoveTriggered, setWrongMoveTriggered] = useState(false)

  const bugActive =
    wrongMoveTriggered && sameCell(pawn, POIANA)

  function move(dir: Dir) {
    setPawn((prev) => {
      const next = tryMove(prev, dir)
      if (
        dir === 'right' &&
        sameCell(prev, CENTER) &&
        sameCell(next, POIANA)
      ) {
        setWrongMoveTriggered(true)
      }
      return next
    })
  }

  function resetTrail() {
    setPawn(START)
    setWrongMoveTriggered(false)
  }

  return (
    <SceneShell sceneId="scene-05">
      <SceneIllustration
        src="/scene05-trail-map.png"
        alt="Harta oficială a potecii cu traseul corect spre Centrul de salvare"
        caption="Hartă oficială · traseu așteptat spre Centrul de salvare"
      />

      <div className="scene-lead">
        <h3 className="scene-lead-title">Obiectiv</h3>
        <p>
          Urmează traseul portocaliu de pe harta oficială folosind navigatorul de
          mai jos.
        </p>
      </div>

      <div className="panel-box">
        <div className="panel-head">
          <h3>Navigator potecă</h3>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={resetTrail}
          >
            Resetează
          </button>
        </div>

        <div className="trail-nav">
          <div
            className="trail-mini-map"
            aria-label="Mini-harta potecii cu pionul tău"
          >
            <div className="trail-mini-compass" aria-hidden>
              N
              <br />↑
            </div>
            {CELLS.map((cell) => {
              const landmark = LANDMARKS.find(
                (l) => l.row === cell.row && l.col === cell.col,
              )
              const isPawn = sameCell(pawn, cell)
              const isWrongDestination =
                bugActive && sameCell(cell, POIANA)
              return (
                <div
                  key={cellKey(cell)}
                  className={`trail-cell${landmark ? ' has-landmark' : ''}${isPawn ? ' has-pawn' : ''}`}
                  style={{
                    gridRow: cell.row + 1,
                    gridColumn: cell.col + 1,
                  }}
                  data-bug-zone={isWrongDestination ? 'bug-05' : undefined}
                >
                  {landmark && (
                    <span className="trail-landmark">
                      <span aria-hidden>{landmark.emoji}</span>
                      <span className="trail-landmark-label">{landmark.label}</span>
                    </span>
                  )}
                  {isPawn && (
                    <span className="trail-pawn" title="Tu">
                      🧍
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          <div className="trail-dpad" role="group" aria-label="Direcții">
            {ARROWS.map((arrow) =>
              arrow.buggy ? (
                <div
                  key={arrow.dir}
                  className="trail-arrow-hit trail-arrow-right"
                  data-bug-zone={bugActive ? 'bug-05' : undefined}
                >
                  <button
                    type="button"
                    className="trail-arrow"
                    onClick={() => move(arrow.dir)}
                    aria-label={arrow.label}
                  >
                    {arrow.glyph}
                  </button>
                </div>
              ) : (
                <button
                  key={arrow.dir}
                  type="button"
                  className={`trail-arrow trail-arrow-${arrow.dir}`}
                  onClick={() => move(arrow.dir)}
                  aria-label={arrow.label}
                >
                  {arrow.glyph}
                </button>
              ),
            )}
          </div>
        </div>
      </div>
    </SceneShell>
  )
}
