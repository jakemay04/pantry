import { IconMinus, IconPlus } from './Icons'

type QuantityStepperProps = {
  value: number
  min?: number
  onChange: (value: number) => void
}

export function QuantityStepper({
  value,
  min = 1,
  onChange,
}: QuantityStepperProps) {
  return (
    <div className="stepper">
      <button
        type="button"
        className="stepper-btn"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <IconMinus />
      </button>
      <span className="stepper-value">{value}</span>
      <button
        type="button"
        className="stepper-btn"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
      >
        <IconPlus />
      </button>
    </div>
  )
}
