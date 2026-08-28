import type { SceneMeta } from './types'

/** Nume afișat utilizatorilor. Proiectul tehnic (git/local) rămâne bug-hunting. */
export const APP_NAME = 'Insula după furtună'
export const INSTRUCTOR_PIN = '2468'
export const STORAGE_KEY = 'bug-hunting-data'
export const ACTIVE_SESSION_KEY = 'bug-hunting-active'

export const INSTRUCTIONS_STEP = {
  id: 'instructions',
  emoji: '📋',
  title: 'Instrucțiuni',
} as const

export const POINTS = {
  find: 100,
  report: 50,
  firstTryBonus: 25,
} as const

/** Padding around the bug zone so kids don’t need pixel-perfect edges. */
export const TOLERANCE_PX = 28

/** At least this fraction of the (padded) bug zone must sit inside the selection. */
export const MIN_ZONE_COVERAGE = 0.45

/**
 * Fixed frame the child places over the bug.
 * Sized for the largest targets (animal-card / certificate).
 */
export const SELECTION_FRAME_WIDTH_PX = 480
export const SELECTION_FRAME_HEIGHT_PX = 360

export const SCENES: SceneMeta[] = [
  {
    id: 'scene-01',
    bugId: 'bug-01',
    number: 1,
    emoji: '🚤',
    title: 'Sosirea pe insulă',
    eyebrow: 'Începutul misiunii',
  },
  {
    id: 'scene-02',
    bugId: 'bug-02',
    number: 2,
    emoji: '🗺️',
    title: 'Harta insulei',
    eyebrow: 'Orientare',
  },
  {
    id: 'scene-03',
    bugId: 'bug-03',
    number: 3,
    emoji: '🐢',
    title: 'Plaja țestoaselor',
    eyebrow: 'Salvare',
  },
  {
    id: 'scene-04',
    bugId: 'bug-04',
    number: 4,
    emoji: '🎒',
    title: 'Rucsacul de salvare',
    eyebrow: 'Echipament',
  },
  {
    id: 'scene-05',
    bugId: 'bug-05',
    number: 5,
    emoji: '🌴',
    title: 'Pădurea',
    eyebrow: 'Căutare',
  },
  {
    id: 'scene-06',
    bugId: 'bug-06',
    number: 6,
    emoji: '🦊',
    title: 'Vizuina vulpii',
    eyebrow: 'Îngrijire',
  },
  {
    id: 'scene-07',
    bugId: 'bug-07',
    number: 7,
    emoji: '🌊',
    title: 'Golful',
    eyebrow: 'Urgență',
  },
  {
    id: 'scene-08',
    bugId: 'bug-08',
    number: 8,
    emoji: '🏥',
    title: 'Centrul de salvare',
    eyebrow: 'Îngrijire',
  },
  {
    id: 'scene-09',
    bugId: 'bug-09',
    number: 9,
    emoji: '🦜',
    title: 'Pregătirea pentru eliberare',
    eyebrow: 'Verificare',
  },
  {
    id: 'scene-10',
    bugId: 'bug-10',
    number: 10,
    emoji: '🗿',
    title: 'Punctul de observație',
    eyebrow: 'Situația insulei',
  },
  {
    id: 'scene-11',
    bugId: 'bug-11',
    number: 11,
    emoji: '🌳',
    title: 'Rezervația',
    eyebrow: 'Habitat',
  },
  {
    id: 'scene-12',
    bugId: 'bug-12',
    number: 12,
    emoji: '💚',
    title: 'Finalul misiunii',
    eyebrow: 'Eliberare',
  },
]
