import { describeExpiry } from '../lib/expiry'
import { LOCATION_LABEL } from '../lib/labels'
import type { InventoryItem } from '../types'
import { ExpiryPill } from './ExpiryPill'
import { IconMinus, IconPlus } from './Icons'

type ItemCardProps = {
  item: InventoryItem
  onAdjust: (id: string, delta: number) => void
}

export function ItemCard({ item, onAdjust }: ItemCardProps) {
  const expiry = describeExpiry(item.expiryDate)

  return (
    <article className="item-card">
      <div className={`item-thumb loc-${item.location}`}>
        {item.imageUrl ? (
          <img src={item.imageUrl} alt="" />
        ) : (
          <span>{item.name.slice(0, 1)}</span>
        )}
      </div>
      <div className="item-body">
        <h3>{item.name}</h3>
        <p>
          {LOCATION_LABEL[item.location]}
          {item.brand ? ` · ${item.brand}` : ''}
        </p>
        {expiry ? <ExpiryPill info={expiry} /> : null}
      </div>
      <div className="item-qty">
        <button
          type="button"
          className="qty-btn"
          aria-label={`Decrease ${item.name}`}
          onClick={() => onAdjust(item.id, -1)}
        >
          <IconMinus />
        </button>
        <span>{item.quantity}</span>
        <button
          type="button"
          className="qty-btn"
          aria-label={`Increase ${item.name}`}
          onClick={() => onAdjust(item.id, 1)}
        >
          <IconPlus />
        </button>
      </div>
    </article>
  )
}
