import type { SiteDossier } from '../lib/siteEval'

interface Props {
  dossier: SiteDossier | null
  onClear: () => void
}

export function SiteDossierPanel({ dossier, onClear }: Props) {
  if (!dossier) {
    return (
      <div className="detail-panel empty">
        <p>
          <strong>Site evaluate</strong> mode is on. Click the map to build a site
          dossier.
        </p>
      </div>
    )
  }

  return (
    <div className="detail-panel">
      <div className="detail-top">
        <h2>Site dossier</h2>
        <button type="button" className="linkish" onClick={onClear}>
          Clear
        </button>
      </div>
      <p className="muted">
        {dossier.lat.toFixed(4)}°N, {Math.abs(dossier.lon).toFixed(4)}°W
      </p>

      <h3>County context</h3>
      {dossier.countyName ? (
        <p>
          {dossier.countyName} County
          {dossier.countyRank != null && <> · rank #{dossier.countyRank}</>}
          {dossier.countyScore != null && (
            <> · screening {dossier.countyScore.toFixed(1)}</>
          )}
        </p>
      ) : (
        <p className="muted">Outside scored Texas counties (or click missed a polygon).</p>
      )}

      <h3>Local thermal (≤ 40 km)</h3>
      <div className="score-row">
        <div>
          <div className="label">Gradient mean</div>
          <div className="big">
            {dossier.localGradientMean == null
              ? '—'
              : `${dossier.localGradientMean.toFixed(1)}`}
          </div>
          <div className="muted tiny">°C/km</div>
        </div>
        <div>
          <div className="label">Heat-flow mean</div>
          <div className="big">
            {dossier.localHeatflowMean == null
              ? '—'
              : `${dossier.localHeatflowMean.toFixed(1)}`}
          </div>
          <div className="muted tiny">mW/m²</div>
        </div>
      </div>
      <p className="muted tiny">{dossier.nearbyCount} IHFC control points in radius</p>

      {dossier.nearestPoints.length > 0 && (
        <>
          <h3>Nearest points</h3>
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
          : `${dossier.transmissionDistKm.toFixed(1)} km to nearest mapped line`}
      </p>
      <p className="muted tiny">Grid proximity proxy — not interconnection feasibility</p>

      <h3>Limitations</h3>
      <ul className="limitations">
        {dossier.limitations.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </div>
  )
}
