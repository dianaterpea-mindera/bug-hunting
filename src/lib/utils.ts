import type { Area } from '../types'
import {
  MIN_ZONE_COVERAGE,
  SELECTION_FRAME_HEIGHT_PX,
  SELECTION_FRAME_WIDTH_PX,
  TOLERANCE_PX,
} from '../constants'

export function uid(prefix = 'id'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function formatDuration(startedAt: string, completedAt?: string): string {
  const end = completedAt ? new Date(completedAt).getTime() : Date.now()
  const mins = Math.max(1, Math.round((end - new Date(startedAt).getTime()) / 60000))
  return `${mins} min`
}

function expandArea(area: Area, tolerance: number): Area {
  return {
    x: area.x - tolerance,
    y: area.y - tolerance,
    width: area.width + tolerance * 2,
    height: area.height + tolerance * 2,
  }
}

function areaSize(area: Area): number {
  return Math.max(0, area.width) * Math.max(0, area.height)
}

function intersectionArea(a: Area, b: Area): number {
  const left = Math.max(a.x, b.x)
  const top = Math.max(a.y, b.y)
  const right = Math.min(a.x + a.width, b.x + b.width)
  const bottom = Math.min(a.y + a.height, b.y + b.height)
  const width = right - left
  const height = bottom - top
  if (width <= 0 || height <= 0) return 0
  return width * height
}

/** True if two rectangles overlap (legacy / geometry helper). */
export function areasIntersect(a: Area, b: Area, tolerance = TOLERANCE_PX): boolean {
  const expanded = expandArea(b, tolerance)
  return intersectionArea(a, expanded) > 0
}

const FRAME_INSET_PX = 8

export function selectionFrameSize(bounds: { width: number; height: number }): {
  width: number
  height: number
} {
  return {
    width: Math.min(
      SELECTION_FRAME_WIDTH_PX,
      Math.max(0, bounds.width - FRAME_INSET_PX * 2),
    ),
    height: Math.min(
      SELECTION_FRAME_HEIGHT_PX,
      Math.max(0, bounds.height - FRAME_INSET_PX * 2),
    ),
  }
}

/** Keep a fixed-size frame fully inside the overlay. */
export function clampSelectionPosition(
  area: Area,
  bounds: { width: number; height: number },
): Area {
  const { width, height } = selectionFrameSize(bounds)
  const maxX = Math.max(0, bounds.width - width)
  const maxY = Math.max(0, bounds.height - height)
  return {
    x: Math.min(Math.max(0, area.x), maxX),
    y: Math.min(Math.max(0, area.y), maxY),
    width,
    height,
  }
}

export function createCenteredSelection(bounds: {
  width: number
  height: number
}): Area {
  const { width, height } = selectionFrameSize(bounds)
  return clampSelectionPosition(
    {
      x: (bounds.width - width) / 2,
      y: (bounds.height - height) / 2,
      width,
      height,
    },
    bounds,
  )
}

/**
 * Selection is valid if the placed frame covers a meaningful part of the bug.
 */
export function isValidBugSelection(
  selection: Area,
  zone: Area,
  tolerance = TOLERANCE_PX,
): boolean {
  if (areaSize(selection) <= 0) return false

  const target = expandArea(zone, tolerance)
  const targetArea = areaSize(target)
  if (targetArea <= 0) return false

  const overlap = intersectionArea(selection, target)
  if (overlap <= 0) return false

  return overlap / targetArea >= MIN_ZONE_COVERAGE
}

export function rectToArea(
  rect: DOMRect,
  container: DOMRect,
): Area {
  return {
    x: rect.left - container.left,
    y: rect.top - container.top,
    width: rect.width,
    height: rect.height,
  }
}

export function getBugZoneAreas(
  container: HTMLElement,
  bugId: string,
): Area[] {
  const containerRect = container.getBoundingClientRect()
  return Array.from(
    container.querySelectorAll(`[data-bug-zone="${bugId}"]`),
  ).map((el) => rectToArea((el as HTMLElement).getBoundingClientRect(), containerRect))
}

export function getBugZoneArea(
  container: HTMLElement,
  bugId: string,
): Area | null {
  return getBugZoneAreas(container, bugId)[0] ?? null
}

/** True if the selection covers any of the bug zones enough. */
export function isValidBugSelectionAny(
  selection: Area,
  zones: Area[],
  tolerance = TOLERANCE_PX,
): boolean {
  return zones.some((zone) => isValidBugSelection(selection, zone, tolerance))
}

export function areasEqual(a: Area | null, b: Area | null): boolean {
  if (a === b) return true
  if (!a || !b) return false
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height
}

/** Grow a highlight slightly so small bug targets stay easy to see. */
export function padAreaWithin(
  area: Area,
  pad: number,
  bounds: { width: number; height: number },
): Area {
  const x = Math.max(0, area.x - pad)
  const y = Math.max(0, area.y - pad)
  const right = Math.min(bounds.width, area.x + area.width + pad)
  const bottom = Math.min(bounds.height, area.y + area.height + pad)
  return {
    x,
    y,
    width: Math.max(0, right - x),
    height: Math.max(0, bottom - y),
  }
}

/** Prefer current field; fall back to older before/after shots. */
export function evidenceScreenshot(shot: {
  screenshot?: string
  screenshotAfter?: string
  screenshotBefore?: string
}): string | undefined {
  return shot.screenshot || shot.screenshotAfter || shot.screenshotBefore
}
