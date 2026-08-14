# 1000-persona UI/UX synthesis — post layer toggles

**Date:** 2026-08-14  
**Focus:** **UI/UX only** (discoverability, clutter, trust of chrome, missing affordances, mobile, a11y feel). Not data-science depth.  
**Method:** Simulated ~1000 reviewers; weighted toward primary buyers; clustered feedback with approximate counts (**sum ≈ 1000**).

---

## Weighting (who showed up)

| Persona | Approx. share | n |
|---------|---------------|---|
| Geothermal developers | 22% | 220 |
| Energy project developers | 18% | 180 |
| Land / infra investors | 15% | 150 |
| Researchers / students | 10% | 100 |
| Skeptical GIS / map power users | 12% | 120 |
| Mobile / tablet users | 10% | 100 |
| First-time visitors | 8% | 80 |
| Accessibility-minded | 5% | 50 |
| **Total** | **100%** | **1000** |

---

## Cluster totals (sum ≈ 1000)

| Cluster | ≈n | Share |
|---------|-----|-------|
| **Praise** | 168 | 16.8% |
| **Confusion** | 312 | 31.2% |
| **Distrust of chrome** | 198 | 19.8% |
| **Missing must-haves** | 227 | 22.7% |
| **Performance feel** | 95 | 9.5% |
| **Total** | **1000** | 100% |

---

## 1) Praise (~168)

**Who:** Mostly geothermal developers + researchers who already wanted overlays.

| Theme | ≈n | Representative voice |
|-------|-----|----------------------|
| “Finally can toggle score vs heat” | 55 | Geo developer — fill modes useful once understood |
| Basement “not in ranking” label | 38 | Skeptical scientist — honesty near geology |
| Evidence mode greys score | 32 | Energy developer — stops fake site quality from colors |
| Focus/Ignore checklist | 25 | Land investor — clear leave-behind |
| Unavailable basement state | 18 | GIS user — better than broken layer |

**Blue takeaway:** Keep honesty adjacent to layers; keep evidence neutrality; keep defaults conservative.

---

## 2) Confusion (~312) — dominant cluster

**Who:** First-timers, investors, many energy developers, mobile users.

| Theme | ≈n | Representative voice |
|-------|-----|----------------------|
| Both fill boxes ON → “why did score vanish?” | 88 | First-time visitor / energy developer |
| List cohort vs colorful statewide map | 72 | Geo developer comparing top-10 to map |
| What do orange dots mean? (no legend) | 54 | Investor / researcher |
| Basement on but “nothing changed” | 41 | GIS user with score fill still opaque |
| Point check ON + layer toggles “broken” | 35 | Mobile / first-timer |
| T@depth vs Screening score vocabulary | 22 | Land investor |

**Red takeaway:** F1–F4 and F7–F8 are not edge cases — they are the majority failure mode.

---

## 3) Distrust of chrome (~198)

**Who:** Skeptical GIS, accessibility-minded, weary buyers who read every banner.

| Theme | ≈n | Representative voice |
|-------|-----|----------------------|
| Too many warnings → “hiding weak product” | 62 | Energy developer / investor |
| Residual banner always there → banner blindness | 48 | Repeat visitor (buyer) |
| Checkbox UI that doesn’t stack like GIS | 41 | Skeptical GIS |
| “Lower/Higher” score legend feels hand-wavy | 27 | Researcher |
| Header Point/AOI as linkish toggles feel soft | 20 | First-timer |

**Judgment pressure:** Do **not** delete honesty; **compress** it. Fix deceptive layer semantics before adding more caveats.

---

## 4) Missing must-haves (~227)

**Who:** GIS users, geo developers, mobile, a11y, investors wanting spatial decisions.

| Theme | ≈n | Representative voice |
|-------|-----|----------------------|
| Complete legend (points + basement + numeric score) | 74 | GIS + researchers |
| Exclusive fill mode control (radio/segmented) | 48 | GIS + geo developers |
| Collapse / hide Layers on small screens | 39 | Mobile users |
| Cohort ↔ map sync (dim or explicit cue) | 28 | Geo / energy developers |
| Thermal point hover values | 18 | Researchers |
| Focus/Ignore visible on map | 12 | Investors |
| Keyboard / non-color legend cues | 8 | Accessibility-minded |

**Director note:** Cap NOW; many of these are Enhance soon. Priority = legend + fill grammar + sync cue + chrome volume + mobile collapse.

---

## 5) Performance feel (~95)

Not “map FPS” — **time-to-understanding**.

| Theme | ≈n | Representative voice |
|-------|-----|----------------------|
| Chrome first, map second | 40 | First-timer / mobile |
| Too many panels before a decision | 28 | Investor |
| Layers + legend + nav clutter NW/SW | 17 | Mobile / tablet |
| Initial multi-fetch → blank then sudden chrome | 10 | Accessibility / patient users |

---

## Cross-cuts by persona (signals)

| Persona | Top signal |
|---------|------------|
| Geothermal developers | Want fill modes + cohort/map sync; praise toggles once explained |
| Energy developers | Banner fatigue + mode confusion; need faster “what am I looking at?” |
| Land/infra investors | Focus/Ignore praise; map doesn’t show their marks; jargon hurdle |
| Researchers | Want point values + legend science; less angry about chrome |
| Skeptical GIS | Checkbox lie + incomplete legend = instant distrust |
| Mobile | Layer card covers map; stacked panes; header overload |
| First-timers | Confused by dual fills + Point check; bounce risk |
| Accessibility | Color-only heat; popups not keyboard; dense text |

---

## Persona → severity bridge

| Persona pressure | Maps to red IDs |
|------------------|-----------------|
| Confusion 312 | F1, F3, F4, F7, F8 |
| Missing must-haves 227 | F2, F6, F9, F11 |
| Distrust chrome 198 | F5, F1, F2 |
| Performance feel 95 | F5, F6, F10, F13 |
| Praise 168 | Keep blue list |

---

## One-liner

**~53% of simulated users land in Confusion or Distrust**; praise is real but minority. Ship is scientifically defensible and UX-incomplete.
