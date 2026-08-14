# Judgment Director — Phase 2.2 (post red/blue)

**Date:** 2026-08-13  
**Director role:** NOW / SOON / DEFER / REJECT + stop criteria for 2.2  
**Inputs:** `00-judgment-unlock.md` · `01-blue-team.md` · `02-red-team.md` · shipped A1–A5 (+ A6 verbs)  
**Constraints:** explainable decisions ≠ GIS sprawl · Texas beachhead · heuristics · solo-dev · no 2.3/2.4 unlock

---

## Verdict

### **STOP — Phase 2.2 is complete enough.**

Unlock stop criteria are **met**. Residual risks (large-AOI mean smear, draw friction, upload caveats) are **enhance-soon polish**, not a failed slice. Cap on NOW is unused: **0 NOW items**. Do **not** open Phase 2.3 or 2.4.

**Why stop:** The product delivers draw-or-upload → control-first AOI evidence → ~km grid → demoted county context → no AOI ScreeningScore, with map quarantine and mutual exclusion vs Point check. Red’s High residual (R1) is real but already bounded by limitations copy + Point-check-parity means demotion when thin; fixing large-AOI confidence inflation is honesty polish, not a missing deliverable from A1–A5.

---

## Stop criteria scorecard

| # | Criterion (from unlock) | Verdict |
|---|-------------------------|---------|
| 1 | Draw or upload one polygon; leave with control + ~km grid + demoted county context; **no fake AOI score** | **Met** — no AOI ScreeningScore; panel hierarchy correct |
| 2 | Cannot reasonably mistake county ScreeningScore/rank for AOI quality | **Met** — demoted section + copy + map mute + limitations |
| 3 | Control weakness before loud means when thin | **Met** — `<details>` when None/Low/n≤1 |
| 4 | Transmission not precise engineering distance | **Met** — `~km` + grid proxy copy |
| 5 | Upload rejects multi-feature / MultiPolygon without silent partial success | **Met** — `parseAoiGeoJson` hard errors |
| 6 | County explorer + Point check survive AOI/site asset failure | **Met** — county path independent; Point/AOI share site gate |
| 7 | Scope lock: no compare, parcels, geocoder, full HIFLD, AOI ScreeningScore | **Met** |

**Then stop.** Short red/blue on A1–A5 only — done via this packet. Personas next; expect confirmation unless they surface a new stop-blocker.

---

## Build / fix NOW

| ID | Action |
|----|--------|
| — | **None.** Slice stop-ready. |

*(If a later pass overturns STOP, NOW cap ≤3 critical honesty/UX only — see contingency below.)*

---

## Enhance SOON (still Phase 2.2 polish — optional, not gate)

| ID | Action | Maps to |
|----|--------|---------|
| **S1** | Large-AOI smear guardrail: when `areaKm2` above a stated threshold (and/or high `n` with large area), force means into `<details>` and/or prepend a situational limitation (“regional smear — means are not an AOI grade”) | R1, R2 |
| **S2** | Strong-path means copy: always “mean of IHFC points inside — **not an AOI score**” | R2 |
| **S3** | Draw close affordance (double-click or Enter to close) **or** clearer empty-state UX; avoid full Draw library | R3 |
| **S4** | Upload caveat line: WGS84 lon/lat, outer ring only, single Polygon | R6 |
| **S5** | County context probe caveat (“may miss edge-only counties”) | R5 |

Priority if any SOON work is scheduled: **S1 > S2 > S4 > S3 > S5**. Still do not block stop on these.

---

## DEFER

| Item | Notes |
|------|-------|
| True distance-to-edge for nearest control | R4 — vertex proxy documented |
| True polygon∩county geometry | R5 — probe method OK for MVP |
| Hide county score digits behind expand | R7 |
| Tighter thermal / markers / West TX reweight | Prior deferrals |
| S7 dual panel numbers (county surface) | Unrelated to AOI stop |
| Phase **2.3** compare · **2.4** parcels | **Locked** until later unlock |

---

## REJECT (reaffirm)

AOI / site ScreeningScore · parcels · compare · geocoder · full HIFLD / ERCOT · MultiPolygon campaigns · layer catalog · saved AOIs · PDF · ML/IDW · DIY BHT · dual choropleths · weight reopen · S7 as AOI dependency

---

## Contingency — if STOP overturned

**NOW cap ≤3** (honesty/UX only):

1. **N1** — Large-AOI smear: demote means + situational limitation when area/n indicates regional aggregation  
2. **N2** — Explicit “means ≠ AOI score” on the strong means path  
3. **N3** — Upload WGS84/outer-ring caveat **or** one draw-close affordance (pick one)

Then re-run short red/blue and stop. **Still no 2.3/2.4.**

---

## Director one-liner

**STOP 2.2:** AOI evidence check cloned Point-check honesty — control first, ~km grid, demoted county context, zero ScreeningScore, map muted, upload rejects multi. Large-AOI mean smear and draw friction are SOON polish, not permission to open compare or parcels.
