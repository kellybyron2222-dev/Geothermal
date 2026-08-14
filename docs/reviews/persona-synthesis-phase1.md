# Persona synthesis — Phase 1 (Texas next-gen geothermal intelligence)

**Simulated reviewers:** ~100  
**Product state reviewed:** County choropleth screening (gradient preferred / heat-flow fallback + transmission proximity); site evaluate → dossier (county context, local IHFC ≤40 km, coarse-grid transmission distance); honest limitations; static app; Texas only.  
**Persona mix:** geothermal developers 25 · energy project developers 20 · infrastructure investors 15 · land investors 10 · domain skeptics/scientists 15 · researchers/students 10 · policymakers 5.

---

## 1. Overall reaction distribution (~100)

| Reaction | Approx. count | Who drives it |
|----------|---------------|---------------|
| **Useful (would try / keep open)** | **32** | Energy developers, land investors, some geo developers, researchers |
| **Lukewarm (credible but thin)** | **28** | Geo developers, infra investors, energy developers |
| **Distrust (overclaims or wrong physics frame)** | **18** | Domain skeptics/scientists, senior geo developers |
| **Confused (what decision does this change?)** | **14** | Policymakers, junior researchers, some land investors |
| **Dismiss / walk away** | **8** | Sophisticated geo developers + hard skeptics |

**Net read:** Early screening curiosity is real; trust and “decision change” remain the bottlenecks. Honesty about limits buys goodwill but does not close the credibility gap on thermal + grid proxies.

---

## 2. Top praise themes (clustered)

1. **Honest scope framing** (~41 mentions)  
   “Not a resource map / not interconnection / not drill advice” lands well. Reduces fear of vendor theater.

2. **Texas / ERCOT beachhead** (~36)  
   Focused geography feels serious vs. continental wallpaper maps.

3. **Click → site dossier** (~33)  
   County screen alone felt abstract; local IHFC neighborhood + county context makes it feel like a workflow, not a poster.

4. **Gradient preferred over heat-flow-only** (~29)  
   Next-gen operators prefer °C/km intuition; labeled fallback is appreciated when present.

5. **Transmission as a second axis** (~27)  
   Even as a coarse proxy, “thermal without wires is tourism” resonates with energy/infra buyers.

6. **Explainable two-factor score** (~22)  
   0.60 / 0.40 formula is auditable; better than black-box “AI geothermal.”

7. **Static / fast / no login** (~18)  
   Good for desk screening and sharing a URL in a diligence thread.

---

## 3. Top criticism themes (clustered, with frequency)

| Theme | ~Freq | Severity |
|-------|-------|----------|
| County unit too coarse for siting | 47 | High |
| Transmission distance ≠ interconnection / capacity / queue | 44 | High |
| Sparse / uneven IHFC control; 40 km radius still regional | 39 | High |
| Heat-flow fallback mixed into same choropleth confuses ranking | 31 | Medium–High |
| No depth target, well cost, or EGS vs closed-loop framing | 28 | High (geo buyers) |
| Score feels arbitrary without calibration stories / known plays | 26 | Medium |
| No land / mineral / surface-use / permitting overlay | 24 | Medium (land + policy) |
| Static snapshot — no refresh date UX prominence / provenance drill-down | 19 | Medium |
| “Intelligence” brand oversells a thin index | 17 | Medium (skeptics) |
| Missing load / offtake / industrial heat demand | 15 | Medium (energy buyers) |
| Policymakers want jobs/equity narrative the tool doesn’t serve | 8 | Low (for MVP) |

---

## 4. Must-haves vs nice-to-haves

### Must-haves (block trust or continued use)

- **Comparable thermal apples-to-apples** — clear map/UI separation when county uses gradient vs heat-flow fallback; never bury the metric switch.
- **Confidence / data density as first-class** — control count and “unknown” counties must drive eye and dossier, not footnotes.
- **Explicit “what decision this supports”** — e.g. shortlist counties for desk work / partner outreach — not “pick a pad.”
- **Grid honesty hardening** — keep proxy language; add at least one non-distance cue later (line voltage class or “coarse grid only”) so experts don’t assume feasibility.
- **Local thermal transparency** — show point neighborhood quality (n, distance to nearest, metric type) in dossier, not just a mean.
- **Methodology version + freeze story** — why 60/40, what would change the rank order.

### Nice-to-haves (enhance, not MVP blockers)

- Dual display of gradient *and* heat flow always
- Known project / lease / announcement pins for orientation
- Depth / temperature-at-depth scenarios (still heuristic)
- Offtake / industrial load or population proxy
- Land / ownership / unitization hints
- Export CSV of shortlist + dossier PDF
- Neighbor-state peek or basin labels (post–Texas lock)
- Policy one-pagers / county economic framing

---

## 5. Quotes (fictional, persona-attributed)

1. **Geothermal developer:** “Finally someone admits this isn’t a resource assessment. I’ll use the map to pick which counties deserve a real geology afternoon.”
2. **Geothermal developer:** “Forty kilometers of IHFC is still basin gossip. Don’t call it a site dossier until I see depth and a well cost story.”
3. **Energy project developer:** “Thermal plus wires is the right instinct for ERCOT. Distance-to-line without queue reality will get juniors in trouble.”
4. **Energy project developer:** “I can brief a VP with this in five minutes. I cannot underwrite with it.”
5. **Infrastructure investor:** “Explainable weights beat magical heat maps. Show me confidence so I don’t overweight empty counties that look hot.”
6. **Land investor:** “Tell me where to start calling landowners. County paint is a start; without surface/mineral hints I’m still guessing.”
7. **Domain skeptic / scientist:** “Gradient preferred is fine. Mixing fallback heat flow into one choropleth without a screaming label is how you mint false rankings.”
8. **Domain skeptic / scientist:** ‘Next-gen geothermal intelligence’ for a two-factor static index is marketing ahead of physics.”
9. **Researcher / student:** “Best teaching demo I’ve seen for ‘screening ≠ assessment.’ I’d assign the methodology page as homework.”
10. **Policymaker:** “Interesting for Texas energy diversification talking points, but I don’t know what action you want from me.”
11. **Geothermal developer (dismissive):** “If I can’t tell whether East Texas ranks high from gradient control or heat-flow fill-in, I’m done.”
12. **Infrastructure investor:** “Static is fine for v0. Broken trust from overclaiming is not.”

---

## 6. What would make sophisticated geothermal developers dismiss the tool

They walk when the product implies **site selection** while delivering **county wallpaper + coarse grid distance**:

1. **Metric contamination** — heat-flow fallback counties ranked beside gradient counties without unmistakable differentiation.
2. **False precision** — a single score presented as opportunity without confidence, nearest-control distance, or “relative Texas only” framing in the critical path of the UI.
3. **Interconnection cosplay** — any copy or visual that reads like deliverability, POI quality, or interconnection readiness from HIFLD distance alone.
4. **No subsurface decision variables** — absence of depth/temperature-at-target, lithology/play context, or even a clear “we don’t do that yet” paired with a narrower claimed job-to-be-done.
5. **Uncalibrated leaderboard** — top counties that contradict known next-gen interest areas with no narrative for why (data sparsity vs real signal).
6. **Brand/job mismatch** — “intelligence platform” language when the artifact is a transparent screening index; they treat overclaim as incompetence.
7. **Workflow dead-end** — click dossier → nowhere to export, compare, or hand to a geologist; feels like a demo, not a desk tool.

**Dismiss threshold (condensed):** *If it can’t prove the ranking is thermally comparable, spatially honest, and decision-scoped, serious operators will treat it as a student map and close the tab.*

---

## Feed-forward (for red/blue + judgment)

| Cluster | Suggested judgment lean |
|---------|-------------------------|
| Metric/fallback clarity + confidence prominence | **Fix now** |
| Sharper job-to-be-done copy (desk shortlist, not pad pick) | **Fix now** |
| Dossier local thermal quality (n, distance, metric) | **Enhance soon** |
| Grid proxy enrichment (voltage class / disclaimer UX) | **Enhance soon** |
| Depth / offtake / land / export | **Defer** |
| Multi-state / policy narrative | **Reject for this phase** |
