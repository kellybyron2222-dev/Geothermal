import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ScreeningCounty, ScreeningMeta } from './types/screening'
import { AoiEvidencePanel } from './components/AoiEvidencePanel'
import { ComparePanel } from './components/ComparePanel'
import { DetailPanel } from './components/DetailPanel'
import { MapView, type EvidenceMode } from './components/MapView'
import { LeftRail } from './components/LeftRail'
import {
  DEFAULT_LAYER_TOGGLES,
  type LayerToggles,
} from './components/LayerControls'
import { Methodology } from './components/Methodology'
import { Phase3Panel } from './components/Phase3Panel'
import {
  RankedCountyList,
  defaultCohort,
  thermalKind,
  type CohortFilter,
} from './components/RankedCountyList'
import { SiteDossierPanel } from './components/SiteDossierPanel'
import {
  WATCH_CAP,
  buildDigest,
  emptyStore,
  getPublishId,
  loadStore,
  saveStore,
  toggleWatch,
  type Phase3Store,
} from './lib/phase3'
import {
  buildAoiDossier,
  countiesIntersectingAoi,
  parseAoiGeoJson,
  type AoiCountyContext,
  type AoiDossier,
  type CountyFeatureLike,
  type CountyScreeningLookup,
  type LonLat,
} from './lib/aoiEval'
import {
  fromAoiDossier,
  fromSiteDossier,
  isDuplicate,
  MAX_COMPARE,
  type CompareSlot,
} from './lib/compareSlot'
import {
  buildSiteDossier,
  type InfraCell,
  type SiteDossier,
  type ThermalPoint,
} from './lib/siteEval'

interface ProspectsPayload {
  meta: ScreeningMeta
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
  const [compareSlots, setCompareSlots] = useState<CompareSlot[]>([])
  const [compareHint, setCompareHint] = useState<string | null>(null)
  const [mapLayers, setMapLayers] = useState<LayerToggles>(DEFAULT_LAYER_TOGGLES)
  const [leftRailCollapsed, setLeftRailCollapsed] = useState(false)
  const [rankedListOpen, setRankedListOpen] = useState(true)
  const [phase3Open, setPhase3Open] = useState(false)
  const [phase3Store, setPhase3Store] = useState<Phase3Store>(() => emptyStore())
  const [phase3HasUpdate, setPhase3HasUpdate] = useState(false)
  const [watchHint, setWatchHint] = useState<string | null>(null)

  useEffect(() => {
    setPhase3Store(loadStore())
  }, [])

  useEffect(() => {
    const base = import.meta.env.BASE_URL
    fetch(`${base}data/prospects.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load prospects.json (${r.status})`)
        return r.json()
      })
      .then((prospects: ProspectsPayload) => {
        setPayload(prospects)
        setCohort(defaultCohort(prospects.counties))
        const firstTdepth = prospects.counties.find((c) => thermalKind(c) === 'tdepth')
        const firstGradient = prospects.counties.find((c) => {
          const t = c.factors.find((f) => f.id === 'thermal')
          return t?.metric === 'gradient_C_per_km' && t.rawValue != null
        })
        const pick = firstTdepth ?? firstGradient ?? prospects.counties[0]
        if (pick) setSelectedFips(pick.countyFips)

        // Quiet digest for Tools badge — no UI panel forced open.
        const store = loadStore()
        const digest = buildDigest({
          currentPublishId: getPublishId(prospects.meta),
          methodologyVersion: prospects.meta.methodologyVersion,
          counties: prospects.counties,
          store,
        })
        setPhase3HasUpdate(
          digest.status === 'county_deltas' && store.watchlist.length > 0,
        )
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
    const m = new Map<string, CountyScreeningLookup>()
    if (!payload) return m
    for (const c of payload.counties) {
      const metric = c.factors.find((f) => f.id === 'thermal')?.metric ?? null
      m.set(c.countyFips, {
        name: c.name,
        rank: c.rank,
        screeningScore: c.screeningScore,
        thermalMetric: metric ?? null,
        modelThermal: c.modelThermal,
        thermalMode: c.thermalMode ?? payload.meta.thermalMode ?? null,
        tdepthMean: c.tdepthMean ?? null,
        tdepthKm: c.tdepthKm ?? null,
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

  /** Cohort FIPS for map dimming — null when cohort is "all" (no dim). */
  const cohortVisibleFips = useMemo(() => {
    if (!payload || cohort === 'all') return null
    return payload.counties
      .filter((c) => thermalKind(c) === cohort)
      .map((c) => c.countyFips)
  }, [payload, cohort])

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
    setPhase3Open(false)
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
    setPhase3Open(false)
    setSelectedFips(county.countyFips)
    setQuery(county.name)
  }

  const openPhase3 = () => {
    setEvidenceMode('county')
    clearPointState()
    clearAoiState()
    setPhase3Open(true)
  }

  const onToggleWatchSelected = () => {
    if (!selectedFips) return
    const { store: next, error: err } = toggleWatch(selectedFips, phase3Store)
    if (err) {
      setWatchHint(err)
      return
    }
    saveStore(next)
    setPhase3Store(next)
    setWatchHint(null)
  }

  const watchedSelected = selectedFips
    ? phase3Store.watchlist.includes(selectedFips)
    : false
  const watchDisabledReason =
    !watchedSelected && phase3Store.watchlist.length >= WATCH_CAP
      ? `Watchlist full (<=${WATCH_CAP})`
      : watchHint

  const finishAoi = useCallback(
    (ring: LonLat[], counties: AoiCountyContext[]) => {
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
    },
    [thermalPoints, infraCells],
  )

  const aoiDraftRef = useRef(aoiDraft)
  const draftCountyHintsRef = useRef(draftCountyHints)
  aoiDraftRef.current = aoiDraft
  draftCountyHintsRef.current = draftCountyHints

  const onClosePolygon = useCallback(() => {
    const draft = aoiDraftRef.current
    if (draft.length < 3) return
    const unique = new Map<string, AoiCountyContext>()
    for (const h of draftCountyHintsRef.current) {
      if (!unique.has(h.countyFips)) unique.set(h.countyFips, h)
    }
    finishAoi(draft, [...unique.values()].slice(0, 8))
  }, [finishAoi])

  useEffect(() => {
    if (evidenceMode !== 'aoi' || aoiRing) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) {
        return
      }
      if (aoiDraftRef.current.length < 3) return
      e.preventDefault()
      onClosePolygon()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [evidenceMode, aoiRing, onClosePolygon])

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

  const addFromPoint = (d: SiteDossier) => {
    const next = fromSiteDossier(d)
    if (isDuplicate(compareSlots, next)) {
      setCompareHint('Already pinned — same point (within ~0.0005°).')
      return
    }
    if (compareSlots.length >= MAX_COMPARE) {
      setCompareHint(`Compare is full (${MAX_COMPARE}/${MAX_COMPARE}) — remove a pin first.`)
      return
    }
    setCompareSlots((prev) => [...prev, next])
    setCompareHint(null)
  }

  const addFromAoi = (d: AoiDossier) => {
    const next = fromAoiDossier(d)
    if (isDuplicate(compareSlots, next)) {
      setCompareHint('Already pinned — same AOI area/centroid.')
      return
    }
    if (compareSlots.length >= MAX_COMPARE) {
      setCompareHint(`Compare is full (${MAX_COMPARE}/${MAX_COMPARE}) — remove a pin first.`)
      return
    }
    setCompareSlots((prev) => [...prev, next])
    setCompareHint(null)
  }

  const compareFull = compareSlots.length >= MAX_COMPARE

  const dataDepthStatus = payload?.meta.dataDepthStatus ?? ''
  const dataDepthAcceptedOrLive =
    /accepted/i.test(dataDepthStatus) ||
    (/live/i.test(dataDepthStatus) &&
      !/risk_pending|pending|partial/i.test(dataDepthStatus))
  const showResidualBanner =
    Boolean(payload?.meta.dataDepth) &&
    !dataDepthAcceptedOrLive &&
    (dataDepthStatus === 'thermal_spine_live_risk_pending' ||
      /risk_pending|pending|partial/i.test(dataDepthStatus))
  const showDataNotes =
    Boolean(payload?.meta.dataDepth || payload?.meta.residualRisk) &&
    !showResidualBanner
  const showCompare =
    compareSlots.length > 0 || Boolean(compareHint)

  if (view === 'methodology') {
    return (
      <div className="app-shell">
        <header className="app-header">
          <div>
            <h1>Texas Next-Gen Screening</h1>
            <p className="header-tagline muted">Methodology</p>
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
  const toolsSummary =
    evidenceMode === 'point'
      ? 'Tools · Point'
      : evidenceMode === 'aoi'
        ? 'Tools · AOI'
        : phase3Open
          ? 'Tools · Watchlist'
          : phase3HasUpdate
            ? 'Tools · updates'
            : 'Tools'

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-brand">
          <h1>Texas Next-Gen Screening</h1>
        </div>
        <div className="header-actions">
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
          <details className="header-tools">
            <summary className="header-tools-summary">{toolsSummary}</summary>
            <div className="header-tools-menu" role="group" aria-label="Explorer tools">
              <button
                type="button"
                className={evidenceMode === 'point' ? 'tools-item active-toggle' : 'tools-item'}
                disabled={Boolean(siteError)}
                title={siteError ?? 'Point evidence check'}
                onClick={() => enterMode('point')}
              >
                {evidenceMode === 'point' ? 'Point check: ON' : 'Point check'}
              </button>
              <button
                type="button"
                className={evidenceMode === 'aoi' ? 'tools-item active-toggle' : 'tools-item'}
                disabled={Boolean(siteError)}
                title={siteError ?? 'AOI evidence check'}
                onClick={() => enterMode('aoi')}
              >
                {evidenceMode === 'aoi' ? 'AOI check: ON' : 'AOI check'}
              </button>
              <button
                type="button"
                className={phase3Open ? 'tools-item active-toggle' : 'tools-item'}
                onClick={() => (phase3Open ? setPhase3Open(false) : openPhase3())}
              >
                Watchlist / updates
                {phase3HasUpdate && !phase3Open ? (
                  <span className="tools-update-dot" aria-label="Updates available">
                    {' '}
                    ·
                  </span>
                ) : null}
              </button>
              <button
                type="button"
                className="tools-item"
                onClick={() => setView('methodology')}
              >
                About / Methodology
              </button>
              {showDataNotes && (
                <button
                  type="button"
                  className="tools-item tools-item-quiet"
                  title="Data Depth notes and residual risk"
                  onClick={() => setView('methodology')}
                >
                  Data notes
                </button>
              )}
            </div>
          </details>
        </div>
      </header>

      {error && <div className="banner error">{error}</div>}
      {siteError && !error && (
        <div className="banner">County screening available. {siteError}</div>
      )}
      {!payload && !error && <div className="banner">Loading…</div>}
      {showResidualBanner && payload && (
        <div className="banner residual-risk" role="status">
          <strong>
            Data Depth: thermal spine live — risk layers pending/partial
          </strong>
          {payload.meta.residualRisk && (
            <div className="muted tiny residual-risk-detail">{payload.meta.residualRisk}</div>
          )}
        </div>
      )}

      {payload && (
        <>
          {showCompare && (
            <ComparePanel
              slots={compareSlots}
              hint={compareHint}
              onRemove={(id) => {
                setCompareSlots((prev) => prev.filter((s) => s.id !== id))
                setCompareHint(null)
              }}
              onClear={() => {
                setCompareSlots([])
                setCompareHint(null)
              }}
            />
          )}
          <main
            className={[
              'explorer',
              evidenceActive ? 'site-mode' : '',
              leftRailCollapsed ? 'rail-collapsed' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <LeftRail
              collapsed={leftRailCollapsed}
              onCollapsedChange={setLeftRailCollapsed}
              listOpen={rankedListOpen}
              onListOpenChange={setRankedListOpen}
              layers={mapLayers}
              onLayersChange={setMapLayers}
              evidenceActive={evidenceActive}
              list={
                evidenceMode === 'county' ? (
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
                    dataDepth={
                      payload.meta.dataDepth === true ||
                      payload.meta.thermalMode === 'stanford_tdepth'
                    }
                  />
                ) : undefined
              }
            />
            <section className="map-pane">
              <MapView
                selectedFips={selectedFips}
                evidenceMode={evidenceMode}
                visibleFips={evidenceMode === 'county' ? cohortVisibleFips : null}
                layers={mapLayers}
                siteMarker={
                  evidenceMode === 'point' && dossier
                    ? { lat: dossier.lat, lon: dossier.lon }
                    : null
                }
                aoiRing={evidenceMode === 'aoi' ? aoiRing : null}
                draftVertices={
                  evidenceMode === 'aoi' && !aoiRing && aoiDraft.length > 0
                    ? aoiDraft
                    : null
                }
                onSelectCounty={(fips) => {
                  setSelectedFips(fips)
                  clearPointState()
                  clearAoiState()
                }}
                onSiteClick={(evt) => {
                  const county = payload.counties.find(
                    (c) => c.countyFips === evt.countyFips,
                  )
                  const metric =
                    county?.factors.find((f) => f.id === 'thermal')?.metric ?? null
                  setDossier(
                    buildSiteDossier({
                      lat: evt.lat,
                      lon: evt.lon,
                      countyFips: evt.countyFips,
                      countyName: evt.countyName,
                      countyRank: evt.countyRank,
                      countyScore: evt.countyScore,
                      countyThermalMetric: metric ?? null,
                      countyModelThermal: county?.modelThermal,
                      countyThermalMode:
                        county?.thermalMode ?? payload.meta.thermalMode ?? null,
                      countyTdepthMean: county?.tdepthMean ?? null,
                      countyTdepthKm: county?.tdepthKm ?? null,
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
                    const county = payload.counties.find(
                      (c) => c.countyFips === evt.countyFips,
                    )
                    const metric =
                      county?.factors.find((f) => f.id === 'thermal')?.metric ?? null
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
                          countyModelThermal: county?.modelThermal,
                          countyThermalMode:
                            county?.thermalMode ?? payload.meta.thermalMode ?? null,
                          countyTdepthMean: county?.tdepthMean ?? null,
                          countyTdepthKm: county?.tdepthKm ?? null,
                        },
                      ]
                    })
                  }
                }}
                onAoiClosePolygon={onClosePolygon}
              />
            </section>
            <aside className="detail-pane">
              {evidenceMode === 'point' ? (
                <SiteDossierPanel
                  dossier={dossier}
                  onClear={() => setDossier(null)}
                  onAddToCompare={
                    dossier ? () => addFromPoint(dossier) : undefined
                  }
                  compareFull={compareFull}
                />
              ) : evidenceMode === 'aoi' ? (
                <AoiEvidencePanel
                  dossier={aoiDossier}
                  draftCount={aoiDraft.length}
                  onClosePolygon={onClosePolygon}
                  onClear={clearAoiState}
                  onUploadText={(text) => void onUploadText(text)}
                  uploadError={uploadError}
                  onAddToCompare={
                    aoiDossier ? () => addFromAoi(aoiDossier) : undefined
                  }
                  compareFull={compareFull}
                />
              ) : phase3Open ? (
                <Phase3Panel
                  counties={payload.counties}
                  meta={payload.meta}
                  store={phase3Store}
                  onStoreChange={(next) => {
                    setPhase3Store(next)
                    const digest = buildDigest({
                      currentPublishId: getPublishId(payload.meta),
                      methodologyVersion: payload.meta.methodologyVersion,
                      counties: payload.counties,
                      store: next,
                    })
                    setPhase3HasUpdate(
                      digest.status === 'county_deltas' && next.watchlist.length > 0,
                    )
                  }}
                  selectedFips={selectedFips}
                  onSelectCounty={(fips) => {
                    setSelectedFips(fips)
                    const c = payload.counties.find((x) => x.countyFips === fips)
                    if (c) setQuery(c.name)
                  }}
                  onClose={() => setPhase3Open(false)}
                />
              ) : (
                <DetailPanel
                  county={selected}
                  watched={watchedSelected}
                  onToggleWatch={onToggleWatchSelected}
                  watchDisabledReason={watchDisabledReason}
                />
              )}
            </aside>
          </main>
        </>
      )}
    </div>
  )
}
