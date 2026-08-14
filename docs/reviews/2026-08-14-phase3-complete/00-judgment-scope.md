# Phase 3 — full-phase completion scope (director)

**Date:** 2026-08-14  
**Status:** **ACCEPTED — build unlocked** (owner directive: run entire Phase 3 to end of loop)  
**Prereqs:** Slice 1 STOP · Data Depth STOP · Barnes KEEP  

---

## What “entire Phase 3” means (this product)

Phase 3 = **automated opportunity cadence** for Texas county screening:

1. Watch what matters  
2. See what moved after published refreshes  
3. See explainable rule candidates  

It is **not** accounts, email ops, land GIS, or economics. Those stay out so Phase 3 can **STOP** as a solo-dev decision product.

---

## Already MET (slice 1)

P3-1…P3-5 + N1–N3 honesty — see `2026-08-14-phase3-slice1/06-stop-after-now.md`.

---

## Slice 2 — BUILD NOW (closes Phase 3)

| ID | Deliverable |
|----|-------------|
| **P3-6** | Auto-run digest when Watchlist panel opens (Mark as seen stays manual) |
| **P3-7** | Unit tests for `buildDigest` / watch / vintage-only / rules filter |
| **P3-8** | Watchlist JSON **export / import** (backup against localStorage wipe) |
| **P3-9** | Publish pack UX — human label + short id (not raw dump as primary) |
| **P3-10** | Rule candidates: TexNet-caution **stable sort demote** (still badge; not exclude) |
| **P3-11** | Methodology + roadmap: Phase 3 **COMPLETE** language (slice 1+2) |

### Parallel KEEP (verify; not new GIS)

| ID | Item |
|----|------|
| **P3-V** | Point/AOI already inherit labeled county T@depth context — confirm UI honesty; no site ScreeningScore |

---

## DEFER (after Phase 3 STOP — new product judgment)

| Item | Why not Phase 3 |
|------|-----------------|
| Auth / cloud sync | Backend + ops; local export covers solo |
| Email / push / Slack | Ops product; digest is the Phase 3 alert |
| Point/AOI **watch pins** | New product concept; counties remain watch unit |
| GLO / University Lands dossiers | Land GIS / partnership data |
| Economics-lite / interconnection | Overclaim risk; not automation core |

---

## REJECT (never as Phase 3 completion)

- Parcel ownership GIS · ERCOT CEII · ML prospects · new map layers as “Phase 3 done”  
- Silent Focus↔Watch merge · geology/Barnes in ScreeningScore  

---

## Phase 3 STOP criteria (full phase)

**Ship / stop when:**

1. Slice 1 scorecard still MET  
2. P3-6…P3-11 shipped + `npm run build` + tests green  
3. Red/blue + personas + director say **Phase 3 COMPLETE**  
4. No auth/email/GLO/CEII/ML/parcels  

**Stop when judgment says Phase 3 is enough** — not when deferred land/auth remain undone.

---

## Build / Enhance / Defer / Reject

| Bucket | Items |
|--------|-------|
| **BUILD NOW** | P3-6 … P3-11 (+ P3-V verify) |
| **ENHANCE SOON** | RRC density replace SMU proxy (Data Depth residual — not Phase 3) |
| **DEFER** | Auth, email, AOI watch pins, GLO, economics |
| **REJECT** | GIS-as-Phase-3 · ML · CEII · parcels |
