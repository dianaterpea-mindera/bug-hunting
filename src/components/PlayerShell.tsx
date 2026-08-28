import { type ReactNode } from 'react'
import { ProgressTrack, TopBar } from './TopBar'

export function PlayerShell({ children }: { children: ReactNode }) {
  return (
    <div className="shell">
      <TopBar />
      <ProgressTrack />
      {children}
    </div>
  )
}
