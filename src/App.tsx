import { useGame } from './context/GameContext'
import { Instructions } from './views/Instructions'
import { Welcome } from './views/Welcome'
import { Game } from './views/Game'
import { Journal } from './views/Journal'
import { Certificate } from './views/Certificate'
import { InstructorLogin } from './views/InstructorLogin'
import { InstructorDashboard } from './views/InstructorDashboard'
import { ReviewMode } from './views/ReviewMode'
import { QaReveal } from './views/QaReveal'
import { Presentation } from './views/Presentation'

export default function App() {
  const { view, instructorUnlocked } = useGame()

  if (
    (view === 'instructor' || view === 'review' || view === 'presentation') &&
    !instructorUnlocked
  ) {
    return <InstructorLogin />
  }

  switch (view) {
    case 'welcome':
      return <Welcome />
    case 'instructions':
      return <Instructions />
    case 'game':
      return <Game />
    case 'journal':
      return <Journal />
    case 'certificate':
      return <Certificate />
    case 'instructor-login':
      return <InstructorLogin />
    case 'instructor':
      return <InstructorDashboard />
    case 'review':
      return <ReviewMode />
    case 'qa-reveal':
      return <QaReveal />
    case 'presentation':
      return <Presentation />
    default:
      return <Welcome />
  }
}
