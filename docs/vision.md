# Vision

**Product:** Geothermal intelligence and prospect discovery  
**Beachhead:** Texas / ERCOT  
**Play (locked):** Next-gen geothermal (closed-loop / AGS and open-loop / EGS)  
**Related:** [DECISIONS.md](DECISIONS.md) · [MVP.md](MVP.md)

---

## Problem statement

Geothermal developers and energy investors in Texas lack a fast, trustworthy way to decide **where to focus next-gen development effort and why**.

Relevant evidence exists—well temperatures, heat flow, transmission, geology—but it is scattered across RRC downloads, academic maps, ERCOT GIS, and internal spreadsheets. Assembling it into a comparable, defensible shortlist takes weeks of desk work and still produces opaque “gut feel” rankings.

The market does not need another GIS with more layers. It needs **explainable opportunity intelligence**.

---

## Market need

Texas is heating up as a next-gen geothermal theater (sedimentary basins, deep heat, dense energy infrastructure, ERCOT load growth)—not as a classic hydrothermal province.

Buyers need:

1. **Discovery** — a short list of focus regions, not a blank map  
2. **Comparability** — same factors, same units, same rules statewide  
3. **Explainability** — why zone A outranks zone B  
4. **Confidence** — where data is thin, say so  
5. **Speed** — hours, not weeks, to a first focus set  

Incumbent tools (Enverus, BEG products, SMU maps, internal ArcGIS) provide pieces. None are optimized as a **next-gen geothermal decision product** for Texas with transparent scoring as the core UX.

---

## Target users

### Primary

| User | Job |
|------|-----|
| Geothermal developers | Prioritize exploration / leasing / partner outreach |
| Energy project developers | Find geothermal options alongside other energy assets |
| Infrastructure investors | Identify regions where resource + grid context justify diligence |
| Land investors | Later: land coincident with geothermal potential (Phase 2+) |

### Secondary (do not drive MVP UX)

- Researchers and students  
- Policymakers  

---

## User pain points

1. **Fragmented data** — wells, heat, faults, and transmission live in different portals and formats  
2. **No shared ranking language** — every shop invents its own suitability model  
3. **Black-box or overclaimed maps** — heat-in-place and ML scores without lineage destroy trust  
4. **GIS ≠ decision** — layers look productive; they do not answer “where next?”  
5. **Texas ≠ Nevada** — hydrothermal playbooks mislead; next-gen needs different evidence  
6. **Infrastructure ignored or bolted on** — geology-only tools miss offtake reality; grid-only tools miss resource  

---

## Vision

Become the leading **geothermal intelligence and prospecting platform**: the system developers and investors use to discover, evaluate, and eventually model geothermal opportunities—starting in Texas/ERCOT and expanding only after the discovery loop is trusted.

Long-term capabilities (resource assessment, parcels, 3D, reservoir, economics, AI generation, portfolio) are real. They are **not** the starting product.

**North-star question (every feature):**  
*Where should I focus development efforts, and why?*

---

## Value proposition

**For** geothermal and energy developers in Texas  
**Who** waste weeks assembling partial evidence into gut-feel rankings  
**Our product** is an explainable opportunity discovery platform  
**That** ranks focus zones and shows the drivers, confidence, and sources  
**Unlike** generic GIS viewers or opaque suitability heatmaps  
**We** optimize for decision speed and technical credibility—not layer count.

---

## Success metrics

### Product (MVP)

- User can name **3 focus regions** and **3 ignore regions** after one session  
- User can restate **why** without reading a legend  
- Time from open → shortlist &lt; 30 minutes (target: &lt; 10)  
- Every factor has a **citation and confidence flag**  

### Business (early)

- 3–5 target developers willingly review and critique the ranking  
- At least one would use the ranking to prioritize desk work  
- Willingness-to-pay signal (even informal) from a primary buyer—not only researchers  

### Anti-metrics (do not optimize)

- Number of map layers  
- Visual polish of basemap  
- Geographic coverage beyond Texas  

---

## Risks and assumptions

### Assumptions (challenge these)

| Assumption | Risk if wrong |
|------------|----------------|
| Public BHT / heat-flow proxies are good enough for relative regional ranking | Rankings lose credibility with technical buyers |
| Developers want statewide discovery before AOI tools | We build the wrong first workflow |
| Transparent heuristics beat ML for trust | Sophisticated buyers dismiss “simple” scores |
| ERCOT proximity is a meaningful early filter | Colocation signal is noise without interconnection depth |
| A solo founder can ship a scored Texas product in 30–45 days | Scope creeps into data engineering swamp |

### Product risks

- Becoming a GIS viewer  
- Overclaiming resource quality from sparse/uncorrected BHT  
- Mixing play types into one unexplainable score  
- Building for researchers who will not pay  

### Market risks

- Tiny sophisticated buyer set already embedded in Enverus / internal GIS  
- Next-gen geothermal timelines longer than investor patience  

### Mitigation stance

Ship the **smallest ranked, explained Texas list**; under-claim; cite everything; defer layers that do not change rank.
