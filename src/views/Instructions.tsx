import { POINTS, SCENES } from '../constants'
import { PlayerShell } from '../components/PlayerShell'
import { useGame } from '../context/GameContext'

export function Instructions() {
  const { session, setView } = useGame()
  if (!session) return null

  const firstTryTotal =
    POINTS.find + POINTS.report + POINTS.firstTryBonus
  const retryTotal = POINTS.find + POINTS.report

  return (
    <PlayerShell>
      <div className="instructions-page">
      <div className="welcome-card instructions-card">
        <div className="welcome-card-body instructions-body">
          <div className="scene-eyebrow">Înainte de misiune</div>
          <h2>Bună, {session.childName}! 👋</h2>

          <div className="instructions-context">
            <div className="instructions-context-block">
              <strong>Locația</strong>
              <p>
                Insula Coralilor e un loc izolat din golf, cu plaje, pădure
                tropicală și un centru de salvare pentru animale. Furtuna a
                tulburat viața de pe insulă — unele animale au nevoie de
                îngrijire, iar echipa lucrează în mai multe zone: debarcader,
                plajă, pădure, golf și rezervație.
              </p>
            </div>
            <div className="instructions-context-block">
              <strong>Scopul misiunii</strong>
              <p>
                Ai venit să ajuți animalele afectate și să sprijini echipa de
                salvare pe parcursul zilei. Pe fiecare ecran vei primi
                informații despre ce se întâmplă — hărți, fișe, liste sau
                mesaje — dar nu tot ce vezi e corect. Trebuie să observi ce nu
                se potrivește, să marchezi problema și să o raportezi înainte
                să treci mai departe.
              </p>
            </div>
            <div className="instructions-context-block">
              <strong>Cum se calculează scorul</strong>
              <p>
                Primești puncte doar când găsești corect o problemă și o
                descrii. Pentru fiecare ecran: {POINTS.find} puncte pentru
                găsire, {POINTS.report} pentru raport — adică {retryTotal}{' '}
                puncte. Dacă o prinzi din prima încercare, primești un bonus de{' '}
                {POINTS.firstTryBonus} puncte ({firstTryTotal} în total).
                Încercările greșite nu scad din scor; poți încerca din nou până
                reușești. Scorul total apare sus, lângă progresul misiunii.
              </p>
            </div>
          </div>

          <div className="instructions-list">
            <div className="instructions-step">
              <span className="instructions-icon" aria-hidden>
                👀
              </span>
              <div>
                <strong>Citește și explorează</strong>
                <p>
                  Fiecare ecran are un obiectiv. Uită-te la texte, numere, hărți
                  și detalii — acolo se ascund indicii.
                </p>
              </div>
            </div>

            <div className="instructions-step">
              <span className="instructions-icon" aria-hidden>
                🐞
              </span>
              <div>
                <strong>Marchează problema</strong>
                <p>
                  Apasă „Am găsit o problemă”, mută cadrul peste zona greșită și
                  confirmă selecția.
                </p>
              </div>
            </div>

            <div className="instructions-step">
              <span className="instructions-icon" aria-hidden>
                ✍️
              </span>
              <div>
                <strong>Descrie ce ai văzut</strong>
                <p>
                  Spune cu propriile cuvinte ce nu e în regulă — de exemplu un
                  nume greșit sau o informație care nu se potrivește.
                </p>
              </div>
            </div>

            <div className="instructions-step">
              <span className="instructions-icon" aria-hidden>
                ➡️
              </span>
              <div>
                <strong>Continuă misiunea</strong>
                <p>
                  După ce raportezi corect, poți trece la următorul ecran. Sunt{' '}
                  {SCENES.length} etape până la final.
                </p>
              </div>
            </div>
          </div>

          <div className="instructions-note">
            <strong>Despre imaginile de pe ecran</strong>
            <p>
              Ilustrațiile principale sunt în general orientative — te ajută să
              înțelegi locul, dar nu trebuie să fie identice cu textele sau
              detaliile. Problemele le găsești comparând informațiile din
              ecran, nu doar privind imaginea.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-success"
            style={{ width: '100%' }}
            onClick={() => setView('game')}
          >
            Începe misiunea 🐞
          </button>
        </div>
      </div>
      </div>
    </PlayerShell>
  )
}
