# Floodword: One Day Late

Design workspace for an open-world strategy game where news travels by hand, and a courier
who delivered one letter too late gets a second chance.

| File | Contents |
|---|---|
| [01-game-brief.md](01-game-brief.md) | Pillars, core loop, systems design (rumour engine, NPC beliefs, faction AI), scope analysis, build order, analytics plan, itch.io launch plan |
| [02-story.md](02-story.md) | World, factions, characters, prologue → Act III, and why the story works |
| [03-decisions-and-endings.md](03-decisions-and-endings.md) | All 6 decisions, 7 endings and 3 Kit variants, flowchart, and the balance analysis |
| [04-name-candidates.md](04-name-candidates.md) | Scored name options and the conflicts checked so far |
| [tools/ending_sim.py](tools/ending_sim.py) | Enumerates every decision path and reports the ending distribution (from the project root: `python docs/design/tools/ending_sim.py`; `python3` on macOS/Linux) |

## Status

- [x] Concept, systems and scope
- [x] Story draft
- [x] Decisions and endings, balanced by simulation
- [x] Name chosen: *Floodword: One Day Late*
- [x] Check that the itch.io URL and a domain are free (both appear free, 30 Oct 2026)
- [ ] Register `floodword.itch.io` and `floodword.com` before announcing
- [x] Engine chosen: React + three.js in the browser (see brief §5)
- [ ] Grey-box rumour prototype playtested (built; see [../ROADMAP.md](../ROADMAP.md) M1)
