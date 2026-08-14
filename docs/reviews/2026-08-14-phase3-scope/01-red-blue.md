# Phase 3 scope — red / blue

**Date:** 2026-08-14  
**Mode:** Scope only — **no build**

---

## Blue — why Phase 3 now

| Keep / build | Why |
|--------------|-----|
| Data Depth spine is live (T@depth + infra + confidence + risk flags) | Automation can watch **published** scores without inventing heat |
| Phase 2 evidence tools exist | Watchlist can attach to counties (and later evidence pins) without new GIS |
| Buyer job after shortlist | “What changed since last week?” — return cadence |
| Rule-based prospects | Explainable generation beats map-layer accumulation |

---

## Red — what fails if we scope wrong

| Sev | Failure | Guardrail |
|-----|---------|-----------|
| **CRITICAL** | Accounts + DB + alerts sprawl before rules are frozen | Slice 1 = **no auth** unless forced |
| **HIGH** | Auto-generate Low/Unknown confidence “prospects” | Gate: confidence ≥ Medium; refuse thin control |
| **HIGH** | Alerts on live API noise / CEII / interconnection | Alerts only on **published** static artifacts |
| **MED** | More geology / layers as Phase 3 work | Barnes KEEP is **context**; not Phase 3 deliverable |
| **MED** | GLO / parcels / economics-lite in slice 1 | Explicit out |
| **LOW** | Point/AOI still IHFC-local while county is T@depth | SOON inherit — not P3 slice-1 blocker |

---

## Persona clusters (weighted)

| Persona | Want | Weight |
|---------|------|--------|
| Geothermal / energy developers | Shortlist that updates; not silly auto-prospects | High |
| Infra / land investors | Weekly digests when ranks move | High |
| Researchers | More layers / accounts / APIs | Low — defer |
| Skeptics | Versioned methodology on every alert | High |
