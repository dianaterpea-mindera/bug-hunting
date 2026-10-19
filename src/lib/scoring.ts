import { SCENES, STARS } from '../constants'

export type StarFill = 'full' | 'half' | 'empty'

/** Stele pe ecran: plină din prima, jumătate după greșeli. */
export function starsForAttempt(attemptNumber: number): number {
  return attemptNumber === 1 ? STARS.full : STARS.half
}

export function starFillForAttempt(attemptNumber: number): 'full' | 'half' {
  return attemptNumber === 1 ? 'full' : 'half'
}

export function isMaxSceneScore(attemptNumber: number): boolean {
  return attemptNumber === 1
}

export function scoreLabel(attemptNumber: number): string {
  return isMaxSceneScore(attemptNumber) ? 'Stea plină' : 'Jumătate de stea'
}

export function maxStarsTotal(sceneCount = SCENES.length): number {
  return sceneCount * STARS.full
}

/** Stele din rapoarte (sigur și pentru sesiuni vechi cu puncte). */
export function starsFromReports(
  reports: { attemptNumber: number }[],
): number {
  return reports.reduce((sum, r) => sum + starsForAttempt(r.attemptNumber), 0)
}

/** O stea per ecran: plină / jumătate / goală. */
export function starFillsForSession(
  reports: { sceneId: string; attemptNumber: number }[],
  sceneIds: string[] = SCENES.map((s) => s.id),
): StarFill[] {
  return sceneIds.map((sceneId) => {
    const report = reports.find((r) => r.sceneId === sceneId)
    if (!report) return 'empty'
    return starFillForAttempt(report.attemptNumber)
  })
}

/** @deprecated alias — scorul e acum în stele */
export function scoreForCorrectReport(attemptNumber: number): number {
  return starsForAttempt(attemptNumber)
}

export function formatStars(value: number): string {
  if (Number.isInteger(value)) return String(value)
  return value.toFixed(1)
}
