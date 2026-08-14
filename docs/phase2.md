# Phase 2 — Site Evaluation

**Status:** Phase 2.1 in progress  
**Depends on:** Phase 1 county screening (shipped)

---

## Goals

Move from “which counties?” to **“what about this site?”** — still explainable, still static-first.

## Phased delivery (solo-dev)

| Slice | Deliverable | Parcels? |
|-------|-------------|---------|
| **2.1** | Click-map **site dossier** (point) | No |
| **2.2** | Draw / upload AOI polygon dossier | No |
| **2.3** | Side-by-side compare 2–3 sites | No |
| **2.4** | Parcel / land context (narrow public sources) | Yes |

## Phase 2.1 — Point evidence check

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
- AOI polygon draw/upload  
- Comparison matrix  
- Live ERCOT / interconnection  

### Success

User can click a candidate location and leave with: county context + local thermal evidence + grid proximity — without opening a GIS.
