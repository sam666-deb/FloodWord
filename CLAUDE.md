# Floodword: notes for Claude

Browser game: an open-world strategy game where rumours physically travel with carriers.
Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) before changing code, and
[docs/ROADMAP.md](docs/ROADMAP.md) for the current milestone.

## Commands

- `npm run dev`: dev server
- `npm run check`: typecheck + lint + tests. Run before saying a change is done.
- `python docs/design/tools/ending_sim.py`: ending balance simulator (story design)

## Rules that matter

- `src/sim` is pure TypeScript: no React, three.js, zustand or `src/data` imports (ESLint enforces this).
  World state stays plain JSON data; randomness only via `nextRandom(world.rng)`.
- The player changes the world only through `apply(world, command)` in `src/sim/commands.ts`.
- Render code reads the world in `useFrame`; HUD code reads `snapshot`. Neither mutates the world.
- New gameplay rules get a scenario test in `src/sim/*.test.ts`.
- Design docs in `docs/design/` are the source of truth for story and systems. If code and docs
  disagree, ask which should change.

## Project history (moved here from `D:\Personal Project\Game draft`, 30 Oct 2026)

- The design was drafted in `Game draft/`, which is now superseded by `docs/design/` here.
- A review of the draft fixed: The Open River vs Kit-leaves contradiction (the Kit variant now
  replaces any Kit beat), silence endings after a public confession (Guild + full confession now goes to
  The Iron Gate), how the courier learns about a kept-sealed letter, Sabe as the one who paid for the
  delay (Teodor learned it from a Guild clerk's ledger copy), Kit's move to Reedwater at the end of Act II,
  D6 now affecting only the towns-saved epilogue, and the kept seal giving Ione's boat (4 towns
  instead of 3). Current ending balance: Iron Gate 32.6% (close to the 35% cap; watch in playtests).
- Engine choice: switched from Unity to React + three.js (R3F) because the game is systems- and
  UI-heavy with light 3D, browser-first on itch.io (small fast builds), and inkjs keeps the Ink plan.
- `floodword.itch.io` and `floodword.com` both appeared free on 30 Oct 2026 but are not registered yet.

## Current status

M0 is done and M1 (grey-box rumour test) is playable. Next: playtest it, tune numbers, record go/no-go
in `docs/playtest-log.md` (template and baseline numbers are in place).
