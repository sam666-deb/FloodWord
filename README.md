# Floodword: One Day Late

An open-world strategy game where news travels by hand. You're a courier in a river delta who
can outrun your own reputation, intercept the truth, or start lies that travel faster than you do.

Built for the browser with React, three.js (React Three Fiber) and TypeScript.

## Run it

Requires Node 20.19 or newer.

```sh
npm install
npm run dev        # http://localhost:5173
npm run check      # typecheck + lint + tests
npm run build      # static build in dist/, ready for itch.io
```

## How to play the grey-box (Milestone 1)

A rumour that you robbed a caravan is leaving Crossing. Before nightfall on day 2, keep as many
towns as you can on your side.

- **Travel:** click a neighbouring town, or use the buttons on the left.
- **Tell your side:** in a town, deny a rumour you know about. If you get there before the rumour,
  your version is the first impression.
- **Intercept:** catch a carrier on the road and bribe them to forget. The game pauses when you're in range.
- A floating diamond above a carrier means it's carrying a rumour you know about (red is harmful, green is helpful).
- Tick **Debug: reveal hidden rumours** to see everything the simulation is doing.

## Docs

| | |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Layers, simulation rules, how the design maps to code |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Milestones M0–M7 and what's next |
| [docs/design/](docs/design/) | Game brief, story, decisions and endings, name choice, ending simulator |
