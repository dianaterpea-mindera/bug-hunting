import { useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  src: string
  alt?: string
}

export function EvidenceShot({ src, alt = 'Dovadă screenshot' }: Props) {
  const [open, setOpen] = useState(false)
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        className="evidence-shot"
        onClick={() => setOpen(true)}
        aria-label="Deschide imaginea mărită"
      >
        <img src={src} alt={alt} />
      </button>

      {open &&
        createPortal(
          <div
            className="image-lightbox"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={() => setOpen(false)}
          >
            <div
              className="image-lightbox-panel"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="image-lightbox-bar">
                <span id={titleId}>Preview dovadă</span>
                <button
                  type="button"
                  className="btn btn-ghost image-lightbox-close"
                  onClick={() => setOpen(false)}
                >
                  Închide
                </button>
              </div>
              <img src={src} alt={alt} className="image-lightbox-img" />
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
