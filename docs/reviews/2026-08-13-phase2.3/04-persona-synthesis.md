# Persona synthesis — Phase 2.3 (Compare evidence)

**Date:** 2026-08-13  
**Simulated reviewers:** ~100 (weighted per BUILD_FRAMEWORK)  
**Stimulus:** Shipped Compare evidence — pin ≤3 Point/AOI snapshots; side-by-side honesty table; refuse 4th; clear/remove; no CompareScore/winner; methodology note; county demoted in cells.

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
| Useful / keep going | 38 | Finally can hold 2–3 evidence snapshots without a fake score |
| Lukewarm | 24 | Want parcels / depth next; accept honesty |
| Distrust | 14 | Fear silent ranking from the matrix; county digits |
| Confused | 12 | Point vs AOI row semantics; where limitations went |
| Dismiss | 8 | “Still can’t pick a winner” (they wanted CompareScore) |
| Praise-heavy niche | *(folded into Useful)* | Skeptics who wanted refuse-4th + no winner |

---

## Praise clusters

| Cluster | ~Mentions | Who |
|---------|-----------|-----|
| **P1 — No winner / no CompareScore is the feature** | 44 | Geo developers, skeptics, investors |
| **P2 — Same fields as Point/AOI panels** | 36 | Energy developers, students |
| **P3 — Cap at 3 + refuse 4th** | 29 | Skeptics, ops-minded developers |
| **P4 — Mixed Point + AOI pins OK** | 24 | Lease sketchers comparing click vs polygon |
| **P5 — County “not a pin score” in cells** | 27 | Investors who misuse ranks less |
| **P6 — Clear / remove without reload** | 18 | Day-to-day UX |
| **P7 — Methodology names Compare honestly** | 16 | Researchers, policy light |

---

## Confusion clusters

| Cluster | ~Mentions | Who | Implication |
|---------|-----------|-----|-------------|
| **C1 — Why do AOI and Point share “Points (n)”?** | 16 | Broader energy / students | SOON S3 kind-aware labels |
| **C2 — Where did limitations go?** | 13 | Skeptics, geothermal developers | SOON S1 limitations row |
| **C3 — How do I tell two similar AOIs apart?** | 11 | Investors comparing lease sketches | SOON S4 richer labels |
| **C4 — Is Compare a new mode or always-on strip?** | 8 | First-time explorers | Empty-state copy mostly OK |
| **C5 — Duplicate pin refused — was that the same site?** | 5 | Analysts | Hint copy OK; keep light dup guard |

---

## Distrust clusters

| Cluster | ~Mentions | Who | Severity for stop |
|---------|-----------|-----|-------------------|
| **D1 — Table is still a silent ranking** | 19 | Skeptics, geothermal developers | **SOON S7** — not stop-fail if no CompareScore/winner |
| **D2 — County digits across columns = fake winner** | 14 | Investors, domain experts | Demotion holds; **SOON S6** optional |
| **D3 — Weak pin means still visible beside strong pin** | 12 | Scientists | **SOON S2** soft parity |
| **D4 — Transmission columns still tempt interconnect fantasy** | 9 | Energy developers | Residual; ~km + grid proxy mostly holds |
| **D5 — Large-AOI smear invisible in Compare** | 7 | Domain experts (2.2 residue) | SOON S1 + prior 2.2 S1 |

---

## Missing must-haves (asked for; disposition)

| Ask | ~Mentions | Judgment disposition |
|-----|-----------|----------------------|
| Parcels / minerals / ownership | 17 | **DEFER 2.4** — do not unlock now |
| Persist / share compare sets / URL | 14 | **DEFER** sprawl |
| “Just tell me which pin is best” / CompareScore | 11 | **REJECT** |
| Depth / T-at-target / cost | 13 | Later thermal — not 2.3 |
| Live ERCOT / HIFLD lines | 10 | **REJECT** for this phase family |
| Export PDF / slide pack of compare | 8 | **REJECT** |
| Sort pins by confidence / n | 7 | **REJECT** (ranking chrome) |
| Geocoder / address to pin | 4 | **REJECT** |

---

## Dismiss triggers (sophisticated geo developers)

1. Shipping a **CompareScore**, winner badge, or auto-sorted “strongest” pin  
2. Treating **county ScreeningScore** as the compare axis  
3. Opening **parcels** before Compare honesty is trusted  
4. **Interconnection cosplay** from transmission columns  
5. Brand language implying pad-ready site selection from three pins

**Note:** Explicit no-winner + refuse-4th reduced dismiss vs a “site ranking / best of three” framing. D1/D2 remain the live distrust residue (glance behavior), not a missing deliverable.

---

## Weighted synthesis for judgment

| Signal | Direction |
|--------|-----------|
| Primary buyers (geo + energy + investors ≈68) | Majority useful; want parcels later, not a score now |
| Skeptics (14) | Praise no-winner; distrust glance-ranking + missing limitations |
| Ask volume for CompareScore / sort | Minority — **reject**, do not reopen |
| Ask volume for 2.4 parcels | High — **defer**, do not unlock from this persona pass |

**Net:** Personas **confirm STOP** with SOON polish only (limitations row, soft parity, kind labels). Do not invent NOW ranking chrome. Do not unlock 2.4.
