import type { SiteDossier } from '../lib/siteEval'
import { LandContextSection } from './LandContextSection'

interface Props {
  dossier: SiteDossier | null
  onClear: () => void
  onAddToCompare?: () => void
  compareFull?: boolean
}

export function SiteDossierPanel({
  dossier,
  onClear,
  onAddToCompare,
  compareFull,
}: Props) {
  if (!dossier) {
    return (
      <div className="detail-panel empty">
        <p>
          <strong>Point check</strong> mode is on. Click the map for local thermal
          control and grid proximity evidence — not a site score.
        </p>
      </div>
    )
  }

  const weak =
    dossier.siteConfidence === 'None' ||
    dossier.siteConfidence === 'Low' ||
    dossier.nearbyCount <= 1

  const strongCounty =
    (dossier.countyRank != null && dossier.countyRank <= 30) ||
    (dossier.countyScore != null && dossier.countyScore >= 70)
  const weakLocal =
    dossier.siteConfidence === 'None' || dossier.siteConfidence === 'Low'
  const countyVsLocalConflict = strongCounty && weakLocal

  return (
    <div className="detail-panel">
      <div className="detail-top">
        <h2>Point evidence check</h2>
        <div className="detail-top-actions">
          {onAddToCompare && (
            <button
              type="button"
              className="linkish"
              disabled={compareFull}
              title={
                compareFull
                  ? 'Compare is full (3/3) — remove a pin first'
                  : 'Pin this evidence snapshot to Compare'
              }
              onClick={onAddToCompare}
            >
              Add to compare
            </button>
          )}
          <button type="button" className="linkish" onClick={onClear}>
            Clear
          </button>
        </div>
      </div>
      <p className="muted">
        {dossier.lat.toFixed(4)}°N, {Math.abs(dossier.lon).toFixed(4)}°W
      </p>

      <div
        className={`verb-banner verb-${dossier.evidenceVerb
          .replace(/\s+/g, '-')
          .toLowerCase()}`}
      >
        {dossier.evidenceVerb}
      </div>

      {dossier.countyModelThermal && (
        <div className="metric-banner model-tdepth">
          <strong>Local IHFC = measured control / QC</strong>
          <div className="muted tiny banner-detail">
            Not a Stanford T@depth site opportunity score. County screening (if shown) uses
            model T@depth as regional context only.
          </div>
          {dossier.countyTdepthMean != null && (
            <div className="muted tiny banner-detail">
              County model T@depth: {dossier.countyTdepthMean.toFixed(1)} °C
              {dossier.countyTdepthKm != null ? ` @ ${dossier.countyTdepthKm} km` : ''}
            </div>
          )}
        </div>
      )}

      <h3>Local control quality</h3>
      <div className="score-row">
        <div>
          <div className="label">Points ≤ 40 km</div>
          <div className="big">{dossier.nearbyCount}</div>
        </div>
        <div>
          <div className="label">Nearest control</div>
          <div className="big">
            {dossier.nearestKm == null ? '—' : `${dossier.nearestKm} km`}
          </div>
        </div>
      </div>
      <p>
        Site confidence:{' '}
        <strong className={`conf conf-${dossier.siteConfidence.toLowerCase()}`}>
          {dossier.siteConfidence}
        </strong>
      </p>
      {dossier.siteConfidence === 'None' && (
        <p className="warn">
          Insufficient local thermal control — do not treat this click as thermally
          supported.
        </p>
      )}

      {weak ? (
        <details className="weak-means">
          <summary>Show local means (weak control)</summary>
          <p className="muted tiny">
            Control quality above is the lead signal — means are secondary when n≤1 or
            confidence is None/Low.
          </p>
          <div className="score-row weakened">
            <div>
              <div className="label">Gradient mean (n={dossier.gradientPointCount})</div>
              <div className="big">
                {dossier.localGradientMean == null
                  ? '—'
                  : `${dossier.localGradientMean.toFixed(1)}`}
              </div>
              <div className="muted tiny">°C/km · unweighted ≤40 km disk</div>
            </div>
            <div>
              <div className="label">Heat-flow mean (n={dossier.heatflowPointCount})</div>
              <div className="big">
                {dossier.localHeatflowMean == null
                  ? '—'
                  : `${dossier.localHeatflowMean.toFixed(1)}`}
              </div>
              <div className="muted tiny">mW/m² · unweighted ≤40 km disk</div>
            </div>
          </div>
        </details>
      ) : (
        <>
          <h3>Local thermal means</h3>
          <div className="score-row">
            <div>
              <div className="label">Gradient mean (n={dossier.gradientPointCount})</div>
              <div className="big">
                {dossier.localGradientMean == null
                  ? '—'
                  : `${dossier.localGradientMean.toFixed(1)}`}
              </div>
              <div className="muted tiny">°C/km · unweighted ≤40 km disk</div>
            </div>
            <div>
              <div className="label">Heat-flow mean (n={dossier.heatflowPointCount})</div>
              <div className="big">
                {dossier.localHeatflowMean == null
                  ? '—'
                  : `${dossier.localHeatflowMean.toFixed(1)}`}
              </div>
              <div className="muted tiny">mW/m² · unweighted ≤40 km disk</div>
            </div>
          </div>
        </>
      )}

      {dossier.nearestPoints.length > 0 && (
        <>
          <h3>Nearest IHFC points</h3>
          <ul className="drivers">
            {dossier.nearestPoints.map((p) => (
              <li key={`${p.lat}-${p.lon}-${p.distKm}`}>
                {p.distKm} km
                {p.grad != null && <> · grad {p.grad} °C/km</>}
                {p.q != null && <> · q {p.q} mW/m²</>}
              </li>
            ))}
          </ul>
        </>
      )}

      <h3>Transmission proximity</h3>
      <p>
        {dossier.transmissionDistKm == null
          ? '—'
          : `~${Math.round(dossier.transmissionDistKm)} km to nearest mapped line`}
      </p>
      <p className="muted tiny">
        Coarse proxy from ~0.15° (~15 km) grid — not survey distance, not interconnection
        feasibility
      </p>

      <h3>County screening context</h3>
      <p className="muted tiny">Not a score for this click point</p>
      {dossier.countyName ? (
        <p>
          {dossier.countyName} County
          {dossier.countyRank != null && <> · rank #{dossier.countyRank}</>}
          {dossier.countyScore != null && (
            <> · screening {dossier.countyScore.toFixed(1)}</>
          )}
          {dossier.countyModelThermal && (
            <>
              {' '}
              · county thermal: <strong>model T@depth</strong>
              {dossier.countyTdepthMean != null && (
                <>
                  {' '}
                  ({dossier.countyTdepthMean.toFixed(1)} °C
                  {dossier.countyTdepthKm != null
                    ? ` @ ${dossier.countyTdepthKm} km`
                    : ''}
                  )
                </>
              )}
            </>
          )}
          {!dossier.countyModelThermal &&
            dossier.countyThermalMetric === 'gradient_C_per_km' && (
              <> · county thermal: <strong>gradient</strong></>
            )}
          {!dossier.countyModelThermal &&
            dossier.countyThermalMetric === 'heat_flow_mWm2' && (
              <> · county thermal: <strong>heat-flow fallback</strong></>
            )}
        </p>
      ) : (
        <p className="muted">No containing scored county for this click.</p>
      )}
      {countyVsLocalConflict && (
        <p className="warn">
          Strong county screening vs weak local control — do not inherit county rank as
          site quality.
        </p>
      )}

      <LandContextSection
        countyNames={dossier.countyName ? [dossier.countyName] : []}
      />

      <h3>Limitations</h3>
      <ul className="limitations">
        {dossier.limitations.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </div>
  )
}
