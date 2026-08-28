import { useState } from 'react'
import { APP_NAME } from '../constants'
import { useGame } from '../context/GameContext'

export function Welcome() {
  const { startGame, setView } = useGame()
  const [name, setName] = useState('')

  return (
    <div className="welcome">
      <div className="welcome-card">
        <div className="welcome-hero">
          <img src="/scene01-arrival.png" alt="Barca de salvare ajunge la Insula Coralilor" />
        </div>
        <div className="welcome-card-body">
          <div className="brand-mark">{APP_NAME}</div>
          <h2>Bun venit, salvatorule!</h2>
          <p className="welcome-sub">Spune-ne cum te cheamă și începe misiunea.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (name.trim().length < 2) return
              void startGame(name)
            }}
          >
            <div className="field">
              <label htmlFor="prenume">Prenume</label>
              <input
                id="prenume"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Andrei"
                autoFocus
                maxLength={24}
              />
            </div>
            <button
              type="submit"
              className="btn btn-success"
              style={{ width: '100%' }}
              disabled={name.trim().length < 2}
            >
              Continuă →
            </button>
          </form>
          <p className="welcome-foot">
            Ești instructor?{' '}
            <a
              href="#instructor"
              onClick={(e) => {
                e.preventDefault()
                setView('instructor-login')
              }}
            >
              Intră în panoul de instructor
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
