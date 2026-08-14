# Phase 2 — Site Evaluation

**Status:** Phase 2.4 **DONE** (land-context honesty stopped) · Phase 2 site-eval track **complete for MVP**  
**Depends on:** Phase 1 county screening (shipped) · Phase 2.1–2.3 honesty stops  
**Reviews:** [reviews/2026-08-13-phase2.4/](reviews/2026-08-13-phase2.4/) · prior [phase2.3/](reviews/2026-08-13-phase2.3/)

---

## Goals

Move from “which counties?” to **“what about this site / AOI?”** — still explainable, still static-first. Evidence checks are **not** site scores. Compare is **pinned evidence side-by-side**, not a winner score. Phase 2.4 adds **land-context honesty** (ownership not in-app + citations), not parcel GIS.

## Phased delivery (solo-dev)

| Slice | Deliverable | Status | Parcels? |
|-------|-------------|--------|---------|
| **2.1** | Click-map **point evidence check** | **DONE** | No |
| **2.2** | Draw / upload **AOI evidence check** | **DONE** | No |
| **2.3** | Side-by-side compare 2–3 **evidence snapshots** | **DONE** | No |
| **2.4** | **Land context honesty** (county + citations; not ownership GIS) | **DONE** | Honesty only — **no** parcel layer |

---

## Phase 2.4 — Land context honesty (current)

### Scoped deliverables (judgment NOW)

| ID | Deliverable |
|----|-------------|
| **L1** | Land context honesty block on Point + AOI panels: intersecting county + “ownership / minerals not in-app” |
| **L2** | Static citation links to public Texas research paths (CAD / RRC concepts; optional GLO overview) |
| **L3** | AOI draw/upload caveat: user polygon ≠ verified parcel / ownership boundary |
| **L4** | Methodology: land context = honesty + outbound pointers; not ownership certainty; not a score input |
| **L5** | Compare: demoted land-context cell/row (county + same honesty) |

**Slip rule:** Ship **L1 + L2 + L3** before L4/L5 if schedule slips.

### User flow

1. In Point or AOI check, read demoted **Land context** (never above thermal control)  
2. See intersecting county + explicit ownership-not-in-app honesty  
3. Follow static citations to CAD / RRC (public research) — no scrape, no live ownership API  
4. AOI: understand drawn/uploaded shape is user boundary, not verified parcel  
5. Compare (if L5): same demoted honesty cell — no ownership ladder  

### Data (reuse only)

| Asset | Role |
|-------|------|
| Existing Point / AOI county resolution | Intersecting county name(s) |
| Static curated URLs / citation copy | Public TX research pointers |
| Existing Compare pin snapshots | Carry land-context honesty into compare |

### Out of 2.4 (REJECT)

- Statewide / county parcel polygon layers · CAD scraping · commercial parcel APIs  
- Ownership certainty / title claims · mineral estate resolution · cadastral map layer  
- Fabricated county land/% ownership scores without data  
- Site / AOI / Compare ScreeningScore · geocoder · full HIFLD · PDF export packs  

### Success / stop

User leaves Point/AOI (and Compare if L5) knowing **which county** applies and that **parcel ownership is not in-app**, with outbound Texas research citations — without believing the product resolved owners, title, or minerals. Then stop; do **not** open “real parcels GIS” without a new judgment.

**Unlock judgment:** [reviews/2026-08-13-phase2.4/00-judgment-unlock.md](reviews/2026-08-13-phase2.4/00-judgment-unlock.md)

---

## Phase 2.3 — Side-by-side evidence compare (shipped)

### Scoped deliverables (completed)

| ID | Deliverable |
|----|-------------|
| **C1** | Pin up to **3** evidence snapshots from Point and/or AOI panels |
| **C2** | Compare view: side-by-side **table** of honesty-hierarchy fields |
| **C3** | No winner / no CompareScore — soften “best site” language |
| **C4** | Methodology: compare = pinned snapshots only; not a site score |
| **C5** | Remove/clear pins + empty Compare state |

### User flow

1. In Point or AOI check, **pin** the current evidence panel (snapshot)  
2. Pin **2–3** snapshots max (Point/AOI mixed OK); refuse a 4th  
3. Open **Compare evidence** — side-by-side table:
   - Control quality first (`n`, nearest/inside, confidence, evidence verb)  
   - Local thermal means (same weak-demotion as source panels)  
   - ~km transmission from coarse HIFLD grid (~0.15°)  
   - County screening **context only**  
   - Situational limitations  
4. No rank column, no CompareScore, no “best site” framing  

### Data (reuse only)

| Asset | Role |
|-------|------|
| Existing Point / AOI dossier builders | Snapshot source |
| In-session pin list (≤3) | Compare input |

### Out of 2.3 (REJECT — historical)

- CompareScore / winner / “best site” rank  
- County ScreeningScore compare matrix as primary  
- Parcel GIS · geocoder · full HIFLD · AOI campaigns · PDF export  
- Site / AOI ScreeningScore · ML/IDW · dual choropleths  

---

## Phase 2.2 — AOI evidence check (shipped)

### Scoped deliverables (completed)

| ID | Deliverable |
|----|-------------|
| **A1** | AOI mode + draw **one** polygon |
| **A2** | Optional upload: single Polygon GeoJSON only |
| **A3** | Evidence panel = Point check hierarchy |
| **A4** | Evidence-only map quarantine in AOI mode |
| **A5** | Methodology: AOI rules; **no AOI ScreeningScore** |
| **A6** | Softened shared evidence verbs (shipped where touched) |

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

- Parcel ownership → **moved to 2.4 as land-context honesty** (not GIS)  
- AOI polygon draw/upload → **2.2** (done)  
- Comparison matrix → **2.3** (done)  
- Live ERCOT / interconnection  

### Success

User can click a candidate location and leave with: county context + local thermal evidence + grid proximity — without opening a GIS.
