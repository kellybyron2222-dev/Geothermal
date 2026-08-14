# Persona synthesis — Phase 2.4 (Land context honesty)

**Date:** 2026-08-13  
**Simulated reviewers:** ~100 (weighted per BUILD_FRAMEWORK)  
**Stimulus:** Shipped Land context — demoted block on Point/AOI; ownership/title/minerals not-in-app; static CAD/RRC/GLO links; AOI≠parcel caveat; Compare demoted land row; methodology + data-sources honesty (no ownership data/GIS).

---

## Cohort weights

| Persona | ~n | Weight rationale |
|---------|----|------------------|
| Geothermal developers | 28 | Primary buyer |
| Energy project developers (broader) | 22 | Primary adjacent |
| Infrastructure / land investors | 18 | Primary capital |
| Skeptical domain experts / geo scientists | 14 | Trust gate |
| Researchers / students | 12 | Secondary |
| Policymakers / economic development | 6 | Light |
| **Total** | **100** | |

---

## Reaction mix

| Reaction | ~Count | Notes |
|----------|--------|-------|
| Useful / keep going | 41 | Finally told the truth about land without fake parcels |
| Lukewarm | 22 | Want real parcels later; accept honesty for MVP |
| Distrust | 12 | Fear links imply coverage; CAD not deep-linked |
| Confused | 11 | County screening vs land context duplication; GLO purpose |
| Dismiss | 9 | “Still no owners” (they wanted parcel GIS) |
| Praise-heavy niche | *(folded into Useful)* | Skeptics who prefer explicit not-in-app over fake layer |

---

## Praise clusters

| Cluster | ~Mentions | Who |
|---------|-----------|-----|
| **P1 — Explicit “not in-app” is the feature** | 48 | Geo developers, skeptics, investors |
| **P2 — CAD / RRC pointers beat a blank land hole** | 39 | Energy developers, land investors |
| **P3 — AOI ≠ parcel caveat** | 31 | Domain experts, lease sketchers |
| **P4 — Demoted placement (not above control)** | 26 | Skeptics, geothermal developers |
| **P5 — Compare land row without ownership ladder** | 24 | Investors comparing pins |
| **P6 — No fabricated land score** | 29 | Scientists, policy light |
| **P7 — Methodology / data-sources name the refusal** | 18 | Researchers, auditors |

---

## Confusion clusters

| Cluster | ~Mentions | Who | Implication |
|---------|-----------|-----|-------------|
| **C1 — Why is county listed twice?** | 14 | Broader energy / students | County screening vs land research jurisdiction — OK; optional copy cue SOON |
| **C2 — Does clicking CAD mean the app “has” ownership?** | 12 | First-time explorers | R1 / SOON S2 coverage cue |
| **C3 — What do I do with GLO vs CAD?** | 9 | Non-TX land analysts | Optional why-copy; GLO stays optional |
| **C4 — Compare says see CAD/RRC but no links** | 8 | Power users pinning many sites | SOON S4 optional |
| **C5 — Is this Phase “parcels shipped”?** | 7 | Stakeholders reading phase names | Naming: honesty not GIS — keep brand **Land context** |

---

## Distrust clusters

| Cluster | ~Mentions | Who | Severity for stop |
|---------|-----------|-----|-------------------|
| **D1 — Official links = implied coverage** | 15 | Skeptics, geothermal developers | **SOON S2** — not stop-fail if disclaimer visible |
| **D2 — Still want owner names / polygons** | 21 | Investors, energy developers | **DEFER/REJECT GIS** — ask ≠ unlock |
| **D3 — RRC pointer misread as mineral ownership** | 8 | Domain experts | Copy already says not mineral ownership; residual |
| **D4 — Repeated muted notes feel like fine print spam** | 10 | All primary buyers | **SOON S1** single external note |
| **D5 — Fear next sprint invents parcels** | 6 | Solo-dev / skeptics | Judgment must reaffirm reject GIS |

---

## Missing must-haves (asked for; disposition)

| Ask | ~Mentions | Judgment disposition |
|-----|-----------|----------------------|
| Parcel polygons / owner names / title | 21 | **REJECT / DEFER** — no invent GIS next |
| County-deep CAD deep-link | 9 | **DEFER** — fragile |
| Mineral estate / severed minerals UI | 8 | **REJECT** |
| Land / lease-readiness score | 7 | **REJECT** |
| Persist / share diligence pack with land links | 6 | **DEFER** sprawl |
| Live CAD scrape / commercial parcel API | 5 | **REJECT** |
| Depth / T-at-target / cost (orthogonal) | 11 | Later thermal — not 2.4 |
| ERCOT / HIFLD lines (orthogonal) | 6 | **REJECT** for this family |

---

## Dismiss triggers (sophisticated geo developers)

1. Shipping a **parcel layer** or owner field that looks resolved but isn’t  
2. A **land ScreeningScore** or “lease ready” badge from county name alone  
3. Branding the section **Parcels / Title check**  
4. **Scraping CAD** or claiming live ownership certainty  
5. Treating persona “we need parcels” volume as automatic unlock of GIS

**Note:** Explicit not-in-app + AOI caveat + demoted Compare row reduced dismiss vs a fake parcels checkbox. D2 remains demand for deferred GIS, not a missing honesty deliverable.

---

## Weighted synthesis for judgment

| Signal | Direction |
|--------|-----------|
| Primary buyers (geo + energy + investors ≈68) | Majority useful; want real parcels later, not fake coverage now |
| Skeptics (14) | Praise honesty; distrust link-as-coverage + fine-print spam |
| Ask volume for parcel GIS / owners | High — **reject/defer**, do not invent next |
| Ask volume for land score | Minority — **reject** |

**Net:** Personas **confirm STOP** with SOON polish only (single external note, optional coverage cue, repo methodology sync). Do not invent NOW parcel GIS. Phase 2 MVP site-eval track may close.
