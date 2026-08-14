import type { CompareSlot } from '../lib/compareSlot'
import { MAX_COMPARE } from '../lib/compareSlot'

interface Props {
  slots: CompareSlot[]
  onRemove: (id: string) => void
  onClear: () => void
  hint?: string | null
}

function fmtMean(v: number | null, unit: string): string {
  if (v == null) return '—'
  return `${v.toFixed(1)} ${unit}`
}

function fmtKm(v: number | null): string {
  if (v == null) return '—'
  return `${v} km`
}

function softMeans(slot: CompareSlot): boolean {
  return slot.siteConfidence === 'None' || slot.siteConfidence === 'Low'
}

export function ComparePanel({ slots, onRemove, onClear, hint }: Props) {
  const empty = slots.length === 0

  return (
    <section className="compare-panel" aria-label="Compare evidence">
      <div className="compare-panel-bar">
        <div className="compare-panel-title">
          <h2>Compare evidence</h2>
          <span className="muted tiny">
            {slots.length}/{MAX_COMPARE} pinned · evidence fields only — not a ranking
          </span>
        </div>
        {slots.length > 0 && (
          <button type="button" className="linkish" onClick={onClear}>
            Clear all
          </button>
        )}
      </div>

      {hint && <p className="compare-hint">{hint}</p>}

      {empty ? (
        <p className="compare-empty muted">
          Pin up to {MAX_COMPARE} Point/AOI evidence snapshots to compare control quality
          side-by-side — not a ranking, not a score.
        </p>
      ) : (
        <div className="compare-table-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th scope="col">Field</th>
                {slots.map((s) => (
                  <th key={s.id} scope="col">
                    <div className="compare-col-head">
                      <span className={`compare-kind kind-${s.kind}`}>
                        {s.kind === 'point' ? 'Point' : 'AOI'}
                      </span>
                      <span className="compare-label" title={s.label}>
                        {s.label}
                      </span>
                      <button
                        type="button"
                        className="compare-remove"
                        aria-label={`Remove ${s.label}`}
                        onClick={() => onRemove(s.id)}
                      >
                        ×
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Evidence verb</th>
                {slots.map((s) => (
                  <td key={s.id}>{s.evidenceVerb}</td>
                ))}
              </tr>
              <tr>
                <th scope="row">Confidence</th>
                {slots.map((s) => (
                  <td key={s.id}>
                    <strong className={`conf conf-${s.siteConfidence.toLowerCase()}`}>
                      {s.siteConfidence}
                    </strong>
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row">Points (n)</th>
                {slots.map((s) => (
                  <td key={s.id}>{s.nearbyCount}</td>
                ))}
              </tr>
              <tr>
                <th scope="row">Nearest km</th>
                {slots.map((s) => (
                  <td key={s.id}>{fmtKm(s.nearestKm)}</td>
                ))}
              </tr>
              <tr>
                <th scope="row">Gradient mean</th>
                {slots.map((s) => (
                  <td
                    key={s.id}
                    className={softMeans(s) ? 'compare-soft' : undefined}
                  >
                    {fmtMean(s.localGradientMean, '°C/km')}
                    <span className="muted tiny"> n={s.gradientPointCount}</span>
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row">Heat-flow mean</th>
                {slots.map((s) => (
                  <td
                    key={s.id}
                    className={softMeans(s) ? 'compare-soft' : undefined}
                  >
                    {fmtMean(s.localHeatflowMean, 'mW/m²')}
                    <span className="muted tiny"> n={s.heatflowPointCount}</span>
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row">Transmission ~km</th>
                {slots.map((s) => (
                  <td key={s.id}>
                    {s.transmissionDistKm == null
                      ? '—'
                      : `~${Math.round(s.transmissionDistKm)} km`}
                    <div className="muted tiny">grid proxy</div>
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row">County context</th>
                {slots.map((s) => (
                  <td key={s.id}>
                    <span className="compare-county">{s.countySummary}</span>
                    <div className="muted tiny">not a pin score</div>
                  </td>
                ))}
              </tr>
              <tr className="compare-demoted">
                <th scope="row">Land context</th>
                {slots.map((s) => (
                  <td key={s.id}>
                    <span className="compare-land">{s.landSummary}</span>
                    <div className="muted tiny">ownership / minerals not in-app</div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
