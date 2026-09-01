import { isExpiringSoon } from './expiry'
import type { FilterId, InventoryItem } from '../types'

export function filterItems(
  items: InventoryItem[],
  query: string,
  chip: FilterId,
): InventoryItem[] {
  const q = query.trim().toLowerCase()
  return items.filter((item) => {
    if (chip === 'expiring' && !isExpiringSoon(item.expiryDate)) return false
    if (chip === 'fridge' || chip === 'freezer' || chip === 'pantry') {
      if (item.location !== chip) return false
    }
    if (!q) return true
    const hay = `${item.name} ${item.brand ?? ''} ${item.location}`.toLowerCase()
    return hay.includes(q)
  })
}

export function sortByExpiry(items: InventoryItem[]): InventoryItem[] {
  return items
    .filter((item) => Boolean(item.expiryDate))
    .slice()
    .sort((a, b) => (a.expiryDate ?? '').localeCompare(b.expiryDate ?? ''))
}
