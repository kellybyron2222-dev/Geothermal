# Judgment Director — Unlock Phase 2.2 (AOI polygon evidence)

**Date:** 2026-08-13  
**Director role:** Decide whether to unlock Phase 2.2 after Phase 1 + 2.1 stop  
**Inputs:** `06-post-n1n5-red-blue-judgment.md` (STOP) · `phase2.md` · `tasks.md` · Point check honesty locks · user request “run next build phase”  
**Product constraints:** explainable decisions ≠ GIS sprawl · Texas beachhead · heuristics · solo-dev · maps are inputs

---

## Verdict

### **UNLOCK Phase 2.2 — razor-thin AOI evidence check only.**

| Question | Decision |
|----------|----------|
| Unlock 2.2 now? | **Yes** |
| Force enhance-soon micro-slice first? | **No** — do not block on S7 panel numbers |
| Fold free enhance-soon while building? | **Optional only:** soft verbs (S1-lite) if touching shared evidence UI; **do not** schedule S7 as a 2.2 dependency |
| Open 2.3 / 2.4? | **No** |

**Why unlock now:** Prior stop closed honesty for county rank-first + Point check quarantine (N1–N5). User explicitly asked for the next build phase. Roadmap next candidate is 2.2. 2.1 honesty holds; enhance-soon (S7/S1) remains polish, not a gate.

**Why not block on S7:** Dual panel numbers address thin gradient-cohort bounce on the *county* surface. AOI is a new evidence mode that must inherit Point check quarantine — orthogonal to S7. Prefer shipping AOI honesty over delaying for panel polish.

---

## Minimal honest scope (this slice only)

**Product name in UI:** **AOI evidence check** (not “AOI dossier”, not “site score”).

### User flow (minimal)

1. Enter **AOI check** mode (alongside / instead of Point check — same evidence family, not a new product).
2. Draw **one simple polygon** on the Texas map **or** upload a tiny GeoJSON polygon (one Feature / FeatureCollection with one Polygon).
3. Right panel shows **AOI evidence** (same hierarchy as Point check):
   - **Control quality first** — `n` of IHFC points intersecting / buffered to AOI (reuse ≤40 km disk logic adapted to polygon: points **inside AOI** + optional nearest-to-boundary km; state rule in methodology)
   - Site/AOI confidence band + evidence verb (evidence-state language)
   - Local thermal means **de-emphasized when weak** (collapse behind `<details>` when n≤1 or Low/None)
   - Transmission: **~km** via existing coarse `infra_grid.json` (~0.15°) — e.g. min distance from AOI centroid or min over a few sample points; always “grid proxy” copy
   - **County screening context demoted** — intersecting county name(s) + rank/score as context only (“not a score for this AOI”)
   - Situational limitations list
4. Map in AOI mode: **no ScreeningScore heatmap authority** (neutral / evidence-only basemap treatment consistent with Point check).

### Data (reuse only)

| Asset | Role |
|-------|------|
| `thermal_points.json` | Local control inside / near AOI |
| `infra_grid.json` | Coarse transmission proxy |
| Existing `prospects.*` | County context for intersected counties |

**No new heavy GIS assets.** No full HIFLD lines in browser.

### Deliverable list (NOW backlog)

| ID | Deliverable |
|----|-------------|
| **A1** | AOI mode toggle + draw **one** polygon (MapLibre draw or equivalent minimal) |
| **A2** | Optional upload: single Polygon GeoJSON only (reject MultiPolygon / many features with clear message) |
| **A3** | AOI evidence panel reusing Point check hierarchy (control → means → ~km grid → county context → limitations) |
| **A4** | Evidence-only map quarantine in AOI mode (no county ScreeningScore as visual lead) |
| **A5** | Methodology note: AOI rules (point-in-polygon / buffer, grid proxy, no AOI ScreeningScore) |
| **A6** *(optional free)* | Soften shared evidence verbs if editing that path anyway — not a stop blocker |

**Hard cap:** A1–A5. If schedule slips, ship **draw + panel honesty (A1+A3+A4)** before upload (A2) and methodology polish (A5).

---

## REJECT in 2.2 (explicit)

| Reject | Why |
|--------|-----|
| **AOI / site ScreeningScore** | Contaminates county screening; Point check lock stands |
| Parcels / ownership / minerals | Phase 2.4 |
| Side-by-side compare 2–3 AOIs | Phase 2.3 |
| Geocoder / address search | GIS trap |
| Full HIFLD / live ERCOT / interconnection | Cosplay engineering |
| Multi-polygon campaigns, layer catalog, saved AOIs, PDF export | Scope sprawl |
| ML / IDW surfaces, DIY BHT→gradient | Black-box / research |
| Dual choropleths | Already rejected for this phase family |
| Editing county weights / growing gradient cohort | Not this slice |
| **S7 as a blocker** | Enhance-soon on county panel; do not serialize behind AOI |

---

## How AOI evidence must reuse Point check honesty

| Point check lock | AOI must |
|------------------|----------|
| Control quality first | Lead with `n`, nearest control km (to AOI), confidence — not big means |
| Weak means demoted | Same `<details>` / visual subordination when weak |
| ~km grid transmission | Same `infra_grid` proxy + “not survey / not interconnection” copy |
| County context demoted | Intersecting county rank/score = context only; copy: not an AOI score |
| No ScreeningScore for the click | **No ScreeningScore for the AOI** — ever in this slice |
| Evidence verbs, not recommendations | Same verb family; prefer soften if free (A6) |
| Neutral map in evidence mode | AOI mode does not paint authority via county score fill |

**Framing:** AOI is **spatial aggregation of the same evidence**, not a new scoring product.

---

## Stop criteria for Phase 2.2

Stop when **ALL** are true:

1. User can draw (or upload) one Texas polygon and leave with control quality + ~km grid + demoted county context — without a fake AOI score.
2. User cannot reasonably mistake county ScreeningScore / rank for AOI quality (copy + layout + map quarantine).
3. Control weakness appears **before** loud thermal means when evidence is thin.
4. Transmission cannot be read as precise engineering distance.
5. Upload path (if shipped) rejects multi-feature / MultiPolygon without silent partial success.
6. County explorer + Point check still work if AOI path fails; no coupling that breaks Phase 1.
7. Scope lock held: no compare, parcels, geocoder, full HIFLD, AOI ScreeningScore.

**Then stop.** Run short red/blue on A1–A5 only. Do **not** open 2.3/2.4 until a later judgment unlocks.

---

## Deferred (still deferred)

- S7 dual panel gradient + HF numbers (county surface)
- S1–S6 residual polish except optional A6 verb soften
- West TX reweight (F14)
- Tighter thermal radius / nearest markers
- Phase 2.3 compare · 2.4 parcels

---

## Director one-liner

**Unlock 2.2 now as an AOI evidence check that clones Point check honesty — control first, ~km grid, demoted county context, zero ScreeningScore — and reject every GIS expansion that does not change that evidence read.**
