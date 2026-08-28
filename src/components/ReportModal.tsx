import { useState } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  onSubmit: (description: string) => void
  onCancel: () => void
  busy?: boolean
}

export function ReportModal({ onSubmit, onCancel, busy }: Props) {
  const [text, setText] = useState('')

  return createPortal(
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal success">
        <h2>🎉 Ai găsit problema!</h2>
        <p>Foarte bine observat! Spune-ne ce ai văzut:</p>
        <div className="field">
          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={"Ex: Numărul este greșit / poza nu se potrivește...\nMinim 3 caractere"}
            autoFocus
          />
        </div>
        <div className="scene-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onCancel}
            disabled={busy}
          >
            Anulează
          </button>
          <button
            type="button"
            className="btn btn-success"
            disabled={text.trim().length < 3 || busy}
            aria-busy={busy}
            onClick={() => onSubmit(text.trim())}
          >
            {busy ? (
              <>
                <span className="btn-spinner" aria-hidden />
                Salvăm...
              </>
            ) : (
              'Raportează'
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
