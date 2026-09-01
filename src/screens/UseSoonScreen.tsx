import { useLiveQuery } from 'dexie-react-hooks'
import { adjustQty, db } from '../db'
import { groupForExpiry } from '../lib/expiry'
import { sortByExpiry } from '../lib/filters'
import { ItemCard } from '../components/ItemCard'

const GROUP_LABEL = {
  expired: 'Expired',
  today: 'Today',
  week: 'This week',
  later: 'Later',
} as const

const GROUP_ORDER = ['expired', 'today', 'week', 'later'] as const

export function UseSoonScreen() {
  const items = useLiveQuery(() => db.items.toArray())

  if (items === undefined) {
    return <div className="screen" />
  }

  const dated = sortByExpiry(items)
  const groups = GROUP_ORDER.map((id) => ({
    id,
    label: GROUP_LABEL[id],
    items: dated.filter((item) => groupForExpiry(item.expiryDate ?? '') === id),
  })).filter((group) => group.items.length > 0)

  return (
    <div className="screen">
      <header className="page-header">
        <p className="eyebrow">Sorted on this phone</p>
        <h1>Use soon</h1>
        <p className="lede">Expiry is calculated when you open this list — nothing is sent away.</p>
      </header>

      {groups.length === 0 ? (
        <div className="empty">
          <p>No dates yet.</p>
          <p className="muted">Add an expiry when you scan and it will show up here.</p>
        </div>
      ) : (
        groups.map((group) => (
          <section key={group.id} className="group">
            <h2 className="group-title">{group.label}</h2>
            <ul className="item-list">
              {group.items.map((item) => (
                <li key={item.id}>
                  <ItemCard item={item} onAdjust={adjustQty} />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  )
}
