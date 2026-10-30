import type { Location, Route, TownId, World } from './types';

export function otherEnd(route: Route, town: TownId): TownId {
  return route.a === town ? route.b : route.a;
}

export function routesFrom(world: World, town: TownId): Route[] {
  return Object.values(world.routes).filter((r) => r.a === town || r.b === town);
}

export function routeBetween(world: World, a: TownId, b: TownId): Route | undefined {
  return Object.values(world.routes).find((r) => (r.a === a && r.b === b) || (r.a === b && r.b === a));
}

/** Map position (x, z) in km. */
export function locationPoint(world: World, location: Location): [number, number] {
  if (location.at === 'town') return world.towns[location.town].position;
  const route = world.routes[location.routeId];
  const from = world.towns[location.from].position;
  const to = world.towns[location.to].position;
  const t = Math.min(1, location.distance / route.length);
  return [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t];
}

/** Distance along a route measured from route.a, so two travellers on it can be compared. */
export function offsetFromA(world: World, location: Location & { at: 'route' }): number {
  const route = world.routes[location.routeId];
  return location.from === route.a ? location.distance : route.length - location.distance;
}
