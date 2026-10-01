import { addDaysISO } from '../lib/dates'
import type { ItemDraft } from '../types'
import { LocationPicker } from './LocationPicker'
import { QuantityStepper } from './QuantityStepper'
import { Sheet } from './Sheet'

type ConfirmSheetProps = {
  draft: ItemDraft | null
  lookingUp: boolean
  onChange: (draft: ItemDraft) => void
  onClose: () => void
  onSave: () => void
}

const PRESETS = [
  { label: '3 days', days: 3 },
  { label: '1 week', days: 7 },
  { label: '2 weeks', days: 14 },
]

export function ConfirmSheet({
  draft,
  lookingUp,
  onChange,
  onClose,
  onSave,
}: ConfirmSheetProps) {
  const open = draft !== null
  const canSave = Boolean(draft?.name.trim()) && !lookingUp
  const title = lookingUp
    ? 'Looking up product'
    : draft?.existingId
      ? 'Update item'
      : 'Add to pantry'

  return (
    <Sheet open={open} title={title} onClose={onClose}>
      {lookingUp || !draft ? (
        <p className="muted lookup-status">Checking Open Food Facts…</p>
      ) : (
        <form
          className="confirm-form"
          onSubmit={(event) => {
            event.preventDefault()
            if (canSave) onSave()
          }}
        >
          {draft.imageUrl ? (
            <img className="confirm-image" src={draft.imageUrl} alt="" />
          ) : null}
          {draft.barcode ? (
            <p className="barcode-chip">{draft.barcode}</p>
          ) : (
            <p className="muted">No barcode · type a name for produce or leftovers.</p>
          )}
          <label className="field">
            <span>Name</span>
            <input
              autoFocus
              value={draft.name}
              placeholder="e.g. Ripe bananas"
              onChange={(event) => onChange({ ...draft, name: event.target.value })}
            />
          </label>
          <div className="field">
            <span>Quantity</span>
            <QuantityStepper
              value={draft.quantity}
              onChange={(quantity) => onChange({ ...draft, quantity })}
            />
          </div>
          <div className="field">
            <span>Location</span>
            <LocationPicker
              value={draft.location}
              onChange={(location) => onChange({ ...draft, location })}
            />
          </div>
          <label className="field">
            <span>Expiry (optional)</span>
            <input
              type="date"
              value={draft.expiryDate ?? ''}
              onChange={(event) =>
                onChange({
                  ...draft,
                  expiryDate: event.target.value || undefined,
                })
              }
            />
          </label>
          <div className="preset-row">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className="chip"
                onClick={() =>
                  onChange({ ...draft, expiryDate: addDaysISO(preset.days) })
                }
              >
                {preset.label}
              </button>
            ))}
            <button
              type="button"
              className="chip"
              onClick={() => onChange({ ...draft, expiryDate: undefined })}
            >
              None
            </button>
          </div>
          <button type="submit" className="primary-btn" disabled={!canSave}>
            {draft.existingId ? 'Save changes' : 'Add to pantry'}
          </button>
        </form>
      )}
    </Sheet>
  )
}
