import { POINTS } from '../constants'

export function scoreForCorrectReport(attemptNumber: number): number {
  const base = POINTS.find + POINTS.report
  const bonus = attemptNumber === 1 ? POINTS.firstTryBonus : 0
  return base + bonus
}
