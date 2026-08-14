# Blue Team Defense — Phase 2.1 Site Dossier

**Role:** Blue team (product defense)  
**Scope:** Texas next-gen county screening (Phase 1) + click-map site dossiers (Phase 2.1)  
**Date:** 2026-08-13  
**Thesis check:** Maps/datasets are inputs; the product answers *where should I focus, and why?*

---

## 1. What works — and why it creates decision value

### County screening still does the hard first job

ScreeningScore (`0.60` thermal / `0.40` transmission) gives a developer a **prioritized Texas shortlist** without pretending counties are drill targets. Gradient-preferred thermal (heat-flow fallback) matches next-gen intuition: *temperature rise with depth*, not a smoothed heat-flow story. Transmission as proximity proxy (explicitly *not* interconnection) keeps infrastructure in the decision without inviting false ERCOT diligence.

**Decision value:** “Which 10–20 counties deserve desk time this quarter?” — answered in one ranked, factor-explained list.

### Site evaluate closes the Phase 1 credibility gap without a second product

Phase 1’s honest weakness: counties are coarse. A sophisticated buyer asks “fine, but what about *this* lease / plant / co-lo pin?” Phase 2.1 answers that in the **same Explorer**, same factors, same honesty envelope:

| Dossier element | Decision use |
|-----------------|--------------|
| Lat/lon + marker | Pin a real candidate, not a choropleth blob |
| Containing county rank/score | Bridges statewide shortlist → local check |
| Local IHFC ≤40 km (grad + q means + nearest points) | Shows whether county thermal is locally supported or sparse |
| HIFLD grid proximity (~0.15°) | Site-level grid distance without shipping a 13MB line layer |
| Explicit limitations | Prevents “dossier = resource assessment” overclaim |

**Decision value:** “Is this pin worth a follow-up call / land check / deeper thermal study?” — yes/no with *evidence*, not a prettier map.

### Explainability is the product surface

Nearest control points (distance + grad + q), control count in radius, and hard-coded limitation copy make the dossier **auditable**. A geothermal developer can disagree with weights; they cannot claim the app hid the thinness of local control. That is how screening tools earn a second session.

### Static-first architecture protects the thesis

Precomputed `thermal_points.json` + `infra_grid.json`, client-side dossier build, GitHub Pages — no layer toggles, no PostGIS, no live ERCOT. The UX stays “click → synthesis,” not “explore datasets.” That is the anti–GIS-toy constraint working as designed.

---

## 2. What to KEEP unchanged

Do **not** reopen these in Phase 2.1 polish:

1. **Two opportunity factors only** (thermal 0.60 / infra 0.40) at county level; site dossier *reports* local evidence, it does not invent a second opaque site score.
2. **Gradient preferred / heat flow fallback** language and methodology version discipline (v0.3).
3. **No interactive layer explorer** (wells, lines, heat-flow rasters as toggles).
4. **Transmission = proximity proxy** labeling; never “interconnection ready.”
5. **Limitations always visible** on county detail and site dossier.
6. **Static delivery** (no API / PostGIS for this slice).
7. **Site evaluate as a mode on the same screen**, not a separate app or route sprawl.
8. **Out of 2.1 stays out:** parcels, AOI polygons, compare matrix, live ERCOT / queue data.

These locks are why Phase 2.1 advances decisions instead of cartography.

---

## 3. Evidence it advances Phase 2 goals without becoming a GIS toy

Phase 2 success criterion (*phase2.md*): user clicks a candidate and leaves with **county context + local thermal evidence + grid proximity — without opening a GIS.**

| Phase 2 goal | Phase 2.1 evidence | GIS-toy avoidance |
|--------------|--------------------|-------------------|
| Move from “which counties?” to “what about this site?” | Mode toggle → click → dossier panel with pin | No second map product; map is still the click surface for synthesis |
| Still explainable | Nearest IHFC points listed; dual thermal display; limitations | Evidence list ≠ layer stack |
| Still static-first | Compact JSON + ~0.15° infra grid lookup | Avoids shipping raw HIFLD lines / interactive symbology |
| Solo-dev slice before 2.2+ | Point dossier only; no AOI/compare/parcels | Scope ladder respected |

**Credibility argument to a developer:** Phase 1 ranks the state; Phase 2.1 stress-tests a pin against the *same* thermal and grid axes, with local control density visible. That is diligence scaffolding, not map tourism.

**What would have made it a GIS toy (and was correctly not shipped):** toggleable transmission polylines, well clouds, geocoder-as-product, parcel fills, score-without-caveats, or a “site attractiveness” black-box number.

---

## 4. In-scope Phase 2.1 polish (not 2.2+)

Enhancements that sharpen *decision clarity* of the existing click→dossier loop. Defer anything that needs polygons, compare UI, or land data.

| Priority | Polish | Why (still 2.1) |
|----------|--------|-----------------|
| **P0** | Show **distance to nearest gradient point** (and whether local mean is n=1 vs n=many) more prominently | Developers discount a “mean” without n; reduces false confidence |
| **P0** | Empty-control UX: when `nearbyCount == 0`, lead with “insufficient local thermal control” before blank means | Decision is often “don’t waste time here yet” |
| **P1** | One-line **bridge copy**: “County screening says X; local IHFC within 40 km says Y / sparse” | Makes the Phase 1→2.1 handoff explicit |
| **P1** | Label infra grid resolution in UI (~0.15°) next to km figure | Honest precision; matches methodology tone |
| **P1** | Keyboard/button: re-click or “evaluate another site” without hunting Clear | Faster pin-shopping workflow |
| **P2** | Cite IHFC / HIFLD vintage + methodology link from dossier footer | Trust without leaving the decision surface |
| **P2** | Slight visual distinction: site marker vs county selection (already partially there — keep minimal) | Orientation only; no new layers |
| **Defer** | AOI draw/upload, side-by-side compare, parcels, dual site scores, live queue data | Explicitly Phase 2.2–2.4 / later |

**Rule for polish tickets:** if it does not change what a developer *concludes about a pin in under a minute*, defer it.

---

## Blue-team verdict

Phase 2.1 is a **correct wedge extension**: same thesis, same factors, finer question. Keep the dossier as *explained evidence + limitations*, not a new score or a layer playground. Polish for control density, empty states, and county↔site narrative — then stop and let judgment/red team challenge before 2.2.
