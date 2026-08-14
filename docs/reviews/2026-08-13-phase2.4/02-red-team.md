# Red Team — Phase 2.4 (Land context honesty)

**Date:** 2026-08-13  
**Stance:** Attack fake ownership certainty, citation-as-coverage, AOI-as-parcel reads, Compare land ladders, and any path that invents parcel GIS next.  
**Code checked:** `landContext.ts`, `LandContextSection.tsx`, `SiteDossierPanel.tsx`, `AoiEvidencePanel.tsx`, `compareSlot.ts`, `ComparePanel.tsx`, `Methodology.tsx`, `docs/data-sources.md`, `docs/scoring-methodology.md`

---

## Critical / honesty findings

| ID | Severity | Finding | Why it hurts | Rec |
|----|----------|---------|--------------|-----|
| **R1** | **Low–Med (residual)** | **Outbound links can be misread as “we cover land.”** Three official TX portals + county name look like product coverage even with disclaimers. | Glance readers may assume diligence is done in-app. | **SOON** — optional one-line “research elsewhere — not coverage” above the list. Not a stop-fail: disclaimer + external note already present. |
| **R2** | **Low** | **`LAND_CONTEXT_EXTERNAL_NOTE` repeats under every citation** (3× identical lines). | Noise may cause users to skip all muted lines, including the real disclaimer. | **SOON** — show external note once for the list. |
| **R3** | **Low** | **CAD pointer is statewide directory**, not deep-linked to the resolved county’s CAD portal. | Extra click; mild “product didn’t finish land” frustration — not a false ownership claim. | **DEFER** — county-specific CAD URLs are fragile/maintenance-heavy; directory is the honest static choice. |
| **R4** | **Low** | **GLO href is homepage** (`glo.texas.gov`), thinner than CAD/RRC research paths. | Optional per unlock; weak pointer if over-trusted as “state land ownership resolved.” | Keep as optional; **SOON** tighten why-copy if needed. Not stop-fail. |
| **R5** | **Low** | **Compare land cells text-only** — no CAD/RRC links in the matrix (panels have links). | User must leave Compare to click citations; honesty string still present. | Unlock L5 required honesty cell, not link parity. **SOON** optional tiny “see panel citations” cue. |
| **R6** | **Info** | **`docs/scoring-methodology.md` has no Land context section**; in-app Methodology + `data-sources.md` do (L4 met in product UI / data docs). | Repo doc drift for auditors. | **SOON** — sync scoring-methodology.md. |
| **R7** | **Info** | Unlock suggested subtitle **“not parcel ownership”**; UI uses disclaimer sentence instead of a literal subtitle. | Naming drift only — honesty content is stronger than a subtitle. | Keep disclaimer; optional subtitle polish. |
| **R8** | **Info** | County name appears in both **County screening context** and **Land context**. | Mild redundancy; risk of county ScreeningScore digits “bleeding” mentally into land. | Demotion + separate land disclaimer hold; do not merge into one scored land block. |

---

## What is *not* a critical failure (red concedes)

- **No parcel GIS / ownership attributes / commercial APIs / CAD scrape** — unlock REJECT held.
- User **cannot reasonably believe** the app resolved owners, title, or mineral estate if they read the land block (explicit not-in-app + external note + methodology).
- AOI path cannot be read as verified parcel if caveat + limitations line are present.
- Land context is **not** a ScreeningScore input and creates no land score.
- Compare land row is demoted honesty — **no ownership ladder**.
- No fabricated county land / lease-density scores.
- Prior phases not coupled to new GIS assets.

---

## Overclaim / distrust traps (ruthless)

1. Any future **parcel polygon layer** “just to show boundaries” reopens the cadastral black hole — **reject** without new judgment.
2. **Scraping CAD** or wiring a “live ownership” API turns honesty into liability theater — **reject**.
3. Adding **owner name / parcel ID fields** (even empty placeholders) implies resolution — **reject**.
4. A **land score** or “lease readiness” badge from county name alone is fabricated certainty — **reject**.
5. Do not “fix” persona parcel asks by inventing GIS; keep pointers + honesty.

---

## Reject now (reaffirm unlock)

| Reject | Why |
|--------|-----|
| Statewide / county parcel polygon layers | Solo-dev black hole; GIS sprawl |
| CAD scrape / live ownership API | Fragile, ops/legal risk, not static-first |
| Commercial parcel / ownership APIs | Cost + lock-in |
| Ownership / title / mineral estate certainty UI | Overclaim |
| Cadastral map / click-to-owner | Checkbox GIS |
| Fabricated % public land / lease-density / land ScreeningScore | Honesty violation |
| Site / AOI / Compare land score | Prior locks |
| Opening “real parcels GIS” as Phase 2.5 from this slice | Explicit unlock stop |

---

## Recommended disposition (for judgment)

- Prefer **STOP** — unlock stop criteria 1–8 met; R1–R2 are **enhance-soon** honesty/UX polish; R3–R8 info/defer.
- If director refuses stop: **cap NOW ≤2** — (1) single external-note above citations, (2) sync `scoring-methodology.md` Land context bullets — then re-stop.
- **Do not** unlock inventing parcel GIS next. Phase 2 site-eval track may be complete for MVP.
