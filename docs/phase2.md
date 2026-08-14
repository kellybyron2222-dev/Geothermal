# Phase 2 — Site Evaluation

**Status:** Phase 2.2 **DONE** (AOI evidence check stopped) · Phase 2.1 Point check **DONE**  
**Depends on:** Phase 1 county screening (shipped) · Phase 2.1 honesty stop (N1–N5 cleared)  
**Reviews:** [reviews/2026-08-13-phase2.2/](reviews/2026-08-13-phase2.2/)

---

## Goals

Move from “which counties?” to **“what about this site / AOI?”** — still explainable, still static-first. Evidence checks are **not** site scores.

## Phased delivery (solo-dev)

| Slice | Deliverable | Status | Parcels? |
|-------|-------------|--------|---------|
| **2.1** | Click-map **point evidence check** | **DONE** | No |
| **2.2** | Draw / upload **AOI evidence check** | **DONE** | No |
| **2.3** | Side-by-side compare 2–3 sites | Locked | No |
| **2.4** | Parcel / land context (narrow public sources) | Locked | Yes |

---

## Phase 2.2 — AOI evidence check (current)

### Scoped deliverables (judgment NOW)

| ID | Deliverable |
|----|-------------|
| **A1** | AOI mode + draw **one** polygon |
| **A2** | Optional upload: single Polygon GeoJSON only |
| **A3** | Evidence panel = Point check hierarchy (control → means → ~km grid → county context → limitations) |
| **A4** | Evidence-only map quarantine in AOI mode |
| **A5** | Methodology: AOI rules; **no AOI ScreeningScore** |
| **A6** | *(optional)* Soften shared evidence verbs if editing that path |

**Slip rule:** Ship **A1 + A3 + A4** before A2/A5 if schedule slips.

### User flow

1. Toggle **AOI check** mode  
2. Draw one polygon in Texas **or** upload one Polygon GeoJSON  
3. Right panel shows **AOI evidence** (not a score):
   - Control quality first (`n`, nearest km, confidence) + evidence verb  
   - Local thermal means (de-emphasized when weak)  
   - ~km transmission from coarse HIFLD grid (~0.15°)  
   - County screening **context only** (intersecting counties)  
   - Situational limitations  

### Data (reuse only)

| Asset | Role |
|-------|------|
| Existing `prospects.*` | County context |
| `thermal_points.json` | IHFC TX points for AOI control |
| `infra_grid.json` | Precomputed distance-to-transmission lookup |

### Out of 2.2 (REJECT)

- AOI / site ScreeningScore  
- Parcels · compare (2.3) · geocoder · full HIFLD in browser  
- MultiPolygon campaigns · saved AOIs · PDF · auth  
- ML/IDW surfaces · DIY BHT→gradient · dual choropleths  
- S7 panel numbers as a blocker (enhance-soon, not gate)

### Success / stop

User can draw or upload one AOI and leave with control quality + grid proximity + demoted county context — without mistaking county rank for AOI quality, and without an AOI ScreeningScore. Then stop; do not open 2.3/2.4.

---

## Phase 2.1 — Point evidence check (shipped)

### User flow

1. Toggle **Point check** mode  
2. Click anywhere in Texas on the map  
3. Right panel shows **point evidence** (not a site score):
   - Control quality (`n`, nearest km, site confidence) + evidence verb  
   - Local thermal means (de-emphasized when weak)  
   - ~km transmission from coarse HIFLD grid (~0.15°)  
   - County screening **context only**  
   - Situational limitations  

### Data

| Asset | Role |
|-------|------|
| Existing `prospects.*` | County context |
| `thermal_points.json` | Compact IHFC TX points for local evidence |
| `infra_grid.json` | Precomputed distance-to-transmission lookup (static, no 13MB line file in browser) |

### Out of 2.1

- Parcel ownership  
- AOI polygon draw/upload → **moved to 2.2**  
- Comparison matrix  
- Live ERCOT / interconnection  

### Success

User can click a candidate location and leave with: county context + local thermal evidence + grid proximity — without opening a GIS.
