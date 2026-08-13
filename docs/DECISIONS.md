# Locked Product Decisions

Status as of 2026-08-13. These decisions gate implementation planning. Do not reopen casually.

## D1 — Play type (MVP)

**Locked: Next-generation geothermal (Texas / ERCOT)**

In scope for MVP framing:

- Closed-loop / AGS-style systems
- Open-loop / EGS-style systems
- Colocated with existing energy infrastructure **or** standalone
- Modular small-scale **or** larger utility-scale concepts

Out of scope for MVP play framing (may return later as adjacent modules):

- Conventional hydrothermal-only screening
- Oilfield coproduction as the primary product (well data remains an *evidence* source, not the play)
- Geopressured-geothermal as a dedicated product line
- Direct-use / industrial heat as the primary product

### Why this lock

Texas is not a classic hydrothermal province. Next-gen systems are the credible growth narrative for developers and infrastructure investors. Public well control still informs temperature and subsurface confidence, but the decision question is **where next-gen projects can be sited**, not where produced fluids are hottest today.

### Design implication

The factor model must support both open- and closed-loop next-gen concepts without collapsing them into a single opaque “geothermal score.” Colocation with infrastructure is a first-class axis, not a decorative map layer. Scale (modular vs large) is a user lens on the same evidence, not a separate statewide model in MVP.

---

## D2 — First job-to-be-done (MVP)

**Locked: Discover where in Texas to focus**

Primary outcome: a ranked set of regions / prospect zones with explainable drivers — not a GIS tour, not an AOI uploader, not a parcel search.

Deferred immediately after MVP (near-term, not Phase 1):

- Screen a known AOI
- Compare candidate sites side-by-side
- Land / mineral-first discovery
- Grid / offtake-first discovery (ERCOT remains a **constraint factor**, not the lead workflow)

### Why this lock

“Where should I focus, and why?” is the company thesis. Discovery-first creates the wedge: synthesis + explainability + speed. Screening and comparison are natural Phase 2 extensions once the statewide ranking is trusted.

### Design implication

Ship a **ranked, factor-explained focus list** as the core deliverable. Map is supporting context. Every MVP dataset must change rank or explanation; otherwise defer it.

---

## D3 — Phase 1 scope freeze (red-team, 2026-08-13)

**Locked in [red-team-mvp.md](red-team-mvp.md):**

- Spatial unit: **counties** (called screening counties—not “prospects” in user copy)
- Opportunity factors: **thermal 0.60 + transmission 0.40** only
- Wells: **confidence only** (not opportunity)
- Delivery: **static app** (no API/PostGIS in Phase 1)
- No interactive dataset explorer / layer toggles

When documents conflict, **red-team-mvp.md wins**.
