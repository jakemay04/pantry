import { LOCATION_LABEL } from '../lib/labels'
import { LOCATIONS, type LocationId } from '../types'

type LocationPickerProps = {
  value: LocationId
  onChange: (value: LocationId) => void
}

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  return (
    <div className="segmented" role="radiogroup" aria-label="Location">
      {LOCATIONS.map((location) => (
        <button
          key={location}
          type="button"
          role="radio"
          aria-checked={value === location}
          className={value === location ? 'segmented-btn is-on' : 'segmented-btn'}
          onClick={() => onChange(location)}
        >
          {LOCATION_LABEL[location]}
        </button>
      ))}
    </div>
  )
}
