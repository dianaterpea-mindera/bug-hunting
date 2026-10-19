import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { DEMO_PLAYER_NAME, INSTRUCTOR_PIN, SCENES } from '../constants'
import { scoreForCorrectReport } from '../lib/scoring'
import {
  applyUploadedUrls,
  childNameExists,
  getActiveSessionId,
  getAllSessions,
  getAllSessionsLocal,
  getSession,
  isSupabaseConfigured,
  onCloudSessionSynced,
  saveSession,
  setActiveSessionId,
} from '../lib/storage'
import { uid } from '../lib/utils'
import type {
  AppView,
  Area,
  BugAttempt,
  BugReport,
  GameSession,
} from '../types'

/** Highest scene index the player may open (completed scenes + current in-progress). */
export function getFrontierSceneIndex(session: GameSession): number {
  const firstIncomplete = SCENES.findIndex(
    (s) => !session.scenesCompleted.includes(s.id),
  )
  if (firstIncomplete === -1) return SCENES.length - 1
  return firstIncomplete
}

/** True when the mission is fully done (or all scenes were already cleared). */
export function isSessionFinished(session: GameSession): boolean {
  if (session.completedAt) return true
  return SCENES.every((s) => session.scenesCompleted.includes(s.id))
}

export function isSceneNavigable(
  session: GameSession,
  index: number,
): boolean {
  if (index < 0 || index >= SCENES.length) return false
  // Finished runs can freely revisit every scene (marks stay on).
  if (isSessionFinished(session)) return true
  return index <= getFrontierSceneIndex(session)
}

type GameContextValue = {
  view: AppView
  setView: (v: AppView) => void
  session: GameSession | null
  sessions: GameSession[]
  refreshSessions: () => Promise<void>
  cloudEnabled: boolean
  startGame: (
    childName: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>
  resetGame: () => void
  resumeSession: (id: string) => void
  enterAsDemoPlayer: () => Promise<{ ok: true } | { ok: false; error: string }>
  currentSceneIndex: number
  goToScene: (index: number) => void
  markSceneComplete: () => Promise<void>
  recordAttempt: (input: {
    sceneId: string
    bugId: string
    selectedArea: Area
    isCorrect: boolean
    screenshot: string
    description?: string
  }) => Promise<{ attempt: BugAttempt; report?: BugReport; pointsEarned: number }>
  instructorUnlocked: boolean
  unlockInstructor: (pin: string) => Promise<boolean>
  lockInstructor: () => void
  reviewSceneId: string | null
  setReviewSceneId: (id: string | null) => void
  selectedInstructorSessionId: string | null
  setSelectedInstructorSessionId: (id: string | null) => void
}

const GameContext = createContext<GameContextValue | null>(null)

function loadInitialSession(): GameSession | null {
  const id = getActiveSessionId()
  if (!id) return null
  return getSession(id) ?? null
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<AppView>(() =>
    loadInitialSession() ? 'game' : 'welcome',
  )
  const [session, setSession] = useState<GameSession | null>(loadInitialSession)
  const [sessions, setSessions] = useState<GameSession[]>(getAllSessionsLocal)
  const [instructorUnlocked, setInstructorUnlocked] = useState(false)
  const [reviewSceneId, setReviewSceneId] = useState<string | null>(null)
  const [selectedInstructorSessionId, setSelectedInstructorSessionId] =
    useState<string | null>(null)
  const sessionRef = useRef(session)

  const persist = useCallback(async (next: GameSession) => {
    sessionRef.current = next
    const saved = await saveSession(next)
    sessionRef.current = saved
    setSession(saved)
    setSessions(getAllSessionsLocal())
  }, [])

  const refreshSessions = useCallback(async () => {
    const list = await getAllSessions()
    setSessions(list)
  }, [])

  useEffect(() => {
    void refreshSessions()
  }, [refreshSessions])

  useEffect(() => {
    return onCloudSessionSynced((synced) => {
      const base =
        sessionRef.current && sessionRef.current.id === synced.id
          ? sessionRef.current
          : null
      if (!base) return
      const next = applyUploadedUrls(base, synced)
      sessionRef.current = next
      setSession(next)
      setSessions(getAllSessionsLocal())
    })
  }, [])

  const startGame = useCallback(
    async (childName: string) => {
      const trimmed = childName.trim()
      if (await childNameExists(trimmed)) {
        return {
          ok: false as const,
          error:
            'Există deja date pentru acest prenume. Folosește un alt nume (de exemplu prenumele + inițiala).',
        }
      }

      const next: GameSession = {
        id: uid('session'),
        childName: trimmed,
        startedAt: new Date().toISOString(),
        currentSceneIndex: 0,
        score: 0,
        bugReports: [],
        attempts: {},
        scenesCompleted: [],
      }
      setActiveSessionId(next.id)
      await persist(next)
      setView('instructions')
      return { ok: true as const }
    },
    [persist],
  )

  const resetGame = useCallback(() => {
    setActiveSessionId(null)
    sessionRef.current = null
    setSession(null)
    setView('welcome')
  }, [])

  const resumeSession = useCallback((id: string) => {
    const found = getSession(id)
    if (!found) return
    setActiveSessionId(id)
    sessionRef.current = found
    setSession(found)
    setView(found.completedAt ? 'journal' : 'game')
  }, [])

  /** Load the MaxPoints demo run and browse the full game with scenes marked. */
  const enterAsDemoPlayer = useCallback(async () => {
    await refreshSessions()
    const target = DEMO_PLAYER_NAME.trim().toLowerCase()
    const found = getAllSessionsLocal().find(
      (s) => s.childName.trim().toLowerCase() === target,
    )
    if (!found) {
      return {
        ok: false as const,
        error: `Nu există sesiunea „${DEMO_PLAYER_NAME}". Verifică lista sau reîncarcă.`,
      }
    }

    const next: GameSession = {
      ...found,
      currentSceneIndex: 0,
      // Ensure completion UI (incl. certificate) works even if cloud row lacks completedAt.
      completedAt:
        found.completedAt ??
        (isSessionFinished(found) ? new Date().toISOString() : undefined),
    }
    setActiveSessionId(next.id)
    await persist(next)
    setView('certificate')
    return { ok: true as const }
  }, [persist, refreshSessions])

  const goToScene = useCallback(
    (index: number) => {
      const current = sessionRef.current
      if (!current) return
      if (!isSceneNavigable(current, index)) return
      if (current.currentSceneIndex === index) return
      void persist({ ...current, currentSceneIndex: index })
    },
    [persist],
  )

  const markSceneComplete = useCallback(async () => {
    if (!session) return
    const scene = SCENES[session.currentSceneIndex]
    if (!scene) return

    // Revisiting an already-finished scene: move forward without touching progress.
    if (session.scenesCompleted.includes(scene.id)) {
      const nextIndex = session.currentSceneIndex + 1
      if (nextIndex < SCENES.length && isSceneNavigable(session, nextIndex)) {
        await persist({ ...session, currentSceneIndex: nextIndex })
        return
      }
      if (isSessionFinished(session)) {
        setView('certificate')
        return
      }
      const frontier = getFrontierSceneIndex(session)
      if (frontier !== session.currentSceneIndex) {
        await persist({ ...session, currentSceneIndex: frontier })
      }
      return
    }

    const scenesCompleted = [...session.scenesCompleted, scene.id]
    const isLast = session.currentSceneIndex >= SCENES.length - 1
    if (isLast) {
      await persist({
        ...session,
        scenesCompleted,
        completedAt: new Date().toISOString(),
      })
      setView('certificate')
      return
    }

    await persist({
      ...session,
      scenesCompleted,
      currentSceneIndex: session.currentSceneIndex + 1,
    })
  }, [persist, session])

  const recordAttempt: GameContextValue['recordAttempt'] = useCallback(
    async (input) => {
      const current = sessionRef.current
      if (!current) {
        throw new Error('No active session')
      }

      const previous = current.attempts[input.bugId] ?? []
      const attemptNumber = previous.length + 1
      const attempt: BugAttempt = {
        id: uid('attempt'),
        selectedArea: input.selectedArea,
        isCorrect: input.isCorrect,
        timestamp: new Date().toISOString(),
        screenshot: input.screenshot,
        description: input.description,
      }

      let pointsEarned = 0
      let report: BugReport | undefined
      let score = current.score
      let bugReports = current.bugReports

      if (input.isCorrect && input.description) {
        pointsEarned = scoreForCorrectReport(attemptNumber)
        attempt.score = pointsEarned
        score += pointsEarned
        report = {
          id: uid('report'),
          sessionId: current.id,
          childName: current.childName,
          sceneId: input.sceneId,
          bugId: input.bugId,
          timestamp: attempt.timestamp,
          screenshot: input.screenshot,
          selectedArea: input.selectedArea,
          description: input.description,
          isCorrect: true,
          attemptNumber,
          score: pointsEarned,
        }
        bugReports = [...bugReports, report]
      }

      const next: GameSession = {
        ...current,
        score,
        bugReports,
        attempts: {
          ...current.attempts,
          [input.bugId]: [...previous, attempt],
        },
      }
      await persist(next)
      return { attempt, report, pointsEarned }
    },
    [persist],
  )

  const unlockInstructor = useCallback(
    async (pin: string) => {
      if (pin.trim() === INSTRUCTOR_PIN) {
        setInstructorUnlocked(true)
        await refreshSessions()
        return true
      }
      return false
    },
    [refreshSessions],
  )

  const lockInstructor = useCallback(() => {
    setInstructorUnlocked(false)
    setSelectedInstructorSessionId(null)
    setReviewSceneId(null)
  }, [])

  const value = useMemo<GameContextValue>(
    () => ({
      view,
      setView,
      session,
      sessions,
      refreshSessions,
      cloudEnabled: isSupabaseConfigured,
      startGame,
      resetGame,
      resumeSession,
      enterAsDemoPlayer,
      currentSceneIndex: session?.currentSceneIndex ?? 0,
      goToScene,
      markSceneComplete,
      recordAttempt,
      instructorUnlocked,
      unlockInstructor,
      lockInstructor,
      reviewSceneId,
      setReviewSceneId,
      selectedInstructorSessionId,
      setSelectedInstructorSessionId,
    }),
    [
      view,
      session,
      sessions,
      refreshSessions,
      startGame,
      resetGame,
      resumeSession,
      enterAsDemoPlayer,
      goToScene,
      markSceneComplete,
      recordAttempt,
      instructorUnlocked,
      unlockInstructor,
      lockInstructor,
      reviewSceneId,
      selectedInstructorSessionId,
    ],
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
