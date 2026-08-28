export type Area = {
  x: number
  y: number
  width: number
  height: number
}

export type BugAttempt = {
  id: string
  selectedArea: Area
  isCorrect: boolean
  timestamp: string
  /** Highlighted evidence shot. Legacy fields kept for older saved sessions. */
  screenshot?: string
  screenshotBefore?: string
  screenshotAfter?: string
  description?: string
  score?: number
}

export type BugReport = {
  id: string
  sessionId: string
  childName: string
  sceneId: string
  bugId: string
  timestamp: string
  screenshot: string
  /** @deprecated older sessions */
  screenshotBefore?: string
  /** @deprecated older sessions */
  screenshotAfter?: string
  selectedArea: Area
  description: string
  isCorrect: true
  attemptNumber: number
  score: number
}

export type GameSession = {
  id: string
  childName: string
  startedAt: string
  completedAt?: string
  currentSceneIndex: number
  score: number
  bugReports: BugReport[]
  attempts: Record<string, BugAttempt[]>
  scenesCompleted: string[]
}

export type AppView =
  | 'welcome'
  | 'instructions'
  | 'game'
  | 'journal'
  | 'instructor-login'
  | 'instructor'
  | 'review'
  | 'qa-reveal'

export type SceneMeta = {
  id: string
  bugId: string
  number: number
  emoji: string
  title: string
  eyebrow: string
}
