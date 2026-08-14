# Judgment Director — Phase 3 slice 1 (post red/blue)

**Date:** 2026-08-14  
**Director role:** NOW / SOON / DEFER / REJECT + stop criteria for Phase 3 slice 1  
**Inputs:** `docs/phase3.md` · `reviews/2026-08-14-phase3-scope/02-judgment-scope.md` · `01-blue-team.md` · `02-red-team.md` · shipped P3-1…P5 wiring  
**Constraints:** explainable decisions ≠ GIS sprawl · Texas beachhead · heuristics · solo-dev · no fake automation · watchlist ≠ Focus · digests must not lie

---

## Verdict

### **NOT STOP — continue with NOW (cap ≤5).**

P3-1…P3-4 **functionally ship** and **GIS sprawl is held**. In-app Methodology covers P3-5. That is not enough to declare slice 1 done: **digest empty-state contradiction (R1)** and **Focus vs Watch vs “Generated focus” collision (R2)** undermine the north-star (*Where should I focus, and why?*) and train distrust of the only return-cadence signal. Repo methodology drift (R4) is an honesty sync, not optional docs fluff for this phase.

**Why not stop yet:** Success criteria require digests users can trust and automation that is not theater. Contradictory “updates found / no changes” and three competing “focus” concepts fail that bar.

**Why not reject the slice:** Core deliverables exist, rules are frozen and explainable, no auth/GIS/ML creep. Fix honesty/IA — do not rebuild.

---

## Stop criteria scorecard

| # | Criterion (from scope) | Verdict |
|---|------------------------|---------|
| 1 | Maintain local county watchlist ≤25; see digest after new published vintage | **Mostly met** — watchlist OK; digest usable but **R1 honesty fail** |
| 2 | Generated candidates follow frozen rules; human “not silly” ≥~80% spot check | **Met** — ~23 matches; top set passes spot check |
| 3 | Methodology documents watchlist + rules + versioning | **Partial** — in-app **met**; `scoring-methodology.md` **not synced** |
| 4 | No auth, no CEII, no parcels, no geology-in-score | **Met** |
| 5 | No GIS sprawl / ML / email-push as slice-1 completion | **Met** |

**Stop when** R1–R2 (and R4 sync) are fixed **and** judgment re-checks — not when accounts or land GIS remain undone.

---

## Build / fix NOW (cap ≤5)

| ID | Action | Maps to |
|----|--------|---------|
| **N1** | **Digest honesty:** Never show “updates found” with an empty item list. Distinguish (a) new published vintage with **no watched-county deltas**, (b) county deltas present, (c) no vintage change / no deltas. Align Tools badge with the same semantics (soft “new vintage” OK only with matching copy — no cry-wolf). | R1 |
| **N2** | **Disambiguate Focus vs Watch vs candidates:** Rename panel heading away from “Generated **focus** candidates” (e.g. **Rule candidates (v0)**). Add one muted line: ranked-list **Focus** is session shortlist and does **not** feed the watch digest; **Watch** does. Do **not** merge Focus into Watch. | R2, R3 |
| **N3** | **Sync `docs/scoring-methodology.md` Phase 3 section** with in-app Methodology: watchlist ≠ score; digests ≠ live-grid alerts; rules v0 + versioning; retire “Phase 3 not unlocked / not complete” contradiction for slice 1 shipped. | R4 |
| **N4** | *(optional within cap)* Soften automation nouns in panel/Tools if still overclaiming after N2 (“Check published updates”). | R3 |
| **N5** | *(optional within cap)* TexNet: implement light demote in candidate order **or** change rules copy to “badge only” until demote ships. | R5 |

**Director priority if time-boxed:** **N1 > N2 > N3**. N4–N5 only if capacity remains under cap.

---

## Enhance SOON (still Phase 3 polish — not gate after NOW)

| ID | Action | Maps to |
|----|--------|---------|
| **S1** | Auto-run digest when Phase3 panel opens (still manual Mark as seen) | R6 |
| **S2** | Unit tests for `buildDigest` hasUpdate / empty watchlist / vintage-only bump | R7 |
| **S3** | “Showing 12 of N matching rules” cue | R8 |
| **S4** | Optional watchlist JSON export/import | scope enhance-soon / R9 |
| **S5** | Point/AOI T@depth inherit (parallel OK — not slice-1 blocker) | prior scope lock |

---

## DEFER

| Item | Notes |
|------|-------|
| Auth / cloud sync / email/SMS digests | Explicit out of slice 1 |
| Point/AOI watch pins | Counties only |
| GLO adjacency / economics-lite / interconnection | Out |
| RRC replace SMU proxy | Data Depth residual — orthogonal |
| Merge Focus + Watch into one system | Tempting; defer — dual purpose (session triage vs return cadence) |

---

## REJECT (reaffirm)

| Reject | Why |
|--------|-----|
| New map layers as Phase 3 “completion” | GIS sprawl |
| ML / black-box prospects | Trust / solo-dev |
| Email/push live-grid alerts | Fake automation + ops |
| Parcels / GLO / CEII / national coverage | Prior locks |
| Auto-generate Low/Unknown confidence counties | Frozen rules |
| Geology-in-score via Barnes | Must-have keep as context only |
| Pretending session Focus feeds digests without saying so | Honesty |

---

## Contingency — if NOW slips

Do **not** declare Phase 3 slice 1 STOP with R1 live. Better to ship N1+N2 only and leave N3 as immediate follow-up same day than to STOP with lying digests.

---

## Director one-liner

**Continue:** watchlist + rules + vintage plumbing are real and non-sprawling; **fix digest lies and Focus/Watch naming, sync methodology doc**, then re-stop. Personas next — expect amplification of R1/R2, not a GIS unlock.
