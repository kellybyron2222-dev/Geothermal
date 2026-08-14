# Left rail IA fix — missed basics (2026-08-14)

## Honest miss

Prior declutter persona optimized header/detail chrome and **under-weighted layout ownership**:

1. Ranked list as permanent equal column  
2. Layer toggles floating on the map  

Those are table-stakes geospatial IA. Corrected now.

## Answers

| Question | Answer |
|----------|--------|
| Need ranked list? | **Yes** for screening shortlist — but not always full-width |
| Collapsible? | **Yes** — whole left rail Hide → thin strip; ranks Show/Hide inside rail |
| Layers on map? | **No** — docked in left rail; map keeps legend only |

## Shipped

- `LeftRail`: layers + ranked list; rail collapse  
- Layer controls removed from map float  
- Site/evidence mode still keeps left rail for layers  
