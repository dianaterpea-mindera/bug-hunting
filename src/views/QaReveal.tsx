import { ResetGameButton } from '../components/ResetGameButton'
import { useGame } from '../context/GameContext'

const ROWS = [
  ['Ați observat că ceva nu e în regulă', 'Bug detection (detectarea bug-urilor)'],
  ['Ați verificat comportamentul', 'Testing (testare)'],
  ['Ați selectat zona problemei', 'Bug localization (localizarea bug-ului)'],
  ['Ați raportat problema', 'Bug reporting (raportarea bug-ului)'],
  ['Ați făcut screenshot', 'Test evidence (dovezi de test)'],
  ['Ați spus ce ar fi trebuit să se întâmple', 'Expected result (rezultat așteptat)'],
  ['Ați văzut ce s-a întâmplat de fapt', 'Actual result (rezultat real)'],
  ['Ați verificat dacă informațiile sunt corecte', 'Validation (validare)'],
]

export function QaReveal() {
  const { setView, instructorUnlocked } = useGame()

  return (
    <div className="shell">
      <div className="scene-panel" style={{ paddingBottom: '1.75rem' }}>
        <h2 className="scene-title">🐞 Știți ce ați făcut în acest joc?</h2>
        <p className="scene-lead" style={{ fontSize: '1.2rem' }}>
          Ați făcut <strong>software testing (QA)</strong>.
        </p>
        <p>
          Și există oameni al căror job este exact să facă asta înainte ca o aplicație să ajungă
          la utilizatori.
        </p>
        <p className="muted">
          Un <strong>bug</strong> e o greșeală din program. Cuvântul vine de la un gândac găsit
          într-un computer vechi — de atunci, așa numim orice problemă în software.
        </p>

        <div className="table-wrap" style={{ marginTop: '1.25rem' }}>
          <table className="qa-table">
            <thead>
              <tr>
                <th>Ce ați făcut în joc</th>
                <th>Termenul din QA</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([game, qa]) => (
                <tr key={qa}>
                  <td>{game}</td>
                  <td>
                    <strong>{qa}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="scene-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setView(instructorUnlocked ? 'instructor' : 'journal')}
          >
            ← Înapoi
          </button>
          {instructorUnlocked ? (
            <button type="button" className="btn btn-success" onClick={() => setView('welcome')}>
              La ecranul de start
            </button>
          ) : (
            <ResetGameButton className="btn btn-success" label="La ecranul de start" />
          )}
        </div>
      </div>
    </div>
  )
}
