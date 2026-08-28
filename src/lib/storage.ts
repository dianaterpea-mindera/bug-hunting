import type { BugAttempt, BugReport, GameSession } from '../types'
import { ACTIVE_SESSION_KEY, STORAGE_KEY } from '../constants'
import { isSupabaseConfigured, supabase } from './supabase'

type Store = {
  sessions: GameSession[]
}

type SessionRow = {
  id: string
  child_name: string
  started_at: string
  completed_at: string | null
  current_scene_index: number
  score: number
  bug_reports: BugReport[]
  attempts: Record<string, BugAttempt[]>
  scenes_completed: string[]
  updated_at?: string
}

function readStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { sessions: [] }
    const parsed = JSON.parse(raw) as Store
    return { sessions: parsed.sessions ?? [] }
  } catch {
    return { sessions: [] }
  }
}

function writeStore(store: Store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

function sortSessions(sessions: GameSession[]): GameSession[] {
  return [...sessions].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
  )
}

function normalizeChildName(name: string): string {
  return name.trim().toLowerCase()
}

function escapeIlike(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_')
}

function sessionHasChildName(session: GameSession, normalized: string): boolean {
  return normalizeChildName(session.childName) === normalized
}

function rowToSession(row: SessionRow): GameSession {
  return {
    id: row.id,
    childName: row.child_name,
    startedAt: row.started_at,
    completedAt: row.completed_at ?? undefined,
    currentSceneIndex: row.current_scene_index,
    score: row.score,
    bugReports: row.bug_reports ?? [],
    attempts: row.attempts ?? {},
    scenesCompleted: row.scenes_completed ?? [],
  }
}

function sessionToRow(session: GameSession): SessionRow {
  return {
    id: session.id,
    child_name: session.childName,
    started_at: session.startedAt,
    completed_at: session.completedAt ?? null,
    current_scene_index: session.currentSceneIndex,
    score: session.score,
    bug_reports: session.bugReports,
    attempts: session.attempts,
    scenes_completed: session.scenesCompleted,
    updated_at: new Date().toISOString(),
  }
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob | null> {
  try {
    const res = await fetch(dataUrl)
    return await res.blob()
  } catch {
    return null
  }
}

async function uploadDataUrl(
  sessionId: string,
  pathKey: string,
  dataUrl: string,
): Promise<string> {
  if (!supabase || !dataUrl.startsWith('data:')) return dataUrl

  const blob = await dataUrlToBlob(dataUrl)
  if (!blob) return dataUrl

  const ext = blob.type.includes('png') ? 'png' : 'jpg'
  const path = `${sessionId}/${pathKey}.${ext}`

  const { error } = await supabase.storage
    .from('evidence')
    .upload(path, blob, { upsert: true, contentType: blob.type })

  if (error) {
    console.warn('Screenshot upload failed, keeping data URL', error.message)
    return dataUrl
  }

  const { data } = supabase.storage.from('evidence').getPublicUrl(path)
  return data.publicUrl
}

async function uploadSessionScreenshots(
  session: GameSession,
): Promise<GameSession> {
  if (!supabase) return session

  const bugReports = await Promise.all(
    session.bugReports.map(async (report) => {
      const raw =
        report.screenshot || report.screenshotAfter || report.screenshotBefore
      if (!raw) return report
      const screenshot = await uploadDataUrl(
        session.id,
        `${report.id}`,
        raw,
      )
      return { ...report, screenshot }
    }),
  )

  const attempts: Record<string, BugAttempt[]> = {}
  for (const [bugId, list] of Object.entries(session.attempts)) {
    attempts[bugId] = await Promise.all(
      list.map(async (attempt) => {
        const raw =
          attempt.screenshot ||
          attempt.screenshotAfter ||
          attempt.screenshotBefore
        if (!raw) return attempt
        const screenshot = await uploadDataUrl(
          session.id,
          `${attempt.id}`,
          raw,
        )
        return { ...attempt, screenshot }
      }),
    )
  }

  return { ...session, bugReports, attempts }
}

function saveLocal(session: GameSession) {
  const store = readStore()
  const idx = store.sessions.findIndex((s) => s.id === session.id)
  if (idx >= 0) store.sessions[idx] = session
  else store.sessions.push(session)
  writeStore(store)
}

function mergeLocalWithRemote(remote: GameSession[]): GameSession[] {
  const byId = new Map<string, GameSession>()
  for (const s of readStore().sessions) byId.set(s.id, s)
  for (const s of remote) byId.set(s.id, s)
  const merged = sortSessions([...byId.values()])
  writeStore({ sessions: merged })
  return merged
}

/** Sync read from local cache (instant UI). */
export function getAllSessionsLocal(): GameSession[] {
  return sortSessions(readStore().sessions)
}

export function getSession(id: string): GameSession | undefined {
  return readStore().sessions.find((s) => s.id === id)
}

/** Fetch all sessions from Supabase (falls back to local). */
export async function getAllSessions(): Promise<GameSession[]> {
  if (!supabase) return getAllSessionsLocal()

  const { data, error } = await supabase
    .from('game_sessions')
    .select('*')
    .order('started_at', { ascending: false })

  if (error || !data) {
    console.warn('Supabase fetch failed, using local cache', error?.message)
    return getAllSessionsLocal()
  }

  return mergeLocalWithRemote(data.map((row) => rowToSession(row as SessionRow)))
}

/** True if a session already exists for this participant name (case-insensitive). */
export async function childNameExists(childName: string): Promise<boolean> {
  const normalized = normalizeChildName(childName)
  if (!normalized) return false

  const localHit = getAllSessionsLocal().some((s) =>
    sessionHasChildName(s, normalized),
  )
  if (localHit) return true
  if (!supabase) return false

  const { data, error } = await supabase
    .from('game_sessions')
    .select('id')
    .ilike('child_name', escapeIlike(childName.trim()))
    .limit(1)

  if (error) {
    console.warn('Name uniqueness check failed', error.message)
    return false
  }

  return (data?.length ?? 0) > 0
}

/** Patch cloud URLs onto the current session without dropping newer local attempts. */
export function applyUploadedUrls(
  current: GameSession,
  uploaded: GameSession,
): GameSession {
  const reportUrls = new Map(
    uploaded.bugReports.map((r) => [r.id, r.screenshot]),
  )
  const attemptUrls = new Map<string, string | undefined>()
  for (const list of Object.values(uploaded.attempts)) {
    for (const attempt of list) attemptUrls.set(attempt.id, attempt.screenshot)
  }

  function preferCloudUrl(local?: string, cloud?: string) {
    if (cloud && !cloud.startsWith('data:')) return cloud
    return local || cloud
  }

  return {
    ...current,
    bugReports: current.bugReports.map((r) => ({
      ...r,
      screenshot:
        preferCloudUrl(r.screenshot, reportUrls.get(r.id)) ?? r.screenshot,
    })),
    attempts: Object.fromEntries(
      Object.entries(current.attempts).map(([bugId, list]) => [
        bugId,
        list.map((attempt) => ({
          ...attempt,
          screenshot: preferCloudUrl(
            attempt.screenshot,
            attemptUrls.get(attempt.id),
          ),
        })),
      ]),
    ),
  }
}

let cloudQueue: Promise<void> = Promise.resolve()
const syncListeners = new Set<(session: GameSession) => void>()

export function onCloudSessionSynced(
  listener: (session: GameSession) => void,
): () => void {
  syncListeners.add(listener)
  return () => {
    syncListeners.delete(listener)
  }
}

async function syncSessionToCloud(sessionId: string) {
  if (!supabase) return
  const latest = getSession(sessionId)
  if (!latest) return

  const withUrls = await uploadSessionScreenshots(latest)
  const current = getSession(sessionId) ?? withUrls
  const merged = applyUploadedUrls(current, withUrls)
  saveLocal(merged)

  const { error } = await supabase
    .from('game_sessions')
    .upsert(sessionToRow(merged), { onConflict: 'id' })

  if (error) {
    console.warn('Supabase save failed', error.message)
  }

  for (const listener of syncListeners) listener(merged)
}

function scheduleCloudSync(sessionId: string) {
  if (!supabase) return
  cloudQueue = cloudQueue
    .then(() => syncSessionToCloud(sessionId))
    .catch((err) => {
      console.warn('Supabase save error', err)
    })
}

/** Local write is immediate; cloud upload is queued so the UI never waits on it. */
export async function saveSession(session: GameSession): Promise<GameSession> {
  saveLocal(session)
  scheduleCloudSync(session.id)
  return session
}

export async function deleteSession(id: string): Promise<void> {
  const store = readStore()
  store.sessions = store.sessions.filter((s) => s.id !== id)
  writeStore(store)
  if (localStorage.getItem(ACTIVE_SESSION_KEY) === id) {
    localStorage.removeItem(ACTIVE_SESSION_KEY)
  }

  if (!supabase) return

  const { error } = await supabase.from('game_sessions').delete().eq('id', id)
  if (error) console.warn('Supabase delete failed', error.message)

  try {
    const { data: files } = await supabase.storage.from('evidence').list(id)
    if (files?.length) {
      await supabase.storage
        .from('evidence')
        .remove(files.map((f) => `${id}/${f.name}`))
    }
  } catch (err) {
    console.warn('Evidence cleanup failed', err)
  }
}

export function setActiveSessionId(id: string | null) {
  if (id) localStorage.setItem(ACTIVE_SESSION_KEY, id)
  else localStorage.removeItem(ACTIVE_SESSION_KEY)
}

export function getActiveSessionId(): string | null {
  return localStorage.getItem(ACTIVE_SESSION_KEY)
}

export async function clearAllData(): Promise<void> {
  const ids = readStore().sessions.map((s) => s.id)
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(ACTIVE_SESSION_KEY)

  if (!supabase || ids.length === 0) return

  const { error } = await supabase.from('game_sessions').delete().in('id', ids)
  if (error) console.warn('Supabase clear failed', error.message)

  for (const id of ids) {
    try {
      const { data: files } = await supabase.storage.from('evidence').list(id)
      if (files?.length) {
        await supabase.storage
          .from('evidence')
          .remove(files.map((f) => `${id}/${f.name}`))
      }
    } catch (err) {
      console.warn('Evidence cleanup failed', err)
    }
  }
}

export { isSupabaseConfigured }
