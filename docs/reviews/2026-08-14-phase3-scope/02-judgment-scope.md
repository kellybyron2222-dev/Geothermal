# Phase 3 judgment — scope lock (slice 1)

**Date:** 2026-08-14  
**Status:** **ACCEPTED 2026-08-14 — build unlocked**  
**Prereqs:** Phase 2 COMPLETE · Data Depth STOP MET · Barnes geology KEEP (context)

---

## Locked product keep (cross-cutting)

| Item | Decision |
|------|----------|
| **Barnes 1992 geologic map overlay** | **KEEP — must-have** map context (USGS DS 170). **Never** in ScreeningScore. |
| Constrained heat-flow IDW surface | KEEP as optional context; honesty: local IDW only, not resource map |
| Basement domains (DS-898) | Stay **out** of product UI (wrong control); raw assets may remain on disk |

---

## Phase 3 slice 1 — goals

1. **Return cadence** — user can watch focus counties and see what moved after a published refresh  
2. **Explainable prospects** — rule-generated candidate shortlist (not ML, not GIS paint)  
3. **Trust** — every notice cites methodology version + data vintage  

North-star remains: *Where should I focus, and why?* — automation must not become a map toy.

---

## In scope (slice 1 ONLY)

| ID | Deliverable |
|----|-------------|
| **P3-1** | **Published vintage watch** — score/meta refresh produces a detectable vintage bump |
| **P3-2** | **County watchlist** — pin/unpin ≤ N counties (default cap **25**); persist **local-first** (localStorage / export JSON) |
| **P3-3** | **Change digest** — when user opens app (or “Check updates”), show what changed among watched counties since last seen vintage: rank Δ, score Δ, factor flags, methodology version |
| **P3-4** | **Rule-based prospect list** — static or regenerated-on-publish list of counties matching frozen rules (below); shown as “Generated focus candidates” with rule text + limitations |
| **P3-5** | **Methodology** — Phase 3 section: watchlist ≠ score; digests ≠ alerts from live grids; rules versioned |

### Frozen prospect rules (v0 — edit only via new judgment)

A county may appear as a generated candidate **only if all** hold:

1. Thermal mode = Stanford T@depth (model labeled)  
2. Confidence band ≥ **Medium** (exclude Low / None / Unknown)  
3. ScreeningScore ≥ cohort P80 **or** rank ≤ 40 within tdepth cohort (pick one in build; default **rank ≤ 40**)  
4. No PAD-US Fee GAP1–2 friction flag (frac >1% gate)  
5. TexNet caution → **demote / badge only**, not hard exclude (unless judgment revises)

Rules text must appear next to every generated list.

---

## Locked decisions (director)

| # | Decision | Lock |
|---|----------|------|
| 1 | Alert semantics | **In-app digest on open / manual check** against last-seen vintage — **not** email/push in slice 1 |
| 2 | Prospect rules | Frozen set above (v0) |
| 3 | Accounts / auth | **Not required** for slice 1 — local-first watchlist |
| 4 | Watchlist unit | **Counties only** in slice 1 (Point/AOI pins deferred) |
| 5 | GLO / UL / economics-lite / interconnection context | **Out** of slice 1 |
| 6 | Point/AOI inherit T@depth spine | **SOON** (parallel OK) — not a slice-1 blocker |

---

## Explicit out of scope / REJECT (slice 1)

- User accounts, cloud sync, email/SMS push  
- Parcel / GLO / University Lands GIS  
- ERCOT CEII / interconnection feasibility  
- ML / black-box prospect scoring  
- Auto-generate Low/Unknown confidence counties  
- New map layers as Phase 3 work (Barnes already KEEP)  
- National coverage · Phase 4–5  
- CompareScore / site ScreeningScore  

---

## Prerequisites (met)

- Phase 1–2 shipped  
- Data Depth STOP MET (accepted SMU well-density proxy)  
- Versioned static publish path exists (`meta.json` + `prospects.*`)  

---

## Success / stop criteria (slice 1)

**Ship when:**

- User can maintain a county watchlist locally and see a digest of changes after a new published vintage  
- Generated candidates follow frozen rules; human “not silly” review ≥ ~80% on a spot check of top candidates  
- Methodology documents watchlist + rules + versioning  
- No auth, no CEII, no parcels, no geology-in-score  

**Stop when** judgment says slice 1 is enough — **not** when accounts or land GIS remain undone.

---

## Build / Enhance / Defer / Reject

| Bucket | Items |
|--------|-------|
| **BUILD (after this scope accepted)** | P3-1 … P3-5 only |
| **ENHANCE SOON** | Point/AOI T@depth inherit; RRC replace SMU proxy; optional export watchlist file |
| **DEFER** | Auth, email digests, Point/AOI watch pins, GLO adjacency, economics-lite |
| **REJECT** | GIS sprawl as Phase 3; ML prospects; CEII; parcels |

---

## Unlock

**Scope ACCEPTED by product owner (2026-08-14).** Implementation of P3-1…P3-5 is unlocked.
