# Red Team — Data Depth live stress (post-ship)

**Role:** Red team (false confidence / overclaim / usability attack)  
**Date:** 2026-08-14  
**Scope:** Shipped D1–D6 / M0 against Phase 2.5 stop criteria and buyer trust  
**Thesis check:** Did we replace thin IHFC with **false confidence wearing better labels**?

---

## Attack posture

Blue shipped a real thermal upgrade. Red’s job is to kill premature Phase 3 unlock and expose honesty/usability failures that will bounce paying developers.

---

## Findings (severity-tagged)

### F1 — Silent False on missing TexNet / PAD-US (CRITICAL)

| | |
|--|--|
| **Failure** | `texnetCaution` and `padusFriction` are **always False** (0/254 true). Missing catalogs encoded as “no risk / no friction.” |
| **Who hurts** | Geothermal developers, policymakers, skeptics — anyone who treats flags as diligence hygiene |
| **Stop hit** | Criterion 4 (risk/constraint visible) and criterion 6 (D4/D5 shipped **or** explicit SOON residual risk) — stubs without loud UNKNOWN fail honesty |
| **Fix NOW** | Ternary: `true` / `false` / `unknown` (or omit + UI “not loaded”); methodology banner: “TexNet/PAD-US not ingested” |
| **Verdict** | **Build NOW** — blocks stop |

### F2 — Stop criteria claimed by thermal spine alone (CRITICAL)

| | |
|--|--|
| **Failure** | D1+D2+D6+M0 feel like “Data Depth done.” Roadmap stop also requires risk/constraint visibility and D3 confidence/context role. Schedule slip allowed D4/D5 → SOON **with written residual risk** — silent False is not that writing. |
| **Fix NOW** | Explicit judgment: STOP **not met**; Phase 3 **locked**; residual risk doc + UI |
| **Verdict** | **Reject** Phase 3 unlock |

### F3 — D3 RRC well density still null (HIGH)

| | |
|--|--|
| **Failure** | All counties lack RRC density. Confidence cannot use “evidence richness / O&G co-use context.” Buyers in Permian / Eagle Ford cannot separate model-hot + data-rich from model-hot + empty. |
| **Stop hit** | Criterion 2/3 intent (denser measured control **and/or RRC**); D3 was on minimal slip path with D1/D2/D6 |
| **Fix** | **Build NOW** Digital Map density band (High/Med/Low/Unknown) — confidence only |
| **Verdict** | **Build NOW** |

### F4 — Model map looks like a resource product (HIGH)

| | |
|--|--|
| **Failure** | 254/254 `stanford_tdepth`, three counties tied at 100, winsorized ladder reads as statewide geothermal ranking. Labels exist but choropleth still sells heat-as-truth. |
| **Who hurts** | Skeptical scientists, GIS power users, ERCOT-adjacent planners who screenshot ranks |
| **Fix SOON** | Dual panel model T + measured control; louder rank chrome (“screening index · model prior”); top/bottom sanity note in product |
| **Verdict** | **Enhance soon** (honesty already partially shipped) |

### F5 — Confidence majority Low / Unknown undermines “commercially useful” (HIGH)

| | |
|--|--|
| **Failure** | 131 Low + 7 Unknown ≈ **54%** of TX not Medium/High. Opportunity ranks everywhere; trust nowhere for half the state. |
| **Fix** | Keep demotion (honest). Pair ranks with confidence filter default; refuse to auto-generate Phase 3 prospects on Low/Unknown |
| **Verdict** | **Enhance soon** UX; **Reject** automation on thin confidence |

### F6 — Evidence tools may not inherit v0.4 spine (MEDIUM–HIGH)

| | |
|--|--|
| **Failure** | Judgment S5: Point/AOI/Compare should inherit Data Depth thermal. If site tools still smell like legacy IHFC, county rank vs site evidence diverge — user distrust. |
| **Fix** | Verify inherit; if missing, **Enhance soon** before Phase 3 |
| **Verdict** | **Enhance soon** |

### F7 — Methodology still says “draft” in places / vintage nulls (MEDIUM)

| | |
|--|--|
| **Failure** | `layerVintages` null for substations, SMU, RRC, TexNet, PAD-US. Docs/scorer “draft” language vs `meta.methodologyVersion: 0.4.0` live. Looks unfinished to auditors. |
| **Fix** | Freeze vintages where live; mark stubs explicitly in meta |
| **Verdict** | **Enhance soon** |

### F8 — Usability: cohort tabs + model banners = cognitive load (MEDIUM)

| | |
|--|--|
| **Failure** | Gradient/heat-flow tabs remain for legacy; with all counties on tdepth, extra tabs look like product indecision. Buyers want one shortlist path. |
| **Fix** | Default tdepth (done); demote legacy tabs to “Legacy IHFC (QC)” or hide when `dataDepth` |
| **Verdict** | **Enhance soon** |

### F9 — Performance / static payload weight (LOW–MEDIUM)

| | |
|--|--|
| **Failure** | Large static `prospects.json` + GeoJSON; acceptable for MVP, painful on mobile / slow networks; Phase 3 alerts would amplify. |
| **Fix** | Defer compression/split until Phase 3 prep |
| **Verdict** | **Defer** |

### F10 — Novelty overclaim risk (MEDIUM)

| | |
|--|--|
| **Failure** | “Data Depth” branding implies practitioner-grade stack. Without TexNet/PAD-US/RRC, product is “Stanford county means + SMU n + substations” — valuable, not depth. |
| **Fix** | Marketing/UI: “Thermal spine v0.4 — risk layers pending” |
| **Verdict** | **Build NOW** copy honesty |

### F11 — Tied scores / winsorization theater (LOW–MEDIUM)

| | |
|--|--|
| **Failure** | Hidalgo/Harrison/Victoria all 100.0 — relative index artifacts. Fine if explained; fatal if sold as absolute resource order. |
| **Fix** | Show raw `tdepthMean` beside score; explain P10–P90 winsorize in UI snippet |
| **Verdict** | **Enhance soon** |

### F12 — Scope creep temptations resurfacing (HIGH if acted on)

| | |
|--|--|
| **Failure** | Pressure to “finish Data Depth” by bolting stress, ERCOT GIS, parcels, Enverus, or Phase 3 alerts before honesty fixes. |
| **Fix** | **Reject** those paths; finish D3 + flag honesty first |
| **Verdict** | **Reject** creep |

---

## Red severity summary

| Sev | IDs | Blocks stop? |
|-----|-----|--------------|
| CRITICAL | F1, F2 | **Yes** |
| HIGH | F3, F4, F5, F12 | F3 yes; F4/F5 soft; F12 process |
| MEDIUM | F6–F8, F10–F11 | Mostly enhance |
| LOW–MED | F9 | Defer |

**Red one-liner:** Thermal spine is real; **silent clear flags on missing risk layers** and **null RRC** mean Data Depth stop is **not** met — unlocking Phase 3 now would automate overconfidence.
