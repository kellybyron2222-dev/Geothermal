# Red Team — Data Depth continue (45-min slice)

**Role:** Red team (false confidence / overclaim / schedule attack)  
**Date:** 2026-08-14  
**Scope:** PAD-US live + RRC still proxy + UI SOON backlog vs stop  
**Thesis check:** Did loading PAD-US create a fake “Data Depth done” narrative?

---

## Attack posture

Blue closed the loudest Unknown (PAD-US). Red’s job is to stop premature STOP, expose over-flagging and residual RRC fraud, and kill Phase 3 temptation.

---

## Findings (severity-tagged)

### F1 — RRC still SMU proxy; Digital Map needs MFT login (CRITICAL)

| | |
|--|--|
| **Failure** | D3 remains `smu_control_density_proxy_rrc_pending`. Real RRC Digital Map is behind MFT / login — not a “quick ETL” close. Buyers who hear “well density” still get thermal-control density, not O&G Digital Map activity. |
| **Who hurts** | Geo developers, O&G transition teams, skeptics doing Permian / Eagle Ford triage |
| **Stop hit** | Criterion 2 (denser measured control **and/or RRC**) stays **PARTIAL** |
| **Fix** | Either (a) real RRC Digital Map density, **or** (b) written **buyer-accepted residual** with loud UI + methodology that the proxy is *not* RRC — current quiet proxy note is insufficient for STOP |
| **Verdict** | **Blocks STOP** |

### F2 — PAD-US may over-flag (~122 / 254 any-intersect) (CRITICAL)

| | |
|--|--|
| **Failure** | Any Fee GAP1–2 intersect → county friction. ~48% of Texas flagged. Tiny park/wildlife corners can paint entire large counties as “friction,” demoting otherwise credible shortlist counties. |
| **Who hurts** | Energy developers + land investors building focus lists; product looks anti-Texas rather than anti-park |
| **Stop hit** | Criterion 4 is *visible* but may be *miscalibrated* — visibility ≠ decision quality |
| **Fix SOON** | Tighten to **min area fraction** (e.g. protected intersect area / county area **> 1%**) before treating friction as diligence-grade |
| **Verdict** | **Enhance soon** (do not roll back load; calibrate) |

### F3 — Site evidence still not Stanford-sampled (HIGH)

| | |
|--|--|
| **Failure** | County spine is v0.4 T@depth; Point / AOI / Compare may still fail to inherit Stanford-sampled evidence (E4). Rank vs site dossier diverge → trust bounce. |
| **Who hurts** | Developers moving from county shortlist → site check |
| **Fix** | E4 evidence inherit before Phase 3 unlock |
| **Verdict** | **Enhance soon** (still 2.5) |

### F4 — Phase 3 temptation after “risk live” (HIGH)

| | |
|--|--|
| **Failure** | TexNet + PAD-US look like stop criteria 4 “done.” Team / deck narrative may unlock alerts/prospects while RRC is still a proxy and PAD-US is coarse. Automating over-flagged + proxy-confidence ranks amplifies wrong diligence. |
| **Fix** | Director **LOCK** Phase 3 until STOP scorecard clears (RRC residual path or real Digital Map + calibrated PAD-US) |
| **Verdict** | **Reject** unlock |

### F5 — UI SOON debt (E4/E5/E6) accumulates (MEDIUM)

| | |
|--|--|
| **Failure** | Evidence inherit, cohort demote, raw T beside score remain named-not-shipped. Cognitive load + model/score ambiguity persist. |
| **Fix** | Keep SOON ordered after PAD-US calibration / RRC residual decision — do not let Phase 3 leapfrog |
| **Verdict** | **Enhance soon** |

### F6 — “Complete Data Depth” marketing risk (MEDIUM)

| | |
|--|--|
| **Failure** | ETL status saying PAD-US LIVE invites README/roadmap drift to “done.” Residual risk chrome must stay loud. |
| **Fix** | Roadmap + methodology: STOP not met; Phase 3 locked |
| **Verdict** | **Reject** complete claim |

---

## Red severity summary

| Sev | IDs | Implication |
|-----|-----|-------------|
| CRITICAL | F1, F2 | No STOP; calibrate PAD-US; resolve RRC residual |
| HIGH | F3, F4 | E4 before automation; Phase 3 locked |
| MEDIUM | F5, F6 | SOON polish; no “complete” marketing |

---

## Red one-liner

**PAD-US live is progress, not STOP — RRC proxy + ~122 any-intersect over-flags + missing site Stanford inherit still fail commercial diligence; Phase 3 stays dead.**
