import { useState } from 'react'
import { BottomNav } from './components/BottomNav'
import { InventoryScreen } from './screens/InventoryScreen'
import { ScanScreen } from './screens/ScanScreen'
import { UseSoonScreen } from './screens/UseSoonScreen'
import type { TabId } from './types'

export default function App() {
  const [tab, setTab] = useState<TabId>('inventory')

  return (
    <div className="shell">
      <main className="main">
        {tab === 'inventory' ? <InventoryScreen /> : null}
        {tab === 'scan' ? <ScanScreen /> : null}
        {tab === 'use-soon' ? <UseSoonScreen /> : null}
      </main>
      <BottomNav tab={tab} onChange={setTab} dark={tab === 'scan'} />
    </div>
  )
}
