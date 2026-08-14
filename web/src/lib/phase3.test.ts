import { describe, expect, it } from 'vitest'
import type { ScreeningCounty } from '../types/screening'
import {
  applyProspectRules,
  buildDigest,
  emptyStore,
  exportWatchlist,
  formatPublishPackLabel,
  importWatchlist,
  markSeen,
  type Phase3Store,
} from './phase3'

function county(partial: Partial<ScreeningCounty> & Pick<ScreeningCounty, 'countyFips' | 'name' | 'rank'>): ScreeningCounty {
  return {
    screeningScore: 70,
    confidence: 'Medium',
    factors: [],
    drivers: [],
    limitations: [],
    thermalMode: 'stanford_tdepth',
    modelThermal: true,
    padusFriction: false,
    texnetCaution: false,
    ...partial,
  }
}

describe('buildDigest', () => {
  it('returns none with empty watch and same publish', () => {
    const store = emptyStore()
    const stamped = markSeen(store, {
      publishId: 'p1',
      methodologyVersion: '0.4.0',
      counties: [],
    })
    const d = buildDigest({
      currentPublishId: 'p1',
      methodologyVersion: '0.4.0',
      counties: [],
      store: stamped,
    })
    expect(d.status).toBe('none')
    expect(d.hasUpdate).toBe(false)
    expect(d.items).toHaveLength(0)
  })

  it('returns vintage_only when publish changed but no county deltas', () => {
    const counties = [county({ countyFips: '48001', name: 'Anderson', rank: 5 })]
    let store: Phase3Store = { watchlist: ['48001'], lastSeen: null }
    store = markSeen(store, {
      publishId: 'old',
      methodologyVersion: '0.4.0',
      counties,
    })
    const d = buildDigest({
      currentPublishId: 'new',
      methodologyVersion: '0.4.0',
      counties,
      store,
    })
    expect(d.status).toBe('vintage_only')
    expect(d.hasUpdate).toBe(true)
    expect(d.items).toHaveLength(0)
  })

  it('returns county_deltas on rank change', () => {
    const prev = [county({ countyFips: '48001', name: 'Anderson', rank: 5 })]
    let store: Phase3Store = { watchlist: ['48001'], lastSeen: null }
    store = markSeen(store, {
      publishId: 'old',
      methodologyVersion: '0.4.0',
      counties: prev,
    })
    const next = [county({ countyFips: '48001', name: 'Anderson', rank: 2 })]
    const d = buildDigest({
      currentPublishId: 'new',
      methodologyVersion: '0.4.0',
      counties: next,
      store,
    })
    expect(d.status).toBe('county_deltas')
    expect(d.items.some((i) => i.kind === 'rank')).toBe(true)
  })

  it('flags new_watch when no prior snapshot', () => {
    const counties = [county({ countyFips: '48001', name: 'Anderson', rank: 5 })]
    const store: Phase3Store = { watchlist: ['48001'], lastSeen: null }
    const d = buildDigest({
      currentPublishId: 'p1',
      methodologyVersion: '0.4.0',
      counties,
      store,
    })
    expect(d.status).toBe('county_deltas')
    expect(d.items[0]?.kind).toBe('new_watch')
  })
})

describe('applyProspectRules', () => {
  it('filters and demotes TexNet', () => {
    const list = applyProspectRules([
      county({
        countyFips: 'a',
        name: 'A',
        rank: 10,
        texnetCaution: true,
      }),
      county({
        countyFips: 'b',
        name: 'B',
        rank: 20,
        texnetCaution: false,
      }),
      county({
        countyFips: 'c',
        name: 'C',
        rank: 5,
        confidence: 'Low',
      }),
      county({
        countyFips: 'd',
        name: 'D',
        rank: 50,
      }),
    ])
    expect(list.map((c) => c.countyFips)).toEqual(['b', 'a'])
  })
})

describe('export/import', () => {
  it('round-trips watchlist', () => {
    const store: Phase3Store = {
      watchlist: ['48001', '48003'],
      lastSeen: {
        publishId: 'p1',
        methodologyVersion: '0.4.0',
        seenAt: '2026-01-01T00:00:00.000Z',
        counties: {},
      },
    }
    const exported = exportWatchlist(store)
    const { store: next, error } = importWatchlist(exported)
    expect(error).toBeUndefined()
    expect(next.watchlist).toEqual(['48001', '48003'])
    expect(next.lastSeen?.publishId).toBe('p1')
  })

  it('rejects missing format', () => {
    const { error } = importWatchlist({ watchlist: ['48001'] })
    expect(error).toMatch(/gt_tx_phase3_watchlist/)
  })
})

describe('formatPublishPackLabel', () => {
  it('labels and shortens long ids', () => {
    const long = '0.4.0|' + 'x'.repeat(80)
    const { label, shortId, fullId } = formatPublishPackLabel(long)
    expect(label).toBe('Published score pack')
    expect(fullId).toBe(long)
    expect(shortId.length).toBeLessThan(fullId.length)
  })
})
