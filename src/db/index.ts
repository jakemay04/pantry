import Dexie, { type EntityTable } from 'dexie'
import type { CachedProduct, InventoryItem, ItemDraft } from '../types'
import { seedItems } from './seed'

type MetaRow = { key: string; value: unknown }

class PantryDB extends Dexie {
  items!: EntityTable<InventoryItem, 'id'>
  products!: EntityTable<CachedProduct, 'barcode'>
  meta!: EntityTable<MetaRow, 'key'>

  constructor() {
    super('pantry')
    this.version(1).stores({
      items: 'id, barcode, location, expiryDate, name, updatedAt',
      products: 'barcode, fetchedAt',
      meta: 'key',
    })
  }
}

export const db = new PantryDB()

db.on('ready', async () => {
  const seeded = await db.meta.get('seeded')
  if (seeded) return
  await db.items.bulkAdd(seedItems())
  await db.meta.put({ key: 'seeded', value: true })
})

export async function findByBarcode(
  barcode: string,
): Promise<InventoryItem | undefined> {
  return db.items.where('barcode').equals(barcode).first()
}

export async function saveDraft(draft: ItemDraft): Promise<void> {
  const now = Date.now()
  const quantity = Math.max(1, Math.round(draft.quantity))
  const name = draft.name.trim()
  if (!name) return

  if (draft.existingId) {
    await db.items.update(draft.existingId, {
      name,
      quantity,
      location: draft.location,
      expiryDate: draft.expiryDate,
      barcode: draft.barcode,
      imageUrl: draft.imageUrl,
      brand: draft.brand,
      updatedAt: now,
    })
    return
  }

  if (draft.barcode) {
    const existing = await findByBarcode(draft.barcode)
    if (existing) {
      await db.items.update(existing.id, {
        name,
        quantity,
        location: draft.location,
        expiryDate: draft.expiryDate,
        imageUrl: draft.imageUrl ?? existing.imageUrl,
        brand: draft.brand ?? existing.brand,
        updatedAt: now,
      })
      return
    }
  }

  await db.items.add({
    id: crypto.randomUUID(),
    name,
    quantity,
    location: draft.location,
    expiryDate: draft.expiryDate,
    barcode: draft.barcode,
    imageUrl: draft.imageUrl,
    brand: draft.brand,
    createdAt: now,
    updatedAt: now,
  })
}

export async function adjustQty(id: string, delta: number): Promise<void> {
  await db.transaction('rw', db.items, async () => {
    const item = await db.items.get(id)
    if (!item) return
    const quantity = item.quantity + delta
    if (quantity <= 0) {
      await db.items.delete(id)
      return
    }
    await db.items.update(id, { quantity, updatedAt: Date.now() })
  })
}
