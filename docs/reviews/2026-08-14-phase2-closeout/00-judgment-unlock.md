# Judgment — Phase 2 residual closeout

**Date:** 2026-08-14  
**Director role:** Finish all remaining Phase 2 *buildable* SOON items; close Phase 2 family for MVP  
**User request:** “finish all build items in phase 2”

---

## Verdict

**UNLOCK Phase 2 residual closeout** — ship all SOON polish from 2.2–2.4 plus county dual-panel numbers (thermal roadmap S7). Do **not** invent parcels GIS, CompareScore, weight reopen, or Phase 3.

Core unlocks (2.1–2.4) already STOPPED. This slice is honesty/UX polish only.

---

## NOW backlog (this closeout)

### From 2.2
| ID | Action |
|----|--------|
| **P2.2-S1** | Large-AOI smear: force means into `<details>` when area large and/or high n; limitation line |
| **P2.2-S2** | Means copy always “not an AOI score” |
| **P2.2-S3** | Double-click and/or Enter to close polygon (≥3 verts) |
| **P2.2-S4** | Upload caveat: WGS84 lon/lat, outer ring only, single Polygon |
| **P2.2-S5** | County context probe caveat |

### From 2.3
| ID | Action |
|----|--------|
| **P2.3-S1** | Limitations row/count+expand in Compare |
| **P2.3-S2** | softMeans when None/Low **or** n≤1 |
| **P2.3-S3** | Kind-aware n / nearest sublabels |
| **P2.3-S4** | Richer AOI pin labels (centroid / county) |
| **P2.3-S5** | Sync scoring-methodology.md Compare |
| **P2.3-S6** | County digits behind expand in Compare |
| **P2.3-S7** | “Not a ranking” cue by means when ≥2 pins |

### From 2.4
| ID | Action |
|----|--------|
| **P2.4-S1** | Single external-note above citations |
| **P2.4-S2** | “Research elsewhere — not coverage” cue |
| **P2.4-S3** | Sync scoring-methodology.md Land context |
| **P2.4-S4** | Compare land-cell citation cue |
| **P2.4-S5** | “Not parcel ownership” subtitle |

### County / Point (Phase 2 family polish)
| ID | Action |
|----|--------|
| **P2-S7** | Dual **panel** gradient + heat-flow raw means on county DetailPanel (not dual choropleths) |
| **P2-S2** | County infra display as ~km + proximity proxy honesty |
| **P2-S4** | Point check conflict callout when strong county vs weak local control |

---

## REJECT / DEFER (still)

Parcel polygons · CAD scrape · commercial APIs · ownership certainty · mineral estate UI · CompareScore · site ScreeningScore · West TX weight reopen · Phase 3 accounts/alerts · ML/IDW · geocoder · full HIFLD · PDF packs · nearest-point map markers (optional later)

---

## Stop criteria

1. All NOW IDs above shipped or explicitly accepted with rationale  
2. `npm run build` passes  
3. No new GIS/ownership product  
4. Phase 2 marked **complete** in tasks/phase2 (residuals closed)

**Then Phase 2 family is finished for MVP.**
