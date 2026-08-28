import html2canvas from 'html2canvas'

/** UI chrome that must not appear in evidence screenshots. */
const IGNORE_SELECTOR =
  '.bug-overlay, .bug-overlay-hint, .bug-overlay-actions, .btn-find-bug, .modal-backdrop, .toast'

/**
 * html2canvas restarts CSS animations on its DOM clone. `.scene-panel` uses
 * `rise-in` with `animation-fill-mode: both` (opacity 0 → 1), so the clone is
 * captured nearly transparent over the white canvas background — a washed-out
 * “white overlay”. Freeze styles before render.
 *
 * Also flatten backgrounds/filters that html2canvas paints incorrectly
 * (multi-layer gradients → gray/cut regions).
 */
function prepareClone(cloned: HTMLElement) {
  cloned.style.animation = 'none'
  cloned.style.opacity = '1'
  cloned.style.transform = 'none'
  cloned.style.background = '#ffffff'

  cloned.querySelectorAll<HTMLElement>('*').forEach((node) => {
    node.style.animation = 'none'
    node.style.filter = 'none'
    node.style.backdropFilter = 'none'
  })

  cloned.querySelectorAll<HTMLElement>('.island-map').forEach((map) => {
    map.style.background =
      'linear-gradient(145deg, #c8e6c9 0%, #81c784 42%, #4db6ac 100%)'
  })

  cloned.querySelectorAll<HTMLElement>(IGNORE_SELECTOR).forEach((node) => {
    node.style.display = 'none'
  })
}

export async function captureElement(el: HTMLElement): Promise<string> {
  const canvas = await html2canvas(el, {
    backgroundColor: '#ffffff',
    // Evidence shots don't need retina density — 1x is ~4× fewer pixels on
    // typical displays and is the main capture cost.
    scale: 1,
    useCORS: true,
    logging: false,
    // Explicit size avoids clipped/letterboxed captures on overflow:hidden panels.
    width: el.offsetWidth,
    height: el.offsetHeight,
    windowWidth: el.offsetWidth,
    windowHeight: el.offsetHeight,
    onclone: (_document, cloned) => {
      prepareClone(cloned as HTMLElement)
    },
  })
  return canvas.toDataURL('image/jpeg', 0.72)
}
