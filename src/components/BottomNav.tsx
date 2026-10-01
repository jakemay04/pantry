import type { TabId } from '../types'
import { IconClock, IconList, IconScan } from './Icons'

type BottomNavProps = {
  tab: TabId
  onChange: (tab: TabId) => void
  dark?: boolean
}

export function BottomNav({ tab, onChange, dark }: BottomNavProps) {
  return (
    <nav className={dark ? 'bottom-nav is-dark' : 'bottom-nav'} aria-label="Primary">
      <button
        type="button"
        className={tab === 'inventory' ? 'nav-item is-on' : 'nav-item'}
        onClick={() => onChange('inventory')}
      >
        <IconList />
        Inventory
      </button>
      <button
        type="button"
        className={tab === 'scan' ? 'nav-scan is-on' : 'nav-scan'}
        aria-label="Scan"
        onClick={() => onChange('scan')}
      >
        <IconScan />
      </button>
      <button
        type="button"
        className={tab === 'use-soon' ? 'nav-item is-on' : 'nav-item'}
        onClick={() => onChange('use-soon')}
      >
        <IconClock />
        Use soon
      </button>
    </nav>
  )
}
