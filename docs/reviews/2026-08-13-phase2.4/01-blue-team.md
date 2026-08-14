# Blue Team — Phase 2.4 (Land context honesty)

**Date:** 2026-08-13  
**Slice:** Demoted Land context on Point/AOI; static CAD/RRC/GLO citations; AOI≠parcel caveat; Compare demoted row; methodology + data-sources (L1–L5)  
**Code checked:** `landContext.ts`, `LandContextSection.tsx`, `SiteDossierPanel.tsx`, `AoiEvidencePanel.tsx`, `compareSlot.ts`, `ComparePanel.tsx`, `Methodology.tsx`, `docs/data-sources.md`, `aoiEval.ts` (limitations)

---

## Verdict (blue)

Phase 2.4 **ships the unlock’s honesty shape**: land-research pointers without ownership GIS. Keep the demoted block, static citations, AOI boundary caveat, and Compare non-score land row. No missing L1–L5 deliverable; residual polish is not a failed JTBD.

---

## What works (keep)

### K1 — Product framing matches the lock
- UI name is **Land context** (`h3` + `aria-label`), not “Parcels,” “Ownership,” or “Title check.”
- Lead line: `Ownership, title, and mineral estate are not in this app.`
- Citations carry `External records; not verified by this product.`
- Methodology § Land context: honesty + outbound pointers; **not** parcel GIS / ownership certainty; **not** a ScreeningScore input.
- `data-sources.md` §5 explicitly refuses statewide parcels, owner names, parcel IDs, land scores, scrape/API, ArcGIS parcel layer.

### K2 — Point + AOI honesty block (L1)
- Shared `LandContextSection` after county screening context, **below** thermal/control/transmission — demoted zone held.
- Intersecting county name(s) reused from existing Point/AOI resolution (no new GIS).
- Empty county path: “No intersecting scored county resolved for land research” — does not invent a land score.

### K3 — Static citations only (L2)
- Curated `LAND_CITATIONS`: Comptroller CAD/county directory, RRC data/research, optional GLO overview.
- Links are static `href`s — no runtime fetch, scrape, or live CAD API.
- Each citation has a **why** that steers surface vs mineral-context research without claiming resolution (`not mineral ownership` on RRC).

### K4 — AOI ≠ parcel (L3)
- `aoiBoundaryCaveat` on AOI panel shows: `Drawn/uploaded AOI is not a verified parcel boundary.`
- Same string also in AOI `limitations[]` — double-path honesty if user skips the land block.
- Point path correctly omits the AOI caveat.

### K5 — Methodology + docs (L4)
- In-app Methodology has dedicated Land context bullets + “What this is not” includes parcel/title/minerals.
- Compare methodology bullet ties land row to ownership-not-in-app (no ownership ladder).
- `docs/data-sources.md` documents pointers as research-only, not ingested ScreeningScore data.

### K6 — Compare demoted land row (L5)
- `landSummary` on `CompareSlot`: county cue + `ownership not in-app — see CAD/RRC`.
- Table row labeled **Land context**, `compare-demoted` styling, always-on muted line `ownership / minerals not in-app`.
- No ownership ladder, no land score column, no ranking by land.

### K7 — Scope discipline held
- No parcel polygons, commercial APIs, CAD scrape, mineral estate UI, fabricated % public land / lease-density scores.
- Land context never enters ScreeningScore; no site/AOI/Compare land score.
- Prior Point / AOI / Compare / county explorer paths unchanged aside from additive UI.

---

## Decision value (why this creates user value)

| Buyer job | Value delivered |
|-----------|-----------------|
| Geothermal / energy developer | Knows **which county** to take to CAD/RRC next — without fake title certainty |
| Infra / land investor | Explicit “not in-app” reduces over-trust before diligence spend |
| Skeptical scientist | Outbound pointers + AOI≠parcel caveat beat a checkbox “parcels” layer |

**Framing that works:** Land context is **honesty + outbound research**, not a parcel product and not a score input.

---

## Blue keep-list (do not regress)

1. Product name **Land context** — never brand as Parcels / Ownership / Title check.
2. Explicit ownership / title / minerals **not in-app** on Point + AOI.
3. Static curated citations only — no scrape, no live ownership API, no parcel GIS assets.
4. AOI draw/upload caveat always present on AOI evidence path.
5. Land block stays **demoted** (after control / thermal / grid / county context).
6. Compare land row = honesty only — no ownership ladder or land score.
7. Land context never feeds ScreeningScore or a site/AOI/Compare land score.
8. Methodology + data-sources stay in sync with “pointers, not coverage.”

---

## Blue disposition for judgment

Prefer **STOP** — unlock stop criteria 1–8 met at honesty level. Residual polish (repo methodology sync, citation UX noise, county-deep CAD link) is **SOON/DEFER**, not a missing deliverable. **Do not** unlock inventing parcel GIS next.
