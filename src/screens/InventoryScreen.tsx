import { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { adjustQty, db } from '../db'
import { filterItems } from '../lib/filters'
import { FILTER_LABEL } from '../lib/labels'
import { FILTERS, type FilterId } from '../types'
import { IconSearch } from '../components/Icons'
import { ItemCard } from '../components/ItemCard'

export function InventoryScreen() {
  const items = useLiveQuery(() => db.items.orderBy('name').toArray())
  const [query, setQuery] = useState('')
  const [chip, setChip] = useState<FilterId>('all')

  const visible = useMemo(
    () => filterItems(items ?? [], query, chip),
    [items, query, chip],
  )

  if (items === undefined) {
    return <div className="screen" />
  }

  return (
    <div className="screen">
      <header className="page-header">
        <p className="eyebrow">On this device</p>
        <h1>Pantry</h1>
        <p className="lede">
          {items.length} {items.length === 1 ? 'item' : 'items'} · never leaves this phone
        </p>
      </header>

      <label className="search">
        <IconSearch />
        <input
          type="search"
          placeholder="Search items"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      <div className="chips" role="tablist" aria-label="Filter">
        {FILTERS.map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={chip === id}
            className={chip === id ? 'chip is-on' : 'chip'}
            onClick={() => setChip(id)}
          >
            {FILTER_LABEL[id]}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="empty">
          <p>Nothing here yet.</p>
          <p className="muted">Scan a barcode or add produce from the Scan tab.</p>
        </div>
      ) : (
        <ul className="item-list">
          {visible.map((item) => (
            <li key={item.id}>
              <ItemCard item={item} onAdjust={adjustQty} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
