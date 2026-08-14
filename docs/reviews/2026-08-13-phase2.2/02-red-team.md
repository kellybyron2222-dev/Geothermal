# Red Team — Phase 2.2 (AOI evidence check)

**Date:** 2026-08-13  
**Stance:** Attack false confidence, fake scores-by-another-name, draw/upload traps, and GIS creep.  
**Code checked:** `aoiEval.ts`, `AoiEvidencePanel.tsx`, `App.tsx`, `MapView.tsx`, `Methodology.tsx`

---

## Critical / honesty findings

| ID | Severity | Finding | Why it hurts | Rec |
|----|----------|---------|--------------|-----|
| **R1** | **High (residual)** | **Large AOI → fake-confident means.** Points *inside* set `nearestKm = 0`. Confidence High if `n≥8`. A West-TX blob that swallows dozens of IHFC points gets **Adequate control** + loud gradient/heat-flow **means** that are regional averages wearing AOI clothing. Area is shown once in tiny muted text; no area-triggered smear warning. | Users treat mean as “the AOI is 35 °C/km.” That is a **score-shaped lie** without calling it ScreeningScore. | **SOON** (prefer) or NOW if judgment won’t stop: area / smear callout; force means into `<details>` above an area or density threshold; copy “mean of points inside ≠ AOI score.” |
| **R2** | **Med** | **Means UI still “score row.”** When not weak, means use `.big` numerals under “Local thermal means” — same visual weight as control `n`. Soft verbs help, but a glance-reader still ranks the AOI by the big number. | Parallel to pre-harden Point-check failure mode; partially mitigated by control-first order. | **SOON** — always label “not an AOI score”; optional demote means one step further when `areaKm2` large. |
| **R3** | **Med** | **Draw UX friction.** Vertices only; must hit **Close polygon**; no double-click/Enter close; no vertex edit/undo except Clear; finished AOI can’t add vertices without Clear. Upload is the escape hatch for real shapes. | Some users bounce before evidence appears → feature looks broken, not honest. | **SOON** polish — not a stop-criterion failure if upload works. |
| **R4** | **Med–Low** | **Nearest-to-AOI is vertex-boundary proxy**, not distance-to-edge. Documented in methodology; still overstates “Nearest to AOI” when a point sits near a long edge between vertices. | Sparse-outside case: nearest km can be wrong by kilometers. | **DEFER** / methodology honesty already present; tighter geometry later. |
| **R5** | **Med–Low** | **County intersect = centroid + vertices only.** An AOI that crosses a county without placing a probe in it **misses** that county. Cap 8 + early `break` can also truncate. | Demoted context can be incomplete → false “one county” read on multi-county leases. | **SOON** note in UI (“probe-based; may miss edge counties”) or **DEFER** true polygon∩polygon. |
| **R6** | **Low–Med** | **Upload edge cases (honest rejects vs silent truncations).** Hard-reject MultiPolygon / multi-feature: **good**. Silent behaviors: **outer ring only** (holes dropped), no CRS check (assumes lon/lat WGS84), self-intersections accepted, shapes outside Texas accepted, Feature with null geometry → generic error. County-load failure still builds dossier with empty counties + error — good non-silent path. | Power users upload land files with holes/CRS and get a wrong ring without knowing. | **SOON** — one-line upload caveats (WGS84 lon/lat, outer ring only, Texas beachhead). |
| **R7** | **Low** | **County screening numbers still visible** (rank # · screening X.X). Header says not AOI score; list still looks like a mini leaderboard for the polygon. | Glance contamination if map mute + control panel ignored. | Keep demotion; **SOON** optional: hide score digits, show names only until expand. |
| **R8** | **Low** | **Internal type `AoiDossier`** and “AOI confidence” wording. UI title is correct; “confidence” can still be read as resource confidence. | Soft overclaim for skeptics. | **SOON** copy: “local control confidence” (already mostly that). |
| **R9** | **Info** | Point + AOI share `siteError` gate — correct reuse, but one asset failure disables both evidence modes. | Acceptable; Phase 1 county path intact. | Keep; do not couple county load to AOI. |

---

## What is *not* a critical failure (red concedes)

- No AOI ScreeningScore shipped — unlock REJECT held.
- Weak means demotion path works for thin control.
- Transmission `~km` + grid copy cannot reasonably be read as survey-grade if the muted line is visible.
- Upload multi-feature / MultiPolygon does **not** silently succeed.
- Map mute + legend quarantine match Point check.
- Scope: no compare / parcels / geocoder / HIFLD / dual choropleths.

---

## Overclaim / distrust traps (ruthless)

1. **“Adequate control to keep investigating” on a county-sized polygon** = permission structure for a fake AOI grade.
2. **Gradient mean with high n inside a smear** is the most dangerous number on the panel — more than county rank.
3. **Area ≈ N km²** without a smear threshold is decoration, not a guardrail.
4. Draw friction will be blamed on product quality; do not “fix” it by adding Mapbox Draw + edit tools (GIS sprawl). Prefer one close affordance + clear upload.

---

## Reject now (reaffirm unlock)

| Reject | Why |
|--------|-----|
| AOI ScreeningScore / site score | Contaminates county + Point locks |
| Compare 2–3 AOIs | Phase 2.3 |
| Parcels / minerals | Phase 2.4 |
| Geocoder, layer catalog, saved AOIs, PDF | Sprawl |
| Full HIFLD / ERCOT / interconnection | Cosplay |
| ML / IDW / BHT DIY | Black box |
| Dual choropleths / weight reopen | Not this slice |

---

## Recommended disposition (for judgment)

- Prefer **STOP** if unlock stop criteria are scored met — treat R1–R3 as **enhance-soon honesty/UX polish**, not a new phase.
- If director refuses stop: **cap NOW ≤3** — (1) large-AOI smear / means demotion guardrail, (2) explicit means ≠ AOI score on strong path, (3) draw close affordance *or* upload caveat line — then re-stop. **Do not** open 2.3/2.4.
