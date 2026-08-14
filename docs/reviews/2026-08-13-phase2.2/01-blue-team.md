# Blue Team — Phase 2.2 (AOI evidence check)

**Date:** 2026-08-13  
**Slice:** AOI polygon evidence check (A1–A5 + optional A6 verb soften)  
**Code checked:** `aoiEval.ts`, `AoiEvidencePanel.tsx`, `App.tsx` (evidence mode), `MapView.tsx` (aoi), `Methodology.tsx`

---

## Verdict (blue)

Phase 2.2 **ships the unlock’s honesty shape**: spatial aggregation of the Point-check evidence family — not a new scoring product, not GIS sprawl. Keep the quarantine architecture; residual friction is polish, not a failed JTBD.

---

## What works (keep)

### K1 — Product framing matches the lock
- UI name is **AOI evidence check** / **AOI check** (not dossier, not site score).
- Empty state and limitations lead with “not an AOI score.”
- Methodology § AOI explicitly: **no AOI ScreeningScore**; aggregation of the same evidence family as Point check.

### K2 — Control quality leads
- Panel hierarchy: verb → **Local control quality** (`n` inside, nearest-to-AOI km, confidence) → means → transmission → county context → limitations.
- Weak path (`None` / `Low` / `n≤1`) collapses means behind `<details>` with copy that control is the lead signal.
- None state warns: do not treat AOI as thermally supported.

### K3 — No fake AOI ScreeningScore
- `buildAoiDossier` never invents a composite AOI score.
- Softened evidence verbs shared with Point check (`Insufficient` / `Sparse` / `Moderate` / `Adequate control to keep investigating`) — evidence-state language, not recommend/drill.

### K4 — Transmission honesty
- Display is `~N km` (rounded) plus always-on “~0.15° (~15 km) grid … not survey / not interconnection” copy.
- Uses existing `infra_grid.json` sample (centroid + sparse vertices) — no HIFLD in browser.

### K5 — County context demoted
- Section titled **County screening context** with “Not a score for this AOI.”
- Limitations reinforce intersecting county rank/score ≠ AOI quality.
- Cap at 8 counties; sorted by rank for context, not as an AOI ladder.

### K6 — Map quarantine
- AOI mode shares Point-check mute: neutral fill, low opacity, legend “Score fill off — evidence only, not AOI quality.”
- Mutually exclusive with Point check (`enterMode` clears the other); county explorer restored when toggled off.

### K7 — Upload reject path (no silent partial)
- `parseAoiGeoJson` rejects MultiPolygon, multi-feature FeatureCollection, empty FC, bad rings — with explicit errors.
- Does not take the first feature and pretend success.

### K8 — Scope discipline held
- Draw **one** polygon or upload one Polygon; no compare, parcels, geocoder, layer catalog, saved AOIs, AOI ScreeningScore.
- Reuses `thermal_points` + `infra_grid` + existing county assets only.
- County explorer still loads if site assets fail (`siteError` banner; Point/AOI disabled together, Phase 1 list intact).

### K9 — Draw path is minimal and explainable
- Click vertices ≥3 → **Close polygon** / Clear; draft vertex count hint.
- Closed ring rendered as fill+outline; draft as line+verts — readable without Mapbox Draw dependency sprawl.

---

## Decision value (why this creates user value)

| Buyer job | Value delivered |
|-----------|-----------------|
| Geothermal / energy developer | Quick “is there any IHFC control inside *this* lease sketch?” before pad fantasy |
| Infra / land investor | Same axes as Point check at polygon scale; county ranks stay regional backdrop |
| Skeptical scientist | Explicit no-score + point-in-polygon rule + grid proxy + limitations |

**Framing that works:** AOI is **spatial aggregation of the same evidence**, not a second product.

---

## Blue keep-list (do not regress)

1. No AOI ScreeningScore — ever in this phase family.
2. Control-first panel + weak-means demotion.
3. `~km` + grid-proxy copy always visible with transmission.
4. County section demoted copy + limitations line.
5. Neutral basemap in AOI mode.
6. Upload hard-reject of MultiPolygon / multi-feature.
7. Mutual exclusion Point ↔ AOI; county mode recovers cleanly.
8. Methodology AOI bullets stay in sync with `aoiEval` rules.

---

## Blue concessions (honest)

- Draw UX is click-and-button, not CAD — acceptable for MVP evidence, not for lease drafting.
- Large AOIs will aggregate many points and look “confident” — honesty depends on area + limitations remaining visible (see red).
- Means when Medium/High still use large numerals — same pattern as hardened Point check; must not become an AOI score by accident (see red / judgment).
