interface Meta {
  methodologyVersion?: string
  disclaimer?: string
  weights?: { thermal: number; infra: number }
}

export function Methodology({ meta }: { meta: Meta | null }) {
  return (
    <main className="methodology">
      <h2>Scoring methodology (v{meta?.methodologyVersion ?? '0.2.0'})</h2>
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
          scaled within Texas (cohorts scaled separately).
        </li>
        <li>
          <strong>Transmission proximity (40%)</strong> — distance from county
          representative point to nearest HIFLD transmission line (nearer is better).
          This is <em>not</em> interconnection feasibility.
        </li>
        <li>
          <strong>Confidence</strong> — separate badge from heat-flow control point
          density. Does not change the primary rank formula.
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
