import { offsetFromA } from './geometry';
import { logEvent } from './log';
import type { Carrier, World } from './types';

/** How close (km) the player must be to a carrier on the same route to see its cargo or intercept it. */
export const INTERCEPT_RANGE_KM = 1.5;

export function stepPlayer(world: World, dt: number): void {
  const loc = world.player.location;
  if (loc.at !== 'route') return;
  const route = world.routes[loc.routeId];
  loc.distance += world.player.speed[route.kind] * dt;
  if (loc.distance >= route.length) {
    world.player.location = { at: 'town', town: loc.to };
    logEvent(world, `You arrive at ${world.towns[loc.to].name}.`, true);
  }
}

/** Carriers sharing the player's route and within range. */
export function carriersInRange(world: World): Carrier[] {
  const loc = world.player.location;
  if (loc.at !== 'route') return [];
  const here = offsetFromA(world, loc);
  return Object.values(world.carriers).filter((c) => {
    const cl = c.location;
    return cl.at === 'route' && cl.routeId === loc.routeId && Math.abs(offsetFromA(world, cl) - here) <= INTERCEPT_RANGE_KM;
  });
}

/** The player learns what the town around them believes, and what nearby carriers carry. */
export function observe(world: World): void {
  const { player } = world;
  if (player.location.at === 'town') {
    for (const id of Object.keys(world.townState[player.location.town].claims)) player.known[id] = true;
  }
  for (const carrier of carriersInRange(world)) {
    for (const id of Object.keys(carrier.cargo)) player.known[id] = true;
  }
}
