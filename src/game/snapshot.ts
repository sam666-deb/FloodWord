import {
  BRIBE_COST,
  interceptTargets,
  isOver,
  otherEnd,
  reputation,
  reputationLabel,
  speakTargets,
  travelOptions,
  type GameEvent,
  type RouteKind,
  type World,
} from '../sim';

/** The day starts at dawn, like the prologue. */
const START_HOUR = 6;

/**
 * A plain, read-only view of the world for the React UI. Rebuilt a few times a second,
 * so components re-render from this instead of from the mutable World.
 */
export interface Snapshot {
  time: number;
  clock: string;
  ended: boolean;
  money: number;
  bribeCost: number;
  location: string;
  towns: { id: string; name: string; reputation: number; label: string }[];
  travelOptions: { routeId: string; to: string; toName: string; kind: RouteKind; hours: number }[];
  speakOptions: { rumourId: string; text: string }[];
  interceptOptions: { carrierId: string; name: string }[];
  log: GameEvent[];
}

export function formatClock(time: number): string {
  const total = START_HOUR + time;
  const day = Math.floor(total / 24) + 1;
  const hour = Math.floor(total % 24);
  const minute = Math.floor((total % 1) * 60);
  return `Day ${day}, ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function describeLocation(world: World): string {
  const loc = world.player.location;
  if (loc.at === 'town') return `In ${world.towns[loc.town].name}`;
  const route = world.routes[loc.routeId];
  const left = (route.length - loc.distance) / world.player.speed[route.kind];
  return `On the ${route.kind} to ${world.towns[loc.to].name} (${left.toFixed(1)}h left)`;
}

export function makeSnapshot(world: World): Snapshot {
  const here = world.player.location.at === 'town' ? world.player.location.town : undefined;
  return {
    time: world.time,
    clock: formatClock(world.time),
    ended: isOver(world),
    money: world.player.money,
    bribeCost: BRIBE_COST,
    location: describeLocation(world),
    towns: Object.values(world.towns).map((t) => {
      const value = reputation(world, t.id);
      return { id: t.id, name: t.name, reputation: value, label: reputationLabel(value) };
    }),
    travelOptions: here
      ? travelOptions(world).map((r) => ({
          routeId: r.id,
          to: otherEnd(r, here),
          toName: world.towns[otherEnd(r, here)].name,
          kind: r.kind,
          hours: r.length / world.player.speed[r.kind],
        }))
      : [],
    speakOptions: speakTargets(world).map((r) => ({ rumourId: r.id, text: r.text })),
    interceptOptions: interceptTargets(world).map((c) => ({ carrierId: c.id, name: c.name })),
    log: world.log.slice(-40),
  };
}
