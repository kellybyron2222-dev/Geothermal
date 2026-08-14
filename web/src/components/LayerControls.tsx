/** Exclusive county fill — one mode at a time. */
export type CountyFillMode = 'score' | 'tdepth' | 'outlines'

export interface LayerToggles {
  fill: CountyFillMode
  /** IHFC heat-flow points (mW/m² — not BHT; gradient deferred). Default OFF. */
  thermalPoints: boolean
  /** Constrained local IDW surface near IHFC controls. Default OFF. */
  thermalSurface: boolean
  /** Barnes 1992 surface geologic map (USGS DS 170). Context only. Default OFF. */
  geology: boolean
}

export const DEFAULT_LAYER_TOGGLES: LayerToggles = {
  fill: 'score',
  thermalPoints: false,
  thermalSurface: false,
  geology: false,
}

const FILL_OPTIONS: { id: CountyFillMode; label: string }[] = [
  { id: 'score', label: 'Screening score' },
  { id: 'tdepth', label: 'Model T@depth' },
  { id: 'outlines', label: 'Outlines only' },
]

interface Props {
  layers: LayerToggles
  onChange: (next: LayerToggles) => void
  /** When true, fill control is disabled — map forces neutral county fill. */
  evidenceActive?: boolean
}

/** Docked map-layer controls for the left workspace rail (never floats on the map). */
export function LayerControls({
  layers,
  onChange,
  evidenceActive = false,
}: Props) {
  const setOverlay = (
    key: 'thermalPoints' | 'thermalSurface' | 'geology',
    value: boolean,
  ) => {
    onChange({ ...layers, [key]: value })
  }
  const setFill = (fill: CountyFillMode) => {
    if (evidenceActive) return
    onChange({ ...layers, fill })
  }

  return (
    <div className="layer-controls layer-controls-docked" role="group" aria-label="Map layers">
      <div className="layer-controls-header">
        <div className="layer-controls-title" id="layer-controls-heading">
          Map layers
        </div>
      </div>

      <div id="layer-controls-body" className="layer-controls-body">
        <div
          className={
            evidenceActive ? 'layer-fill-group layer-fill-disabled' : 'layer-fill-group'
          }
          role="radiogroup"
          aria-labelledby="layer-fill-label"
          aria-disabled={evidenceActive}
        >
          <div className="layer-section-label" id="layer-fill-label">
            County fill
          </div>
          <div className="layer-fill-segment">
            {FILL_OPTIONS.map((opt) => (
              <label
                key={opt.id}
                className={
                  layers.fill === opt.id
                    ? 'layer-fill-opt layer-fill-opt-active'
                    : 'layer-fill-opt'
                }
              >
                <input
                  type="radio"
                  name="county-fill"
                  value={opt.id}
                  checked={layers.fill === opt.id}
                  disabled={evidenceActive}
                  onChange={() => setFill(opt.id)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
          {evidenceActive && (
            <div className="layer-note layer-evidence-note">
              Evidence mode: county fill muted
            </div>
          )}
        </div>

        <div className="layer-section-label">Overlays</div>
        <label className="layer-check">
          <input
            type="checkbox"
            checked={layers.thermalPoints}
            onChange={(e) => setOverlay('thermalPoints', e.target.checked)}
          />
          <span className="layer-check-stack">
            <span>Measured heat-flow points</span>
            <span className="layer-note">
              IHFC q (mW/m²) — not BHT; gradient deferred
            </span>
          </span>
        </label>
        <label className="layer-check">
          <input
            type="checkbox"
            checked={layers.thermalSurface}
            onChange={(e) => setOverlay('thermalSurface', e.target.checked)}
          />
          <span className="layer-check-stack">
            <span>Local heat-flow surface</span>
            <span className="layer-note">
              Constrained IDW ≤25 km · ≥2 q controls · gaps stay empty
            </span>
          </span>
        </label>
        <label className="layer-check">
          <input
            type="checkbox"
            checked={layers.geology}
            onChange={(e) => setOverlay('geology', e.target.checked)}
          />
          <span className="layer-check-stack">
            <span>Geologic map (Barnes 1992)</span>
            <span className="layer-note">
              Surface geology + faults — USGS DS 170; not in ranking
            </span>
          </span>
        </label>
      </div>
    </div>
  )
}
