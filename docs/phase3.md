# Phase 3 — Automated opportunity

**Status:** **COMPLETE** — [reviews/2026-08-14-phase3-complete/06-phase3-stop.md](reviews/2026-08-14-phase3-complete/06-phase3-stop.md)  
**Scope lock:** [reviews/2026-08-14-phase3-complete/00-judgment-scope.md](reviews/2026-08-14-phase3-complete/00-judgment-scope.md)  
**Slice 1:** [reviews/2026-08-14-phase3-slice1/06-stop-after-now.md](reviews/2026-08-14-phase3-slice1/06-stop-after-now.md)

---

## Goals (met)

- Return cadence: watch counties; see what moved after published refreshes  
- Explainable rule-based candidates (not ML, not GIS paint)  
- Every digest cites methodology version + published score pack  

## Shipped

| ID | Deliverable |
|----|-------------|
| P3-1…P3-5 | Slice 1: publishId, watchlist ≤25, digest, rules v0, methodology |
| P3-6 | Auto-digest on Watchlist panel open |
| P3-7 | Unit tests (`phase3.test.ts`) |
| P3-8 | Export/import JSON (+ confirm on replace) |
| P3-9 | Published score pack UX label |
| P3-10 | TexNet stable demote (badge, not exclude) |
| P3-11 | Docs + Methodology COMPLETE language |

### Frozen prospect rules (v0)

T@depth mode · confidence ≥ Medium · rank ≤ 40 · no PAD-US friction · TexNet = badge + demote only.

## Must-have keeps (not Phase 3 build items)

- **Barnes 1992 geologic map** — context overlay KEEP; never in score  
- Heat-flow points / constrained IDW — optional context  

## Deferred (not Phase 3)

Accounts · email/push · Point/AOI watch pins · GLO/parcels · CEII · ML · economics  

## Success / stop

Scoped local automation works without auth or GIS sprawl → **Phase 3 COMPLETE**.
