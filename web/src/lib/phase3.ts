/**
 * Phase 3 — local-first watchlist, digest, frozen prospect rules (slice 1+2).
 */
import type { ConfidenceBand, ScreeningCounty, ScreeningMeta } from '../types/screening'

export const WATCH_CAP = 25
export const STORAGE_KEY = 'gt_tx_phase3_v1'
export const RULES_VERSION = 'v0' as const
export const EXPORT_FORMAT = 'gt_tx_phase3_watchlist' as const
export const EXPORT_VERSION = 1 as const

export const PROSPECT_RULES_TEXT = [
  'Thermal mode = Stanford T@depth (model labeled)',
  'Confidence >= Medium (exclude Low / Unknown)',
  'Rank <= 40 within T@depth cohort',
  'No PAD-US Fee GAP1-2 friction',
  'TexNet caution -> badge + stable demote (not hard exclude)',
].join('\n')

export interface CountySnapshot {
  rank: number
  screeningScore: number
  confidence: ConfidenceBand | string
  padusFriction: boolean | null
  texnetCaution: boolean | null
}

export interface LastSeenSnapshot {
  publishId: string
  methodologyVersion: string
  seenAt: string
  counties: Record<string, CountySnapshot>
}

export interface WatchlistExport {
  format: typeof EXPORT_FORMAT
  version: typeof EXPORT_VERSION
  exportedAt: string
  watchlist: string[]
  lastSeen: LastSeenSnapshot | null
}

export interface Phase3Store {
  watchlist: string[]
  lastSeen: LastSeenSnapshot | null
}

export type DigestKind = 'rank' | 'score' | 'confidence' | 'flag' | 'new_watch'

/** Honest digest outcome — never claim "updates" with an empty list. */
export type DigestStatus = 'county_deltas' | 'vintage_only' | 'none'

export interface DigestItem {
  countyFips: string
  name: string
  kind: DigestKind
  summary: string
  before?: string
  after?: string
}

export interface DigestResult {
  /** True when status is county_deltas or vintage_only (badge may show). */
  hasUpdate: boolean
  status: DigestStatus
  items: DigestItem[]
  rulesVersion: typeof RULES_VERSION
}

export function emptyStore(): Phase3Store {
  return { watchlist: [], lastSeen: null }
}

/** Stable id: methodologyVersion + sorted layerVintages (matches stamp_phase3_meta / scorer). */
export function getPublishId(meta: ScreeningMeta): string {
  if (meta.publishId && meta.publishId.trim()) return meta.publishId.trim()
  const version = meta.methodologyVersion ?? ''
  const vintages = meta.layerVintages ?? {}
  const joined = Object.keys(vintages)
    .sort()
    .map((k) => `${k}=${vintages[k] ?? ''}`)
    .join('|')
  return joined ? `${version}|${joined}` : version
}

export function loadStore(): Phase3Store {
  if (typeof localStorage === 'undefined') return emptyStore()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyStore()
    const parsed = JSON.parse(raw) as Partial<Phase3Store>
    const watchlist = Array.isArray(parsed.watchlist)
      ? parsed.watchlist.filter((f): f is string => typeof f === 'string')
      : []
    const lastSeen =
      parsed.lastSeen &&
      typeof parsed.lastSeen === 'object' &&
      typeof parsed.lastSeen.publishId === 'string'
        ? (parsed.lastSeen as LastSeenSnapshot)
        : null
    return { watchlist, lastSeen }
  } catch {
    return emptyStore()
  }
}

export function saveStore(store: Phase3Store): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    /* quota / private mode — ignore */
  }
}

export function toggleWatch(
  fips: string,
  store: Phase3Store,
): { store: Phase3Store; error?: string } {
  const id = fips.trim()
  if (!id) return { store }
  const watching = store.watchlist.includes(id)
  if (watching) {
    return {
      store: {
        ...store,
        watchlist: store.watchlist.filter((f) => f !== id),
      },
    }
  }
  if (store.watchlist.length >= WATCH_CAP) {
    return {
      store,
      error: `Watchlist full (≤${WATCH_CAP}). Remove a county first.`,
    }
  }
  return {
    store: {
      ...store,
      watchlist: [...store.watchlist, id],
    },
  }
}

function snapOne(c: ScreeningCounty): CountySnapshot {
  return {
    rank: c.rank,
    screeningScore: c.screeningScore,
    confidence: c.confidence,
    padusFriction: c.padusFriction ?? null,
    texnetCaution: c.texnetCaution ?? null,
  }
}

export function snapshotCounties(
  counties: ScreeningCounty[],
  fips: string[],
): Record<string, CountySnapshot> {
  const want = new Set(fips)
  const out: Record<string, CountySnapshot> = {}
  for (const c of counties) {
    if (want.has(c.countyFips)) out[c.countyFips] = snapOne(c)
  }
  return out
}

function flagLabel(padus: boolean | null, texnet: boolean | null): string {
  const p =
    padus === true ? 'PAD friction' : padus === false ? 'PAD clear' : 'PAD unknown'
  const t =
    texnet === true
      ? 'TexNet caution'
      : texnet === false
        ? 'TexNet clear'
        : 'TexNet unknown'
  return `${p}; ${t}`
}

export function buildDigest(args: {
  currentPublishId: string
  methodologyVersion: string
  counties: ScreeningCounty[]
  store: Phase3Store
}): DigestResult {
  const { currentPublishId, counties, store } = args
  const byFips = new Map(counties.map((c) => [c.countyFips, c]))
  const items: DigestItem[] = []
  const last = store.lastSeen
  const publishChanged = !last || last.publishId !== currentPublishId

  for (const fips of store.watchlist) {
    const cur = byFips.get(fips)
    if (!cur) continue
    const prev = last?.counties?.[fips]
    if (!prev) {
      items.push({
        countyFips: fips,
        name: cur.name,
        kind: 'new_watch',
        summary: 'New on watchlist — no prior snapshot',
        after: `#${cur.rank} · ${cur.screeningScore.toFixed(1)} · ${cur.confidence}`,
      })
      continue
    }
    if (prev.rank !== cur.rank) {
      items.push({
        countyFips: fips,
        name: cur.name,
        kind: 'rank',
        summary: `Rank ${prev.rank} → ${cur.rank}`,
        before: String(prev.rank),
        after: String(cur.rank),
      })
    }
    if (Math.abs(prev.screeningScore - cur.screeningScore) >= 0.05) {
      items.push({
        countyFips: fips,
        name: cur.name,
        kind: 'score',
        summary: `Score ${prev.screeningScore.toFixed(1)} → ${cur.screeningScore.toFixed(1)}`,
        before: prev.screeningScore.toFixed(1),
        after: cur.screeningScore.toFixed(1),
      })
    }
    if (prev.confidence !== cur.confidence) {
      items.push({
        countyFips: fips,
        name: cur.name,
        kind: 'confidence',
        summary: `Confidence ${prev.confidence} → ${cur.confidence}`,
        before: String(prev.confidence),
        after: String(cur.confidence),
      })
    }
    if (
      prev.padusFriction !== (cur.padusFriction ?? null) ||
      prev.texnetCaution !== (cur.texnetCaution ?? null)
    ) {
      items.push({
        countyFips: fips,
        name: cur.name,
        kind: 'flag',
        summary: 'Risk flags changed',
        before: flagLabel(prev.padusFriction, prev.texnetCaution),
        after: flagLabel(cur.padusFriction ?? null, cur.texnetCaution ?? null),
      })
    }
  }

  const status: DigestStatus =
    items.length > 0 ? 'county_deltas' : publishChanged ? 'vintage_only' : 'none'
  return {
    hasUpdate: status !== 'none',
    status,
    items,
    rulesVersion: RULES_VERSION,
  }
}

export function applyProspectRules(counties: ScreeningCounty[]): ScreeningCounty[] {
  return counties
    .filter((c) => {
      const tdepth =
        c.thermalMode === 'stanford_tdepth' || c.modelThermal === true
      const confOk = c.confidence === 'High' || c.confidence === 'Medium'
      const rankOk = c.rank <= 40
      const padOk = c.padusFriction !== true && c.padusStatus !== 'friction'
      return tdepth && confOk && rankOk && padOk
    })
    .slice()
    .sort((a, b) => {
      const ta = a.texnetCaution === true ? 1 : 0
      const tb = b.texnetCaution === true ? 1 : 0
      if (ta !== tb) return ta - tb
      return a.rank - b.rank
    })
}

/** Human-facing publish pack label (short id for UI; full id in title/tooltip). */
export function formatPublishPackLabel(publishId: string): {
  label: string
  shortId: string
  fullId: string
} {
  const fullId = publishId.trim() || '—'
  const shortId =
    fullId.length <= 40 ? fullId : `${fullId.slice(0, 18)}…${fullId.slice(-14)}`
  return { label: 'Published score pack', shortId, fullId }
}

export function exportWatchlist(store: Phase3Store): WatchlistExport {
  return {
    format: EXPORT_FORMAT,
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    watchlist: [...store.watchlist],
    lastSeen: store.lastSeen,
  }
}

export function importWatchlist(
  raw: unknown,
  opts?: { merge?: boolean; current?: Phase3Store },
): { store: Phase3Store; error?: string; truncated?: boolean } {
  const merge = opts?.merge === true
  const current = opts?.current ?? emptyStore()

  if (!raw || typeof raw !== 'object') {
    return { store: current, error: 'Import failed — not a JSON object.' }
  }
  const obj = raw as Partial<WatchlistExport> & { watchlist?: unknown }
  if (obj.format == null || obj.format !== EXPORT_FORMAT) {
    return {
      store: current,
      error: 'Import failed — expected gt_tx_phase3_watchlist export JSON.',
    }
  }
  if (!Array.isArray(obj.watchlist)) {
    return { store: current, error: 'Import failed — missing watchlist array.' }
  }
  const imported = obj.watchlist
    .filter((f): f is string => typeof f === 'string' && f.trim().length > 0)
    .map((f) => f.trim())

  let watchlist = merge
    ? [...current.watchlist]
    : ([] as string[])
  let truncated = false
  for (const fips of imported) {
    if (watchlist.includes(fips)) continue
    if (watchlist.length >= WATCH_CAP) {
      truncated = true
      break
    }
    watchlist.push(fips)
  }

  let lastSeen: LastSeenSnapshot | null = merge ? current.lastSeen : null
  if (
    !merge &&
    obj.lastSeen &&
    typeof obj.lastSeen === 'object' &&
    typeof (obj.lastSeen as LastSeenSnapshot).publishId === 'string'
  ) {
    lastSeen = obj.lastSeen as LastSeenSnapshot
  }

  return {
    store: { watchlist, lastSeen },
    truncated: truncated || undefined,
  }
}

export function markSeen(
  store: Phase3Store,
  args: {
    publishId: string
    methodologyVersion: string
    counties: ScreeningCounty[]
  },
): Phase3Store {
  return {
    ...store,
    lastSeen: {
      publishId: args.publishId,
      methodologyVersion: args.methodologyVersion,
      seenAt: new Date().toISOString(),
      counties: snapshotCounties(args.counties, store.watchlist),
    },
  }
}
