# MVP Spec — Texas Next-Gen County Screening

**Status:** Refined after red-team. Authoritative detail: [red-team-mvp.md](red-team-mvp.md)  
**Phase:** 1 · **Window:** ~30–45 days · **Operator:** solo founder  
**Geography:** Texas only  
**Unit:** Counties (not drill targets)  
**Play framing:** Next-gen geothermal **regional screening** (not loop-type optimization)

---

## One-sentence product

Help a geothermal/energy developer answer: **“Which Texas counties should I focus on next for next-gen screening—and why?”**

---

## True MVP (locked)

| Item | Decision |
|------|----------|
| Objective | Focus / ignore county shortlist with explainable drivers |
| Primary user | Geothermal / energy project developer |
| Delivery | **Static** web app + precomputed JSON/GeoJSON |
| Opportunity factors | **2 only:** geothermal **gradient** preferred / heat-flow fallback (0.60) + transmission proximity (0.40) |
| Confidence | Thermal control density bands (**not** part of Screening Score) |
| UX | Map + detail panel + county search + Methodology |
| Not included | API, PostGIS, layers, BHT-in-score, parcels, AOI, auth, ML |

---

## Primary workflow

1. Open Explorer → ranked counties + choropleth  
2. Click county → explanation (factors, drivers, sources, limitations)  
3. Leave with ~3 focus and ~3 ignore counties  

## Secondary workflow

Filter by county name → same explanation panel.

---

## Success criteria

- User produces focus/ignore lists and can explain *why* in &lt; 15 minutes  
- No login; public URL  
- Methodology matches shipped weights  
- Language does not claim resource proof or drill readiness  
- Top/bottom 15 manually sanity-checked  

**Failure mode:** A pretty map with layers and no decision.

---

## Explicitly out of Phase 1

Interactive wells/transmission layers · FastAPI/PostGIS · BHT opportunity scoring · faults/hot springs/plants · AOI/parcels · dual open/closed products · geocoder · accounts  

See [red-team-mvp.md](red-team-mvp.md) Parts 2–4 for full shippable product and milestones.
