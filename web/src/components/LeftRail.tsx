import { type ReactNode } from 'react'
import { LayerControls, type LayerToggles } from './LayerControls'

interface Props {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
  listOpen: boolean
  onListOpenChange: (open: boolean) => void
  layers: LayerToggles
  onLayersChange: (next: LayerToggles) => void
  evidenceActive: boolean
  /** Ranked list — omit in evidence mode */
  list?: ReactNode
}

/**
 * Left workspace rail: docked layer controls + optional collapsible ranked list.
 * Entire rail collapses to a thin strip so the map can dominate.
 */
export function LeftRail({
  collapsed,
  onCollapsedChange,
  listOpen,
  onListOpenChange,
  layers,
  onLayersChange,
  evidenceActive,
  list,
}: Props) {
  if (collapsed) {
    return (
      <aside className="left-rail left-rail-collapsed" aria-label="Workspace rail">
        <button
          type="button"
          className="left-rail-expand"
          aria-expanded={false}
          onClick={() => onCollapsedChange(false)}
          title="Show list and layers"
        >
          <span className="left-rail-expand-label">List &amp; layers</span>
        </button>
      </aside>
    )
  }

  return (
    <aside className="left-rail" aria-label="Workspace rail">
      <div className="left-rail-toolbar">
        <span className="left-rail-toolbar-title">Workspace</span>
        <button
          type="button"
          className="left-rail-hide"
          onClick={() => onCollapsedChange(true)}
          title="Hide left panel — map expands"
          aria-label="Hide left panel"
        >
          Hide
          <span className="left-rail-hide-chevron" aria-hidden>
            ‹
          </span>
        </button>
      </div>

      <div className="left-rail-layers">
        <LayerControls
          layers={layers}
          onChange={onLayersChange}
          evidenceActive={evidenceActive}
        />
      </div>

      {list != null && (
        <div className="left-rail-list-section">
          <button
            type="button"
            className="left-rail-list-toggle"
            aria-expanded={listOpen}
            onClick={() => onListOpenChange(!listOpen)}
          >
            <span>Ranked counties</span>
            <span className="muted tiny">{listOpen ? 'Hide' : 'Show'}</span>
          </button>
          {listOpen && <div className="left-rail-list-body">{list}</div>}
        </div>
      )}
    </aside>
  )
}
