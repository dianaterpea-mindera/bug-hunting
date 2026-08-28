import { useState } from 'react'
import { SceneIllustration } from '../components/SceneIllustration'
import { SceneShell } from '../components/SceneShell'

type Item = { id: string; label: string; emoji: string; required: number }

const ITEMS: Item[] = [
  { id: 'food', label: 'Hrană', emoji: '🍎', required: 2 },
  { id: 'kit', label: 'Trusă medicală', emoji: '🩹', required: 1 },
  { id: 'blanket', label: 'Pătură', emoji: '🧣', required: 2 },
  { id: 'radio', label: 'Radio portabil', emoji: '📻', required: 1 },
  { id: 'water', label: 'Apă', emoji: '🧴', required: 3 },
  { id: 'light', label: 'Lanternă', emoji: '🔦', required: 2 },
]

const CAPACITY = ITEMS.reduce((sum, item) => sum + item.required, 0)

export function Scene04() {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [displayStuck, setDisplayStuck] = useState<Record<string, number>>({})

  function syncDisplay(itemId: string, real: number) {
    setDisplayStuck((d) => {
      if (itemId === 'water' && real > 2) {
        return { ...d, [itemId]: 2 }
      }
      return { ...d, [itemId]: real }
    })
  }

  function add(item: Item) {
    setCounts((prev) => {
      const next = { ...prev, [item.id]: (prev[item.id] ?? 0) + 1 }
      syncDisplay(item.id, next[item.id])
      return next
    })
  }

  function remove(item: Item) {
    setCounts((prev) => {
      const current = prev[item.id] ?? 0
      if (current <= 0) return prev
      const nextCount = current - 1
      const next = { ...prev }
      if (nextCount === 0) {
        delete next[item.id]
      } else {
        next[item.id] = nextCount
      }
      syncDisplay(item.id, nextCount)
      return next
    })
  }

  const totalCount = ITEMS.reduce(
    (sum, item) => sum + (counts[item.id] ?? 0),
    0,
  )
  const fill = Math.min(100, Math.round((totalCount / CAPACITY) * 100))

  return (
    <SceneShell sceneId="scene-04">
      <SceneIllustration
        src="/scene04-backpack.png"
        alt="Rucsac deschis cu echipamentele de salvare"
        caption="Depozit debarcader · Rucsac R-17"
      />

      <div className="scene-lead">
        <h3 className="scene-lead-title">Obiectiv</h3>
        <p>Pregătește rucsacul pentru misiune:</p>
        <ul className="scene-lead-list">
          {ITEMS.map((item) => (
            <li key={item.id}>
              {item.required} x {item.label.toLowerCase()}
            </li>
          ))}
        </ul>
      </div>

      <div className="scene-layout">
        <div className="panel-box">
          <h3>Raft disponibil</h3>
          <div style={{ marginTop: '0.75rem' }}>
            {ITEMS.map((item) => (
              <div key={item.id} className="item-btn">
                <span className="item-btn-label">
                  {item.emoji} {item.label}
                </span>
                <div className="item-qty">
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => remove(item)}
                    aria-label={`Scoate ${item.label}`}
                    disabled={(counts[item.id] ?? 0) <= 0}
                  >
                    −
                  </button>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => add(item)}
                    aria-label={`Adaugă ${item.label}`}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel-box">
          <div className="panel-head">
            <h3>În rucsac</h3>
            <span className="chip">
              {totalCount}/{CAPACITY}
            </span>
          </div>
          <div className="capacity-bar" aria-hidden>
            <div className="capacity-fill" style={{ width: `${fill}%` }} />
          </div>
          {ITEMS.map((item) => {
            const shown = displayStuck[item.id] ?? 0
            const realCount = counts[item.id] ?? 0
            if (!shown && !realCount) return null
            const waterBugActive = item.id === 'water' && realCount > 2
            return (
              <div
                key={item.id}
                className="backpack-slot"
                data-bug-zone={waterBugActive ? 'bug-04' : undefined}
              >
                {item.emoji} {item.label} × {shown || realCount}
              </div>
            )
          })}
          {Object.keys(counts).length === 0 && (
            <p className="muted">Rucsacul este gol. Adaugă obiecte de pe raft.</p>
          )}
        </div>
      </div>
    </SceneShell>
  )
}
