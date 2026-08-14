import type { ScreeningCounty, ScreeningFactor } from '../types/screening'

interface Props {
  county: ScreeningCounty | null
  /** Whether this county is on the local Phase 3 watchlist. */
  watched?: boolean
  onToggleWatch?: () => void
  watchDisabledReason?: string | null
}

function fmtMean(v: number | null | undefined, digits = 1): string {
  if (v == null || Number.isNaN(v)) return '—'
  return v.toFixed(digits)
}

function isTdepthMetric(metric: string | undefined): boolean {
  return !!metric && metric.startsWith('tdepth')
}

function resolveTexnetStatus(county: ScreeningCounty): 'caution' | 'clear' | 'unknown' {
  const s = (county.texnetStatus || '').toLowerCase()
  if (s === 'caution' || s === 'clear' || s === 'unknown') return s
  if (county.texnetCaution === true) return 'caution'
  if (county.texnetCaution === false) return 'clear'
  return 'unknown'
}

function resolvePadusStatus(county: ScreeningCounty): 'friction' | 'clear' | 'unknown' {
  const s = (county.padusStatus || '').toLowerCase()
  if (s === 'friction' || s === 'clear' || s === 'unknown') return s
  if (county.padusFriction === true) return 'friction'
  if (county.padusFriction === false) return 'clear'
  return 'unknown'
}

function RiskStatusChips({ county }: { county: ScreeningCounty }) {
  const tex = resolveTexnetStatus(county)
  const pad = resolvePadusStatus(county)
  const texLabel =
    tex === 'caution' ? 'Caution' : tex === 'clear' ? 'Clear' : 'Unknown'
  const padLabel =
    pad === 'friction' ? 'Friction' : pad === 'clear' ? 'Clear' : 'Unknown'
  return (
    <div className="risk-status-row" aria-label="Risk layer status">
      <span className={`risk-chip risk-${tex}`}>
        TexNet: <strong>{texLabel}</strong>
      </span>
      <span className={`risk-chip risk-${pad === 'friction' ? 'caution' : pad}`}>
        PAD-US: <strong>{padLabel}</strong>
      </span>
    </div>
  )
}

function InfraRaw({
  factor,
  softSubstationNote,
}: {
  factor: ScreeningFactor
  softSubstationNote: boolean
}) {
  if (factor.rawValue == null) return <span>—</span>
  return (
    <span>
      ~{Math.round(factor.rawValue)} km
      <div className="muted tiny">grid proximity proxy — not interconnection</div>
      {softSubstationNote && (
        <div className="muted tiny">
          Distance uses nearest line or substation (min) when both layers are present —
          still not interconnection feasibility.
        </div>
      )}
    </span>
  )
}

function ThermalFactorBlock({
  county,
  factor,
  isModelTdepth,
}: {
  county: ScreeningCounty
  factor: ScreeningFactor
  isModelTdepth: boolean
}) {
  const activeIsGradient = factor.metric === 'gradient_C_per_km'
  const hasDual =
    county.gradientMean != null ||
    county.heatflowMean != null ||
    (county.gradientN != null && county.gradientN > 0) ||
    (county.heatflowN != null && county.heatflowN > 0)

  return (
    <div className="factor">
      <div className="factor-title">
        {factor.label}{' '}
        <span className="muted">(weight {(factor.weight * 100).toFixed(0)}%)</span>
      </div>
      <div className="factor-grid">
        <span>Raw (in score)</span>
        <span>
          {factor.rawValue == null ? '—' : factor.rawValue} {factor.rawUnit}
          {county.thermalControlCount != null && !isModelTdepth && (
            <span className="muted tiny"> · n={county.thermalControlCount}</span>
          )}
        </span>
        <span>Score</span>
        <span>{factor.score0to100.toFixed(1)} / 100</span>
        <span>Contribution</span>
        <span>{factor.weightedContribution.toFixed(1)}</span>
      </div>

      {isModelTdepth && (county.tdepthMean != null || county.tdepthKm != null) && (
        <div className="thermal-companion muted tiny">
          <div className="thermal-companion-title">Model T@depth (in score)</div>
          <div>
            Mean: {fmtMean(county.tdepthMean)} °C
            {county.tdepthKm != null ? ` @ ${county.tdepthKm} km` : ''}
          </div>
        </div>
      )}

      {county.measuredControlCount != null && (
        <div className="muted tiny measured-control-note">
          Measured control count (confidence densification): n=
          {county.measuredControlCount}
          {isModelTdepth ? ' — does not replace model T@depth in opportunity score' : ''}
        </div>
      )}

      {hasDual ? (
        <div className="thermal-companion muted tiny">
          <div className="thermal-companion-title">
            {isModelTdepth
              ? 'IHFC companion (QC / context — not opportunity)'
              : 'Companion metric (panel context)'}
          </div>
          <div>
            Gradient: {fmtMean(county.gradientMean)} °C/km
            {county.gradientN != null ? ` (n=${county.gradientN})` : ''}
            {!isModelTdepth && (activeIsGradient ? ' · in score' : ' · context only')}
          </div>
          <div>
            Heat flow: {fmtMean(county.heatflowMean)} mW/m²
            {county.heatflowN != null ? ` (n=${county.heatflowN})` : ''}
            {!isModelTdepth && (!activeIsGradient ? ' · in score' : ' · context only')}
          </div>
        </div>
      ) : (
        !isModelTdepth && (
          <p className="muted tiny">
            County scoring uses active metric only; Point/AOI panels show both local means.
          </p>
        )
      )}

      <div className="muted tiny">
        {factor.source} · {factor.vintage}
      </div>
    </div>
  )
}

export function DetailPanel({
  county,
  watched = false,
  onToggleWatch,
  watchDisabledReason = null,
}: Props) {
  if (!county) {
    return (
      <div className="detail-panel empty">
        <p>
          Select a county from the ranked list or the map, or open{' '}
          <strong>Tools → Point check</strong> for click-level evidence.
        </p>
      </div>
    )
  }

  const thermal = county.factors.find((f) => f.id === 'thermal')
  const infra = county.factors.find((f) => f.id === 'infra')
  const isModelTdepth =
    county.modelThermal === true || isTdepthMetric(thermal?.metric)
  const isFallback = thermal?.metric === 'heat_flow_mWm2'
  const infraMentionsSubstation = /substation/i.test(infra?.label ?? '')
  const topDrivers = county.drivers.slice(0, 2)

  const metricChip = isModelTdepth
    ? 'Model T@depth'
    : isFallback
      ? 'Heat-flow fallback'
      : 'Gradient'

  return (
    <div className="detail-panel">
      <div className="detail-title-row">
        <h2>
          #{county.rank} {county.name} County
        </h2>
        {onToggleWatch && (
          <button
            type="button"
            className={watched ? 'linkish active-toggle' : 'linkish'}
            onClick={onToggleWatch}
            disabled={Boolean(watchDisabledReason) && !watched}
            title={
              watchDisabledReason && !watched
                ? watchDisabledReason
                : watched
                  ? 'Remove from local watchlist'
                  : 'Add to local watchlist'
            }
          >
            {watched ? 'Watching' : 'Watch'}
          </button>
        )}
      </div>
      <div className="score-row">
        <div>
          <div className="label">Screening score</div>
          <div className="big">{county.screeningScore.toFixed(1)}</div>
          {isModelTdepth && county.tdepthMean != null && (
            <div
              className="muted tiny score-tdepth"
              title="Raw model T@depth (Stanford) — not measured BHT"
            >
              {fmtMean(county.tdepthMean)} °C
              {county.tdepthKm != null ? ` @ ${county.tdepthKm} km` : ''}
            </div>
          )}
        </div>
        <div>
          <div className="label">Confidence</div>
          <div className={`big conf conf-${county.confidence.toLowerCase()}`}>
            {county.confidence}
          </div>
        </div>
      </div>

      <RiskStatusChips county={county} />

      <div className="detail-summary-meta">
        <span
          className={`metric-chip ${
            isModelTdepth
              ? 'metric-tdepth'
              : isFallback
                ? 'metric-heat-flow'
                : 'metric-gradient'
          }`}
          title={
            isModelTdepth
              ? 'Model T@depth (Stanford) — not measured BHT'
              : isFallback
                ? 'Heat-flow fallback (gradient unavailable)'
                : 'Geothermal gradient'
          }
        >
          {metricChip}
        </span>
      </div>

      {topDrivers.length > 0 && (
        <ul className="drivers drivers-top">
          {topDrivers.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}

      <details className="detail-section" open>
        <summary>Why this rank</summary>
        <ul className="drivers">
          {county.drivers.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </details>

      <details className="detail-section">
        <summary>Factors</summary>
        <div className="factors">
          {thermal && (
            <ThermalFactorBlock
              county={county}
              factor={thermal}
              isModelTdepth={isModelTdepth}
            />
          )}
          {infra && (
            <div className="factor">
              <div className="factor-title">
                {infra.label}{' '}
                <span className="muted">(weight {(infra.weight * 100).toFixed(0)}%)</span>
              </div>
              <div className="factor-grid">
                <span>Raw</span>
                <InfraRaw factor={infra} softSubstationNote={infraMentionsSubstation} />
                <span>Score</span>
                <span>{infra.score0to100.toFixed(1)} / 100</span>
                <span>Contribution</span>
                <span>{infra.weightedContribution.toFixed(1)}</span>
              </div>
              <div className="muted tiny">
                {infra.source} · {infra.vintage}
              </div>
            </div>
          )}
          {county.factors
            .filter((f) => f.id !== 'thermal' && f.id !== 'infra')
            .map((f) => (
              <div key={f.id} className="factor">
                <div className="factor-title">
                  {f.label}{' '}
                  <span className="muted">(weight {(f.weight * 100).toFixed(0)}%)</span>
                </div>
                <div className="factor-grid">
                  <span>Raw</span>
                  <span>
                    {f.rawValue == null ? '—' : f.rawValue} {f.rawUnit}
                  </span>
                  <span>Score</span>
                  <span>{f.score0to100.toFixed(1)} / 100</span>
                  <span>Contribution</span>
                  <span>{f.weightedContribution.toFixed(1)}</span>
                </div>
                <div className="muted tiny">
                  {f.source} · {f.vintage}
                </div>
              </div>
            ))}
        </div>
      </details>

      <details className="detail-section">
        <summary>Limitations</summary>
        <ul className="limitations">
          {county.limitations.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </details>
    </div>
  )
}
