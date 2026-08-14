# Red Team — Full Build (Phase 1 + Phase 2.1 post-harden)

**Date:** 2026-08-13  
**Scope:** Everything shipped — county screening + Point check after J1–J9 honesty harden  
**Stance:** Attack false confidence, overclaim, JTBD failure, and residual stop-criteria risk  
**Product thesis check:** Not a GIS viewer; answers “Where should I focus, and why?” — Texas, explainable heuristics, solo MVP

---

## Executive verdict

Honesty copy for Point check largely landed. **The product still fails its own Phase 1 acceptance shape and its thermal honesty story.**

1. Explorer is **map + search + panel** — the authoritative MVP required a **ranked list as primary UX**. Users cannot produce a focus/ignore shortlist without inventing their own scan method. That is a GIS trap.
2. Marketing/docs say **gradient preferred**. Reality: **25 / 254** counties use gradient; **222** use heat-flow fallback; **9 of top 10** ranks are heat-flow fallback, including **#1 Harrison at 100.0**. Separate cohort scaling then one statewide leaderboard is **metric contamination with a green choropleth**.
3. Phase 2.1 stop criteria are **mostly improved, not closed**. Panel copy is better; the map still teaches “darker county = better site” while clicking.

**Do not open 2.2–2.4.** Fix ranking honesty + list UX before celebrating Point check.

---

## J1–J9 land check (judgment NOW items)

| ID | Intent | Landed? | Evidence |
|----|--------|---------|----------|
| **J1** | Rename to **Point check** | **Yes (UI)** | `App.tsx` toggle “Point check” / “Point check: ON”; `SiteDossierPanel` title “Point evidence check”. Residual: symbols still `SiteDossier` / `buildSiteDossier` / filename — not user-facing. |
| **J2** | Demote county rank/score | **Yes** | Panel section “County screening context” + “Not a score for this click point”; limitations string in `siteEval.ts`. |
| **J3** | Lead with control quality | **Yes** | `n`, nearest km, site confidence before means; means labeled de-emphasized when weak. |
| **J4** | `~X km` + ~0.15° / ~15 km disclaimer | **Yes** | `~${Math.round(...)} km` + grid proxy copy in `SiteDossierPanel`. |
| **J5** | Situational limitations | **Yes** | n=0/1, no local gradient, county HF fallback, county-not-site. |
| **J6** | Scream gradient vs HF in county detail | **Partial** | Detail panel metric banner **yes** (`DetailPanel.tsx`). **Map/list/search do not.** GeoJSON has no `thermalMetric`. Top ranks still look like one product. |
| **J7** | Decouple loads | **Yes** | Separate `error` vs `siteError`; banner “County screening available…”; Point check disabled if site assets fail (`App.tsx`). |
| **J8** | Methodology documents point-check rules | **Partial** | `Methodology.tsx` has Point check section (40 km, grid, not a site score). Missing: site-confidence thresholds, evidence-verb rules, infra lookup method. |
| **J9** | Empty control leads with insufficient | **Yes** | Warn + limitations unshift; verb “Insufficient control”. |

**SOON items that partially leaked into NOW code:** S2 evidence verb exists, but **`Deprioritize` is unreachable** (`evidenceVerb()` never returns it). S1 conflict callout (strong county / weak local) **not built**.

---

## Findings

### F1 — No ranked county list; map is the product
| | |
|--|--|
| **Severity** | **Critical** |
| **What fails** | Primary JTBD (“leave with ~3 focus / ~3 ignore”) assumes a ranked table. Shipped UX is choropleth + name search + detail. That is orientation GIS, not decision UX. Violates `red-team-mvp.md` Part 2–3 and Phase 1 acceptance (“ranked list primary”). |
| **Evidence** | `web/src/App.tsx` — explorer = `MapView` + `DetailPanel` only; search returns ≤8 matches, not a ranked shortlist. No table component exists. |
| **Recommend** | **Fix now:** Add a compact ranked list (rank, name, score, confidence, thermal metric badge). Map secondary. Search filters the list. |

### F2 — “Gradient preferred” is a lie on the leaderboard
| | |
|--|--|
| **Severity** | **Critical** |
| **What misleads** | Docs/README/methodology claim gradient-preferred thermal. Live ranks are a **heat-flow product** with a thin gradient garnish. Top 10: **9 HF / 1 gradient** (Anderson #5). Top 30: **27 HF**. Gradient counties: **25**. HF fallback: **222**. Missing thermal: **7**. |
| **Evidence** | `web/public/data/prospects.json` analysis; `#1 Harrison` label `"Heat-flow fallback"`, `metric=heat_flow_mWm2`, `screeningScore=100`, `s_thermal=100`, `s_infra=100`. Scoring: `scoring/score_counties.py` (separate cohort scale → one `screening_score`). |
| **Recommend** | **Fix now (pick one honesty path):** (A) Dual tracks / dual choropleths (“Gradient control counties” vs “Heat-flow proxy counties”) — never one fused rank; or (B) Rank only counties with gradient, mark HF as “unranked / proxy only”; or (C) Keep fused score but **visually quarantine** HF counties (hatch, badge, separate sort). Do not ship one green ramp. |

### F3 — Separate cohort scaling → fake comparability
| | |
|--|--|
| **Severity** | **Critical** |
| **What overclaims** | Gradient and heat-flow are scaled 0–100 **within their own cohorts**, then mixed with the same 0.60 weight into one ScreeningScore. A HF “100” and a gradient “100” are treated as equivalent attractiveness. That is apples-to-oranges ranking contamination by construction. |
| **Evidence** | `score_counties.py` L133–150; HF cohort has **23** counties at ~100 thermal; gradient cohort **3**. Winsorize + tiny HF cohort tails create ceiling pile-ups (`Harrison`/`Morris`/`Hill` all **100.0** overall). |
| **Recommend** | **Fix now:** Stop claiming a single statewide ordinal. If fused score stays for demo, add hard UI: “Cross-metric ranks are not scientifically comparable.” Prefer F2 option A/B. |

### F4 — Choropleth cannot show metric; map teaches one truth
| | |
|--|--|
| **Severity** | **High** |
| **What misleads** | Fill color = `screeningScore` only. User cannot see that #1 is HF fallback vs #5 is gradient. Persona dismiss trigger (“metric contamination”) is still live on the main canvas. J6 only fixed the side panel. |
| **Evidence** | `MapView.tsx` paint on `screeningScore`; geo props in `score_counties.py` omit `thermalMetric` / `confidence` styling. Legend: “Screening score” / Lower–Higher. |
| **Recommend** | **Fix now:** Encode metric on map (hatch/pattern or dual legend). At minimum badge selected county + list rows. **Enhance:** filter toggles “Gradient counties only”. |

### F5 — Single gradient point overrides richer heat-flow control
| | |
|--|--|
| **Severity** | **High** |
| **What fails** | Any `gradient_n > 0` switches the county to gradient scoring — even `n=1`. Cherokee: **1** gradient vs **21** heat-flow points → still gradient metric. Six gradient counties are n=1. Sparse gradient can dominate denser HF evidence and still look “preferred.” |
| **Evidence** | `build_county_features.py` `use_grad = gradient_n > 0`; county_features analysis. |
| **Recommend** | **Fix soon:** Minimum `gradient_n` gate (e.g. ≥3) else HF fallback + explicit “thin gradient” flag. Show both raw means always in panel (deferred dual-display, now urgent). |

### F6 — Perfect-score pile-up destroys trust
| | |
|--|--|
| **Severity** | **High** |
| **What overclaims** | Three counties at **100.0**, many thermal legs clipped to 100 after P10–P90 winsorize. Leaderboard looks calibrated; it is ceiling artifact + infra proximity. Domain experts will smell it immediately. |
| **Evidence** | Top rows in `prospects.json`; `winsorize` + `scale_0_100` in `score_counties.py`. |
| **Recommend** | **Fix soon:** Don’t display 100.0 as destiny; show factor contributions first; consider rank bands / ties; publish top/bottom sanity notes (Phase 1 acceptance still unmet in-repo). |

### F7 — Confidence story is inconsistent / under-shown
| | |
|--|--|
| **Severity** | **High** |
| **What misleads** | Methodology UI says confidence is “heat-flow control point density.” Code uses `thermal_n` for the **active** metric (closer to `scoring-methodology.md`). Panel shows badge only — **not** `thermalControlCount`. Top ranks include **Low** confidence + score 100 (Morris #2, Hill #3, Anderson #5). Score still dominates perception. |
| **Evidence** | `Methodology.tsx` L32–34; `score_counties.py` confidence from `well_count`(=`thermal_n`); `DetailPanel` omits count. |
| **Recommend** | **Fix now:** Show `n=` beside confidence; fix methodology wording; visually demote Low/Unknown in list/map (opacity or sort-after). |

### F8 — Phase 1 UX still fails “explain without a legend”
| | |
|--|--|
| **Severity** | **High** |
| **What blocks JTBD** | No focus/ignore workflow cues, no “top / bottom” presets, no export of shortlist, no explicit “first filter before desk GIS” CTA. Header title “Texas Next-Gen Geothermal Screening” is OK; README still “Intelligence Platform” brand oversell vs shipped thinness. |
| **Evidence** | `App.tsx` header; `README.md` H1; missing list UX (F1). |
| **Recommend** | **Fix now:** Ranked list + “Suggested focus (top 10 with Medium+ conf)” / “Deprioritize (bottom)” sections. Soften brand to match honesty. |

### F9 — Point mode still sits on a county-score heatmap
| | |
|--|--|
| **Severity** | **High** (residual stop criterion #1) |
| **What misleads** | Panel says county score isn’t a site score; the map under the click still colors counties by ScreeningScore. Muscle memory: click dark green → expect good site. Stop criterion “cannot reasonably mistake county rank for site quality” is **not fully met**. |
| **Evidence** | `MapView.tsx` — same fill layer in `siteMode`; legend title changes, color ramp does not. |
| **Recommend** | **Fix now:** In Point check mode, mute/desaturate choropleth or switch to neutral county outlines + marker only. |

### F10 — Evidence verb overclaims; `Deprioritize` dead code
| | |
|--|--|
| **Severity** | **Med** |
| **What misleads** | Medium confidence → “Keep looking”. Verb reads like a recommendation product, not evidence quality. `Deprioritize` typed/CSS’d but never returned — SOON S2 incomplete, looks half-baked if inspected. |
| **Evidence** | `siteEval.ts` `evidenceVerb()`; CSS `.verb-deprioritize`. |
| **Recommend** | **Fix soon:** Verbs = evidence only (“Sparse control”, “Adequate control to keep investigating”, “Conflict: strong county / weak local”). Wire Deprioritize for far-nearest + empty gradient or remove from type/CSS. |

### F11 — 40 km unweighted mean still looks like a measurement
| | |
|--|--|
| **Severity** | **Med** (residual stop #2/#5) |
| **What fails** | Control leads correctly, but means still use `.big` type at opacity 0.55 — still the visual second punch. Outliers in disk unhandled. Judgment accepted 40 km smear **only if clearly labeled**; labeling exists, visual hierarchy still invites misuse. |
| **Evidence** | `SiteDossierPanel.tsx` means row; `siteEval.ts` radius 40. |
| **Recommend** | **Enhance:** Hide numeric means when `None`/`Low` until expand; show median + range; optional tighter radius later. **Accept** 40 km for stop if means are collapsed by default when weak. |

### F12 — Transmission proxy honesty in Point check vs county factor asymmetry
| | |
|--|--|
| **Severity** | **Med** |
| **What misleads** | Point check rounds to `~N km` + grid disclaimer (good). County factor still shows raw `X.XX km to nearest line` from centroid — false precision relative to Point check harden. Infra remains proximity cosplay for interconnection-sensitive buyers. |
| **Evidence** | `DetailPanel` factor rawValue; `SiteDossierPanel` transmission block. |
| **Recommend** | **Fix soon:** Round county infra display; keep “not interconnection” in drivers (already). **Defer** queues/voltage. |

### F13 — Missing thermal counties scored as thermal 0 without map stigma
| | |
|--|--|
| **Severity** | **Med** |
| **What fails** | 7 counties (`Comal`, `Rockwall`, `Mason`, `Blanco`, `Llano`, `Kendall`, `Gillespie`) have no thermal; `s_thermal` filled 0; metric may serialize oddly (`nan` in JSON path). They sink ranks via zero thermal + infra only — OK if labeled; easy to miss on map. |
| **Evidence** | `county_features.csv`; `score_counties.py` `fillna(0.0)`. |
| **Recommend** | **Fix soon:** Explicit `Unknown` thermal + distinct map style; exclude from “focus” suggestions. |

### F14 — West Texas / standalone next-gen narrative crushed by infra weight
| | |
|--|--|
| **Severity** | **Med** |
| **What fails product thesis** | Presidio: rich gradient control (`gradient_n=144`, raw ~48 °C/km) but rank **#98** because transmission distance. Product framing includes standalone next-gen (`DECISIONS.md` D1) but score punishes basin interiors. Developers hunting Far West heat will dismiss the tool as “grid map with heat flavor.” |
| **Evidence** | Gradient county ranks vs `infra_dist_km` in features. |
| **Recommend** | **Enhance:** Optional “thermal-only sort” lens (not a second black-box score). **Accept** for colocated beachhead if copy says so loudly. |

### F15 — Methodology / docs drift
| | |
|--|--|
| **Severity** | **Med** |
| **What misleads** | Confidence description wrong in UI; `county_features_meta.json` still implies singular `thermal_metric: heat_flow_mWm2`; `tasks.md` says Phase 2.1 “IN PROGRESS” while harden claims done; no filed top/bottom 15 sanity artifact. |
| **Evidence** | `Methodology.tsx`; `data/processed/county_features_meta.json`; `docs/tasks.md`; missing review notes for Phase 1 acceptance #7. |
| **Recommend** | **Fix now:** Align docs to code; publish sanity checklist under `docs/reviews/`. |

### F16 — Point-check compute / asset weight (solo-MVP tax)
| | |
|--|--|
| **Severity** | **Low** |
| **What is slow / complex** | Every click haversines ~5875 thermal points + scans ~6497 infra cells in JS. Fine on desktop today; fragile if assets grow. Internal “dossier” naming adds cognitive debt. |
| **Evidence** | `siteEval.ts`; `thermal_points.json` n=5875; `infra_grid.json` n=6497. |
| **Recommend** | **Defer** spatial index until measured pain. **Accept** current static grid approach (correct solo trade). |

### F17 — Component overclaim residue
| | |
|--|--|
| **Severity** | **Low** |
| **What overclaims** | File/symbol `SiteDossierPanel` / `SiteDossier` still say “dossier” after product rename — fine for users, bad for future agents reopening scope. |
| **Recommend** | **Accept** until next refactor; rename when touching files. |

---

## Residual Phase 2.1 stop-criteria audit

| # | Criterion | Status | Residual risk |
|---|-----------|--------|---------------|
| 1 | Cannot mistake county rank for site quality | **Fail / partial** | Panel OK; **choropleth in point mode** still equates darkness with site quality (F9). Rank/score still shown in county context block (necessary but tempting). |
| 2 | Control weakness before big thermal means | **Pass with caveat** | Order correct; means still large type when weak (F11). |
| 3 | Transmission not readable as survey distance | **Pass** | `~km` + ~0.15° copy present (J4). |
| 4 | County explorer works if site assets fail | **Pass** | Decoupled fetches + banner + disabled toggle (J7). |
| 5 | Accept 40 km smear with clear labeling | **Pass with caveat** | Labeled; judgment should **not** stop until F9 muted map + weak means collapsed. |

**Stop recommendation:** Phase 2.1 is **not done**. Close F9 + F11 (display) + complete verb honesty (F10), then re-judge. Do **not** treat J1–J9 checklist alone as stop.

---

## Phase 1 score honesty risks (explicit)

| Risk | Severity | Reality check |
|------|----------|---------------|
| Gradient vs heat-flow mixed on one rank | **Critical** | 25 gradient vs 222 HF; top ranks HF-dominated (F2–F4) |
| ~25 counties with gradient | **Critical** | Preferred metric is minority coverage; product overclaims “gradient preferred” statewide |
| Ranking contamination | **Critical** | Cross-cohort 0–100 fusion (F3); n=1 gradient flips (F5); ceiling pile-up (F6) |
| Confidence ≠ opportunity but UI underplays | **High** | Low-conf 100-scores in top 5 (F7) |
| No published top/bottom sanity | **High** | Acceptance criterion unmet |
| County centroid infra | **Med** | Large counties + false precision (F12, F14) |

---

## UX / product risks that block primary JTBD

Primary JTBD: *Which Texas counties should I focus on next — and why?*

| Blocker | Why it blocks |
|---------|----------------|
| **No ranked list (F1)** | Cannot scan focus/ignore in &lt;15 min without map hunting |
| **Contaminated leaderboard (F2–F4)** | “Why” is not trustworthy; sophisticated buyers dismiss |
| **Score &gt; confidence visually (F7)** | Users will shortlist Low-conf HF ceilings |
| **Map-as-product (F1, F9)** | Thesis regression into GIS viewer |
| **Point check ahead of county trust** | Pin evidence on a distrusted statewide rank teaches the wrong next step |

Secondary JTBD (Point check): *What about this location?* — honesty harden helped; **still blocked** if users arrive via false county ranks or read the green map as site quality.

---

## Reject / do not build (reaffirm)

AOI draw, compare matrix, parcels, site ScreeningScore, ML/IDW surfaces, DIY BHT→gradient, geocoder, full HIFLD in browser, PDF export, auth, layer catalog, interconnection queues — **reject until Phase 1 rank honesty + list UX pass.**

---

## Prioritized actions for judgment

### Fix NOW
1. **Ranked county list** as primary UX (F1, F8)  
2. **Break or quarantine cross-metric ranking** + map encoding of gradient vs HF (F2–F4)  
3. **Mute choropleth in Point check** (F9)  
4. Show **confidence n** + fix methodology confidence copy (F7, F15)  
5. Collapse/hide weak local means by default (F11)  

### Enhance soon
- Gradient_n gate / always show both thermal raws (F5)  
- Evidence verbs without recommendation cosplay (F10)  
- County infra rounding; thermal-only sort lens (F12, F14)  
- S1 county↔local conflict callout  

### Defer
- 2.2 AOI, 2.3 compare, 2.4 parcels  
- Spatial index for point queries (F16)  
- Voltage / queues / depth scenarios  

### Accept
- Static HIFLD grid approach  
- County grain for Phase 1  
- Internal `SiteDossier` symbol names until refactor  

---

## Bottom line

J1–J9 made Point check **less dishonest**. They did **not** make the platform **decision-grade**. The red team’s Phase 1 original warning still owns the build: **synthesis + rank + explanation** — and right now the rank is scientifically contaminated and the ranked list is missing. Fix that, or sophisticated Texas geothermal buyers will correctly treat this as a pretty map with footnotes.
