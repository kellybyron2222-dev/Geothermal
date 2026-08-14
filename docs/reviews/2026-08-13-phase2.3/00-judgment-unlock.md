# Judgment Director — Unlock Phase 2.3 (side-by-side evidence compare)

**Date:** 2026-08-13  
**Director role:** Decide whether to unlock Phase 2.3 after Phase 2.2 STOP  
**Inputs:** `phase2.2/05-judgment-after-personas.md` (STOP) · `phase2.md` · `tasks.md` · Point/AOI honesty locks · user “ok lets keep going”  
**Product constraints:** explainable decisions ≠ GIS sprawl · Texas beachhead · heuristics · solo-dev · maps are inputs · no site/AOI ScreeningScore

---

## Verdict

### **UNLOCK Phase 2.3 — razor-thin side-by-side evidence snapshot compare only.**

| Question | Decision |
|----------|----------|
| Unlock 2.3 now? | **Yes** — user asked keep going after 2.2 STOP |
| Force 2.2 SOON polish first (S1–S5)? | **No** — do not block on large-AOI smear / draw affordances |
| Open 2.4 parcels? | **No** — remains locked |
| Invent CompareScore / winner rank? | **Reject** |

**Why unlock now:** Phase 2.2 stop closed AOI evidence honesty (control first, ~km grid, demoted county, no AOI ScreeningScore). Personas deferred compare explicitly to 2.3. Roadmap next candidate is 2.3. User explicitly asked to keep going. Residual 2.2 SOON (S1–S5) and county polish (S7) stay optional — not a gate.

**Why not parcels / score matrix:** Parcels are Phase 2.4. County focus/ignore already covers shortlist comparison on the screening surface. Compare here is **evidence-to-evidence**, not a second ScreeningScore ladder.

---

## Minimal honest scope (this slice only)

**Product name in UI:** **Compare evidence** (not “best sites”, not “site ranking”, not “CompareScore”).

### User flow (minimal)

1. In **Point check** or **AOI check**, after an evidence panel is built, **pin** that snapshot (label = mode + short place cue).
2. Pin **2–3** snapshots max (Point and/or AOI mixed OK). Fourth pin refused with clear message.
3. Open **Compare** view: a **side-by-side table** of the same honesty hierarchy columns used in Point/AOI panels:
   - Control quality first (`n`, nearest km / inside count, confidence, evidence verb)
   - Local thermal means (same demotion rules as source panel — weak → muted / collapsed cue in cell)
   - Transmission ~km (grid proxy copy intact)
   - County screening context (demoted; “not a score for this evidence”)
   - Situational limitations (short list or count + expand)
4. No column or footer that ranks, scores, or declares a **winner / best site**. Soften any “best / preferred / top” language to **side-by-side evidence**.

### Data (reuse only)

| Asset | Role |
|-------|------|
| Existing Point / AOI dossier builders | Snapshot source — pin copies fields already computed |
| In-session pin list (2–3) | Compare input only |

**No new GIS assets.** No export pack. No persisted campaign store required for this slice (in-session is enough).

### Deliverable list (NOW backlog)

| ID | Deliverable |
|----|-------------|
| **C1** | Pin up to **3** evidence snapshots from Point and/or AOI panels (clear affordance + refuse 4th) |
| **C2** | Compare view: side-by-side **table** of honesty-hierarchy fields (same column order as panels) |
| **C3** | **No winner / no CompareScore** — UI copy + layout never ranks pins; soften “best site” language |
| **C4** | Methodology note: compare = pinned evidence snapshots only; not a site score; county rank ≠ pin quality |
| **C5** | Remove/clear pins + empty Compare state (minimal UX so users can re-pin without reload) |

**Hard cap:** C1–C5. If schedule slips, ship **C1 + C2 + C3** before methodology (C4) and clear/remove polish (C5).

---

## REJECT in 2.3 (explicit)

| Reject | Why |
|--------|-----|
| **CompareScore / winner / “best site” rank** | Contaminates evidence family; invents a score we refuse for Point/AOI |
| County ScreeningScore compare matrix as primary | County focus/ignore already exists; not this product |
| Parcels / ownership / minerals | Phase 2.4 locked |
| Geocoder / address search | GIS trap |
| Full HIFLD / live ERCOT / interconnection | Cosplay engineering |
| AOI / Point campaigns, saved libraries, MultiPolygon packs | Scope sprawl |
| Export PDF / share packs / auth | Not decision-critical for solo MVP |
| ML / IDW surfaces, DIY BHT→gradient | Black-box / research |
| Dual choropleths | Already rejected for this phase family |
| Site / AOI ScreeningScore | Prior locks stand |
| Making 2.2 SOON S1–S5 a blocker | Optional polish; do not serialize |

---

## How Compare must reuse Point / AOI honesty

| Evidence lock | Compare must |
|---------------|--------------|
| Control quality first | First data columns = control / confidence / verb — not loud means |
| Weak means demoted | Cells respect same weak-evidence demotion as source panel |
| ~km grid transmission | Same proxy wording; not survey-grade |
| County context demoted | County rank/score cells = context only; banner/copy: not a pin score |
| No ScreeningScore for Point/AOI | **No CompareScore** — ever in this slice |
| Evidence verbs, not recommendations | No “recommended site” / “best of three” |
| Evidence-only map quarantine | Compare does not re-authorize county score heatmap |

**Framing:** Compare is **pinned evidence side-by-side**, not a new scoring product and not a county shortlist substitute.

---

## Stop criteria for Phase 2.3

Stop when **ALL** are true:

1. User can pin **2–3** Point and/or AOI evidence snapshots and open a side-by-side table of honesty-hierarchy fields.
2. User cannot reasonably read Compare as a **winner / best site / CompareScore** product (copy + absence of rank column).
3. County ScreeningScore / rank remains **context only** in compare cells — not the primary compare axis.
4. Weak control still reads before loud means across columns (same hierarchy as panels).
5. Transmission cells cannot be read as precise engineering distance.
6. Fourth pin is refused (or oldest replaced only if product chooses refuse — prefer **refuse** for honesty of “2–3”).
7. County explorer + Point + AOI still work if Compare path fails; no coupling that breaks prior phases.
8. Scope lock held: no parcels, geocoder, full HIFLD, AOI campaigns, PDF export, CompareScore, site/AOI ScreeningScore.

**Then stop.** Run short red/blue on C1–C5 only. Do **not** open 2.4 until a later judgment unlocks.

---

## Deferred (still deferred)

- Phase 2.2 SOON S1–S5 (large-AOI smear, draw affordance, upload caveat, county probe miss)
- County enhance-soon S7 dual panel numbers; S1–S6 residual polish
- West TX reweight (F14)
- Persisted compare libraries / share URLs
- Phase **2.4** parcels

---

## Director one-liner

**Unlock 2.3 now as pin-2–3 Point/AOI evidence snapshots into a side-by-side honesty table — control first, no winner, no CompareScore, no parcels — and stop when that read is clear.**
