import type { ScreeningCounty } from '../types/screening'

interface Props {
  county: ScreeningCounty | null
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
        {county.factors.map((f) => (
          <div key={f.id} className="factor">
            <div className="factor-title">
              {f.label}{' '}
              <span className="muted">
                (weight {(f.weight * 100).toFixed(0)}%)
              </span>
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
