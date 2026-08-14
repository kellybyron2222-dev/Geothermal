# Scoring Methodology (Phase 1 / v0.3.1)

**Thermal factor:** geothermal **temperature gradient** (preferred), heat flow fallback.  
**Locks:** [DECISIONS.md](DECISIONS.md) D4 · [scoring-critique.md](scoring-critique.md)

`methodology_version: 0.3.1`

---

## What this score is

A **relative Texas county screening index** for early next-gen geothermal prioritization.

## What this score is not

- Resource assessment or heat-in-place  
- Drill target ranking  
- Open- vs closed-loop optimization  
- Interconnection feasibility or NPV  
- Parcel ownership, title, or mineral-estate resolution  

---

## Spatial unit

**Texas counties only.**

---

## Opportunity factors (2)

### A — Thermal potential (weight **0.60**) — gradient preferred

| Item | Detail |
|------|--------|
| **Primary** | Geothermal gradient (°C/km) from IHFC `T_grad_mean` |
| Why gradient | Matches next-gen intuition: temperature rise with depth |
| Calculation | County mean of valid gradient points → winsorize P10–P90 → scale 0–100 in Texas |
| Valid range gate | Drop absurd point values outside ~5–150 °C/km before aggregate |
| **Min-n gate** | Prefer gradient only when `gradient_n >= 3`; thinner gradient control uses heat-flow fallback |
| **Fallback** | If gradient gate fails or no gradient control, use county mean **heat flow** (`q`, mW/m²) with the same winsorize/scale path |
| UI label | “Geothermal gradient” or “Heat-flow fallback” depending on `thermal_metric` |
| **Cross-metric** | `S_thermal` is scaled **within** each cohort. Do **not** treat one statewide ladder as scientifically comparable across metrics. Explorer defaults to the **gradient cohort** list. |
| **Panel dual means** | County DetailPanel may show both `gradientMean`/`gradientN` and `heatflowMean`/`heatflowN` as **context**. Only the active metric enters ScreeningScore. |
| **Do not** | DIY BHT→gradient corrections |

### B — Transmission proximity (weight **0.40**)

Unchanged: HIFLD distance to nearest transmission line (km); nearer is better.  
Label: grid proximity proxy — **not** interconnection feasibility.  
UI raw display: `~{km} km` plus honesty that this is proximity, not interconnection.

---

## Formula

```text
ScreeningScore = 0.60 * S_thermal + 0.40 * S_infra
```

`S_thermal` is always 0–100 relative Texas scale, but the **raw unit** is either °C/km (preferred) or mW/m² (fallback).

---

## Confidence (separate)

From **thermal control count** used for the active metric (gradient_n if gradient, else heatflow_n):

```text
High   | count >= T_high
Medium | T_low <= count < T_high
Low    | 0 < count < T_low
Unknown| count == 0
```

---

## Point check (Phase 2.1)

Click-level evidence — **not** a site ScreeningScore.

- Local thermal: unweighted IHFC points within a **40 km** disk (gradient and/or heat flow means).
- Site confidence from point count + nearest distance.
- Transmission: nearest cell on a ~0.15° (~15 km) precomputed HIFLD proximity grid.
- Containing county rank/score is demoted regional context only.
- Map choropleth is muted in Point mode so the click does not borrow county-score authority.

---

## AOI evidence check (Phase 2.2)

Spatial aggregation of the same evidence family — **no AOI ScreeningScore**.

- Draw one polygon or upload a single GeoJSON Polygon (outer ring only; WGS84 lon/lat).
- Local thermal: IHFC points **inside** the AOI; nearest uses an inside/boundary proxy when empty.
- Transmission: min ~km from centroid / sample vertices on the same grid proxy.
- Intersecting county rank/score is demoted (“not a score for this AOI”).
- Large-AOI means may be collapsed into details; means copy always states this is not an AOI score.

---

## Compare evidence (Phase 2.3)

Side-by-side pin of up to **3** Point and/or AOI evidence snapshots.

- Shows honesty-hierarchy fields only (control, confidence, means, transmission ~km, county names, limitations, demoted land context).
- **Not** a ranking, **not** a CompareScore, and there is no winner column.
- Means cells soften when confidence is None/Low **or** nearby count ≤ 1.
- Kind-aware sublabels: Point “≤40 km disk” vs AOI “inside AOI”.
- County rank / screening digits sit behind expand; names stay visible.
- Land cell cues outbound citations in the evidence panel — never an ownership ladder.

---

## Land context (Phase 2.4)

Honesty + outbound research pointers — **not** parcel GIS and **not** ownership certainty.

- Subtitle: not parcel ownership. Coverage cue: research elsewhere — not in-app land coverage.
- Static citations: Texas Comptroller CAD / county directory, RRC public datasets (mineral-context pointer), optional GLO. External-records note once above the list.
- Drawn/uploaded AOI is not a verified parcel boundary.
- Does **not** enter ScreeningScore and does not create a site / AOI / Compare land score.

---

## Build plan note

| Step | Status |
|------|--------|
| v0.2 heat-flow-only thermal | Shipped (interim) |
| v0.3 gradient-preferred thermal | **Active** |
| Dual **panel** means (gradient + heat flow) | **Shipped** — context only; score formula unchanged |
| Dual choropleths / dual scores | Deferred |

---

## Calibration

Review top/bottom 15 after gradient switch. Freeze weights; change metric with methodology version bump only.
