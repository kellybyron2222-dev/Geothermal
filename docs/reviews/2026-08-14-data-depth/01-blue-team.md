# Blue Team Defense — Texas Geothermal Data Depth Strategy

**Role:** Blue team (decision-value defense)  
**Date:** 2026-08-14  
**Scope:** Proposed **Data Depth** upgrade before Phase 3 automation  
**Inputs:** `docs/data-strategy-texas-geothermal.md` (esp. rankings §3 + final recommendation §7) · scoring v0.3.1 · Phase 2 complete · product locks  
**Thesis check:** Datasets earn a seat only if they change a **focus / ignore / defer diligence** decision for Texas next-gen screening — not if they look impressive on a map.

---

## Product reality blue must defend against

Shipped stack today:

```text
ScreeningScore ≈ 0.60 × S_thermal(IHFC sparse gradient/HF) + 0.40 × S_infra(HIFLD lines)
```

- Gradient-primary cohort ≈ **10 counties** (honest, commercially thin)
- Point / AOI evidence exist but inherit the same thermal spine
- Phase 2 site tools are complete; user correctly says: **need actual data before Phase 3**

Blue accepts the blunt opening of the strategy: IHFC-only statewide ranking cannot defend a paying-developer shortlist. The job of Data Depth is to make the **existing** county / point / AOI surfaces commercially non-embarrassing — not to invent a new product category.

---

## 1. What creates decision value (defend)

### 1.1 Stanford Thermal Earth Model T@depth (GDR 1592) — thermal language buyers already speak

**Decision value:** Answers *temperature at what depth?* statewide. Replaces “sparse global heat-flow choropleth” with a play-selected depth band (e.g. 3–5 km closed-loop / 3–6 km EGS) that matches Fervo / XGS / Eavor / HotRock public language.

**Why not reject despite PIGNN / model nature:** Blue does **not** defend silent ML scores. Blue defends a **labeled model layer**: opportunity prior with explicit `measured_vs_model` flag and confidence demotion vs IHFC/SMU points. That is the only public path that fills the ~244 counties without gradient control without waiting on Enverus.

**KEEP rule:** Always UI-label “model T@depth (Stanford)” — never “measured geothermal.”

### 1.2 SMU NGDS / GDR 1704 TX BHT / heat-flow points — densify control, restore trust

**Decision value:** Dense measured/corrected thermal control is what skeptics and geo developers ask for after seeing ~10 gradient counties. Raises **confidence** where wells exist; optional local means only where QC flags allow — never silent DIY statewide correction.

**Why ahead of Enverus:** Public archive path; relevance 10 in strategy; buys the Texas BHT narrative GEO / BEG-style buyers expect before paid densification.

### 1.3 RRC well density — evidence-exists / O&G co-use context (not attractiveness alone)

**Decision value:** Separates “hot on a model” from “anyone has drilled here / data richness exists.” For next-gen Texas, well density is mostly **confidence** and co-location context (Sage-style reuse narrative), not a thermal substitute.

**KEEP rule:** Do not juice opportunity solely because a county is oilfield-dense.

### 1.4 HIFLD substations (+ optional EIA 860 plants) — infra/offtake depth without GIS sprawl

**Decision value:** Lines-only proximity is a weak interconnection story. Substations upgrade “can we even talk interconnection?” without claiming queue feasibility. EIA plants add soft offtake / host-site adjacency for energy developers.

**KEEP rule:** Still **proxy** language — never “interconnection ready.”

### 1.5 TexNet — risk honesty for EGS narratives

**Decision value:** Prevents over-ranking EGS-leaning corridors near induced-seismicity clusters. Belongs in **confidence / caution flags**, not opportunity juice.

### 1.6 PAD-US — cheap hard friction / exclusion

**Decision value:** Stops embarrassing shortlists into parks / wilderness / GAP statuses that a junior analyst would catch in five minutes. Constraint / gate — not opportunity.

### 1.7 Methodology bump to v0.4 — trust product, not just ETL

**Decision value:** Every thermal spine change without a versioned honesty rewrite recreates the HF/gradient cohort trust wound. Buyers and skeptics treat methodology as the product contract.

### 1.8 What blue defends *keeping* from the shipped product

| Keep | Why |
|------|-----|
| Separate opportunity vs confidence | Prevents fake “truth scores” |
| County screening unit until site scores exist | Solo-dev + JTBD fit |
| IHFC retained as QC / citation | Citable measured points; demote as statewide opportunity spine |
| HIFLD lines as infra baseline | Already shipped; extend, don’t replace blindly |
| Point / AOI = evidence, not site ScreeningScore | Phase 2 honesty locks |
| No parcels / Enverus / ERCOT CEII redistribution in public MVP | Protect focus and ToS |
| Phase 3 automation **blocked** until Data Depth ships | Automating a weak spine amplifies wrong ranks |

---

## 2. Multi-lens “good screening” — datasets that pass

| Lens | Datasets that create value | Why |
|------|----------------------------|-----|
| Geothermal geologist | Stanford T@depth (labeled) + SMU/GDR BHT + IHFC QC | Depth + control density + honesty about model vs measured |
| Project developer | T@depth shortlist + substation/plant adjacency + confidence flags | Changes leasing / partner outreach this quarter |
| Geospatial data scientist | Versioned joins, CRS, methodology_version | Reproducible claims |
| Energy infrastructure analyst | Substations / EIA context; TexNet caution | Grid proximity ≠ interconnection; risk not buried |
| Startup CTO | Public Easy–Medium ingest first | Solo-dev achievability before paid Enverus |

---

## 3. Defend the strategy’s “smallest defensible score stack” (§7B)

Blue endorses the minimum commercially non-embarrassing inputs:

```text
Opportunity ≈ f(T@depth Stanford, transmission/substation proximity)
Confidence  ← f(n_BHT SMU/local, n_IHFC, well_density_RRC, measured_vs_model_flag)
```

Everything else (stress, TexNet, PAD-US, ERCOT xlsx, OFM306, aquifers, GLO, University Lands) is **badge, dossier, gate, or later** — not required to claim Data Depth shipped, unless judgment promotes a cheap gate into NOW.

---

## 4. Competitive landscape alignment (why these datasets, not more GIS)

Industry public emphasis cluster from strategy §5:

1. Temperature at depth → **Stanford + SMU control**  
2. Existing well control → **SMU BHT + RRC density**  
3. Stress / stimulation → valuable later; not mandatory for closed-loop-safer default  
4. Grid proximity / interconnection reality → **lines + substations** (proxy only)  
5. Offtake / colocated demand → **EIA plants** (light)  
6. Land access → **defer** (GLO / UL / parcels)

If (1)–(2) remain thin, UI polish and Phase 3 automation will not save the product.

---

## 5. Blue KEEP list for Data Depth (locks for red/judgment)

1. Lead with **T@depth + denser BHT control**; demote IHFC as statewide opportunity spine  
2. Stanford only as **labeled model layer** with confidence demotion vs measured points  
3. **No DIY statewide BHT→gradient/opportunity** without methodology version + QC gates  
4. RRC density = confidence / context — **not** attractiveness alone  
5. TexNet / PAD-US = risk / exclusion — **not** opportunity juice  
6. Substations / plants = infra/offtake **proxies** — never interconnection / NPV  
7. No ERCOT CEII redistribution, parcels GIS, or Enverus for public MVP **now**  
8. Solo-dev: prefer Easy–Medium public ingest; kill high-complexity nice-to-haves  
9. **Phase 3 blocked** until Data Depth stop criteria met  
10. Bump `methodology_version` to **v0.4** on thermal spine change  

---

## 6. Blue severity on “do nothing”

| Failure mode if Data Depth skipped | Severity |
|------------------------------------|----------|
| Paying developer bounce: “hot at what depth? how many BHT?” | **Critical** |
| Automating Phase 3 on ~10 gradient counties | **Critical** |
| Shipping more UI/site tools without thermal spine | **High** |
| Buying Enverus / parcels before public T@depth path | **High** (wrong spend) |

**Blue one-liner:** Defend Data Depth as the commercial thermal spine — T@depth (honestly labeled) + measured control density + infra proxies — then stop and only then automate.
