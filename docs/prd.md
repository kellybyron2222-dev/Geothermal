# Product Requirements Document (PRD) — Phase 1

**Aligned to red-team true MVP:** [red-team-mvp.md](red-team-mvp.md) · [MVP.md](MVP.md)

---

## User stories (must-have)

1. Ranked Texas counties with Screening Score + Confidence  
2. Click county → factor breakdown, drivers, sources, limitations  
3. Supporting choropleth (not a layer product)  
4. Visible methodology (weights, formula, what-it-is-not)  
5. Filter counties by name  

## Won’t-have (Phase 1)

AOI upload · parcels · layer toggles · geocoder · auth · API/DB · BHT-in-score · faults/springs/plants as factors · dual loop modes · ML · 3D  

---

## Workflows

**Primary:** Open → rank/map → click → explain → focus/ignore shortlist  

**Secondary:** Filter by county name → same panel  

---

## Functional requirements

| ID | Requirement |
|----|-------------|
| F1 | Precomputed Screening Score for all TX counties |
| F2 | Ranked list is primary UX |
| F3 | Choropleth map supports selection |
| F4 | Detail panel shows 2 factors + confidence + drivers + sources |
| F5 | Methodology page matches shipped v0.2 formula |
| F6 | Heuristic only; static data files |
| F7 | County name filter |

---

## Non-functional

Solo-maintainable · static hosting · Texas-only · public data · no auth · desktop-first · honest limitations copy  

---

## Datasets in

Counties · one thermal proxy · one transmission source · wells/counts for confidence only  

## Datasets out

Faults · hot springs · plants · substations (unless forced by license path) · parcels · commercial wells · live ERCOT  
