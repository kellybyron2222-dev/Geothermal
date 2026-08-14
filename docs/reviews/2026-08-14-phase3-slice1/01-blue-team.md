# Blue Team — Phase 3 slice 1 (watchlist / digest / rules)

**Date:** 2026-08-14  
**Slice:** P3-1…P3-5 — published vintage watch, local county watchlist ≤25, in-app change digest, frozen rule candidates, methodology Phase 3 section  
**Code checked:** `web/src/lib/phase3.ts`, `Phase3Panel.tsx`, `App.tsx` Phase3 wiring, `DetailPanel` Watch control, `Methodology.tsx` Phase 3 block, `scoring/stamp_phase3_meta.py`, `meta.json` / `prospects.json` publishId + phase3 stamp

---

## Verdict (blue)

Slice 1 **ships the scoped automation shape without GIS sprawl or auth theater**. Keep publishId vintage, local watchlist, manual Check updates / Mark as seen, frozen v0 rules with on-panel rule text, and in-app Methodology honesty. Residual polish (digest empty-state copy, Focus vs Watch naming, repo methodology sync) does not erase the JTBD win: *return after a publish and see what moved among counties I care about*.

---

## What works (keep)

### K1 — Scope discipline held
- No accounts, email/push, parcels/GLO, CEII, ML prospects, or new map layers as Phase 3 work.
- Barnes stays context-only (Methodology restates never-in-score).
- Watch unit = **counties only**; Point/AOI pins not invented.
- Automation is **rule filter + local snapshot delta** — explainable, not a black box.

### K2 — Published vintage watch (P3-1)
- `meta.publishId` stamped from methodologyVersion + sorted layer vintages (`stamp_phase3_meta` / scorer).
- Client `getPublishId(meta)` prefers stamped id; falls back to same composition.
- Panel surfaces publishId + methodology + rules version; last-seen vs current vintage labeled.

### K3 — County watchlist local-first (P3-2)
- Cap `WATCH_CAP = 25`; toggle with hard stop + error string when full.
- Persist `gt_tx_phase3_v1` in localStorage; load/save tolerate quota/private mode.
- Detail panel **Watch / Watching** is the pin path; Phase3 panel lists watched counties with Remove.

### K4 — Change digest (P3-3)
- Compares last-seen snapshots for watched FIPS: rank, score (≥0.05), confidence, PAD/TexNet flags, plus `new_watch`.
- Explicit copy: *published vintage … not live grids*.
- Manual **Check updates** + **Mark as seen**; quiet Tools badge on load when watchlist nonempty and digest says update (does not force panel open).
- Digests cite methodology version in the result strip; `rulesVersion` on result object.

### K5 — Frozen prospect rules (P3-4)
- Client `applyProspectRules`: T@depth / modelThermal · confidence High|Medium · rank ≤40 · no PAD friction · TexNet not hard-excluded.
- Panel shows **Not a score · rules v0** + full `PROSPECT_RULES_TEXT` beside the list.
- Spot-check on published data: **23** counties match; top ranks (e.g. Victoria, Robertson, DeWitt…) are not silly for a Medium+ T@depth shortlist; TexNet appears as badge (~6 of 23) without exclusion.

### K6 — Methodology (P3-5 in-product)
- In-app Methodology has dedicated **Phase 3 (watchlist & rules)** section: local watchlist, digests ≠ live alerts, frozen rules bullets, not-a-score labeling, Barnes keep, “What this is not” includes email/cloud/score-replacement refusal.

### K7 — Wiring hygiene
- Phase3 panel replaces detail when open; closes when entering Point/AOI or picking a county from search.
- Tools menu item **Watchlist / updates** with optional update dot — discoverable without left-rail sprawl.

---

## Decision value (why this creates user value)

| Buyer job | Value delivered |
|-----------|-----------------|
| Geothermal / energy developer | Pin focus counties; return after publish; see rank/score/flag moves without inbox ops |
| Infra / land investor | Rule shortlist + rule text = explainable “why these” without ML cosplay |
| Skeptical scientist | Vintage-bound digests + not-live-grids copy + Medium+ gate reduce fake real-time / low-confidence spam |

**Framing that works:** Phase 3 is **return cadence + explainable shortlist**, not GIS paint and not “AI found prospects.”

---

## Blue keep-list (do not regress)

1. Local-first watchlist ≤25 — no auth required for slice 1.
2. Digests bound to **published** vintage / publishId — never claim live grid alerts.
3. Frozen rules v0 text next to every generated list; edits only via new judgment.
4. TexNet = badge/demote path, not hard exclude (unless new judgment).
5. No new Phase 3 map layers; Barnes never enters ScreeningScore.
6. Candidates labeled **not a score**.
7. Quiet badge OK; do not auto-spam email/push without new scope.

---

## Blue concede (honest gaps for red)

- Digest header can say **updates found** while the list says **No changes among watched counties** when only publishId moved (see red).
- Session **Focus** (ranked list, cap 3) vs **Watchlist** vs **Generated focus candidates** naming collides.
- `docs/scoring-methodology.md` still reads as pre-unlock Phase 3; in-app is ahead of repo doc.
- TexNet “demote” is badge-only today (sort still by rank).
- No automated tests for `phase3.ts` yet.
