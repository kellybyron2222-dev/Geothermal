import type { ScreeningMeta } from '../types/screening'

export function Methodology({ meta }: { meta: ScreeningMeta | null }) {
  const version = meta?.methodologyVersion ?? '0.4.0'
  const thermalW = meta?.weights?.thermal ?? 0.55
  const infraW = meta?.weights?.infra ?? 0.45
  const dataDepth = meta?.dataDepth === true || meta?.thermalMode === 'stanford_tdepth'
  const status = meta?.dataDepthStatus ?? null
  const residual = meta?.residualRisk ?? null
  const riskPending =
    status === 'thermal_spine_live_risk_pending' ||
    /risk_pending|pending|partial/i.test(status ?? '') ||
    Boolean(residual)

  return (
    <main className="methodology">
      <h2>Scoring methodology (v{version})</h2>
      <p>{meta?.disclaimer}</p>

      {dataDepth && riskPending && (
        <section className="residual-risk-section">
          <h3>Residual risk (Data Depth)</h3>
          <p>
            <strong>Data Depth STOP met with accepted residuals</strong> when risk layers are
            pending/partial — Unknown stays loud (never silent False). Phase 3
            (local watchlist / digests / rule candidates / export) is complete;
            accounts / email remain deferred.
          </p>
          {residual && <p className="muted">{residual}</p>}
          <ul>
            <li>
              Status code: <code>{status ?? 'thermal_spine_live_risk_pending'}</code>
            </li>
            <li>
              TexNet: {meta?.riskLayerStatus?.texnet ?? 'see county chips'} · PAD-US:{' '}
              {meta?.riskLayerStatus?.padus ?? 'see county chips'} · Well density:{' '}
              {meta?.riskLayerStatus?.rrcWellDensity ?? 'see sources'}
            </li>
          </ul>
        </section>
      )}

      <h3>v0.4 Data Depth (primary)</h3>
      <ul>
        <li>
          <strong>Model T@depth (55%)</strong> — county mean Stanford / GDR 1592 temperature
          at a documented depth slice (typically 3–5 km). Always labeled{' '}
          <em>model</em> — not measured BHT or well temperature. Metric id form{' '}
          <code>tdepth_C_kmX</code>.
        </li>
        <li>
          <strong>Grid proximity (45%)</strong> — min distance to HIFLD transmission line
          and/or substation when both exist. Grid proximity proxy —{' '}
          <em>not</em> interconnection feasibility.
        </li>
        <li>
          Formula:{' '}
          <code>
            ScreeningScore = {(thermalW * 100).toFixed(0)}% × S_tdepth +{' '}
            {(infraW * 100).toFixed(0)}% × S_infra
          </code>
          {dataDepth ? ' (active in this build).' : ' when Data Depth features are present.'}
        </li>
        <li>
          <strong>Model vs measured</strong> — opportunity thermal is the model prior.
          Measured SMU/BHT/IHFC counts densify <em>confidence only</em>; they do not replace
          model T@depth in the opportunity score. No DIY statewide BHT→opportunity path.
        </li>
        <li>
          <strong>Confidence densification</strong> — separate badge from measured control
          count, well-density band, and demotions (TexNet caution / PAD-US friction only when{' '}
          <em>True</em>; Unknown does not demote as Clear). Never blended into a fake “truth
          score.”
        </li>
        <li>
          <strong>Nullable risk flags</strong> — <code>texnetCaution</code> /{' '}
          <code>padusFriction</code> are <code>true | false | null</code> with status chips
          Caution/Friction · Clear · Unknown (not loaded).
        </li>
        <li>
          <strong>No live upstream</strong> — static extracts and published layers only. No
          scrape, no live CAD/API feeds in the explorer.
        </li>
      </ul>

      <h3>Formula</h3>
      <pre>
        {dataDepth
          ? `ScreeningScore = ${(thermalW * 100).toFixed(0)}% × model_T@depth
               + ${(infraW * 100).toFixed(0)}% × grid_proximity`
          : `ScreeningScore = ${(thermalW * 100).toFixed(0)}% × thermal_proxy
               + ${(infraW * 100).toFixed(0)}% × transmission_proximity`}
      </pre>

      <h3>Legacy fallback (no T@depth)</h3>
      <ul>
        <li>
          When Data Depth features are missing: <code>thermalMode=legacy_ihfc</code>, weights
          60% thermal / 40% infra.
        </li>
        <li>
          Thermal: geothermal <em>gradient</em> (°C/km) from IHFC when{' '}
          <strong>gradient_n ≥ 3</strong>; otherwise heat-flow fallback (mW/m²). Scaled within
          metric cohorts — not cross-comparable.
        </li>
        <li>
          IHFC remains QC / citation / legacy fallback — not primary opportunity when Data
          Depth is active.
        </li>
      </ul>

      <h3>Cohorts (not cross-comparable)</h3>
      <ul>
        <li>
          Model T@depth, gradient, and heat-flow scores are scaled within their own cohorts. A
          “100” in one cohort is <strong>not</strong> scientifically comparable to a “100” in
          another.
        </li>
        <li>
          The explorer defaults to <strong>T@depth (model)</strong> when any counties use
          model thermal; otherwise Gradient control. Under Data Depth (
          <code>thermalMode=stanford_tdepth</code>), legacy Gradient / Heat-flow / All cohort
          tabs are hidden so ranking stays in the model T@depth cohort. All (when shown) carries
          an explicit non-comparability warning.
        </li>
      </ul>

      <h3>Point check (Phase 2.1)</h3>
      <ul>
        <li>Click mode gathers evidence at a point — <strong>not</strong> a site score.</li>
        <li>Local thermal: unweighted IHFC points within 40 km (gradient and/or heat flow).</li>
        <li>
          Under Data Depth, site/AOI evidence is <strong>measured-control local</strong> (IHFC
          QC) — not a model T@depth site score; county T@depth stays regional screening context.
        </li>
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

      <h3>Compare evidence (Phase 2.3)</h3>
      <ul>
        <li>
          Pin up to <strong>3</strong> Point and/or AOI evidence snapshots into a side-by-side
          table of the same honesty-hierarchy fields (control, confidence, means, transmission
          ~km, county names, limitations, demoted land context).
        </li>
        <li>
          Compare shows <strong>pinned evidence fields only</strong> — not a site score, not a
          ranking, and there is no CompareScore or winner column. With two or more pins, a banner
          near means restates that cue.
        </li>
        <li>
          Means cells soften when confidence is None/Low or nearby count ≤ 1. Point vs AOI use
          kind-aware n / nearest sublabels (≤40 km disk vs inside AOI).
        </li>
        <li>
          County ScreeningScore / rank stay behind expand; visible names are demoted context only.
        </li>
        <li>
          Land context in compare repeats ownership-not-in-app honesty and points to citations in
          the evidence panel — never an ownership ladder or land score.
        </li>
      </ul>

      <h3>Land context (Phase 2.4)</h3>
      <ul>
        <li>
          Land context is <strong>honesty + outbound research pointers</strong>, not parcel GIS
          and not ownership certainty. Subtitle: not parcel ownership.
        </li>
        <li>
          Parcel ownership, title, and mineral estate are <strong>out of scope</strong> — this
          product does not resolve owners, parcel IDs, or land scores. Research elsewhere — not
          in-app land coverage.
        </li>
        <li>
          Static citations only: Texas Comptroller CAD / county directory (surface ownership
          research start), Railroad Commission public datasets (mineral-context pointer, not
          mineral ownership), and optional Texas GLO overview. One external-records note sits
          above the list. No scrape, no live CAD API.
        </li>
        <li>
          Drawn/uploaded AOI polygons are user-supplied boundaries — not verified parcels.
        </li>
        <li>
          Land context does <strong>not</strong> enter ScreeningScore and does not create a
          site / AOI / Compare land score.
        </li>
      </ul>

      <h3>County detail honesty</h3>
      <ul>
        <li>
          When opportunity thermal is model T@depth, DetailPanel banners{' '}
          <strong>Model T@depth (Stanford) — not measured BHT</strong> and surfaces
          tdepth mean / depth slice plus measured control count for confidence.
        </li>
        <li>
          Dual IHFC gradient / heat-flow means may still appear as QC / context only — not in
          ScreeningScore under Data Depth mode.
        </li>
        <li>
          Transmission raw display uses ~km and states grid proximity proxy — not interconnection.
          Substation-aware labels get a soft note that min(line, substation) is still not
          interconnection.
        </li>
        <li>
          TexNet / PAD-US status chips show Caution/Friction, Clear, or Unknown — not loaded.
          Missing layers never display as Clear.
        </li>
      </ul>

      <h3>Map layers (context toggles)</h3>
      <ul>
        <li>
          County fill is exclusive: Screening score, Model T@depth, or Outlines only.
        </li>
        <li>
          <strong>Measured heat-flow points</strong> — IHFC GHFDB heat flow q (mW/m²) only.
          Color-coded low → high. Geothermal gradient points are deferred (different units; not
          mixed). <em>Not bottom-hole temperature.</em> Optional constrained IDW surface (≤25 km,
          ≥2 nearby controls) fills only where local q control exists. Neither enters
          ScreeningScore.
        </li>
        <li>
          <strong>Geologic map (Barnes 1992)</strong> — USGS DS 170 digital of the BEG Geologic
          Map of Texas (surface units + faults). Context overlay only;{' '}
          <strong>not used in ScreeningScore</strong>. Tip: set County fill to Outlines for a
          clearer view.
        </li>
      </ul>

      <h3>Phase 3 (watchlist &amp; rules) — complete</h3>
      <ul>
        <li>
          <strong>Local watchlist</strong> — pin up to 25 counties in the browser
          (localStorage). Export/import JSON backup. No accounts, no email, no push.
        </li>
        <li>
          <strong>Change digests</strong> run when the Watchlist panel opens and compare
          this <em>published score pack</em> (methodology version + layer vintages /
          publishId) to your last-seen snapshot for watched counties only. Digests are
          not alerts from live grids or upstream APIs. Mark as seen stays manual.
        </li>
        <li>
          <strong>Frozen prospect rules (v0)</strong> — <em>Rule candidates</em> are a
          shortlist, not a ScreeningScore and not the ranked-list Focus shortlist:
          <ul>
            <li>Thermal mode = Stanford T@depth (model labeled)</li>
            <li>Confidence ≥ Medium (exclude Low / Unknown)</li>
            <li>Rank ≤ 40 within T@depth cohort</li>
            <li>No PAD-US Fee GAP1–2 friction</li>
            <li>TexNet caution → badge + stable demote (not hard exclude)</li>
          </ul>
        </li>
        <li>
          Session <strong>Focus</strong> (ranked list) does not feed digests; only{' '}
          <strong>Watch</strong> does.
        </li>
        <li>
          Rule candidates are labeled <strong>Not a score · rules v0</strong>.
          Rule text edits require a new judgment version.
        </li>
        <li>
          Point/AOI evidence shows containing-county <strong>model T@depth</strong> as
          regional context only — never a site ScreeningScore.
        </li>
        <li>
          <strong>Barnes 1992 geologic map</strong> remains a context overlay only —
          never enters ScreeningScore and is not a Phase 3 deliverable.
        </li>
      </ul>

      <h3>What this is not</h3>
      <ul>
        <li>Not a geothermal resource assessment</li>
        <li>Not measured temperature-at-depth or reservoir quality (model T@depth is labeled model)</li>
        <li>Not a drill target or lease recommendation</li>
        <li>Not ERCOT interconnection analysis</li>
        <li>Not parcel ownership, title, or mineral-estate resolution</li>
        <li>Not email/push alerts or cloud-synced watchlists (scoped Phase 3 is local-first; accounts/email deferred)</li>
        <li>Not a ScreeningScore replacement — rule candidates are an explainable shortlist only</li>
      </ul>

      <p className="muted">
        Full write-up: docs/scoring-methodology.md in the repository.
      </p>
    </main>
  )
}
