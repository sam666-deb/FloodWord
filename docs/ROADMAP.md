# Roadmap

Risk first: each milestone answers the scariest open question before content is built on top
of it. This follows the build order in [design/01-game-brief.md](design/01-game-brief.md) §6, adapted
for the browser stack.

## M0: Foundation ✅

- [x] Vite + React + TypeScript + React Three Fiber project
- [x] Pure, deterministic simulation core with tests
- [x] Layered architecture with ESLint-enforced boundaries ([ARCHITECTURE.md](ARCHITECTURE.md))

## M1: Grey-box rumour test (2 weeks), current milestone

**Question: is racing or intercepting a rumour fun?** If not, change the design before going further.

- [x] 3 towns, 2 carriers (walker, ferry), 1 harmful rumour ([src/data/greybox.ts](../src/data/greybox.ts))
- [x] Rumours move only with carriers, distort per hop, and stay hidden until seen
- [x] Travel, speak first ("tell your side"), intercept and bribe
- [x] Town reputation and an end-of-scenario result
- [x] Auto-pause when an interception becomes possible
- [ ] Playtest with 3–5 people. Watch, don't explain. Write notes in `docs/playtest-log.md`
- [ ] Tune numbers: speeds, trust, `FIRST_IMPRESSION`, bribe cost, scenario length
- [ ] Try one twist if it's flat: a weather event that closes the river for a few hours
- [ ] **Go/no-go decision** recorded in the playtest log

Exit criteria: most testers try to race or intercept on their own, and say they'd play another round.

## M2: Beliefs and reputation (3 weeks)

- [ ] Named NPCs per town with their own beliefs `{rumourId, confidence, source}` (brief §3.2)
- [ ] Source trust per NPC (priest > drunk > rival faction)
- [ ] Reputation labels from belief mix: Hero, Liar, Ghost, Thief, Saviour
- [ ] NPCs react differently in dialogue based on what reached them
- [ ] Save/load (versioned JSON in localStorage)

## M3: Prologue + Act I vertical slice (4 weeks)

- [ ] inkjs integration; prologue and Act I scripts
- [ ] Real low-poly art for Crossing and Saltmouth; Kit; the courier
- [ ] The "news of your own death" opening as the rumour-map tutorial
- [ ] D1 (The Seal) and D2 (The Ram); the systemic Reveal choice
- [ ] Rumour map layer: moving glyphs for known rumours

## M4: itch.io demo

- [ ] Opt-in analytics: the events in brief §7
- [ ] itch.io page, browser build, feedback link
- [ ] Devlog 1: "I'm making a game where gossip is a physical object"

## M5: Factions and weather (4 weeks)

- [ ] Faction utility AI with an on-screen score table for debugging
- [ ] Weather: storms close rivers, fog slows roads; flood-season clock

## M6: Acts II–III and all endings (6 weeks)

- [ ] Port ending rules to `src/sim/endings.ts`; a test asserts the same distribution as `ending_sim.py`
- [ ] D3–D6, 7 endings, 3 Kit variants, towns-saved epilogue

## M7: Polish and release (3 weeks)

- [ ] Playtests, accessibility (text size, colour-blind-safe reputation colours), audio
- [ ] Tauri desktop builds for Windows and macOS
- [ ] Full release: pay-what-you-want with a minimum

Total: about 22 weeks of focused work.
