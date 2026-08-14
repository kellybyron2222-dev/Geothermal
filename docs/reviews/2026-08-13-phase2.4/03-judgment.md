# Judgment Director — Phase 2.4 (post red/blue)

**Date:** 2026-08-13  
**Director role:** NOW / SOON / DEFER / REJECT + stop criteria for 2.4  
**Inputs:** `00-judgment-unlock.md` · `01-blue-team.md` · `02-red-team.md` · shipped L1–L5  
**Constraints:** explainable decisions ≠ GIS sprawl · Texas beachhead · heuristics · solo-dev · **no inventing parcel GIS next** · no land ScreeningScore

---

## Verdict

### **STOP — Phase 2.4 is complete enough.**

Unlock stop criteria are **met**. Residual risks (citation-as-coverage glance, repeated external notes, repo methodology drift) are **enhance-soon / defer polish**, not a failed slice. Cap on NOW unused: **0 NOW items**. Do **not** unlock inventing parcel GIS next.

**Why stop:** User sees demoted Land context on Point and AOI with intersecting county + explicit ownership/title/minerals not-in-app, static CAD/RRC/(optional) GLO citations, AOI≠parcel caveat, Compare demoted land honesty row, and methodology/data-sources that refuse ownership certainty and parcel coverage. Red’s residual findings do not invent a missing L1–L5 deliverable.

**Phase 2 family note:** With 2.1–2.4 honesty stops cleared, the **MVP site-eval track** (Point → AOI → Compare → land-context honesty) may be treated as **complete**. Further parcels GIS requires a **new** judgment and defaults to **reject**.

---

## Stop criteria scorecard

| # | Criterion (from unlock) | Verdict |
|---|-------------------------|---------|
| 1 | Point + AOI Land context block: intersecting county + ownership-not-in-app | **Met** — L1 |
| 2 | Static citation links to public TX research (CAD/RRC min) without scrape/API | **Met** — L2 (+ optional GLO) |
| 3 | AOI path not readable as verified parcel ownership | **Met** — L3 section + limitations |
| 4 | User cannot reasonably believe app resolved owners / title / minerals | **Met** — disclaimer + external note + methodology (R1 glance = SOON) |
| 5 | Land context not a ScreeningScore input; no site land score | **Met** — L4 + code reuse only |
| 6 | Compare (L5) repeats demoted honesty only — no ownership ladder | **Met** — L5 |
| 7 | County + Point + AOI + Compare still work; no new GIS coupling | **Met** |
| 8 | Scope lock: no statewide parcels, commercial ownership APIs, mineral resolution, cadastral layer | **Met** |

**Then stop.** Short red/blue on L1–L5 only — done via this packet. Personas next; expect confirmation unless they surface a new stop-blocker.

---

## Build / fix NOW

| ID | Action |
|----|--------|
| — | **None.** Slice stop-ready. |

*(If a later pass overturns STOP, NOW cap ≤2 — see contingency below.)*

---

## Enhance SOON (still Phase 2.4 polish — optional, not gate)

| ID | Action | Maps to |
|----|--------|---------|
| **S1** | Show `LAND_CONTEXT_EXTERNAL_NOTE` once above the citation list (not per link) | R2 |
| **S2** | Optional one-line “research elsewhere — not in-app coverage” above citations | R1 |
| **S3** | Sync `docs/scoring-methodology.md` Land context bullets with in-app Methodology / data-sources | R6 |
| **S4** | Optional Compare land-cell cue to panel citations | R5 |
| **S5** | Optional literal “not parcel ownership” subtitle under Land context h3 | R7 |

Priority if any SOON work is scheduled: **S1 > S3 > S2 > S5 > S4**. Still do not block stop on these.

---

## DEFER

| Item | Notes |
|------|-------|
| County-deep CAD portal URLs | R3 — fragile; directory is enough |
| Stronger GLO deep-link | R4 — optional pointer |
| Phase 2.3 residual SOON S1–S7 | Orthogonal Compare polish |
| Phase 2.2 residual SOON | Orthogonal |
| County enhance-soon / West TX reweight | Unrelated |
| Any true parcel / ownership GIS integration | **Default reject** until new judgment finds thin licensed non-scrape path |

---

## REJECT (reaffirm)

Statewide parcel layers · CAD scrape · commercial ownership APIs · ownership/title/mineral certainty · cadastral click-to-owner · fabricated land scores · site/AOI/Compare land ScreeningScore · geocoder · full HIFLD/ERCOT · PDF packs · ML/IDW · **opening “real parcels GIS” from this slice**

---

## Contingency — if STOP overturned

**NOW cap ≤2** (honesty/UX only):

1. **N1** — Single external-note (and/or coverage cue) above citation list  
2. **N2** — Sync `docs/scoring-methodology.md` Land context section  

Then re-run short red/blue and stop. **Still no parcel GIS unlock.**

---

## Director one-liner

**STOP 2.4:** Land context is honest enough — demoted county + not-in-app ownership + static CAD/RRC/GLO pointers + AOI≠parcel + Compare demoted row. Citation UX and repo doc sync are SOON; inventing parcel GIS is rejected. Phase 2 MVP site-eval track may close.
