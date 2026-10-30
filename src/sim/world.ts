import { stepCarriers } from './carriers';
import { observe, stepPlayer } from './player';
import { hear } from './rumours';
import type { Route, Scenario, World } from './types';

/** Routes wind, so they're longer than the straight line between towns. */
export const ROUTE_WINDING = 1.2;

export function createWorld(scenario: Scenario, seed: number): World {
  const world: World = {
    time: 0,
    endsAt: scenario.hours,
    rng: { seed },
    towns: {},
    routes: {},
    rumours: {},
    townState: {},
    carriers: {},
    player: {
      money: scenario.player.money,
      speed: { ...scenario.player.speed },
      location: { at: 'town', town: scenario.player.town },
      known: {},
    },
    log: [],
  };

  for (const town of scenario.towns) {
    world.towns[town.id] = town;
    world.townState[town.id] = { claims: {} };
  }
  for (const r of scenario.routes) {
    const [ax, az] = world.towns[r.a].position;
    const [bx, bz] = world.towns[r.b].position;
    const length = r.length ?? Math.round(Math.hypot(bx - ax, bz - az) * ROUTE_WINDING * 10) / 10;
    world.routes[r.id] = { ...r, length } satisfies Route;
  }
  for (const c of scenario.carriers) {
    const { departsAt, ...rest } = c;
    world.carriers[c.id] = { ...rest, stop: 0, location: { at: 'town', town: c.schedule[0] }, dwellUntil: departsAt, cargo: {} };
  }
  for (const r of scenario.rumours) {
    const { stance, knownByPlayer, ...rumour } = r;
    world.rumours[r.id] = { ...rumour, createdAt: 0 };
    hear(world, r.origin, { rumourId: r.id, truth: r.truth, stance, hops: 0 }, { name: 'witnesses', trust: 0.8 });
    if (knownByPlayer) world.player.known[r.id] = true;
  }
  observe(world);
  return world;
}

export function isOver(world: World): boolean {
  return world.time >= world.endsAt;
}

/** Advance the world by dt game hours. Call with a fixed dt for reproducible results. */
export function step(world: World, dt: number): void {
  if (isOver(world)) return;
  world.time += dt;
  stepCarriers(world, dt);
  stepPlayer(world, dt);
  observe(world);
}
