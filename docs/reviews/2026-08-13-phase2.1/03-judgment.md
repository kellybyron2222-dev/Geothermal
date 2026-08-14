# Judgment Director — Phase 2.1 (post red/blue + personas)

**Date:** 2026-08-13  
**Director role:** Prioritize now / soon / defer / reject and define stop.

---

## Verdict

Phase 2.1 **concept is correct** (blue) but **shipping honesty is insufficient** (red + personas).  
**Do not start 2.2–2.4.** Harden 2.1 into an honest **point evidence check**, then stop the slice.

---

## Build / fix NOW (this iteration)

| ID | Action |
|----|--------|
| J1 | Rename UI: **Point check** (not “Site dossier”) |
| J2 | Demote county rank/score to **“County screening context (not a site score)”** |
| J3 | Lead dossier with **control quality**: `n` in radius, nearest km, site confidence band; de-emphasize means when weak |
| J4 | Transmission: show **~X km** + always “~0.15° / ~15 km grid proxy” |
| J5 | Situational limitations (n=0/1, no local gradient, county heat-flow fallback if known) |
| J6 | County detail: scream **gradient vs heat-flow fallback** metric |
| J7 | Decouple loads: county explorer works if site JSON fails |
| J8 | Methodology: document point-check rules (radius, grid, means) |
| J9 | Empty local control: lead with “insufficient local thermal control” |

## Enhance SOON (still Phase 2.1 / late 2.1 — only after NOW)

| ID | Action |
|----|--------|
| S1 | Conflict callout: strong county vs weak local evidence |
| S2 | Rule-based verb: Keep looking / Weak evidence / Deprioritize (not a new score) |
| S3 | Lat/lon paste (no geocoder) |
| S4 | Optional nearest-point markers in point-check mode only (hard cap) |

## DEFER (later phases)

| Item | Phase |
|------|-------|
| AOI draw/upload | 2.2 |
| Side-by-side compare | 2.3 |
| Parcels / minerals | 2.4 |
| Voltage-class / substations / queues | 3+ |
| Depth / T-at-target scenarios | later thermal upgrade |
| Dual always-on gradient+HF surfaces | polish after NOW |

## REJECT

Site ScreeningScore · ML/IDW thermal surfaces · DIY BHT→gradient · geocoder · full HIFLD in browser · PDF export · auth/saved sites · layer catalog · early parcels

---

## Stop criteria for Phase 2.1

Stop when ALL are true:

1. User cannot reasonably mistake county rank for site quality (copy + layout)
2. User sees control weakness before big thermal means
3. Transmission cannot be read as precise engineering distance
4. County explorer still loads if site assets fail
5. Judgment accepts residual 40 km smear with clear labeling (tighter radius optional in SOON)

**Then stop.** Do not “celebrate” into AOI/compare until 2.1 stop criteria pass a second red/blue pass.
