import { db } from '../db'
import type { CachedProduct } from '../types'

const USER_AGENT = 'Pantry/0.1 (https://github.com/jakemay04/pantry)'
const CACHE_MS = 1000 * 60 * 60 * 24 * 30

export async function lookupProduct(
  barcode: string,
): Promise<CachedProduct | null> {
  const cached = await db.products.get(barcode)
  if (cached && Date.now() - cached.fetchedAt < CACHE_MS) {
    return cached.missing ? null : cached
  }

  const url = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(
    barcode,
  )}?fields=product_name,brands,image_url,quantity`

  try {
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), 8000)
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': USER_AGENT,
      },
    })
    window.clearTimeout(timer)

    if (!response.ok) {
      return cached && !cached.missing ? cached : null
    }

    const data: {
      status?: number
      product?: {
        product_name?: string
        brands?: string
        image_url?: string
        quantity?: string
      }
    } = await response.json()

    if (data.status !== 1 || !data.product) {
      await db.products.put({
        barcode,
        name: '',
        missing: true,
        fetchedAt: Date.now(),
      })
      return null
    }

    const product: CachedProduct = {
      barcode,
      name: (data.product.product_name ?? '').trim(),
      brand: (data.product.brands ?? '').split(',')[0]?.trim() || undefined,
      imageUrl: data.product.image_url || undefined,
      quantityLabel: data.product.quantity || undefined,
      fetchedAt: Date.now(),
    }
    await db.products.put(product)
    return product.name ? product : { ...product, name: '' }
  } catch {
    return cached && !cached.missing ? cached : null
  }
}
