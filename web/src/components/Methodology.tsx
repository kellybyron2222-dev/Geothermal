interface Meta {
  methodologyVersion?: string
  disclaimer?: string
  weights?: { thermal: number; infra: number }
}

export function Methodology({ meta }: { meta: Meta | null }) {
  return (
    <main className="methodology">
      <h2>Scoring methodology (v{meta?.methodologyVersion ?? '0.3.0'})</h2>
      <p>{meta?.disclaimer}</p>

      <h3>Formula</h3>
      <pre>
        {`ScreeningScore = ${((meta?.weights?.thermal ?? 0.6) * 100).toFixed(0)}% × thermal_proxy
               + ${((meta?.weights?.infra ?? 0.4) * 100).toFixed(0)}% × transmission_proximity`}
      </pre>

      <h3>Factors</h3>
      <ul>
        <li>
          <strong>Thermal (60%)</strong> — geothermal <em>gradient</em> (°C/km) from
          IHFC when available; otherwise heat-flow fallback (mW/m²). Winsorized and
          scaled within Texas (cohorts scaled separately). Gradient preference requires
          a minimum control count of <strong>gradient_n ≥ 3</strong>; thinner gradient
          samples stay on heat-flow (or none).
        </li>
        <li>
          <strong>Transmission proximity (40%)</strong> — distance from county
          representative point to nearest HIFLD transmission line (nearer is better).
          This is <em>not</em> interconnection feasibility.
        </li>
        <li>
          <strong>Confidence</strong> — separate badge from thermal control count for
          the <em>active</em> metric (gradient_n when gradient is used; heatflow_n when
          heat-flow is used). Does not change the primary rank formula.
        </li>
      </ul>

      <h3>Cohorts (not cross-comparable)</h3>
      <ul>
        <li>
          Gradient and heat-flow scores are scaled within their own cohorts. A “100” in
          one cohort is <strong>not</strong> scientifically comparable to a “100” in the
          other.
        </li>
        <li>
          The explorer defaults to the <strong>Gradient control</strong> cohort list.
          Use Heat-flow proxy for the fallback cohort; All shows statewide rank with an
          explicit non-comparability warning.
        </li>
      </ul>

      <h3>Point check (Phase 2.1)</h3>
      <ul>
        <li>Click mode gathers evidence at a point — <strong>not</strong> a site score.</li>
        <li>Local thermal: unweighted IHFC points within 40 km (gradient and/or heat flow).</li>
        <li>Site confidence from point count + nearest distance.</li>
        <li>
          Transmission: nearest cell on a ~0.15° (~15 km) precomputed HIFLD proximity grid.
        </li>
        <li>County rank on the panel is regional context only.</li>
        <li>
          In Point check, county ScreeningScore map fill is muted so the click does not
          borrow choropleth authority.
        </li>
      </ul>

      <h3>AOI evidence check (Phase 2.2)</h3>
      <ul>
        <li>
          Draw one polygon or upload a single GeoJSON <strong>Polygon</strong> (Feature or
          one-feature FeatureCollection). MultiPolygon and multi-feature uploads are rejected.
        </li>
        <li>
          Local thermal control: IHFC points <em>inside</em> the AOI (point-in-polygon). If none
          are inside, nearest-to-AOI distance uses a vertex-boundary proxy.
        </li>
        <li>
          There is <strong>no AOI ScreeningScore</strong> — AOI is spatial aggregation of the
          same evidence family as Point check, not a new scoring product.
        </li>
        <li>
          Transmission: min ~km from AOI centroid / sample vertices on the same ~0.15° grid
          proxy — not survey distance, not interconnection.
        </li>
        <li>
          Intersecting county rank/score is demoted context only (“not a score for this AOI”).
        </li>
        <li>
          In AOI check, county ScreeningScore map fill is muted (evidence-only basemap), same
          quarantine as Point check.
        </li>
      </ul>

      <h3>What this is not</h3>
      <ul>
        <li>Not a geothermal resource assessment</li>
        <li>Not temperature-at-depth or reservoir quality</li>
        <li>Not a drill target or lease recommendation</li>
        <li>Not ERCOT interconnection analysis</li>
      </ul>

      <p className="muted">
        Full write-up: docs/scoring-methodology.md in the repository.
      </p>
    </main>
  )
}
