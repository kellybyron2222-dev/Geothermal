# Red Team — Phase 3 slice 1 (watchlist / digest / rules)

**Date:** 2026-08-14  
**Stance:** Attack GIS sprawl creep, fake automation theater, Watchlist vs Focus confusion, and digest empty-state lies that destroy trust.  
**Code checked:** `phase3.ts` (`buildDigest` / `hasUpdate` / `applyProspectRules`), `Phase3Panel.tsx`, `App.tsx` badge + Tools copy, `RankedCountyList` Focus marks, `Methodology.tsx`, `docs/scoring-methodology.md`, published `meta.publishId`

---

## Critical / honesty findings

| ID | Severity | Finding | Why it hurts | Rec |
|----|----------|---------|--------------|-----|
| **R1** | **High** | **Digest empty-state lie.** `hasUpdate = publishChanged \|\| items.length > 0`. After a new publish with identical watched snapshots (or vintage bump only), UI can show **“· updates found”** while `DigestList` renders **“No changes among watched counties.”** Tools badge also keys off `hasUpdate` when watchlist nonempty. | Buyers learn digests cry wolf → ignore the one trust signal Phase 3 exists for. | **NOW** — split vintage bump vs county deltas; never pair “updates found” with empty item list; align badge semantics with honest copy. |
| **R2** | **High** | **Watchlist vs Focus confusion.** Ranked list **Focus** (session, cap 3) ≠ Phase 3 **Watch** (persisted, ≤25) ≠ panel **“Generated focus candidates.”** Three “focus” concepts collide in one explorer. | Developer pins Focus, assumes it feeds digests; digests stay empty → “automation is broken.” Or assumes rule list *is* their watchlist. | **NOW** — rename candidates away from “focus”; one-line disambiguation Focus ≠ Watch; do not merge systems in slice 1. |
| **R3** | **Med** | **Fake automation overclaim risk.** Product language (“Automated opportunity,” “Generated focus candidates,” Tools · updates) can read as proactive agenting. Implementation is: static rule filter + local snapshot compare + manual Check updates. Honesty lines exist but compete with “Generated.” | Sophisticated buyers dismiss as marketing theater; skeptics assume hidden ML. | **NOW/SOON** — prefer “Rule candidates (v0)” / “Check published updates”; keep “not a score · not live grids.” Do not add fake push/email chrome. |
| **R4** | **Med** | **`docs/scoring-methodology.md` still pre-unlock.** Still says Phase 3 unlock requires separate judgment / not complete; no Phase 3 watchlist·digest·rules section matching in-app Methodology. | Auditors / secondary readers get contradictory trust story vs app. | **NOW** — sync Phase 3 section; retire unlock-blocker language for slice 1 shipped. |
| **R5** | **Low–Med** | **TexNet “demote” incomplete.** Rules text: badge / demote; UI badges only; sort remains pure rank. | Mild overclaim vs frozen rule card; not a hard-exclude failure. | **SOON** — stable demote (e.g. TexNet after clear peers at same band) or soften rules copy to “badge only.” |
| **R6** | **Low** | **Digest not computed until “Check updates” inside panel.** Scope allowed open-app *or* manual check; load only sets badge. Opening Watchlist panel shows empty digest region until click. | Mild discoverability; not a lie if badge is honest. | **SOON** — auto-run digest when panel opens (still no email). |
| **R7** | **Low** | **No unit tests** for `buildDigest` / `applyProspectRules` / publishId composition. | Regression risk on honesty edge cases (R1). | **SOON** — small pure-function tests; especially hasUpdate semantics. |
| **R8** | **Info** | **Candidates capped to 12 in UI** while ~23 match rules. | Fine for shortlist; power users may think rules only yield 12. | **DEFER** — “showing 12 of N” cue optional. |
| **R9** | **Info** | **Export JSON** called out as enhance-soon in scope; not shipped. | Local-only wipe risk (browser clear). | **DEFER** — optional export; not slice-1 stop. |

---

## Challenge: GIS sprawl

| Probe | Result |
|-------|--------|
| New Phase 3 map layers? | **No** |
| Parcel / GLO / CEII / Point watch pins? | **Out of slice — held** |
| Geology pulled into score via Phase 3? | **No** — Methodology restates Barnes context-only |
| Rule list as choropleth “prospect paint”? | **No** — list in panel only |

**Red concede:** Slice 1 does **not** open GIS sprawl. Reject any “just one more layer for watches” follow-on without new judgment.

---

## Challenge: fake automation

| Probe | Result |
|-------|--------|
| Email/push/alerts from live grids? | **Absent** — good |
| ML / black-box prospects? | **Absent** — frozen heuristics |
| “Generated” = pipeline regeneration? | **Overclaim risk** — client filter of scored counties |
| Quiet badge on load | OK if semantics match R1 fix |

**Red ask:** Automation must mean *cadence after publish*, not *agent found deals*.

---

## Challenge: Watchlist vs Focus

| Concept | Persistence | Cap | Feeds digest? |
|---------|-------------|-----|---------------|
| Ranked-list **Focus** | Session state | 3 | **No** |
| Detail **Watch** / Phase3 watchlist | localStorage | 25 | **Yes** |
| **Generated focus candidates** | Derived each load | ~12 shown | **No** (separate shortlist) |

This is a **primary-buyer footgun**, not polish.

---

## Challenge: digest empty-state lies

Concrete failure mode:

1. User watches counties; **Mark as seen** at vintage A.  
2. Publish bumps to vintage B with **no** rank/score/flag deltas on watched set.  
3. `publishChanged === true` → `hasUpdate === true`, `items === []`.  
4. UI: **updates found** + **No changes among watched counties.**  

Also: first Check with empty watchlist can theoretically claim update via `!last` while items stay empty (badge gated by watchlist length — panel path still awkward).

---

## What is *not* a critical failure (red concedes)

- Deliverables P3-1…P3-4 are **present and usable** without auth.
- Rule set matches frozen judgment defaults (rank ≤40 path).
- Spot-check candidates (~23) look non-silly for Medium+ T@depth / no PAD friction.
- In-app Methodology Phase 3 section exists and refuses email/cloud/score-replacement.
- No CEII, parcels, ML, or geology-in-score creep.

---

## Overclaim / distrust traps (ruthless)

1. Shipping **email digests** next “because automation” without scope → fake ops product.  
2. Renaming rules to **AI prospects** or hiding rule text → reject.  
3. Merging Focus + Watch into one silent system without UX → more confusion.  
4. Adding map layer for “watched counties” as Phase 3 “completion” → GIS sprawl.  
5. Leaving R1 unfixed → train users that update badges are noise.

---

## Recommended disposition (for judgment)

- **Do not STOP yet** — R1 + R2 are stop-adjacent honesty/IA failures for a trust product.  
- **NOW cap ≤5:** (1) digest honesty, (2) Focus≠Watch≠candidates naming, (3) scoring-methodology Phase 3 sync; optional (4) TexNet demote or copy soften.  
- **REJECT:** GIS sprawl, ML, email/push, parcels, live-grid alerts cosplay.  
- After NOW: short re-check then STOP slice 1.
