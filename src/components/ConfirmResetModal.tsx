import { createPortal } from 'react-dom'

type Props = {
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmResetModal({ onConfirm, onCancel }: Props) {
  return createPortal(
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="reset-title">
      <div className="modal">
        <h2 id="reset-title">🔄 Reîncepi misiunea?</h2>
        <p>
          Sigur vrei să o iei de la capăt? Vei ajunge din nou la ecranul de start, unde trebuie
          să îți introduci numele. Progresul misiunii actuale se pierde.
        </p>
        <div className="scene-actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Nu, continuă
          </button>
          <button type="button" className="btn btn-success" onClick={onConfirm}>
            Da, reîncepe
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
