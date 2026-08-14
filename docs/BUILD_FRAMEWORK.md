# Build Framework

This project uses a deliberate build–critique–judge–simulate loop.

Cursor rule: `.cursor/rules/build-framework.mdc` (always apply).

---

## Loop

```text
1 Parallel build
2 Red team / Blue team deliberation
3 Judgment director (now / soon / defer / reject)
4 Iterate 2–3 on implementation
5 Simulate ~100 persona reviewers → feedback clusters
6 Re-run 2–3 on clusters until judgment stops the phase slice
```

---

## Roles

| Role | Job |
|------|-----|
| Parallel builders | Ship the slice fast via concurrent agents/workstreams |
| Blue team | Defend value: what works for “where & why” decisions |
| Red team | Attack: false confidence, scope creep, UX failure, science risk |
| Judgment director | Prioritize: now / soon / defer / reject; define stop |
| Persona panel | ~100 simulated reviewers; cluster feedback |

---

## Persona mix (approximate weights)

| Persona | Weight |
|---------|--------|
| Geothermal developer | 25% |
| Energy project developer | 20% |
| Infrastructure investor | 15% |
| Land investor | 10% |
| Domain skeptic / geothermal scientist | 15% |
| Researcher / student | 10% |
| Policymaker | 5% |

---

## Review artifact template

Each cycle creates files in `docs/reviews/YYYY-MM-DD-<slice>/`:

1. `01-blue-team.md` — keep / strengths  
2. `02-red-team.md` — risks / failures / enhancements  
3. `03-judgment.md` — now / soon / defer / reject + stop criteria  
4. `04-persona-synthesis.md` — clustered feedback from ~100 reviewers  
5. `05-judgment-after-personas.md` — updated director call  

---

## Stop rule

Judgment declares the slice **done for this phase** when:

- Primary JTBD for the slice is met  
- Critical red-team issues are fixed or explicitly accepted  
- Remaining asks are deferred with rationale  
- Further iteration would not materially improve decision quality
