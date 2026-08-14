import type { ScreeningCounty, ScreeningFactor } from '../types/screening'

interface Props {
  county: ScreeningCounty | null
}

function fmtMean(v: number | null | undefined, digits = 1): string {
  if (v == null || Number.isNaN(v)) return '—'
  return v.toFixed(digits)
}

function InfraRaw({ factor }: { factor: ScreeningFactor }) {
  if (factor.rawValue == null) return <span>—</span>
  return (
    <span>
      ~{Math.round(factor.rawValue)} km
      <div className="muted tiny">grid proximity proxy — not interconnection</div>
    </span>
  )
}

function ThermalFactorBlock({
  county,
  factor,
}: {
  county: ScreeningCounty
  factor: ScreeningFactor
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
          {county.thermalControlCount != null && (
            <span className="muted tiny"> · n={county.thermalControlCount}</span>
          )}
        </span>
        <span>Score</span>
        <span>{factor.score0to100.toFixed(1)} / 100</span>
        <span>Contribution</span>
        <span>{factor.weightedContribution.toFixed(1)}</span>
      </div>

      {hasDual ? (
        <div className="thermal-companion muted tiny">
          <div className="thermal-companion-title">Companion metric (panel context)</div>
          <div>
            Gradient: {fmtMean(county.gradientMean)} °C/km
            {county.gradientN != null ? ` (n=${county.gradientN})` : ''}
            {activeIsGradient ? ' · in score' : ' · context only'}
          </div>
          <div>
            Heat flow: {fmtMean(county.heatflowMean)} mW/m²
            {county.heatflowN != null ? ` (n=${county.heatflowN})` : ''}
            {!activeIsGradient ? ' · in score' : ' · context only'}
          </div>
        </div>
      ) : (
        <p className="muted tiny">
          County scoring uses active metric only; Point/AOI panels show both local means.
        </p>
      )}

      <div className="muted tiny">
        {factor.source} · {factor.vintage}
      </div>
    </div>
  )
}

export function DetailPanel({ county }: Props) {
  if (!county) {
    return (
      <div className="detail-panel empty">
        <p>
          Select a county from the ranked list or the map, or use{' '}
          <strong>Point check</strong> for click-level evidence.
        </p>
      </div>
    )
  }

  const thermal = county.factors.find((f) => f.id === 'thermal')
  const infra = county.factors.find((f) => f.id === 'infra')
  const isFallback = thermal?.metric === 'heat_flow_mWm2'

  return (
    <div className="detail-panel">
      <h2>
        #{county.rank} {county.name} County
      </h2>
      <div className="score-row">
        <div>
          <div className="label">Screening score</div>
          <div className="big">{county.screeningScore.toFixed(1)}</div>
        </div>
        <div>
          <div className="label">Confidence</div>
          <div className={`big conf conf-${county.confidence.toLowerCase()}`}>
            {county.confidence}
          </div>
        </div>
      </div>

      {isFallback ? (
        <div className="metric-banner fallback">
          County thermal metric: <strong>heat-flow fallback</strong> (gradient unavailable)
        </div>
      ) : (
        <div className="metric-banner gradient">
          County thermal metric: <strong>geothermal gradient</strong>
        </div>
      )}

      <h3>Why this rank</h3>
      <ul className="drivers">
        {county.drivers.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>

      <h3>Factors</h3>
      <div className="factors">
        {thermal && <ThermalFactorBlock county={county} factor={thermal} />}
        {infra && (
          <div className="factor">
            <div className="factor-title">
              {infra.label}{' '}
              <span className="muted">(weight {(infra.weight * 100).toFixed(0)}%)</span>
            </div>
            <div className="factor-grid">
              <span>Raw</span>
              <InfraRaw factor={infra} />
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

      <h3>Limitations</h3>
      <ul className="limitations">
        {county.limitations.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </div>
  )
}
