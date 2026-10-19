import { useGame } from '../context/GameContext'
import { ResetGameButton } from './ResetGameButton'

type Props = {
  active?: 'journal' | 'certificate' | 'game'
}

export function FinalNav({ active }: Props) {
  const { session, setView, goToScene } = useGame()
  if (!session) return null

  return (
    <div className="final-nav" role="navigation" aria-label="Navigare finală">
      {active !== 'certificate' ? (
        <ResetGameButton label="Înapoi la start" className="btn btn-ghost" />
      ) : null}
      <button
        type="button"
        className={`btn btn-secondary${active === 'game' ? ' is-active' : ''}`}
        onClick={() => {
          goToScene(0)
          setView('game')
        }}
      >
        Vezi jocul
      </button>
      {active !== 'certificate' ? (
        <button
          type="button"
          className="btn btn-success"
          onClick={() => setView('certificate')}
        >
          Vezi certificat
        </button>
      ) : null}
    </div>
  )
}
