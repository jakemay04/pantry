import type { LocationId } from '../types'

export const LOCATION_LABEL: Record<LocationId, string> = {
  fridge: 'Fridge',
  freezer: 'Freezer',
  pantry: 'Pantry',
}

export const FILTER_LABEL = {
  all: 'All',
  fridge: 'Fridge',
  freezer: 'Freezer',
  pantry: 'Pantry',
  expiring: 'Expiring',
} as const
