import type { ReactNode } from 'react'

type SheetProps = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export function Sheet({ open, title, onClose, children }: SheetProps) {
  if (!open) return null

  return (
    <div className="sheet-root">
      <button
        type="button"
        className="sheet-backdrop"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        className="sheet-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
      >
        <div className="sheet-handle" />
        <h2 id="sheet-title">{title}</h2>
        {children}
      </div>
    </div>
  )
}
