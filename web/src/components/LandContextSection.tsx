import {
  AOI_PARCEL_BOUNDARY_CAVEAT,
  LAND_CITATIONS,
  LAND_CONTEXT_DISCLAIMER,
  LAND_CONTEXT_EXTERNAL_NOTE,
} from '../lib/landContext'

type Props = {
  /** Intersecting / containing county display names (already resolved). */
  countyNames: string[]
  /** When true, show AOI draw/upload parcel-boundary caveat (L3). */
  aoiBoundaryCaveat?: boolean
}

export function LandContextSection({ countyNames, aoiBoundaryCaveat }: Props) {
  return (
    <section className="land-context" aria-label="Land context">
      <h3>Land context</h3>
      <p className="muted tiny">{LAND_CONTEXT_DISCLAIMER}</p>

      {countyNames.length > 0 ? (
        <p>
          {countyNames.length === 1 ? 'County' : 'Counties'}:{' '}
          {countyNames.map((n) => `${n} County`).join('; ')}
        </p>
      ) : (
        <p className="muted">No intersecting scored county resolved for land research.</p>
      )}

      {aoiBoundaryCaveat && (
        <p className="muted tiny">{AOI_PARCEL_BOUNDARY_CAVEAT}</p>
      )}

      <ul className="land-citations">
        {LAND_CITATIONS.map((c) => (
          <li key={c.id}>
            <a href={c.href} target="_blank" rel="noopener noreferrer">
              {c.label}
            </a>
            <div className="muted tiny">{c.why}</div>
            <div className="muted tiny">{LAND_CONTEXT_EXTERNAL_NOTE}</div>
          </li>
        ))}
      </ul>
    </section>
  )
}
