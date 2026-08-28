import { useState } from 'react'
import { useGame } from '../context/GameContext'
import { ConfirmResetModal } from './ConfirmResetModal'

type Props = {
  label?: string
  className?: string
}

export function ResetGameButton({
  label = 'Reîncepe jocul',
  className = 'btn btn-ghost',
}: Props) {
  const { resetGame } = useGame()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {label}
      </button>
      {open && (
        <ConfirmResetModal
          onCancel={() => setOpen(false)}
          onConfirm={() => {
            setOpen(false)
            resetGame()
          }}
        />
      )}
    </>
  )
}
