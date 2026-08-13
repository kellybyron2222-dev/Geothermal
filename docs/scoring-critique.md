# Scoring Critique — Geothermal Developer Perspective

**Audience:** Internal product/tech  
**Stance:** Maximize credibility with geothermal professionals; keep Phase 1 solo-achievable  
**Related:** [scoring-methodology.md](scoring-methodology.md) · [red-team-mvp.md](red-team-mvp.md)

---

## 1. Is county-level ranking the correct unit?

**Verdict: Correct for Phase 1 shipping. Incorrect if you call them prospects.**

### Why counties work for an MVP

- Developers already think in counties for landmen, tax, permitting, and first-pass screening.
- 254 polygons are tractable for static GeoJSON and choropleth UX.
- Aggregating noisy regional datasets to counties **forces honesty** about resolution.

### Why counties will draw professional pushback

- Thermal and structural reality varies **inside** large Texas counties (e.g. Pecos, Brewster, Hudspeth).
- A high county score does **not** mean a leasable fairway exists.
- Grid proximity to a county centroid can misrepresent a county that is half empty basin / half corridor.

### How to stay credible

| Do | Don't |
|----|-------|
| Call them **screening counties** | Call them prospects, leads, or resources |
| Say “first filter before desk GIS” | Imply drill-ready ranking |
| Show county size / caveat on large West Texas counties | Pretend uniform opportunity inside the polygon |
| Plan Phase 2 as AOI / grid / play fairways | Jump to 5 km grids in Phase 1 (solo schedule killer) |

**Recommendation:** Keep counties. Fix the language and UI framing. Finer units are a credibility *upgrade* later, not a Phase 1 requirement.

---

## 2. Are the scoring factors sufficient?

**Verdict: Sufficient for a screening wedge. Insufficient as a technical diligence model — and that is fine if labeled correctly.**

### What v0.2 has

1. Regional thermal proxy (60%)  
2. Transmission proximity (40%)  
3. Well-count confidence (separate)

### What a developer actually cares about (full stack)

| Theme | Phase 1? | Note |
|-------|----------|------|
| Temperature at depth / gradient | Partial | Heat flow ≠ T@depth |
| Depth to target interval | No | Needs geology picks / models |
| Rock / stress / stimability (EGS) | No | Research-grade |
| Natural permeability / aquifers (open loop) | No | Easy to fake with faults |
| Water / offtake / surface use | No | Later |
| Land / minerals | No | Phase 2 |
| True interconnection (capacity, queue, POI) | No | Infra factor is only proximity |
| Capex analogs / well cost | No | Later |

### Are two factors “enough”?

For **“where should I look next on a map of Texas?”** — yes, if explanations are ruthless.

For **“is this a good project?”** — no. Do not let the product drift there.

**Missing but high-value later (not Phase 1):** depth-referenced temperature (carefully corrected BHT or published gradient at depth), and a single depth/basement or sediment-thickness context layer for next-gen reachability.

**Recommendation:** Do not add a third opportunity factor in Phase 1. Add **better thermal science** before adding more weights.

---

## 3. What datasets are scientifically strongest for Phase 1?

Prioritize **published, citable, statewide, peer-or-agency-backed** products over scraped operational mess.

### Tier A — strongest for Phase 1 (prefer these)

| Dataset | Why strong |
|---------|------------|
| **Published heat-flow / geothermal gradient grids or maps** (e.g. SMU node products, USGS geothermal / heat-flow compilations covering Texas) | Designed as regional thermal characterization; citable; better than ad-hoc BHT averages |
| **Texas county boundaries** (official/Census) | Clean unit geometry |
| **HIFLD or other clearly redistributable transmission** (if ERCOT terms block GitHub) | Transparent lineage; good enough for proximity screening |
| **ERCOT transmission** *only if* redistribution for a public demo is clearly allowed | Best operational relevance — license is the risk |

### Tier B — acceptable for confidence, not opportunity

| Dataset | Role |
|---------|------|
| Public well locations / county well counts (RRC or derived) | **Confidence only** — evidence density |
| Published well-count summaries by county | Prefer over raw multi-GB well dumps if available |

### Tier C — valuable later, not Phase 1 opportunity inputs

- Corrected BHT / SMU temperature-at-depth products (when using the **published** product, not DIY correction)
- Basement depth / sediment thickness
- Substations (voltage-aware)
- Fault compilations (context only until a defensible rule exists)

**Solo-dev rule:** One thermal product + one transmission product + one well-count path. Stop.

---

## 4. Which datasets create false confidence?

These make the map look “scientific” while misleading developers:

| Dataset / practice | Why it creates false confidence |
|--------------------|----------------------------------|
| **Raw / lightly treated BHT averages by county** | Circulation bias, uneven depth, oilfield sampling bias; looks like temperature truth |
| **Well density as attractiveness** | Dense oilfields ≠ geothermal reservoir or EGS quality |
| **Fault traces as permeability** | Faults can seal or conduct; presence ≠ producibility |
| **Hot springs** | Surface manifestations ≠ deep next-gen screening in most of Texas |
| **“Known geothermal sites” pins** | Sparse validation points, not a ranking engine |
| **Power plant colocation** without interconnection context | Suggests offtake that may not exist |
| **Unwinsorized heat-flow extremes** | One anomalous cell crowns a county |
| **Centroid-to-line distance on huge counties** | Implies access that may be 80 miles from the interesting acreage |
| **Smooth heat-flow choropleths without confidence** | Visual certainty over sparse control |

**Phase 1 discipline:** If it cannot be explained in one sentence without hedging, it does not enter the opportunity score.

---

## 5. How should opportunity areas be represented on the map?

**Goal:** Orientation + selection, not implied precision.

### Recommended representation (Phase 1)

1. **County choropleth** of Screening Score (single sequential color scale).  
2. **Ranked list is primary**; map mirrors selection (click county ↔ highlight row).  
3. **No well dots, no transmission lines, no fault overlays** on the MVP map.  
4. **Confidence as a non-fill cue** — e.g. hatch, outline style, or badge in the list/panel—not a second competing choropleth.  
5. **Clear legend + permanent disclaimer:** “Regional screening index — not a resource map.”  
6. **Selected county:** strong outline + panel; do not explode into multi-layer inspector.

### Optional (only if free)

- Neutral basemap (minimal labels).  
- Slight opacity so basemap geography remains readable.  

### Avoid

- Hotspot heatmaps that look like continuous “resource.”  
- Diverging color schemes that imply good/bad geology.  
- Bubble markers at centroids (overstates point precision).  
- Dual choropleths (score + confidence) that users will misread as quality.

### Professional framing on the map chrome

> Screening score by county. Thermal proxy + transmission proximity. Not temperature-at-depth, not interconnection feasibility, not a drill recommendation.

---

## Bottom line for credibility vs achievability

| Keep | Change in copy/UX | Defer |
|------|-------------------|-------|
| County unit | “Screening counties,” not prospects | Grid/AOI |
| 2-factor score | Emphasize limitations in panel | 3rd factor |
| Heat-flow primary | Never imply T@depth | DIY BHT correction |
| Transmission proximity | Label as proxy | Substations/queue |
| Wells → confidence | Never sell as reservoir | Well dots on map |
| Choropleth only | List-first UX | Layer GIS |

Counties + two honest factors + a humble map will earn more respect than a beautiful false-precision product.
