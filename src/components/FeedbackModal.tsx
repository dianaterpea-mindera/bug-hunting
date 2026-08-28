import { createPortal } from 'react-dom'

type Props = {
  variant: 'success' | 'retry'
  title: string
  body: string
  onClose: () => void
  onCancel?: () => void
  hideClose?: boolean
}

export function FeedbackModal({
  variant,
  title,
  body,
  onClose,
  onCancel,
  hideClose,
}: Props) {
  return createPortal(
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className={`modal ${variant}`}>
        <h2>
          {variant === 'success' ? '🎉' : '🔎'} {title}
        </h2>
        <p>{body}</p>
        {!hideClose && (
          <div className="scene-actions">
            {onCancel && (
              <button type="button" className="btn btn-muted" onClick={onCancel}>
                Anulează
              </button>
            )}
            <button type="button" className="btn btn-success" onClick={onClose}>
              Încearcă din nou
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
