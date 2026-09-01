import type { ExpiryInfo } from '../lib/expiry'

export function ExpiryPill({ info }: { info: ExpiryInfo }) {
  return <span className={`pill pill-${info.tone}`}>{info.label}</span>
}
