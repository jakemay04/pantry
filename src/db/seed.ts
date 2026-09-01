import { addDaysISO } from '../lib/dates'
import type { InventoryItem } from '../types'

export function seedItems(now = Date.now()): InventoryItem[] {
  const stamp = (offset: number) => now - offset

  return [
    {
      id: 'seed-milk',
      name: 'Organic whole milk',
      brand: 'Straus',
      quantity: 1,
      location: 'fridge',
      expiryDate: addDaysISO(2),
      createdAt: stamp(86_400_000),
      updatedAt: stamp(86_400_000),
    },
    {
      id: 'seed-yogurt',
      name: 'Plain Greek yogurt',
      brand: 'Fage',
      quantity: 2,
      location: 'fridge',
      expiryDate: addDaysISO(1),
      createdAt: stamp(80_000_000),
      updatedAt: stamp(80_000_000),
    },
    {
      id: 'seed-spinach',
      name: 'Baby spinach',
      quantity: 1,
      location: 'fridge',
      expiryDate: addDaysISO(0),
      createdAt: stamp(20_000_000),
      updatedAt: stamp(20_000_000),
    },
    {
      id: 'seed-rice',
      name: 'Leftover fried rice',
      quantity: 1,
      location: 'fridge',
      expiryDate: addDaysISO(1),
      createdAt: stamp(12_000_000),
      updatedAt: stamp(12_000_000),
    },
    {
      id: 'seed-eggs',
      name: 'Large eggs',
      quantity: 12,
      location: 'fridge',
      expiryDate: addDaysISO(12),
      createdAt: stamp(200_000_000),
      updatedAt: stamp(200_000_000),
    },
    {
      id: 'seed-bread',
      name: 'Sourdough loaf',
      quantity: 1,
      location: 'pantry',
      expiryDate: addDaysISO(3),
      createdAt: stamp(40_000_000),
      updatedAt: stamp(40_000_000),
    },
    {
      id: 'seed-oil',
      name: 'Extra virgin olive oil',
      brand: 'California Olive Ranch',
      quantity: 1,
      location: 'pantry',
      expiryDate: addDaysISO(180),
      createdAt: stamp(400_000_000),
      updatedAt: stamp(400_000_000),
    },
    {
      id: 'seed-berries',
      name: 'Frozen wild blueberries',
      quantity: 1,
      location: 'freezer',
      expiryDate: addDaysISO(90),
      createdAt: stamp(300_000_000),
      updatedAt: stamp(300_000_000),
    },
    {
      id: 'seed-chicken',
      name: 'Chicken thighs',
      quantity: 2,
      location: 'freezer',
      expiryDate: addDaysISO(21),
      createdAt: stamp(50_000_000),
      updatedAt: stamp(50_000_000),
    },
  ]
}
