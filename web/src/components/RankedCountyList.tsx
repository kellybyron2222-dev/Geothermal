import type { ScreeningCounty } from '../types/screening'

export type CohortFilter = 'gradient' | 'heat-flow' | 'all'

export type ThermalKind = 'gradient' | 'heat-flow' | 'none'

const FOCUS_CAP = 3
const IGNORE_CAP = 3

export function thermalKind(county: ScreeningCounty): ThermalKind {
  const thermal = county.factors.find((f) => f.id === 'thermal')
  if (thermal?.rawValue == null || !thermal.metric) return 'none'
  if (thermal.metric === 'gradient_C_per_km') return 'gradient'
  if (thermal.metric === 'heat_flow_mWm2') return 'heat-flow'
  return 'none'
}

interface RankedRow {
  county: ScreeningCounty
  displayRank: number
  tied: boolean
  kind: ThermalKind
}

function buildRows(counties: ScreeningCounty[], cohort: CohortFilter): RankedRow[] {
  const filtered =
    cohort === 'all'
      ? counties
      : counties.filter((c) => thermalKind(c) === cohort)

  const sorted = [...filtered].sort((a, b) => {
    if (b.screeningScore !== a.screeningScore) return b.screeningScore - a.screeningScore
    return a.name.localeCompare(b.name)
  })

  const scoreCounts = new Map<number, number>()
  for (const c of sorted) {
    scoreCounts.set(c.screeningScore, (scoreCounts.get(c.screeningScore) ?? 0) + 1)
  }

  const rows: RankedRow[] = []
  let i = 0
  while (i < sorted.length) {
    const score = sorted[i].screeningScore
    const runEnd = i + (scoreCounts.get(score) ?? 1)
    const displayRank = i + 1
    const tied = (scoreCounts.get(score) ?? 1) > 1
    for (let j = i; j < runEnd; j++) {
      const county = sorted[j]
      rows.push({
        county,
        displayRank,
        tied,
        kind: thermalKind(county),
      })
    }
    i = runEnd
  }
  return rows
}

interface Props {
  counties: ScreeningCounty[]
  selectedFips: string | null
  onSelect: (fips: string) => void
  cohort: CohortFilter
  onCohortChange: (cohort: CohortFilter) => void
  focusFips: Set<string>
  ignoreFips: Set<string>
  onToggleFocus: (fips: string) => void
  onToggleIgnore: (fips: string) => void
  query?: string
}

export function RankedCountyList({
  counties,
  selectedFips,
  onSelect,
  cohort,
  onCohortChange,
  focusFips,
  ignoreFips,
  onToggleFocus,
  onToggleIgnore,
  query = '',
}: Props) {
  const q = query.trim().toLowerCase()
  const base = q
    ? counties.filter((c) => c.name.toLowerCase().includes(q))
    : counties
  const rows = buildRows(base, cohort)

  const focusCount = focusFips.size
  const ignoreCount = ignoreFips.size

  return (
    <div className="ranked-list">
      <div className="ranked-list-header">
        <h2>Ranked counties</h2>
        <p className="checklist-cue">
          Leave with ~{FOCUS_CAP} focus / ~{IGNORE_CAP} ignore counties
          <span className="muted">
            {' '}
            ({focusCount}/{FOCUS_CAP} focus · {ignoreCount}/{IGNORE_CAP} ignore)
          </span>
        </p>
      </div>

      <div className="cohort-tabs" role="tablist" aria-label="Thermal cohort filter">
        <button
          type="button"
          role="tab"
          aria-selected={cohort === 'gradient'}
          className={cohort === 'gradient' ? 'cohort-tab active' : 'cohort-tab'}
          onClick={() => onCohortChange('gradient')}
        >
          Gradient control
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={cohort === 'heat-flow'}
          className={cohort === 'heat-flow' ? 'cohort-tab active' : 'cohort-tab'}
          onClick={() => onCohortChange('heat-flow')}
        >
          Heat-flow proxy
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={cohort === 'all'}
          className={cohort === 'all' ? 'cohort-tab active' : 'cohort-tab'}
          onClick={() => onCohortChange('all')}
        >
          All (not comparable)
        </button>
      </div>

      {cohort === 'all' && (
        <div className="cohort-warn" role="status">
          Scores are not scientifically comparable across thermal metrics. Prefer Gradient
          or Heat-flow lists for ranking.
        </div>
      )}

      <div className="ranked-list-meta muted tiny">
        {rows.length} counties
        {cohort === 'gradient' && ' · ranked within gradient cohort'}
        {cohort === 'heat-flow' && ' · ranked within heat-flow cohort'}
        {cohort === 'all' && ' · statewide rank (mixed metrics)'}
        {q && ` · filtered by “${query.trim()}”`}
      </div>

      <ul className="county-rows">
        {rows.map(({ county, displayRank, tied, kind }) => {
          const conf = county.confidence
          const demoted = conf === 'Low' || conf === 'Unknown'
          const isFocus = focusFips.has(county.countyFips)
          const isIgnore = ignoreFips.has(county.countyFips)
          const rankLabel = cohort === 'all' ? county.rank : displayRank

          return (
            <li
              key={county.countyFips}
              className={[
                'county-row',
                selectedFips === county.countyFips ? 'selected' : '',
                demoted ? 'row-demoted' : '',
                isFocus ? 'is-focus' : '',
                isIgnore ? 'is-ignore' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <button
                type="button"
                className="county-row-main"
                onClick={() => onSelect(county.countyFips)}
              >
                <span className="row-rank">
                  #{rankLabel}
                  {tied && <span className="tied-cue">tied</span>}
                </span>
                <span className="row-name">{county.name}</span>
                <span className="row-score">{county.screeningScore.toFixed(1)}</span>
                <span className="row-chips">
                  <span className={`conf-badge conf-${conf.toLowerCase()}`}>{conf}</span>
                  <span className={`metric-chip metric-${kind}`}>
                    {kind === 'gradient' && 'Gradient'}
                    {kind === 'heat-flow' && 'HF'}
                    {kind === 'none' && 'None'}
                  </span>
                </span>
              </button>
              <div className="row-marks">
                <button
                  type="button"
                  className={isFocus ? 'mark-btn focus on' : 'mark-btn focus'}
                  disabled={!isFocus && focusCount >= FOCUS_CAP}
                  title={
                    isFocus
                      ? 'Remove focus'
                      : focusCount >= FOCUS_CAP
                        ? `Focus cap (${FOCUS_CAP}) reached`
                        : 'Mark focus'
                  }
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleFocus(county.countyFips)
                  }}
                >
                  Focus
                </button>
                <button
                  type="button"
                  className={isIgnore ? 'mark-btn ignore on' : 'mark-btn ignore'}
                  disabled={!isIgnore && ignoreCount >= IGNORE_CAP}
                  title={
                    isIgnore
                      ? 'Remove ignore'
                      : ignoreCount >= IGNORE_CAP
                        ? `Ignore cap (${IGNORE_CAP}) reached`
                        : 'Mark ignore'
                  }
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleIgnore(county.countyFips)
                  }}
                >
                  Ignore
                </button>
              </div>
            </li>
          )
        })}
        {rows.length === 0 && (
          <li className="county-row empty-rows muted">No counties in this cohort.</li>
        )}
      </ul>
    </div>
  )
}
