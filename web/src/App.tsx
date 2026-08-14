import { useEffect, useMemo, useState } from 'react'
import type { ScreeningCounty } from './types/screening'
import { AoiEvidencePanel } from './components/AoiEvidencePanel'
import { DetailPanel } from './components/DetailPanel'
import { MapView, type EvidenceMode } from './components/MapView'
import { Methodology } from './components/Methodology'
import {
  RankedCountyList,
  type CohortFilter,
} from './components/RankedCountyList'
import { SiteDossierPanel } from './components/SiteDossierPanel'
import {
  buildAoiDossier,
  countiesIntersectingAoi,
  parseAoiGeoJson,
  type AoiCountyContext,
  type AoiDossier,
  type CountyFeatureLike,
  type LonLat,
} from './lib/aoiEval'
import {
  buildSiteDossier,
  type InfraCell,
  type SiteDossier,
  type ThermalPoint,
} from './lib/siteEval'

interface ProspectsPayload {
  meta: {
    methodologyVersion: string
    disclaimer: string
    weights: { thermal: number; infra: number }
  }
  counties: ScreeningCounty[]
}

type View = 'explorer' | 'methodology'

const FOCUS_CAP = 3
const IGNORE_CAP = 3

function closeRing(vertices: LonLat[]): LonLat[] {
  if (vertices.length < 3) return vertices
  const first = vertices[0]!
  const last = vertices[vertices.length - 1]!
  if (first[0] === last[0] && first[1] === last[1]) return vertices
  return [...vertices, [first[0], first[1]]]
}

export default function App() {
  const [view, setView] = useState<View>('explorer')
  const [payload, setPayload] = useState<ProspectsPayload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [siteError, setSiteError] = useState<string | null>(null)
  const [selectedFips, setSelectedFips] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [evidenceMode, setEvidenceMode] = useState<EvidenceMode>('county')
  const [dossier, setDossier] = useState<SiteDossier | null>(null)
  const [aoiDraft, setAoiDraft] = useState<LonLat[]>([])
  const [aoiRing, setAoiRing] = useState<LonLat[] | null>(null)
  const [aoiDossier, setAoiDossier] = useState<AoiDossier | null>(null)
  const [draftCountyHints, setDraftCountyHints] = useState<AoiCountyContext[]>([])
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [countyFeatures, setCountyFeatures] = useState<CountyFeatureLike[] | null>(null)
  const [thermalPoints, setThermalPoints] = useState<ThermalPoint[]>([])
  const [infraCells, setInfraCells] = useState<InfraCell[]>([])
  const [cohort, setCohort] = useState<CohortFilter>('gradient')
  const [focusFips, setFocusFips] = useState<Set<string>>(() => new Set())
  const [ignoreFips, setIgnoreFips] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    const base = import.meta.env.BASE_URL
    fetch(`${base}data/prospects.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load prospects.json (${r.status})`)
        return r.json()
      })
      .then((prospects: ProspectsPayload) => {
        setPayload(prospects)
        const firstGradient = prospects.counties.find((c) => {
          const t = c.factors.find((f) => f.id === 'thermal')
          return t?.metric === 'gradient_C_per_km' && t.rawValue != null
        })
        const pick = firstGradient ?? prospects.counties[0]
        if (pick) setSelectedFips(pick.countyFips)
      })
      .catch((e: Error) => setError(e.message))

    Promise.all([
      fetch(`${base}data/thermal_points.json`).then((r) => {
        if (!r.ok) throw new Error(`thermal_points.json (${r.status})`)
        return r.json()
      }),
      fetch(`${base}data/infra_grid.json`).then((r) => {
        if (!r.ok) throw new Error(`infra_grid.json (${r.status})`)
        return r.json()
      }),
    ])
      .then(([thermal, infra]) => {
        setThermalPoints((thermal as { points: ThermalPoint[] }).points ?? [])
        setInfraCells((infra as { cells: InfraCell[] }).cells ?? [])
      })
      .catch((e: Error) => setSiteError(`Point check data unavailable: ${e.message}`))
  }, [])

  const countiesByFips = useMemo(() => {
    const m = new Map<
      string,
      { name: string; rank: number; screeningScore: number; thermalMetric: string | null }
    >()
    if (!payload) return m
    for (const c of payload.counties) {
      const metric = c.factors.find((f) => f.id === 'thermal')?.metric ?? null
      m.set(c.countyFips, {
        name: c.name,
        rank: c.rank,
        screeningScore: c.screeningScore,
        thermalMetric: metric ?? null,
      })
    }
    return m
  }, [payload])

  const ensureCountyFeatures = async (): Promise<CountyFeatureLike[]> => {
    if (countyFeatures) return countyFeatures
    const base = import.meta.env.BASE_URL
    const r = await fetch(`${base}data/prospects.geojson`)
    if (!r.ok) throw new Error(`prospects.geojson (${r.status})`)
    const gj = (await r.json()) as { features?: CountyFeatureLike[] }
    const feats = gj.features ?? []
    setCountyFeatures(feats)
    return feats
  }

  const suggestions = useMemo(() => {
    if (!payload || evidenceMode !== 'county') return []
    const q = query.trim().toLowerCase()
    if (q.length < 1) return []
    return payload.counties
      .filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 8)
  }, [payload, query, evidenceMode])

  const selected = useMemo(
    () => payload?.counties.find((c) => c.countyFips === selectedFips) ?? null,
    [payload, selectedFips],
  )

  const clearAoiState = () => {
    setAoiDraft([])
    setAoiRing(null)
    setAoiDossier(null)
    setDraftCountyHints([])
    setUploadError(null)
  }

  const clearPointState = () => {
    setDossier(null)
  }

  const enterMode = (mode: EvidenceMode) => {
    if (mode === evidenceMode) {
      setEvidenceMode('county')
      clearPointState()
      clearAoiState()
      return
    }
    setEvidenceMode(mode)
    if (mode === 'point') {
      clearAoiState()
    } else if (mode === 'aoi') {
      clearPointState()
    } else {
      clearPointState()
      clearAoiState()
    }
  }

  const pickCounty = (county: ScreeningCounty) => {
    setEvidenceMode('county')
    clearPointState()
    clearAoiState()
    setSelectedFips(county.countyFips)
    setQuery(county.name)
  }

  const finishAoi = (ring: LonLat[], counties: AoiCountyContext[]) => {
    const closed = closeRing(ring)
    setAoiRing(closed)
    setAoiDraft([])
    setAoiDossier(
      buildAoiDossier({
        ring: closed,
        thermalPoints,
        infraCells,
        intersectingCounties: counties,
      }),
    )
  }

  const onClosePolygon = () => {
    if (aoiDraft.length < 3) return
    const unique = new Map<string, AoiCountyContext>()
    for (const h of draftCountyHints) {
      if (!unique.has(h.countyFips)) unique.set(h.countyFips, h)
    }
    finishAoi(aoiDraft, [...unique.values()].slice(0, 8))
  }

  const onUploadText = async (text: string) => {
    const parsed = parseAoiGeoJson(text)
    if (parsed.error || parsed.ring.length < 4) {
      setUploadError(parsed.error ?? 'Polygon ring too short.')
      return
    }
    setUploadError(null)
    try {
      const feats = await ensureCountyFeatures()
      const counties = countiesIntersectingAoi(parsed.ring, feats, countiesByFips)
      finishAoi(parsed.ring, counties)
      setDraftCountyHints([])
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to resolve county context'
      setUploadError(msg)
      finishAoi(parsed.ring, [])
    }
  }

  const toggleFocus = (fips: string) => {
    setFocusFips((prev) => {
      const next = new Set(prev)
      if (next.has(fips)) {
        next.delete(fips)
        return next
      }
      if (next.size >= FOCUS_CAP) return prev
      next.add(fips)
      return next
    })
    setIgnoreFips((prev) => {
      if (!prev.has(fips)) return prev
      const next = new Set(prev)
      next.delete(fips)
      return next
    })
  }

  const toggleIgnore = (fips: string) => {
    setIgnoreFips((prev) => {
      const next = new Set(prev)
      if (next.has(fips)) {
        next.delete(fips)
        return next
      }
      if (next.size >= IGNORE_CAP) return prev
      next.add(fips)
      return next
    })
    setFocusFips((prev) => {
      if (!prev.has(fips)) return prev
      const next = new Set(prev)
      next.delete(fips)
      return next
    })
  }

  if (view === 'methodology') {
    return (
      <div className="app-shell">
        <header className="app-header">
          <div>
            <h1>Texas Next-Gen County Screening</h1>
            <p className="disclaimer">Methodology</p>
          </div>
          <button type="button" className="linkish" onClick={() => setView('explorer')}>
            ← Back to Explorer
          </button>
        </header>
        <Methodology meta={payload?.meta ?? null} />
      </div>
    )
  }

  const evidenceActive = evidenceMode !== 'county'

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Texas Next-Gen Geothermal Screening</h1>
          <p className="disclaimer">
            {payload?.meta.disclaimer ??
              'Regional screening index — not a resource map.'}
          </p>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className={evidenceMode === 'point' ? 'linkish active-toggle' : 'linkish'}
            disabled={Boolean(siteError)}
            title={siteError ?? 'Point evidence check'}
            onClick={() => enterMode('point')}
          >
            {evidenceMode === 'point' ? 'Point check: ON' : 'Point check'}
          </button>
          <button
            type="button"
            className={evidenceMode === 'aoi' ? 'linkish active-toggle' : 'linkish'}
            disabled={Boolean(siteError)}
            title={siteError ?? 'AOI evidence check'}
            onClick={() => enterMode('aoi')}
          >
            {evidenceMode === 'aoi' ? 'AOI check: ON' : 'AOI check'}
          </button>
          {evidenceMode === 'county' && (
            <div className="search">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find a county…"
                aria-label="Find a county"
              />
              {suggestions.length > 0 && (
                <ul className="search-results">
                  {suggestions.map((c) => (
                    <li key={c.countyFips}>
                      <button type="button" onClick={() => pickCounty(c)}>
                        <span>
                          #{c.rank} {c.name}
                        </span>
                        <span className="muted">{c.screeningScore.toFixed(1)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <button type="button" className="linkish" onClick={() => setView('methodology')}>
            Methodology
          </button>
        </div>
      </header>

      {error && <div className="banner error">{error}</div>}
      {siteError && !error && (
        <div className="banner">County screening available. {siteError}</div>
      )}
      {!payload && !error && <div className="banner">Loading…</div>}

      {payload && (
        <main className={evidenceActive ? 'explorer site-mode' : 'explorer'}>
          {evidenceMode === 'county' && (
            <aside className="list-pane">
              <RankedCountyList
                counties={payload.counties}
                selectedFips={selectedFips}
                onSelect={(fips) => {
                  setSelectedFips(fips)
                  clearPointState()
                  clearAoiState()
                }}
                cohort={cohort}
                onCohortChange={setCohort}
                focusFips={focusFips}
                ignoreFips={ignoreFips}
                onToggleFocus={toggleFocus}
                onToggleIgnore={toggleIgnore}
                query={query}
              />
            </aside>
          )}
          <section className="map-pane">
            <MapView
              selectedFips={selectedFips}
              evidenceMode={evidenceMode}
              siteMarker={
                evidenceMode === 'point' && dossier
                  ? { lat: dossier.lat, lon: dossier.lon }
                  : null
              }
              aoiRing={evidenceMode === 'aoi' ? aoiRing : null}
              draftVertices={
                evidenceMode === 'aoi' && !aoiRing && aoiDraft.length > 0 ? aoiDraft : null
              }
              onSelectCounty={(fips) => {
                setSelectedFips(fips)
                clearPointState()
                clearAoiState()
              }}
              onSiteClick={(evt) => {
                const county = payload.counties.find((c) => c.countyFips === evt.countyFips)
                const metric = county?.factors.find((f) => f.id === 'thermal')?.metric ?? null
                setDossier(
                  buildSiteDossier({
                    lat: evt.lat,
                    lon: evt.lon,
                    countyFips: evt.countyFips,
                    countyName: evt.countyName,
                    countyRank: evt.countyRank,
                    countyScore: evt.countyScore,
                    countyThermalMetric: metric ?? null,
                    thermalPoints,
                    infraCells,
                  }),
                )
                if (evt.countyFips) setSelectedFips(evt.countyFips)
              }}
              onAoiMapClick={(evt) => {
                if (aoiRing) return
                const vert: LonLat = [evt.lon, evt.lat]
                setAoiDraft((prev) => [...prev, vert])
                if (evt.countyFips) {
                  const metric =
                    payload.counties
                      .find((c) => c.countyFips === evt.countyFips)
                      ?.factors.find((f) => f.id === 'thermal')?.metric ?? null
                  setDraftCountyHints((prev) => {
                    if (prev.some((h) => h.countyFips === evt.countyFips)) return prev
                    return [
                      ...prev,
                      {
                        countyFips: evt.countyFips!,
                        countyName: evt.countyName ?? evt.countyFips!,
                        countyRank: evt.countyRank,
                        countyScore: evt.countyScore,
                        countyThermalMetric: metric,
                      },
                    ]
                  })
                }
              }}
            />
          </section>
          <aside className="detail-pane">
            {evidenceMode === 'point' ? (
              <SiteDossierPanel dossier={dossier} onClear={() => setDossier(null)} />
            ) : evidenceMode === 'aoi' ? (
              <AoiEvidencePanel
                dossier={aoiDossier}
                draftCount={aoiDraft.length}
                onClosePolygon={onClosePolygon}
                onClear={clearAoiState}
                onUploadText={(text) => void onUploadText(text)}
                uploadError={uploadError}
              />
            ) : (
              <DetailPanel county={selected} />
            )}
          </aside>
        </main>
      )}
    </div>
  )
}
