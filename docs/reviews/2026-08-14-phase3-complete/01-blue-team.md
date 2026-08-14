# Blue Team — Phase 3 complete (slice 2)

**Date:** 2026-08-14  
**Scope:** P3-6…P3-11 + P3-V verify (after slice 1 STOP)  
**Code checked:** `web/src/lib/phase3.ts`, `phase3.test.ts`, `Phase3Panel.tsx`, `App.tsx` badge wiring, `Methodology.tsx` Phase 3 block, Point/AOI inherit in `siteEval.ts` / `aoiEval.ts` / site & AOI panels, `00-judgment-scope.md`

---

## Verdict (blue)

Slice 2 **closes the Phase 3 automation loop the judgment defined**: return after publish → open Watchlist → see an honest digest; backup the local watch; read a human publish pack; see TexNet demoted in the rule shortlist; methodology says Phase 3 complete in-product. Scope discipline held — still counties, still local, still heuristics, still Texas, still no Barnes-in-score.

This is **decision cadence**, not a GIS product and not an ops/alerts product. Keep it.

---

## What works (keep)

### K1 — Scope discipline still held
- No auth, email/push, parcels/GLO, CEII, ML prospects, or new Phase 3 map layers.
- Watch unit remains **counties only**; Point/AOI watch pins not invented.
- Barnes restated as context-only / never ScreeningScore / not a Phase 3 deliverable.
- Automation = **published vintage + local snapshot delta + frozen rules** — explainable.

### K2 — P3-6 Auto-digest on panel open
- `Phase3Panel` mounts → `buildDigest` once; copy states digests run on open.
- **Mark as seen** stays manual (correct — viewing ≠ acknowledging).
- Manual **Refresh digest** retained for after mark-seen / import / mid-session edits.
- Does not invent live-grid polling or push chrome.

### K3 — Digest honesty preserved (slice 1 N1 still live)
- Status triad: `county_deltas` | `vintage_only` | `none`.
- Panel status lines match status (no “updates found” + empty list lie).
- Tools badge keys off **`county_deltas` only** + nonempty watchlist (`App.tsx`) — vintage bump alone does not cry wolf.
- Digests bound to publish pack / last-seen snapshots — “not live grids” copy intact.

### K4 — P3-7 Unit tests (phase3.test.ts)
- Covers `none`, `vintage_only`, rank `county_deltas`, `new_watch`.
- Covers TexNet demote sort + Low/rank>40 filter exclusions.
- Covers export/import round-trip and publish-pack label shortening.
- Pure-function tests lock the honesty contract that makes Phase 3 trustworthy.

### K5 — P3-8 Export / import watchlist JSON
- Typed format `gt_tx_phase3_watchlist` v1: watchlist + lastSeen.
- Cap ≤25 enforced on import with truncation signal.
- Unrecognized format / missing array / invalid JSON fail loudly in UI hints.
- Solo-dev backup against localStorage wipe **without** auth — matches DEFER of cloud sync.

### K6 — P3-9 Publish pack UX label
- Primary label **“Published score pack”** + shortened id; full id in `title`.
- Methodology version + rules version shown beside pack — not a raw dump as the hero signal.

### K7 — P3-10 TexNet stable demote
- `applyProspectRules` sorts caution-after-clear, then by rank; badge retained; **not** hard exclude.
- Panel honesty: “TexNet demoted” + rules text matches behavior (closes slice-1 “badge only” overclaim).
- Showing **12 of N** when truncated — power users see full match count.

### K8 — P3-11 In-app Methodology COMPLETE language
- Heading: **Phase 3 (watchlist & rules) — complete**.
- Documents: local watch + export/import, auto-digest on open, Mark as seen manual, frozen rules with TexNet demote, Focus ≠ Watch, Point/AOI T@depth context, Barnes keep.
- Residual banner also says Phase 3 complete; accounts/email deferred.

### K9 — P3-V Point/AOI T@depth inherit (verified present)
- Site/AOI dossiers pass `countyTdepthMean` / `countyTdepthKm` and label **regional / model context — not a site ScreeningScore**.
- No site score invented from Stanford model — honesty contract intact.

### K10 — Focus ≠ Watch still explicit
- Panel header: ranked-list Focus does not feed digests; only Watch does.
- Candidates labeled **Not a score · not Focus · rules v0**.

---

## Decision value (why this creates user value)

| Buyer job | Value delivered |
|-----------|-----------------|
| Geothermal / energy developer | Open Watchlist after a publish → immediate delta list; Mark as seen resets noise; export survives browser wipe |
| Infra / land investor | Rule candidates with demoted TexNet + printed rules = explainable shortlist without “AI found deals” |
| Skeptical scientist | Vintage-only vs county-deltas split + badge gated on real deltas = digests remain believable |

**Framing that works:** Phase 3 complete = **local return cadence + explainable shortlist + backup**, not accounts and not map sprawl.

---

## Blue keep-list (do not regress)

1. Digest statuses `county_deltas` / `vintage_only` / `none` — never pair “updates” language with an empty delta list.
2. Tools badge = county deltas only (not vintage-only).
3. Auto-run digest on panel open; Mark as seen stays manual.
4. Frozen rules v0 text beside every candidates list; TexNet = badge + stable demote, not hard exclude.
5. Export/import as the solo backup story — do not silently require auth for Phase 3 “done.”
6. Publish pack human label + short id primary; full id secondary.
7. Candidates labeled **not a score** / **not Focus**.
8. No Phase 3 map layers; Barnes never enters ScreeningScore.
9. Point/AOI show county model T@depth as **context only** — never a site score.
10. Cap ≤25 counties; watch unit = counties.

---

## Blue concede (honest gaps for red)

- Repo docs (`roadmap.md`, `phase3.md`, `scoring-methodology.md`) still read **SLICE 1 STOP** / incomplete Phase 3 while the in-app Methodology claims **complete** — trust split for auditors.
- Import is **replace** (`merge: false`) with no confirm dialog — restore can silently wipe current watch + lastSeen.
- Auto-digest is **mount-once**; Remove watch / mid-panel store edits do not refresh the digest list until Refresh / re-import / Mark as seen.
- Unit tests do not cover score/flag/confidence deltas, truncate path, or App badge contract.
- Methodology “What this is not” still says “Phase 3 slice 1 is local-first” — stale vs COMPLETE heading.
