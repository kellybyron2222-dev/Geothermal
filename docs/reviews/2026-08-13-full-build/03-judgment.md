# Judgment Director — Full build so far (Phase 1 + Phase 2.1)

**Date:** 2026-08-13  
**Scope under review:** Phase 1 county screening + Phase 2.1 Point check (post J1–J9)  
**Director role:** Decide NOW / SOON / DEFER / REJECT; define stop for this retrospective slice  
**Inputs:** Blue KEEP locks · Red F1–F15 · prior Phase 2.1 judgment (J1–J9) · product constraints · MVP (list-primary, explainable focus/ignore)

---

## Verdict on Phase 1 + 2.1 status

| Slice | Status | Why |
|-------|--------|-----|
| **Phase 1** | **Not closed** | Core question and two-factor model are right (blue), but decision trust is broken: map-primary UX without a usable ranked shortlist (**F1**), “gradient preferred” marketing vs HF-dominated leaderboard (**F2**), and separate cohort scaling sold as one comparable ScreeningScore (**F3**). That is not “polish”—it fails the MVP job. |
| **Phase 2.1** | **Honesty mostly landed; stop open** | J1–J9 largely shipped. Stop criteria still fail on **F9** (point mode on county-score heatmap) and **F11** (weak means still visually large). |
| **Combined “full build so far”** | **Not stop-ready** | Do **not** open 2.2–2.4. Do **not** celebrate into AOI/compare/parcels. Cap this week to the smallest honesty/UX fixes that restore focus/ignore trust. |

**Director stance:** Blue team wins on product shape and locks. Red team wins on shipping honesty. Prefer quarantine and demotion over new surfaces. Solo-dev budget: **≤5 NOW items**, merged ruthlessly. Features that don’t change a focus/ignore decision this week are out.

---

## Build / fix NOW (this week only)

| ID | Maps from | Concrete action | Why (decision impact) |
|----|-----------|-----------------|------------------------|
| **N1** | F1, F8 | **Rank-first decision surface.** Make the ranked county list the primary workflow (visible shortlist + sort by rank; map is supporting context). Add minimal focus/ignore cues (e.g. mark Focus / Ignore on ≤~6 counties, or explicit “leave with ~3 focus / ~3 ignore” checklist copy tied to the list). | Without a ranked shortlist, users cannot do the MVP job; map-primary is GIS sprawl. |
| **N2** | F2, F3, F5 | **Thermal cohort quarantine (no dual choropleths).** (1) Default primary ranking to **gradient cohort only**, with heat-flow fallback in a clearly secondary list/filter—**or** hard-separate ranks so HF and gradient never share one fake ladder. (2) **Min-n gate** before gradient preference (kill n=1 flip to “gradient”). (3) Copy: ScreeningScore is **not comparable across thermal metrics**. Bump methodology note if rules change. | Top-10 dominated by HF while UI says gradient preferred is a trust-ending lie; separate scaling + one leaderboard is false precision. |
| **N3** | F4, F13 (light) | **Encode metric on the single choropleth**—not a second map. e.g. hatch/outline/badge for heat-flow fallback vs gradient; muted/stigma style for missing thermal. One ScreeningScore fill only. | Users must see *what* was scored without approving dual full choropleths. |
| **N4** | F7, F6 (light), F15 (methodology) | **Confidence on the decision surface.** Show confidence band on every list row (and demote Low/Unknown visually). Fix methodology confidence copy to match shipped rules. Label **100.0 ties** as ties (no unique-#1 cosplay). Sync the confidence section of methodology (+ tasks status line if it still says 2.1 “IN PROGRESS” after this slice closes). | Low-conf in top ranks + wrong docs trains distrust; pile-ups look like fake certainty. |
| **N5** | F9, F11 | **Close Phase 2.1 residual stop.** In Point check: **blank/neutral basemap**—no county ScreeningScore heatmap. Keep weak local means **visually subordinate** to control quality (`n`, nearest km, confidence)—size/weight hierarchy, not a second banner. | Explicit prior stop fail; evidence mode must not borrow county-score authority. |

**Hard cap:** Implement N1→N5 in that order. If schedule slips, ship **N1 + N2 + N5** before N3/N4—not the reverse.

---

## Enhance SOON (still this phase family — only after NOW stop)

| ID | Maps from | Action |
|----|-----------|--------|
| **S1** | F10 | Soften verbs: evidence-state language, not recommendations; make “Deprioritize / weak evidence” reachable when evidence is thin. |
| **S2** | F12 | County infra distance: same honesty as point (~km / grid proxy)—no false county precision. |
| **S3** | F6 (deeper) | If ties remain after quarantine, tighten winsorize/scale presentation or rank-sharing rules (methodology bump if math changes). |
| **S4** | Prior 2.1 S1 | Conflict callout: strong county rank vs weak local Point check evidence. |
| **S5** | F13 remainder / polish | Stronger missing-thermal stigma if N3 light treatment is still too quiet. |
| **S6** | F15 remainder | Full docs drift pass (`tasks.md`, roadmap status) after code stop—no feature work. |
| **S7** | Prior 2.1 / tasks | Optional dual **panel** display of gradient + heat flow (numbers only)—**not** dual statewide choropleths. |

---

## DEFER

| Item | Why defer |
|------|-----------|
| **F14 — Reweight thermal vs infra for West TX** | Don’t reopen 0.60/0.40 this week; needs calibration note + methodology version, not a panic tweak. |
| AOI draw/upload (2.2) | Honesty of statewide rank first. |
| Side-by-side compare (2.3) | Same. |
| Parcels / minerals (2.4) | Not decision-critical for county focus/ignore. |
| Voltage-class / substations / queues | Phase 3+. |
| Depth / T-at-target scenarios | Later thermal upgrade. |
| Tighter Point check radius / nearest markers (prior S3–S4) | After F9/F11 closed. |
| Dual full choropleths (gradient map + HF map) | Heavier than quarantine; reject for this slice (see REJECT). |

---

## REJECT (do not build)

| Item | Why |
|------|-----|
| AOI / compare / parcels in this slice | Scope creep; blocked until Phase 1+2.1 stop. |
| **Dual full choropleths** | Solo-dev cost; N2+N3 quarantine is enough. |
| Site / point ScreeningScore | Contaminates county screening with fake site grades. |
| ML / IDW thermal surfaces | Black-box; violates explainable-heuristics lock. |
| DIY BHT→gradient | Research project, not MVP. |
| Geocoder, layer catalog, full HIFLD in browser | GIS trap. |
| PDF export, auth, saved sites | Not decision-critical. |
| Reopening play-type / factor-count locks | Blue KEEP stands. |
| “Fix West TX” by silent weight edits | Methodology theater without calibration. |

---

## Explicit stop criteria — this retrospective slice

Stop when **ALL** are true:

1. **Rank-first:** User can produce ~3 focus and ~3 ignore counties from the **list** in one session without treating the map as the product (**N1**).
2. **Thermal honesty:** Primary leaderboard cannot reasonably be read as one cross-metric ladder; gradient preference requires min-n; HF is quarantined/secondary (**N2**).
3. **Metric visibility:** On the single choropleth, user can tell gradient vs heat-flow fallback (and missing thermal is not “normal green”) (**N3**)—without a second full map.
4. **Confidence honesty:** List rows show confidence; methodology matches shipped bands; perfect-score ties are labeled (**N4**).
5. **Point check quarantine:** Point mode does **not** show county ScreeningScore heatmap; weak means are not the visual lead (**N5** / F9+F11).
6. **Scope lock:** No AOI, compare, parcels, or dual choropleths shipped.

**Then stop.** Run a short red/blue pass on N1–N5 only. Do **not** open Phase 2.2+ until that pass clears stop.

---

## Ordered implementation backlog (builders)

1. **N1** — Rank-first list + focus/ignore cues (map demoted)  
2. **N2** — Cohort quarantine + min-n gradient gate + no cross-metric comparability copy  
3. **N5** — Point mode: kill county-score heatmap; demote weak means  
4. **N3** — Light metric encoding on single choropleth (+ missing-thermal stigma)  
5. **N4** — Confidence on ranks + methodology/tasks honesty + tie labeling  

**Slip rule:** If only three land, they must be **N1, N2, N5**. N3/N4 next day—not AOI, not weights, not a second map.
