# Persona synthesis — Phase 2.2 (AOI evidence check)

**Date:** 2026-08-13  
**Simulated reviewers:** ~100 (weighted per BUILD_FRAMEWORK)  
**Stimulus:** Shipped AOI evidence check — draw one polygon OR upload single Polygon GeoJSON; control first; ~km infra grid; demoted county context; no AOI ScreeningScore; mutually exclusive with Point check; muted map; softened evidence verbs.

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
| Useful / keep going | 34 | Control-first + no fake AOI score lands |
| Lukewarm | 26 | Want compare / land next; accept honesty |
| Distrust | 16 | Large-AOI means / “confidence” / county digits |
| Confused | 14 | Draw close friction; Point vs AOI mode switching |
| Dismiss | 10 | Still no depth/cost/interconnect; “toy polygon” |
| Praise-heavy niche | *(folded into Useful)* | Scientists who wanted reject-on-MultiPolygon |

---

## Praise clusters

| Cluster | ~Mentions | Who |
|---------|-----------|-----|
| **P1 — No AOI score is the feature** | 41 | Geo developers, skeptics, investors |
| **P2 — Same evidence family as Point check** | 33 | Energy developers, students |
| **P3 — Upload hard-reject MultiPolygon / multi-feature** | 22 | GIS-literate researchers, geo ops |
| **P4 — Map mute / not borrowing choropleth** | 29 | Skeptics, geothermal developers |
| **P5 — County demoted as context** | 27 | Investors who misuse ranks less |
| **P6 — Soft verbs (investigate / control)** | 18 | Policy light + skeptical scientists |
| **P7 — Fast static assets, no layer zoo** | 15 | Solo-dev empathy / ops |

---

## Confusion clusters

| Cluster | ~Mentions | Who | Implication |
|---------|-----------|-----|-------------|
| **C1 — How do I finish the polygon?** | 19 | Non-GIS energy / investor | Draw UX SOON (S3) |
| **C2 — Point check vs AOI check — which when?** | 14 | Broader energy developers | Empty-state one-liner OK; no new mode |
| **C3 — Why is nearest 0 km with points inside?** | 8 | Students / analysts | Expected; methodology covers |
| **C4 — Why only outer ring / my hole vanished?** | 6 | Researchers with land GeoJSON | Upload caveat S4 |
| **C5 — Missing county on the list** | 5 | Land investors with skinny AOIs | Probe caveat S5 |

---

## Distrust clusters

| Cluster | ~Mentions | Who | Severity for stop |
|---------|-----------|-----|-------------------|
| **D1 — Big AOI mean = fake grade** | 21 | Skeptics, geothermal developers | **SOON S1/S2** — not stop-fail if limitations + no ScreeningScore held |
| **D2 — “Adequate control” on smear polygons** | 17 | Domain experts | Same as D1 |
| **D3 — Transmission still smells like interconnect** | 11 | Energy developers | Residual; ~km copy mostly holds |
| **D4 — County rank chips still tempt** | 9 | Investors | Demotion mostly holds |
| **D5 — Vertex-only nearest distance** | 4 | Scientists | DEFER geometry |

---

## Missing must-haves (asked for; disposition)

| Ask | ~Mentions | Judgment disposition |
|-----|-----------|----------------------|
| Side-by-side AOI compare | 18 | **DEFER 2.3** — do not unlock now |
| Parcels / minerals / ownership | 16 | **DEFER 2.4** |
| Depth / T-at-target / cost | 14 | Later thermal — not 2.2 |
| Live ERCOT / queues / HIFLD lines | 12 | **REJECT** for this phase family |
| Edit vertices / snappy draw tool | 11 | **SOON S3** minimal only |
| AOI ScreeningScore “so we can rank leases” | 8 | **REJECT** |
| Save / share / PDF AOI packs | 7 | **REJECT** sprawl |
| Address / geocoder | 5 | **REJECT** |

---

## Dismiss triggers (sophisticated geo developers)

1. Shipping an **AOI ScreeningScore** or composite “lease grade”
2. Treating **large-polygon means** as resource quality without smear labeling
3. **Interconnection cosplay** from grid proxy
4. Opening **compare/parcels** before AOI honesty is trusted
5. Brand language that implies pad-ready intelligence

**Note:** Softened verbs + no AOI score reduced dismiss vs a “AOI dossier / site score” framing. D1/D2 remain the live distrust residue.

---

## Weighted takeaway for judgment

- **Primary buyers (geo + energy + land, ~68):** Majority useful/lukewarm; top ask is compare/land **later**; top honesty worry is **large-AOI means**, not missing ScreeningScore.
- **Skeptics (~14):** Stop is acceptable **if** no score and control-first stay; they will re-attack on smear means in demos — schedule **S1/S2** as optional polish, not a new phase.
- **Students/researchers (~12):** Upload reject praised; hole/CRS caveats wanted.
- **Policy (~6):** Soft verbs help; little demand for GIS expansion.

**Persona pressure does not reopen 2.3/2.4.** It reinforces STOP + optional SOON honesty polish (S1–S4).
