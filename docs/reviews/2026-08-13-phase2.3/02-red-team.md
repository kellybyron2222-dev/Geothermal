# Red Team — Phase 2.3 (Compare evidence)

**Date:** 2026-08-13  
**Stance:** Attack fake rankings-by-another-name, glance-winner tables, county-as-axis contamination, and GIS/compare sprawl.  
**Code checked:** `compareSlot.ts`, `ComparePanel.tsx`, `App.tsx`, `SiteDossierPanel.tsx`, `AoiEvidencePanel.tsx`, `Methodology.tsx`

---

## Critical / honesty findings

| ID | Severity | Finding | Why it hurts | Rec |
|----|----------|---------|--------------|-----|
| **R1** | **Med (residual)** | **Side-by-side numerics invite silent ranking.** Even without a winner column, humans scan Confidence / n / means left-to-right and pick a “best pin.” Soft copy helps; layout still looks like a decision matrix. | Primary buyers may treat Compare as a shortlist scorer — the exact contamination unlock rejected. | **SOON** — reinforce “not a ranking” near means row; optional one-line banner when ≥2 pins. Not a stop-fail if no CompareScore/winner shipped. |
| **R2** | **Med–Low** | **Weak-means demotion weaker than source panels.** Panels collapse means behind `<details>` when None/Low **or** `n≤1`. Compare only applies `compare-soft` for None/Low — **not** `n≤1`. Means stay visible (muted) always. | Thin-control pin can still look “gradeable” beside a strong pin. | **SOON** — align soft rule with panels (`n≤1` too); optional “weak” cue in cell. |
| **R3** | **Med–Low** | **Situational limitations omitted from table.** Unlock listed limitations (short list or count+expand). `CompareSlot` does not carry `limitations`; table has no row. Users must leave Compare to read smear / thin-control caveats. | Large-AOI smear distrust (2.2 residue) is invisible in the matrix that invites comparison. | **SOON** — pin a short limitation count or first line into slot; expand row. |
| **R4** | **Low–Med** | **County context still shows rank # and screening digits.** Demotion copy (“not a pin score”) is present; digits remain scannable across columns — mini ScreeningScore ladder sideways. | Investors glance-rank pins by county score. | Keep demotion; **SOON** optional: names-first / digits behind expand in compare cells only. |
| **R5** | **Low** | **AOI labels are area-only** (`AOI · ≈N km²`) — weak place cue vs Point lat/lon. Mixed pins of similar area hard to tell apart without tooltip/title. | Confusion → wrong pin remove / wrong mental map. | **SOON** — append centroid or county cue to label. |
| **R6** | **Low** | **Shared “Points (n)” / “Nearest km” row labels** for Point (≤40 km disk) vs AOI (inside / nearest-to-AOI). Semantics differ; table pretends same metric. | Misread AOI `n` as radius count or Point nearest as AOI edge distance. | **SOON** — kind-aware sublabels in cells (“inside AOI” / “≤40 km”). |
| **R7** | **Low** | **Hint lives only in Compare panel**; full-state also disables Add buttons. If user never scrolls to Compare, refuse reason is title-only on disabled control. | Mild UX; honesty of refuse still holds. | **SOON** polish — toast near panel or keep as-is. |
| **R8** | **Info** | **`docs/scoring-methodology.md` has no Compare section**; in-app Methodology does (C4 met in product UI). | Repo doc drift for auditors. | **SOON** — sync scoring-methodology.md. |
| **R9** | **Info** | AOI duplicate detection is light (rounded km² + centroid). Two different shapes with same area/centroid round can collide; dissimilar shapes rarely false-dup. | Edge case; prefer over silent double-pin spam. | Keep; DEFER tighter geometry hash. |

---

## What is *not* a critical failure (red concedes)

- **No CompareScore / winner / best-of-three** shipped — unlock REJECT held.
- Fourth pin **refused** (not silent replace) — stop criterion prefer-refuse met.
- Transmission cells cannot reasonably be read as survey-grade if muted “grid proxy” is visible.
- County row carries explicit “not a pin score.”
- Control/confidence rows appear before means.
- Scope: no parcels, geocoder, HIFLD, campaigns, PDF, site/AOI ScreeningScore.
- Prior phases not coupled to Compare success.

---

## Overclaim / distrust traps (ruthless)

1. Any future **highlight / sort / “strongest control”** chrome turns this into a ranking product overnight.
2. **County screening digits across columns** are the easiest accidental winner axis — watch harder than means.
3. Shipping a **composite pin quality** “for convenience” = CompareScore under another name — **reject**.
4. Persisted compare libraries / share URLs tempt export sprawl — stay deferred.
5. Do not “fix” glance-ranking by inventing a score; fix with copy + demotion only.

---

## Reject now (reaffirm unlock)

| Reject | Why |
|--------|-----|
| CompareScore / winner / “best site” | Contaminates Point/AOI evidence family |
| County ScreeningScore matrix as primary compare | Focus/ignore already covers shortlist |
| Parcels / minerals / ownership | Phase **2.4** locked |
| Geocoder, PDF/share packs, auth, campaigns | Sprawl |
| Full HIFLD / ERCOT / interconnection | Cosplay |
| ML / IDW / DIY BHT | Black box |
| Opening 2.4 from this slice | Explicit lock |

---

## Recommended disposition (for judgment)

- Prefer **STOP** — unlock stop criteria 1–8 met; R1–R3 are **enhance-soon honesty/UX polish**.
- If director refuses stop: **cap NOW ≤2** — (1) limitations row or count in compare, (2) softMeans parity with panels (`n≤1`) — then re-stop.
- **Do not** unlock Phase 2.4 parcels.
