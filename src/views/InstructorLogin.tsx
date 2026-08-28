import { useState } from 'react'
import { useGame } from '../context/GameContext'

export function InstructorLogin() {
  const { unlockInstructor, setView } = useGame()
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  return (
    <div className="welcome">
      <div className="welcome-card pin-form">
        <div className="welcome-card-body">
          <h2>👩‍🏫 Panou instructor</h2>
          <p className="welcome-sub">Introdu PIN-ul pentru a continua.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void unlockInstructor(pin).then((ok) => {
                if (ok) setView('instructor')
                else setError(true)
              })
            }}
          >
            <div className="field">
              <label htmlFor="pin">PIN</label>
              <input
                id="pin"
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value)
                  setError(false)
                }}
                autoFocus
              />
            </div>
            {error && <p className="field-error">PIN incorect.</p>}
            <button type="submit" className="btn btn-success" style={{ width: '100%' }}>
              Intră
            </button>
          </form>
          <p className="welcome-foot">
            <a
              href="#back"
              onClick={(e) => {
                e.preventDefault()
                setView('welcome')
              }}
            >
              ← Înapoi
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
