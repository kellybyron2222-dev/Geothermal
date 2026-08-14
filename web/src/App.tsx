import { useEffect, useMemo, useState } from 'react'
import type { ScreeningCounty } from './types/screening'
import { DetailPanel } from './components/DetailPanel'
import { MapView } from './components/MapView'
import { Methodology } from './components/Methodology'
import { SiteDossierPanel } from './components/SiteDossierPanel'
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

export default function App() {
  const [view, setView] = useState<View>('explorer')
  const [payload, setPayload] = useState<ProspectsPayload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [siteError, setSiteError] = useState<string | null>(null)
  const [selectedFips, setSelectedFips] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [siteMode, setSiteMode] = useState(false)
  const [dossier, setDossier] = useState<SiteDossier | null>(null)
  const [thermalPoints, setThermalPoints] = useState<ThermalPoint[]>([])
  const [infraCells, setInfraCells] = useState<InfraCell[]>([])

  useEffect(() => {
    const base = import.meta.env.BASE_URL
    fetch(`${base}data/prospects.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load prospects.json (${r.status})`)
        return r.json()
      })
      .then((prospects: ProspectsPayload) => {
        setPayload(prospects)
        if (prospects.counties[0]) setSelectedFips(prospects.counties[0].countyFips)
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

  const suggestions = useMemo(() => {
    if (!payload || siteMode) return []
    const q = query.trim().toLowerCase()
    if (q.length < 1) return []
    return payload.counties
      .filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 8)
  }, [payload, query, siteMode])

  const selected = useMemo(
    () => payload?.counties.find((c) => c.countyFips === selectedFips) ?? null,
    [payload, selectedFips],
  )

  const pickCounty = (county: ScreeningCounty) => {
    setSiteMode(false)
    setDossier(null)
    setSelectedFips(county.countyFips)
    setQuery(county.name)
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
            className={siteMode ? 'linkish active-toggle' : 'linkish'}
            disabled={Boolean(siteError)}
            title={siteError ?? 'Point evidence check'}
            onClick={() => {
              setSiteMode((v) => !v)
              if (siteMode) setDossier(null)
            }}
          >
            {siteMode ? 'Point check: ON' : 'Point check'}
          </button>
          {!siteMode && (
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
        <main className="explorer">
          <section className="map-pane">
            <MapView
              selectedFips={selectedFips}
              siteMode={siteMode}
              siteMarker={dossier ? { lat: dossier.lat, lon: dossier.lon } : null}
              onSelectCounty={(fips) => {
                setSelectedFips(fips)
                setDossier(null)
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
            />
          </section>
          <aside className="detail-pane">
            {siteMode ? (
              <SiteDossierPanel dossier={dossier} onClear={() => setDossier(null)} />
            ) : (
              <DetailPanel county={selected} />
            )}
          </aside>
        </main>
      )}
    </div>
  )
}
