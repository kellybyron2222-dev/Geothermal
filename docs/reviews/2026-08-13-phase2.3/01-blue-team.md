# Blue Team — Phase 2.3 (Compare evidence)

**Date:** 2026-08-13  
**Slice:** Pin ≤3 Point/AOI evidence snapshots; side-by-side honesty table; no CompareScore/winner; methodology note (C1–C5)  
**Code checked:** `compareSlot.ts`, `ComparePanel.tsx`, `App.tsx` (compare wiring), `SiteDossierPanel.tsx`, `AoiEvidencePanel.tsx`, `Methodology.tsx`

---

## Verdict (blue)

Phase 2.3 **ships the unlock’s honesty shape**: evidence-to-evidence side-by-side, not a second scoring ladder. Keep the pin/refuse/clear model and anti-rank copy; residual gaps are polish, not a failed JTBD.

---

## What works (keep)

### K1 — Product framing matches the lock
- UI name is **Compare evidence** (title + `aria-label`), not “best sites,” not “site ranking.”
- Subtitle: `N/3 pinned · evidence fields only — not a ranking`.
- Empty state: “not a ranking, not a score.”
- Methodology § Compare: pinned snapshots only; **no CompareScore or winner column**; county demoted.

### K2 — Pin path is minimal and clear (C1 + C5)
- **Add to compare** on Point and AOI evidence panels after a dossier exists.
- Cap `MAX_COMPARE = 3`; fourth pin **refused** (hint + disabled button when full) — not silent replace.
- Per-column × remove + **Clear all**; empty Compare state without reload.
- Light duplicate guard (point ~0.0005°; AOI rounded area + centroid) with explicit hint.

### K3 — Honesty hierarchy in the table (C2)
- Column order mirrors panel intent: **evidence verb → confidence → n → nearest km → means → transmission ~km → county context**.
- Control/confidence rows sit **above** thermal means.
- Weak means (`None` / `Low` confidence) get `compare-soft` mute — not loud primary signal.
- Transmission cells: `~N km` + always-on **grid proxy** line.
- County row: summary string + **not a pin score** cue.

### K4 — No winner / no CompareScore (C3)
- No rank column, no footer winner, no composite score type.
- Copy repeatedly softens “ranking / score / best” into side-by-side evidence.
- Mixed Point + AOI pins allowed without inventing a cross-mode score.

### K5 — Data reuse only (no new GIS)
- `fromSiteDossier` / `fromAoiDossier` copy fields already computed by Point/AOI builders.
- In-session `compareSlots` state only — no campaign store, no export pack, no new assets.

### K6 — Non-coupling (prior phases survive)
- Compare is additive UI above explorer; county / Point / AOI modes unchanged when compare is empty or full.
- Site-asset failure still gates Point/AOI together; county path independent — Compare does not re-authorize score heatmap.

### K7 — Scope discipline held
- No parcels, geocoder, HIFLD, AOI campaigns, PDF, CompareScore, site/AOI ScreeningScore.
- Does not reopen county ScreeningScore as the compare axis.

---

## Decision value (why this creates user value)

| Buyer job | Value delivered |
|-----------|-----------------|
| Geothermal / energy developer | Hold 2–3 lease sketches / clicks and inspect **control quality** before pad fantasy |
| Infra / land investor | Same honesty fields across pins; county ranks stay backdrop, not a pin ladder |
| Skeptical scientist | Explicit no-winner + refuse-4th + demoted county cells reduce “fake shortlist” read |

**Framing that works:** Compare is **pinned evidence side-by-side**, not a ScreeningScore substitute and not a site ranking product.

---

## Blue keep-list (do not regress)

1. Product name **Compare evidence**; never ship CompareScore / winner / “best of three.”
2. Hard cap 3 with **refuse** on 4th (not silent oldest-replace).
3. Table: control/confidence before loud means; weak means muted.
4. Transmission always `~km` + grid-proxy cue.
5. County cells always carry “not a pin score” (or equivalent).
6. Pin only from existing Point/AOI dossiers — no new GIS assets.
7. Clear/remove without page reload.
8. Methodology Compare bullets stay in sync with UI.

---

## Blue disposition for judgment

Prefer **STOP** — unlock C1–C5 met at honesty level. Residual polish (limitations row, `n≤1` soft parity, repo methodology sync) is **SOON**, not a missing deliverable.
