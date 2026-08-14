# Persona synthesis — Phase 3 slice 1 (~100)

**Date:** 2026-08-14  
**Simulated reviewers:** ~100 (weighted per BUILD_FRAMEWORK)  
**Stimulus:** Shipped Watchlist / updates panel — local ≤25 county watch, Check updates / Mark as seen digest, publishId vintage, frozen v0 rule candidates with rule text, Tools badge, Detail **Watch** control; ranked-list session **Focus** still present.

---

## Cohort weights

| Persona | ~n | Weight rationale |
|---------|----|------------------|
| Geothermal developers | 30 | Primary buyer — return cadence |
| Energy project developers (broader) | 22 | Primary adjacent |
| Infrastructure / land investors | 20 | Primary capital — shortlist trust |
| Skeptical domain experts / geo scientists | 12 | Trust gate / anti-ML |
| Researchers / students | 10 | Secondary |
| Policymakers / economic development | 6 | Light |
| **Total** | **100** | |

---

## Reaction mix

| Reaction | ~Count | Notes |
|----------|--------|-------|
| Useful / keep going | 38 | Local watch + vintage digest is the missing return loop |
| Lukewarm | 24 | Want email later; accept local-first for MVP |
| Confused | 18 | Focus vs Watch vs “Generated focus candidates” |
| Distrust | 14 | Digest “updates found” with empty list; “Generated” sounds ML |
| Dismiss | 6 | Want parcels / push alerts / national GIS (out of scope) |

---

## Praise clusters

| Cluster | ~Mentions | Who |
|---------|-----------|-----|
| **P1 — Local watch without accounts** | 44 | Geo developers, energy developers |
| **P2 — Digests tied to published vintage (not live grids)** | 36 | Skeptics, geothermal developers |
| **P3 — Rules text beside candidates** | 33 | Investors, scientists |
| **P4 — Not a score labeling on candidates** | 29 | Skeptics, policy light |
| **P5 — Cap 25 + Watch on detail** | 27 | Power users tracking a beachhead set |
| **P6 — No new map layers / no GIS tax** | 22 | Solo-dev-sympathetic buyers, skeptics |
| **P7 — TexNet badge without hard exclude** | 15 | TX operators near seismicity |

---

## Confusion clusters

| Cluster | ~Mentions | Who | Implication |
|---------|-----------|-----|-------------|
| **C1 — Focus vs Watch** | 31 | Geo + energy developers (heaviest) | **NOW N2** — primary footgun |
| **C2 — Are “Generated focus candidates” my watchlist?** | 19 | Investors, students | Rename; clarify derived shortlist |
| **C3 — Why Check updates if Tools already says updates?** | 14 | Broader energy | Badge vs panel; improve after N1 |
| **C4 — publishId string looks like debug** | 9 | Non-technical investors | SOON shorten/label; not stop |
| **C5 — Is this email alerting?** | 8 | Stakeholders hearing “automated” | Methodology + copy; reject push for now |

---

## Distrust clusters

| Cluster | ~Mentions | Who | Severity for stop |
|---------|-----------|-----|-------------------|
| **D1 — “Updates found” + “No changes”** | 22 | Geothermal developers, investors | **STOP-blocker → NOW N1** |
| **D2 — “Generated” implies ML / secret model** | 16 | Domain experts, geo developers | **NOW N2/N4** naming |
| **D3 — Badge cried wolf after quiet republish** | 12 | Return users | Same as D1 / N1 |
| **D4 — Fear next sprint adds map watch layers** | 7 | Skeptics | Affirm REJECT GIS sprawl |
| **D5 — Repo methodology still says Phase 3 not unlocked** | 6 | Researchers / auditors | **NOW N3** |

---

## Missing must-haves (asked for; disposition)

| Ask | ~Mentions | Judgment disposition |
|-----|-----------|----------------------|
| Email / Slack digest | 18 | **DEFER** — not slice 1 |
| Cloud sync / accounts | 14 | **DEFER** |
| Point / AOI watch pins | 11 | **DEFER** |
| Merge Focus + Watch | 10 | **DEFER** (clarify now; merge later only with judgment) |
| Parcel / GLO adjacency on candidates | 9 | **REJECT** GIS sprawl |
| ML ranking of prospects | 8 | **REJECT** |
| Export watchlist JSON | 7 | **SOON/DEFER** S4 |
| Live ERCOT / CEII | 5 | **REJECT** |
| Auto-open digest on every visit | 6 | **SOON** S1 — not email |

---

## Dismiss triggers (sophisticated geo developers / investors)

1. Digest UI that **claims updates when nothing changed** on watched counties  
2. Three unlabeled “focus” systems that don’t share state  
3. Calling a rank filter **“generated”** without visible rules (rules are visible — keep them; fix noun)  
4. Shipping a **watch choropleth** or parcel layer to “finish” automation  
5. Push/email that pretends **live grid** monitoring

**Note:** Praise for local-first + vintage honesty is real. Distrust concentrates on **empty-state lies** and **Focus/Watch IA**, not on missing GIS.

---

## Cluster → judgment feed

| Cluster | Feed into |
|---------|-----------|
| D1, D3, C3 | **NOW N1** digest honesty |
| C1, C2, D2 | **NOW N2** (and light N4) naming |
| D5 | **NOW N3** methodology sync |
| P6, D4, parcel/ML asks | **REJECT** sprawl / ML |
| Email/accounts/pins | **DEFER** |
| P1–P5, P7 | **KEEP** — do not regress |

---

## Persona one-liner

Primary buyers like the **return loop**; they will **not trust it** until digests stop lying and Focus stops colliding with Watch.
