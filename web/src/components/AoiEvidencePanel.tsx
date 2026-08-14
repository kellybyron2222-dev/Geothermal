import { useRef } from 'react'
import type { AoiDossier } from '../lib/aoiEval'
import { LandContextSection } from './LandContextSection'

interface Props {
  dossier: AoiDossier | null
  draftCount: number
  onClosePolygon: () => void
  onClear: () => void
  onUploadText: (text: string) => void
  uploadError: string | null
  onAddToCompare?: () => void
  compareFull?: boolean
}

export function AoiEvidencePanel({
  dossier,
  draftCount,
  onClosePolygon,
  onClear,
  onUploadText,
  uploadError,
  onAddToCompare,
  compareFull,
}: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null)

  const onFile = async (file: File | null) => {
    if (!file) return
    const text = await file.text()
    onUploadText(text)
    if (fileRef.current) fileRef.current.value = ''
  }

  if (!dossier) {
    return (
      <div className="detail-panel empty">
        <h2>AOI evidence check</h2>
        <p>
          Click the map to add vertices (≥3), then <strong>Close polygon</strong>, or
          upload a single Polygon GeoJSON — not an AOI score.
        </p>
        <div className="aoi-controls">
          <button
            type="button"
            className="linkish"
            disabled={draftCount < 3}
            onClick={onClosePolygon}
          >
            Close polygon{draftCount > 0 ? ` (${draftCount})` : ''}
          </button>
          <button type="button" className="linkish" onClick={onClear} disabled={draftCount === 0}>
            Clear
          </button>
          <label className="aoi-upload linkish">
            Upload GeoJSON
            <input
              ref={fileRef}
              type="file"
              accept=".json,.geojson,application/geo+json,application/json"
              onChange={(e) => void onFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>
        {draftCount > 0 && draftCount < 3 && (
          <p className="muted tiny aoi-draft-hint">
            {draftCount} vertex{draftCount === 1 ? '' : 'es'} — need {3 - draftCount} more to
            close.
          </p>
        )}
        {uploadError && <p className="warn">{uploadError}</p>}
      </div>
    )
  }

  const weak =
    dossier.siteConfidence === 'None' ||
    dossier.siteConfidence === 'Low' ||
    dossier.nearbyCount <= 1

  return (
    <div className="detail-panel">
      <div className="detail-top">
        <h2>AOI evidence check</h2>
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
      <p className="muted tiny">
        Area ≈ {dossier.areaKm2.toLocaleString()} km² · centroid{' '}
        {dossier.centroid.lat.toFixed(3)}°N, {Math.abs(dossier.centroid.lon).toFixed(3)}°W
      </p>

      <div className="aoi-controls">
        <label className="aoi-upload linkish">
          Upload GeoJSON
          <input
            ref={fileRef}
            type="file"
            accept=".json,.geojson,application/geo+json,application/json"
            onChange={(e) => void onFile(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>
      {uploadError && <p className="warn">{uploadError}</p>}

      <div
        className={`verb-banner verb-${dossier.evidenceVerb.replace(/\s+/g, '-').toLowerCase()}`}
      >
        {dossier.evidenceVerb}
      </div>

      <h3>Local control quality</h3>
      <div className="score-row">
        <div>
          <div className="label">Points inside AOI</div>
          <div className="big">{dossier.nearbyCount}</div>
        </div>
        <div>
          <div className="label">Nearest to AOI</div>
          <div className="big">
            {dossier.nearestKm == null ? '—' : `${dossier.nearestKm} km`}
          </div>
        </div>
      </div>
      <p>
        AOI confidence:{' '}
        <strong className={`conf conf-${dossier.siteConfidence.toLowerCase()}`}>
          {dossier.siteConfidence}
        </strong>
      </p>
      {dossier.siteConfidence === 'None' && (
        <p className="warn">
          Insufficient local thermal control — do not treat this AOI as thermally supported.
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
              <div className="muted tiny">°C/km · points inside AOI</div>
            </div>
            <div>
              <div className="label">Heat-flow mean (n={dossier.heatflowPointCount})</div>
              <div className="big">
                {dossier.localHeatflowMean == null
                  ? '—'
                  : `${dossier.localHeatflowMean.toFixed(1)}`}
              </div>
              <div className="muted tiny">mW/m² · points inside AOI</div>
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
              <div className="muted tiny">°C/km · points inside AOI</div>
            </div>
            <div>
              <div className="label">Heat-flow mean (n={dossier.heatflowPointCount})</div>
              <div className="big">
                {dossier.localHeatflowMean == null
                  ? '—'
                  : `${dossier.localHeatflowMean.toFixed(1)}`}
              </div>
              <div className="muted tiny">mW/m² · points inside AOI</div>
            </div>
          </div>
        </>
      )}

      {dossier.nearestPoints.length > 0 && (
        <>
          <h3>IHFC points inside AOI</h3>
          <ul className="drivers">
            {dossier.nearestPoints.map((p) => (
              <li key={`${p.lat}-${p.lon}-${p.distKm}`}>
                {p.distKm} km from centroid
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
        Coarse proxy from ~0.15° (~15 km) grid (centroid / sample vertices) — not survey
        distance, not interconnection feasibility
      </p>

      <h3>County screening context</h3>
      <p className="muted tiny">Not a score for this AOI</p>
      {dossier.intersectingCounties.length > 0 ? (
        <ul className="aoi-county-context">
          {dossier.intersectingCounties.map((c) => (
            <li key={c.countyFips}>
              {c.countyName} County
              {c.countyRank != null && <> · rank #{c.countyRank}</>}
              {c.countyScore != null && <> · screening {c.countyScore.toFixed(1)}</>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">No intersecting scored counties detected for this AOI.</p>
      )}

      <LandContextSection
        countyNames={dossier.intersectingCounties.map((c) => c.countyName)}
        aoiBoundaryCaveat
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
