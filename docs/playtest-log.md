# Playtest log: M1 grey-box

**Question:** is racing or intercepting a rumour fun?

**Exit criteria:** most testers try to race or intercept on their own, and say they'd play another round.

**Protocol:** watch, don't explain. Give only "You're a courier. Someone's spreading a story about you."
Note what they try, where they hesitate, and what they say out loud.

## Baseline numbers (30 Oct 2026)

| Setting | Value | Where |
| --- | --- | --- |
| Scenario length | 36 h | `src/data/greybox.ts` |
| Pell (walker) speed / trust / departs | 4 / 0.6 / 0.5 h | `src/data/greybox.ts` |
| Marigold (boat) speed / trust / departs | 8 / 0.7 / 1 h | `src/data/greybox.ts` |
| Player speed road / river | 6 / 5 | `src/data/greybox.ts` |
| Player money | 30 | `src/data/greybox.ts` |
| `BRIBE_COST` | 10 | `src/sim/commands.ts` |
| `PLAYER_TRUST` | 0.8 | `src/sim/commands.ts` |
| `FIRST_IMPRESSION` | 0.6 | `src/sim/rumours.ts` |
| `DISPROOF` | 0.5 | `src/sim/rumours.ts` |
| `DISTORTION_CHANCE` | 0.5 | `src/sim/rumours.ts` |
| `REINFORCEMENT` | 0.1 | `src/sim/rumours.ts` |
| `INTERCEPT_RANGE_KM` | 1.5 | `src/sim/player.ts` |
| `DWELL_HOURS` | 1 | `src/sim/carriers.ts` |
| `ROUTE_WINDING` | 1.2 | `src/sim/world.ts` |

## Sessions

<!-- Copy this block per tester.

### Tester N: <date>, <experience with strategy games>

- **First 2 minutes:** what did they do without being told?
- **Raced or intercepted unprompted?** yes / no; how?
- **Confusions:**
- **Quotes:**
- **Result:** town reputations at the end
- **Play another round?** yes / no
-->

## Tuning changes

<!-- date: what changed, why, which session prompted it -->

## Go/no-go

<!-- Decision, date, and reasoning against the exit criteria. -->
