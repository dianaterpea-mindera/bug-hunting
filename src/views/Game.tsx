import { PlayerShell } from '../components/PlayerShell'
import { useGame } from '../context/GameContext'
import { SCENE_COMPONENTS } from '../scenes'

export function Game() {
  const { currentSceneIndex, session } = useGame()
  if (!session) return null

  const Scene = SCENE_COMPONENTS[currentSceneIndex]
  if (!Scene) return null

  return (
    <PlayerShell>
      <Scene key={SCENES_KEY(currentSceneIndex)} />
    </PlayerShell>
  )
}

function SCENES_KEY(index: number) {
  return `scene-${index}`
}
