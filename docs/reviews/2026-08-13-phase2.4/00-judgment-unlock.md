# Judgment Director — Unlock Phase 2.4 (land-context honesty)

**Date:** 2026-08-13  
**Director role:** Decide whether to unlock Phase 2.4 after Phase 2.3 STOP  
**Inputs:** `phase2.3/05-judgment-after-personas.md` (STOP) · `phase2.md` · `tasks.md` · Point/AOI/Compare honesty locks · user “ok go”  
**Product constraints:** explainable decisions ≠ GIS sprawl · Texas beachhead · heuristics · solo-dev · static-first · **no site/AOI/Compare ScreeningScore**

---

## Verdict

### **UNLOCK Phase 2.4 — YES, razor-thin land-context honesty only. Not parcel GIS.**

| Question | Decision |
|----------|----------|
| Unlock 2.4 now? | **Yes** — under renamed honest scope |
| Ship full TX parcel / ownership GIS? | **Reject** — solo-dev black hole |
| Buy commercial parcel APIs for MVP? | **Reject** |
| Claim ownership / mineral estate certainty? | **Reject** |
| Defer 2.4 and do enhance-soon polish instead? | **No** — honesty slice is achievable without GIS; user unlocked next phase |
| Force 2.3 SOON (S1–S7) first? | **No** — optional residual; not a gate |

**Why unlock (not defer):** Personas repeatedly ask for parcels. A checkbox “parcels” layer would lie or trap the solo-dev. A **land-context honesty** panel earns the phase name without cadastral data: intersecting **county**, explicit “ownership not in-app,” and **citations** to known public Texas research paths (CAD / RRC concepts). That changes the decision read (“I must look land up elsewhere”) without inventing owners.

**Why not defer to polish:** 2.3 SOON (limitations row, soft parity, kind labels) improves Compare UX but does not answer the land-context gap. Solo-dev achievability favors a thin honesty block over pretending parcels require GIS first.

**Why not invent county land hints:** No pre-aggregated Texas surface/ownership dataset lives in-repo. Do **not** fabricate % public land, lease density, or ownership scores. County name (already resolved) + honesty + outbound links is enough.

---

## Minimal honest scope (this slice only)

**Product name in UI:** **Land context** (subtitle / section: “not parcel ownership”).  
**Do not** brand this as “Parcels,” “Ownership,” or “Title check.”

### User flow (minimal)

1. In **Point check** or **AOI check**, after evidence is built, a demoted **Land context** block appears **after** thermal/control/grid (or within limitations-adjacent demoted zone — not above control quality).
2. Block contents (static + already-known fields only):
   - Intersecting **county** name(s) for the click / AOI (reuse existing county resolution)
   - Explicit honesty: **Parcel ownership and mineral estate are not resolved in this app**
   - Short research cue: surface ownership typically starts with the **county appraisal district (CAD)**; oil/gas / related public records concepts via **RRC** (and similar public portals) — **links/citations only**, no scrape, no live API
   - AOI path: if user uploaded/drew a polygon, note that the shape is a **user-supplied boundary**, not a verified parcel or ownership polygon
3. **Compare evidence:** one demoted land-context cell/row repeating the same honesty (county + “ownership not in-app”) — no new score column.
4. Methodology page: land context = honesty + outbound research pointers; not ownership certainty; not a site score input.

### Data (reuse only)

| Asset | Role |
|-------|------|
| Existing Point / AOI county resolution | Intersecting county name(s) |
| Static curated URLs / short citation copy | Public TX research pointers (CAD pattern, RRC concepts, optional GLO overview if cited carefully) |
| Existing Compare pin snapshots | Carry land-context honesty into compare cells |

**No new GIS assets.** No parcel polygons. No ownership attributes. No commercial feeds.

### Deliverable list (NOW backlog — hard cap P1–P5)

| ID | Deliverable | Priority |
|----|-------------|----------|
| **L1** | **Land context** honesty block on Point + AOI evidence panels: intersecting county + “ownership / minerals not in-app” | Must |
| **L2** | Curated **citation links** (static) to public Texas land-research concepts — CAD / RRC (and optional GLO overview); no scraping | Must |
| **L3** | AOI draw/upload caveat: user polygon ≠ verified parcel / ownership boundary | Must |
| **L4** | Methodology: land context = honesty + outbound pointers; not ownership certainty; not a ScreeningScore input | Must (docs/UI) |
| **L5** | Compare: demoted land-context cell/row (county + same honesty; no ownership column) | Should (after L1–L3) |

**Slip rule:** Ship **L1 + L2 + L3** before L4/L5 if schedule slips. L5 must not invent new compare ranking.

---

## REJECT in 2.4 (explicit)

| Reject | Why |
|--------|-----|
| Statewide / county parcel polygon layers | Solo-dev black hole; GIS sprawl |
| Scraping appraisal districts / CAD portals | Fragile, legally/ops risky, not static-first |
| Commercial parcel / ownership APIs for MVP | Cost + lock-in; not explainable decisions |
| Ownership certainty / title claims | Product would overclaim |
| Mineral estate resolution / severed minerals UI | Domain trap; not beachhead MVP |
| Full cadastral map layer / parcel click-to-owner | Checkbox GIS, not decisions |
| Site / AOI / Compare ScreeningScore from land | Prior locks stand |
| Geocoder, full HIFLD, live ERCOT, PDF export packs | Still out of family |
| Fabricated county “% public land” / lease-density scores without data | Honesty violation |
| Treating AOI GeoJSON upload alone as “parcels shipped” | Too weak; must pair with honesty + citations (L1–L3) |

---

## How land context must respect prior honesty

| Prior lock | 2.4 must |
|------------|----------|
| Control quality first | Land context stays **demoted** — never above thermal control |
| County ScreeningScore demoted | County name here is **jurisdiction for land research**, not a land score |
| No site/AOI/Compare ScreeningScore | Land context is never scored |
| Evidence verbs, not recommendations | No “lease this” / “clear title” language |
| Compare no winner | Land row does not rank pins by ownership |

**Framing:** Phase 2.4 is **land-research honesty**, not a parcel product.

---

## Stop criteria for Phase 2.4

Stop when **ALL** are true:

1. Point and AOI evidence panels show a **Land context** block with intersecting county + explicit ownership-not-in-app honesty.
2. User has **static citation links** to public Texas research paths (CAD / RRC concepts at minimum) without any scrape/API.
3. AOI path cannot be read as verified parcel ownership (draw/upload caveat present).
4. User cannot reasonably believe the app resolved owners, title, or mineral estate.
5. Land context is **not** a ScreeningScore input and does not create a site score.
6. Compare (if L5 shipped) repeats demoted honesty only — no ownership ladder.
7. County explorer + Point + AOI + Compare still work; no coupling to new GIS assets.
8. Scope lock held: no statewide parcels, no commercial ownership APIs, no mineral resolution, no cadastral layer.

**Then stop.** Run short red/blue on L1–L5 only. Do **not** open a “real parcels” follow-on without a new judgment.

---

## Deferred (still deferred)

- Phase 2.3 SOON S1–S7 (Compare limitations row, soft parity, kind labels, etc.)
- Phase 2.2 residual SOON (large-AOI smear, draw polish)
- County enhance-soon S7 dual panel numbers; residual county polish
- West TX reweight (F14)
- Any future true parcel integration (only if judgment later finds a **thin, licensed, non-scrape** path — default remains **reject**)

---

## Director one-liner

**Unlock 2.4 as land-context honesty on Point/AOI (and demoted Compare): county + “ownership not in-app” + static Texas citations — reject every parcel GIS, scrape, API, and ownership claim that would turn a solo MVP into a cadastral trap.**
