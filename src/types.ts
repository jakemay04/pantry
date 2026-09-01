export const LOCATIONS = ['fridge', 'freezer', 'pantry'] as const
export type LocationId = (typeof LOCATIONS)[number]

export const FILTERS = ['all', 'fridge', 'freezer', 'pantry', 'expiring'] as const
export type FilterId = (typeof FILTERS)[number]

export type InventoryItem = {
  id: string
  name: string
  quantity: number
  location: LocationId
  expiryDate?: string
  barcode?: string
  imageUrl?: string
  brand?: string
  createdAt: number
  updatedAt: number
}

export type CachedProduct = {
  barcode: string
  name: string
  brand?: string
  imageUrl?: string
  quantityLabel?: string
  missing?: boolean
  fetchedAt: number
}

export type ItemDraft = {
  existingId?: string
  barcode?: string
  name: string
  brand?: string
  imageUrl?: string
  quantity: number
  location: LocationId
  expiryDate?: string
}

export type TabId = 'inventory' | 'scan' | 'use-soon'
