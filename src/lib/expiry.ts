import { diffDays, formatShort, localISODate } from './dates'

export type ExpiryTone = 'expired' | 'today' | 'soon' | 'week' | 'later'

export type ExpiryInfo = {
  label: string
  tone: ExpiryTone
  days: number
}

export function describeExpiry(
  isoDate?: string,
  today = localISODate(),
): ExpiryInfo | null {
  if (!isoDate) return null
  const days = diffDays(isoDate, today)
  if (days < 0) {
    const n = -days
    return {
      label: n === 1 ? 'Expired yesterday' : `Expired ${n}d ago`,
      tone: 'expired',
      days,
    }
  }
  if (days === 0) return { label: 'Expires today', tone: 'today', days }
  if (days === 1) return { label: 'Tomorrow', tone: 'soon', days }
  if (days <= 3) return { label: `${days} days left`, tone: 'soon', days }
  if (days <= 7) return { label: `${days} days left`, tone: 'week', days }
  return { label: formatShort(isoDate), tone: 'later', days }
}

export function isExpiringSoon(isoDate?: string, today = localISODate()): boolean {
  if (!isoDate) return false
  return diffDays(isoDate, today) <= 3
}

export type UseSoonGroup = 'expired' | 'today' | 'week' | 'later'

export function groupForExpiry(
  isoDate: string,
  today = localISODate(),
): UseSoonGroup {
  const days = diffDays(isoDate, today)
  if (days < 0) return 'expired'
  if (days === 0) return 'today'
  if (days <= 7) return 'week'
  return 'later'
}
