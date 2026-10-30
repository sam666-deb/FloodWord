# Game Brief: *Floodword: One Day Late*

An open-world strategy game where your reputation moves at walking speed. You are a courier in
a river delta where news only spreads when someone physically carries it, so you can outrun your
own reputation, intercept the truth, or start lies that travel faster than you do.

The title comes from the story. See [04-name-candidates.md](04-name-candidates.md) for why it was chosen.

---

## 1. Design pillars

Every feature has to support at least one of these, or it gets cut.

| Pillar | Meaning | Test question for any feature |
|---|---|---|
| **News is physical** | Information is an object that moves across the map | Does this make the spread of information visible or playable? |
| **Every choice echoes** | Decisions change who believes what, and where | Will the player see a consequence somewhere else, later? |
| **A world that moves without you** | Factions act on their own goals | Would this still happen if the player stood still? |
| **Small but deep** | 6 towns built richly beat 60 empty ones | Does this add depth to existing places, or just more map? |

**Analysis: why these four.** Open-world solo projects usually fail by expanding the map instead
of deepening its systems. The pillars push all effort into the one system no other game has (physical
rumours) and the payoff players remember (consequences). That keeps the scope finite and the
hook sharp.

---

## 2. The core loop

```
Arrive at a town → read what people believe about you → pick jobs, deals or schemes
      ↑                                                            ↓
Rumours spread along roads and rivers ← witnesses, merchants and birds carry the news ← you act
```

- **Moment-to-moment**: travel, talk, trade, sneak, deliver.
- **Hour-to-hour**: plan routes around rumours: race them, intercept them, or delay them.
- **Whole-game**: the story's major decisions (see [03-decisions-and-endings.md](03-decisions-and-endings.md)).

---

## 3. Systems design

### 3.1 Rumour engine (the heart of the game)

Every notable act creates a **Rumour**:

```
Rumour {
  id, eventType          // "robbed caravan", "delivered letter", "seen alive"
  subject, actor         // who it's about
  truth: 0..1            // 1 = exactly what happened
  heat: 0..1             // how juicy it is; affects spread speed and priority
  origin: townId, time
  hops: int              // how many carriers it has passed through
}
```

- **Carriers** are real agents on the map: witnesses who walk to the next town, merchant boats,
  messenger birds and the Post (courier network). A rumour only moves when a carrier moves.
- **Distortion**: each hop has a chance to lower `truth` or change details (the amount stolen grows,
  the culprit changes). Low-`truth` rumours can be disproved; high-`heat` ones spread faster.
- **Interception**: carriers can be bribed, delayed, robbed or outrun. Weather closes routes.
- **Visibility**: a map layer shows rumours you know about as moving glyphs. Rumours you don't
  know about stay hidden, so information about the information becomes a resource too.

**Analysis: why a graph of agents, not a global timer.** A timer ("everyone knows in 2 days")
can't be gamed. Agents can be chased, bribed and blocked. That turns the core idea into actual
strategy instead of flavour, and it's cheap: about 6 town nodes and around 20 carrier agents is
well within budget for a browser game.

### 3.2 NPC memory and belief

Each named NPC holds a list of **Beliefs**: `{rumourId, confidence, source}`.
- Confidence depends on how much they trust the source (a priest > a drunk > a rival faction).
- Conflicting beliefs are resolved by confidence, so the player can win back an NPC with stronger evidence.
- **Town reputation** = the weighted average of residents' beliefs about the player.
  This is shown as *what this town thinks you are*: Hero, Liar, Ghost, Thief, Saviour.

### 3.3 Faction AI

Three factions (see the story), each running a simple **utility AI** every in-game day:
score possible actions (raise tolls, send envoys, sabotage, ally) by goals × current beliefs,
then act. Factions also create rumours, so the world generates news without the player.

**Analysis: why utility AI and not behaviour trees.** Factions need to weigh competing goals
(money vs. safety vs. pride), and utility scoring does that in a few hundred lines, is easy to
debug with a score table on screen, and gives the emergent "they made a smart move" feeling.

### 3.4 Time, weather and the flood clock

- A day/night cycle and a **flood season** countdown that drives Act III.
- Storms close rivers (rumours stop) and fog slows roads. Weather is the natural "window of
  opportunity" mechanic.

---

## 4. Scope analysis

| Feature | Cost (weeks) | Player value | Decision |
|---|---|---|---|
| Rumour engine and carriers | 4 | Core identity | **Must** |
| NPC beliefs and town reputation | 3 | Makes choices visible | **Must** |
| Branching story (prologue, 3 acts, 7 endings) | 6 | Emotional hook | **Must** |
| Faction utility AI | 3 | World moves without you | **Must** |
| Weather and flood clock | 1.5 | Strategic windows, Act III tension | Should |
| Combat | 4+ | Low; violence isn't the point | **Cut** (handled through choices and consequences) |
| Crafting / base building | 4+ | Off-theme | **Cut** |
| Voice acting | — | High cost | Cut (text plus sound design) |

**The features above total 17.5 weeks. With the grey-box test and final polish, the build order in §6
comes to about 22 weeks of focused work.** Cutting combat is the single biggest
scope saving, and it also strengthens the theme: in this game *words* are the weapon.

---

## 5. Tech stack

- **TypeScript + React + three.js** (via React Three Fiber), built with Vite. Top-down 3D with a
  low-poly, painterly look (cheap to make, looks intentional).
- **Ink** (by Inkle) for branching dialogue, run with `inkjs`, its official JavaScript runtime. It keeps
  the story text outside the code.
- A pure TypeScript simulation (rumours, beliefs, factions) with plain-data scenarios for towns,
  carriers and rumour types. See [../ARCHITECTURE.md](../ARCHITECTURE.md).
- **Browser build** for itch.io (browser play gets far more clicks), plus Windows/macOS downloads via Tauri.

**Why not Unity (decided 30 Oct 2026):** the game is mostly systems and UI with light 3D, and it
targets the browser first. A three.js build is a few hundred KB and loads in seconds, where Unity
WebGL builds are large and weak on mobile. React is well suited to the dialogue, map and reputation
UI, and inkjs keeps the Ink plan. What we give up is Unity's scene editor, so towns are laid out in Blender or in data.

---

## 6. Build order (risk first)

The riskiest question is "**is chasing rumours actually fun?**", so it gets answered before any story is built.

1. **Grey-box rumour test (2 weeks)**: 3 cubes as towns, 1 carrier, the player can race or
   intercept it. If racing a rumour isn't fun here, change the design before going further.
2. **Beliefs and reputation (3 weeks)**: NPCs react differently based on what reached them.
3. **Prologue and Act I vertical slice (4 weeks)**: real art for 2 towns, Kit, the letter, the first 2 decisions.
4. **itch.io demo release** with a devlog. Gather feedback and analytics (see §7).
5. **Factions and weather (4 weeks)**.
6. **Acts II–III and all endings (6 weeks)**.
7. **Polish, playtests, full release (3 weeks)**.

---

## 7. Analytics: measure every step

Use an anonymous, opt-in event log (a simple HTTP endpoint that receives batched command logs) to answer design
questions with data instead of guesses:

| Question | Event / metric | Healthy target |
|---|---|---|
| Do players understand rumours? | % who intercept or race a rumour in the first 30 min | > 60% |
| Are decisions balanced? | Choice split at each major decision | No option < 10% or > 75% |
| Are endings reachable? | Ending distribution across players | Every ending ≥ 3% |
| Where do players quit? | Last checkpoint before quitting | No single drop-off spike > 20% |
| Is the hook working? | Demo → itch.io follow/wishlist rate | > 5% |

Each build's results go into a `playtest-log.md` in this folder. Decide what to change from the
numbers, then playtest again.

---

## 8. itch.io launch plan

1. **Devlog 1**: "I'm making a game where gossip is a physical object" (GIF of a rumour glyph travelling).
2. Submit the grey-box version to a game jam with a matching theme to get early feedback.
3. Release the **Prologue + Act I demo** free, in the browser, with a feedback link.
4. Monthly devlogs: one system per post (rumour engine, belief AI, the branching story).
5. **Full release**: pay-what-you-want with a minimum price. Ask a few YouTubers who cover narrative indies for coverage.
