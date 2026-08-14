# Red Team — Phase 3 complete (slice 2)

**Date:** 2026-08-14  
**Stance:** Attack “COMPLETE” overclaims, backup footguns, stale doc drift, and residual Focus/automation confusion. Concede shipped code that actually closes P3-6…P3-10.  
**Code checked:** `phase3.ts` (`buildDigest` / `importWatchlist` / `applyProspectRules` / `formatPublishPackLabel`), `Phase3Panel.tsx`, `phase3.test.ts`, `App.tsx` badge, `Methodology.tsx`, `docs/roadmap.md`, `docs/phase3.md`, `docs/scoring-methodology.md`, Point/AOI inherit paths

---

## Critical / honesty findings

| ID | Severity | Finding | Why it hurts | Rec |
|----|----------|---------|--------------|-----|
| **R1** | **High** | **P3-11 incomplete outside the app.** In-app Methodology says Phase 3 **complete**; `docs/roadmap.md` still **SLICE 1 STOP** / “further automation needs a new judgment”; `docs/phase3.md` status **SLICE 1 STOP**; `docs/scoring-methodology.md` still “Phase 3 slice 1 shipped,” “not full Phase 3,” TexNet “badge only,” Point/AOI inherit still **SOON**. | Auditors / buyers reading repo get a contradictory completion story. Declaring Phase 3 COMPLETE while authoritative docs disagree is a trust failure for an explainability product. | **FIX NOW** — sync roadmap / phase3.md / scoring-methodology to scoped Phase 3 COMPLETE (slice 1+2); retire unlock / slice-1-only language; document TexNet demote + export/import + auto-digest; mark Point/AOI inherit as shipped context (not site score). |
| **R2** | **High** | **Import is silent full replace.** UI always calls `importWatchlist(..., { merge: false })`. No confirm. Successful import overwrites watchlist **and** lastSeen (or clears lastSeen if file lacks it). One wrong file = lost pins + broken digest baseline. | Solo backup feature becomes a **wipe vector**. Local-first without confirm is reckless for the only persistence story Phase 3 has. | **FIX NOW** — confirm dialog (“Replace current watchlist & last-seen?”) + show counts before apply; optionally offer Merge (library already supports `merge: true`). |
| **R3** | **Med** | **Methodology self-contradiction.** Heading “Phase 3 … — complete” vs “What this is not” still: “Not email/push… (**Phase 3 slice 1** is local-first).” Residual Data Depth blurb is COMPLETE; Not-list lags. | Softens COMPLETE claim; skeptics notice versioning slop. | **FIX NOW** — reword Not-list to “scoped Phase 3 is local-first; accounts/email deferred,” not “slice 1.” |
| **R4** | **Med** | **scoring-methodology TexNet / inherit drift.** Table still “TexNet badge only”; Point/AOI thermal inherit still “remains SOON.” Slice 2 shipped demote sort + verified inherit UI. | Same doc/app split as R1 — secondary readers distrust both. | **FIX NOW** (bundle with R1). |
| **R5** | **Med** | **Auto-digest is mount-once; panel digest can go stale.** `useEffect([], …)` only. `removeWatch` updates store + parent badge via `onStoreChange`, but **does not** `setDigest`. User can Remove a county and still see its deltas until Refresh. | Mild lie-by-stale-UI; teaches “Refresh” as mandatory after edits — undercuts “runs when panel opens” confidence. | **ENHANCE SOON** — re-run digest after Remove / successful import already re-runs (good); align Remove with that; or derive digest from store in render/`useMemo`. |
| **R6** | **Med** | **Focus ≠ Watch still a footgun (mitigated, not cured).** Header + candidate labeling help, but session Focus (cap 3) and Watch (≤25) remain two pin systems. New users still pin Focus and expect digests. | Primary-buyer confusion from slice 1 red **R2** — reduced severity, not eliminated. | **ENHANCE SOON** — one more persistent cue near Focus UI (“does not feed Watchlist digests”); **REJECT** silent Focus↔Watch merge. |
| **R7** | **Low** | **Tests are thin vs honesty surface.** Missing: score ≥0.05 threshold, confidence/flag deltas, empty-watch + publishChanged, import truncate + format reject, `getPublishId` fallback, App badge = county_deltas-only contract. | Regressions on the exact trust edges Phase 3 exists for. | **ENHANCE SOON** — add 4–6 cases; especially truncate + format mismatch + flag change. |
| **R8** | **Low** | **Import format gate is soft.** If `format` is omitted, any JSON with a `watchlist` array imports. Malformed `lastSeen` accepted if `publishId` is a string. | Accidental paste / foreign JSON can poison baseline snapshots → weird digests. | **ENHANCE SOON** — require `format === EXPORT_FORMAT` (and version); lightly validate `lastSeen.counties` shape. |
| **R9** | **Low** | **Export always downloads `gt_tx_phase3_watchlist.json`.** No date stamp; easy to overwrite prior backups in Downloads. | Ops friction for the backup that replaces cloud sync. | **DEFER** — filename with ISO date; not a STOP blocker. |
| **R10** | **Info** | **Publish pack shortId still opaque** when id is a long `version\|layer=vintage…` string. Label helps; comprehension of *what* changed still requires mental parse. | Mild; better than raw dump. | **DEFER** — human layer-vintage summary later; not Phase 3. |
| **R11** | **Info** | **Candidates UI still caps at 12** (now with “12 of N”). | Acceptable shortlist; not a lie. | **DEFER** — expand only if buyers demand. |

---

## Challenge: “Phase 3 COMPLETE” overclaim

| Probe | Result |
|-------|--------|
| Judgment-defined Phase 3 (watch / digest / rules / local backup)? | **Mostly shipped in code** (P3-6…P3-10 solid; P3-11 **app yes / repo no**) |
| Accounts / email / cloud / push? | **Absent** — correct DEFER; must not be implied by COMPLETE |
| In-app vs docs completion language? | **Split** — High (R1) |
| Does COMPLETE mean “automation product done forever”? | **Must not** — means scoped county cadence STOP |

**Red ask:** COMPLETE = *scoped Phase 3 stop criteria met*, documented the same way in app **and** repo. Do not let COMPLETE become a Trojan horse for auth/email next week “to finish automation.”

---

## Challenge: backup / local-first footguns

| Probe | Result |
|-------|--------|
| Export exists? | **Yes** — good |
| Import confirm? | **No** — High wipe risk (R2) |
| Merge path in UI? | **No** (API supports merge) |
| Cap truncation surfaced? | **Yes** (hint) — keep |

**Red ask:** The export/import story is the *entire* durability story. Treat import like a destructive restore.

---

## Challenge: GIS sprawl / score pollution

| Probe | Result |
|-------|--------|
| New Phase 3 map layers? | **No** |
| Parcel / GLO / CEII / Point watch pins? | **Out — held** |
| Barnes / geology in ScreeningScore via Phase 3? | **No** |
| Site ScreeningScore from model T@depth? | **No** — inherit is labeled context (P3-V OK) |

**Red concede:** Slice 2 does **not** open GIS sprawl or Barnes-in-score. Reject any “watched counties choropleth” as Phase 3 completion theater.

---

## Challenge: fake automation

| Probe | Result |
|-------|--------|
| Auto-digest on open? | **Real** — client compare on mount, not agenting |
| Email/push/live grids? | **Absent** — good |
| Badge on vintage-only? | **No** — honesty held |
| Stale digest after Remove? | **Yes** — Med (R5) |
| “Rule candidates” naming? | **Good** — “Generated focus” theater from slice 1 largely gone |

**Red ask:** Keep automation = *cadence after publish*. Do not add fake agent chrome.

---

## What is *not* a critical failure (red concedes)

- P3-6…P3-10 are **present and usable** without auth.
- Digest status triad + badge gating still honest for the vintage-only case.
- TexNet demote sort matches rules text (closes prior badge-only overclaim).
- Publish pack label is a real UX improvement over raw id dump.
- Export/import round-trip works; format string exists.
- Point/AOI county T@depth context is shipped and labeled not-a-site-score.
- No CEII, parcels, ML, or geology-in-score creep in this slice.

---

## Overclaim / distrust traps (ruthless)

1. Shipping **email digests** next “because COMPLETE needs alerts” → reject without new judgment.  
2. Leaving **repo docs on SLICE 1 STOP** while UI says COMPLETE → train distrust.  
3. Silent Focus↔Watch merge → resurrect slice-1 footgun.  
4. Watched-county map layer as “Phase 3 polish” → GIS sprawl.  
5. Import without confirm → backup feature destroys the product’s only state.  
6. Softening TexNet back to hard exclude or hiding rule text → reject.

---

## Recommended disposition (for judgment)

| Bucket | Items |
|--------|-------|
| **FIX NOW** | R1 doc sync (roadmap / phase3.md / scoring-methodology); R2 import confirm (+ optional merge); R3 Methodology Not-list wording |
| **ENHANCE SOON** | R5 digest refresh on Remove; R6 Focus cue; R7–R8 test + import validation tighten |
| **DEFER** | R9 dated export filename; R10 human vintage summary; R11 show-all candidates; auth/email/AOI pins/GLO/economics |
| **REJECT** | GIS-as-Phase-3 · ML · CEII · parcels · silent Focus↔Watch merge · Barnes-in-score · live-grid alert cosplay |

**Do not declare Phase 3 COMPLETE for the product loop until R1 (and preferably R2) land** — code slice 2 is close; the completion *claim* is currently inconsistent. Personas + director should treat docs sync as stop-adjacent honesty, not optional polish.
