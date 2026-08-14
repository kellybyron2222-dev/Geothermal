# Persona synthesis — Phase 3 complete (~100)

**Date:** 2026-08-14  
**Simulated reviewers:** ~100 (weighted per BUILD_FRAMEWORK)  
**Stimulus:** Full Phase 3 automation — local county watchlist ≤25; auto digest on Watchlist panel open; Mark as seen; watchlist JSON export/import; rule candidates v0 (T@depth · conf ≥ Medium · rank ≤ 40 · no PAD friction · TexNet badge + stable demote); Focus ≠ Watch naming; published score pack UX; Point/AOI shows county model T@depth as **context only**. No auth/email. Barnes geology = context overlay only (not in score).

**Delta vs slice-1 personas:** Auto-digest, export/import, publish-pack labeling, TexNet demote sort, Focus≠Watch honesty, Point/AOI T@depth context — re-scored against the full-phase ship.

---

## Cohort weights

| Persona | ~n | Weight rationale |
|---------|----|------------------|
| Geothermal developers | 30 | Primary buyer — return cadence / shortlist hygiene |
| Energy project developers (broader) | 22 | Primary adjacent — multi-asset desk |
| Infrastructure / land investors | 20 | Primary capital — portable shortlist trust |
| Skeptical domain experts / geo scientists | 12 | Trust gate / anti-ML / model-vs-measured |
| Researchers / students | 10 | Secondary — methodology auditors |
| Policymakers / economic development | 6 | Light — narrative only |
| **Total** | **100** | |

---

## Reaction mix

| Reaction | ~Count | Notes |
|----------|--------|-------|
| Useful / Phase 3 feels done | 46 | Auto-digest + export + Focus≠Watch close the return-loop gaps from slice 1 |
| Lukewarm | 22 | Accept local-first; still want email/sync “eventually” |
| Confused | 14 | Publish pack vs vintage; demote vs exclude; Point T@depth “score?” |
| Distrust | 12 | Rules still feel arbitrary; localStorage fragility; model prior misread |
| Dismiss | 6 | Want parcels / push / national GIS / ML prospects (out of Phase 3) |

**Net vs slice 1:** Praise up (~38→46); confusion down (~18→14); empty-digest distrust largely retired. Remaining friction is **rule legitimacy**, **storage durability**, and **Point/AOI model-prior honesty**.

---

## Praise clusters

| Cluster | ~Mentions | Who |
|---------|-----------|-----|
| **P1 — Auto digest on panel open** | 41 | Geo + energy developers (heaviest) |
| **P2 — Mark as seen stays manual** | 34 | Power users who want control of “read” state |
| **P3 — Export/import JSON backup** | 38 | Investors, geo developers (browser wipe fear) |
| **P4 — Focus ≠ Watch is finally labeled** | 36 | Same buyers who flagged C1 in slice 1 |
| **P5 — Rules text + TexNet badge/demote (not hard exclude)** | 31 | Skeptics, TX operators near seismicity |
| **P6 — Published score pack (human label, not raw dump)** | 27 | Investors, policy light, researchers |
| **P7 — No auth / no email ops tax** | 24 | Solo-shop developers; skeptics of “alert product” |
| **P8 — Point/AOI T@depth as context only** | 22 | Domain experts; energy developers doing site desk |
| **P9 — Barnes stays overlay-only; no new GIS layers** | 19 | Skeptics, MVP-aligned buyers |
| **P10 — Cap 25 still feels like a focus tool** | 17 | Beachhead trackers |

---

## Confusion clusters

| Cluster | ~Mentions | Who | Implication |
|---------|-----------|-----|-------------|
| **C1 — Publish pack vs “last seen” vintage** | 16 | Broader energy, investors | Clarify pack id/label vs digest baseline in UI copy |
| **C2 — Demote ≠ exclude (TexNet)** | 14 | Investors, policy light | One-line: sorted down, still eligible; not a veto |
| **C3 — Point/AOI T@depth looks like a site score** | 13 | Geo developers, skeptics | Reinforce “county model prior · context only” near the number |
| **C4 — Import merges or replaces?** | 11 | Power users | Document / confirm dialog semantics |
| **C5 — Rule candidates vs my Watchlist** | 9 | Students, some investors | Keep “Rule candidates (v0)” noun; do not say Generated |
| **C6 — Why no email if digest auto-runs?** | 7 | Stakeholders hearing “automated” | Methodology: in-app cadence ≠ notification product |

---

## Distrust clusters

| Cluster | ~Mentions | Who | Severity for Phase 3 stop |
|---------|-----------|-----|---------------------------|
| **D1 — Rank ≤ 40 / conf ≥ Med feel arbitrary cutoffs** | 18 | Domain experts, sophisticated geo developers | **SOON** explainability; not stop if rules stay visible |
| **D2 — localStorage still can vanish despite export** | 15 | Investors, return users | **SOON** nudge to export; auth remains DEFER |
| **D3 — County model T@depth misread as measured site heat** | 14 | Skeptics, geo scientists | **NOW** if UI still ambiguous; else SOON copy harden |
| **D4 — Fear auto-digest will spam / cry wolf again** | 8 | Slice-1 scar tissue | KEEP honesty statuses; no email |
| **D5 — Export JSON = “product data leak” anxiety** | 5 | Corp energy / policy light | Low; file is user-owned shortlist |
| **D6 — Completing Phase 3 will unlock parcel/ML next** | 6 | Skeptics | Affirm REJECT sprawl |

---

## Missing must-haves (asked for; disposition)

| Ask | ~Mentions | Judgment disposition |
|-----|-----------|----------------------|
| Email / Slack / push digest | 17 | **DEFER** — Phase 3 alert = in-app digest |
| Cloud sync / accounts | 15 | **DEFER** — export covers solo |
| Soften or document rule thresholds (why 40 / Med) | 14 | **SOON** methodology + UI one-liners |
| Point / AOI watch pins | 11 | **DEFER** — county remains watch unit |
| Import conflict UX (merge vs replace) polish | 10 | **SOON** if confusing in ship |
| Stronger “model prior / not site score” on Point/AOI | 12 | **NOW** if still ambiguous; else **SOON** |
| Export reminder / last-backup hint | 8 | **SOON** |
| Parcel / GLO on candidates | 8 | **REJECT** GIS sprawl |
| ML ranking of prospects | 7 | **REJECT** |
| Silent Focus↔Watch merge | 6 | **REJECT** |
| Live ERCOT / CEII | 4 | **REJECT** |
| National coverage | 3 | **DEFER** (post-TX trust) |

---

## Dismiss triggers (sophisticated geo developers / investors)

1. Treating county **model** T@depth on Point/AOI as a **site resource score**  
2. Hard-excluding TexNet counties without stating seismicity is caution, not veto  
3. Auto-digest that again claims “updates” when nothing watched moved  
4. Shipping parcels / watch choropleth / ML to “finish” automation  
5. Email/push that pretends **live grid** monitoring  
6. Silent merge of session Focus with durable Watch  

**Note:** Primary buyers largely accept Phase 3 as a **return-loop product**. Remaining distrust is about **threshold legitimacy** and **model-prior honesty**, not about missing GIS.

---

## Persona one-liners (weighted)

| Persona | One-liner |
|---------|-----------|
| Geothermal developers | Auto-open digest + export make watching counties feel real; still want rule cutoffs justified in one sentence. |
| Energy project developers | Focus≠Watch and publish pack labels reduce desk confusion; email can wait. |
| Infra / land investors | Portable JSON shortlist is the trust feature; local-only without export would have failed diligence culture. |
| Skeptical domain experts | Keep rules visible and TexNet soft; Point/AOI must never look like a scored prospect. |
| Researchers / students | Methodology + pack id are enough; ask for threshold citations, not accounts. |
| Policymakers | “Automated opportunity” is fine if it stays explainable lists, not alert spam. |

---

## Actionable clusters for judgment (5–8)

| # | Cluster | Severity | Recommended action |
|---|---------|----------|-------------------|
| **J1** | Point/AOI county model T@depth misreadable as site score | **NOW** if UI still ambiguous; else **SOON** | Harden “county model prior · context only · not a site ScreeningScore” adjacent to the value; never promote to score factor |
| **J2** | Rule threshold legitimacy (rank ≤40, conf ≥ Med) | **SOON** | One-line rationale in candidates panel + methodology; keep rules frozen/visible — do not retune without new judgment |
| **J3** | Import semantics (merge vs replace) + export durability nudge | **SOON** | Explicit import mode + light “export recommended” hint; do **not** build auth |
| **J4** | Publish pack label vs digest “last seen” baseline | **SOON** | Short copy linking pack id/label to what digest compares |
| **J5** | TexNet demote misunderstood as exclude | **SOON** (light) | Badge + sort footnote: eligible, sorted down |
| **J6** | Email / accounts / AOI watch pins / GLO | **DEFER** | New product judgment after Phase 3 STOP only |
| **J7** | Parcels · CEII · ML prospects · silent Focus↔Watch merge · geology-in-score | **REJECT** | Do not treat as Phase 3 completion debt |
| **J8** | Auto-digest + Mark as seen + Focus≠Watch + export + rules v0 + Barnes overlay-only | **KEEP** | Declare Phase 3 COMPLETE when honesty statuses hold and build/tests green — deferrals are success |

---

## Cluster → next step

| Feed | Into |
|------|------|
| J1, D3, C3 | Director NOW/SOON honesty pass on Point/AOI context |
| J2, D1 | Methodology / UI threshold explainers (SOON) |
| J3, D2, C4 | Export/import polish (SOON); auth stays DEFER |
| J4, C1 | Publish-pack / digest copy (SOON) |
| J5, C2 | TexNet demote footnote (SOON light) |
| J6 | Post–Phase 3 backlog only |
| J7, D6 | Affirm REJECT in stop judgment |
| J8, P1–P10 | KEEP — stop condition input |

---

## Director-facing verdict (persona layer)

Weighted reviewers treat **Phase 3 automation as complete enough** for a local, explainable return loop. Do **not** reopen auth/email/GIS to satisfy minority asks. Gate STOP on **model-prior honesty at Point/AOI** (J1) and keep threshold/export polish in **SOON** without blocking completion.
