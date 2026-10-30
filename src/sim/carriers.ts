import { routeBetween } from './geometry';
import { logEvent } from './log';
import { hear, retell } from './rumours';
import type { Carrier, TownId, World } from './types';

/** Hours a carrier spends in each town before moving on. */
export const DWELL_HOURS = 1;

function playerIsIn(world: World, town: TownId): boolean {
  return world.player.location.at === 'town' && world.player.location.town === town;
}

/** Tell the town everything the carrier carries. Carriers keep their cargo and pass it on at every stop. */
function unload(world: World, carrier: Carrier, town: TownId): void {
  for (const copy of Object.values(carrier.cargo)) {
    const isNews = hear(world, town, copy, carrier);
    const rumour = world.rumours[copy.rumourId];
    if (isNews && rumour.subject === 'player') {
      logEvent(world, `${world.towns[town].name} hears from ${carrier.name}: "${rumour.text}"`, playerIsIn(world, town));
    }
  }
}

/** Pick up everything the town believes that the carrier isn't already carrying. */
function load(world: World, carrier: Carrier, town: TownId): void {
  for (const claim of Object.values(world.townState[town].claims)) {
    if (carrier.cargo[claim.rumourId]) continue;
    const { rumourId, truth, stance, hops } = claim;
    carrier.cargo[rumourId] = retell(world, { rumourId, truth, stance, hops });
  }
}

export function stepCarriers(world: World, dt: number): void {
  for (const carrier of Object.values(world.carriers)) {
    const loc = carrier.location;
    if (loc.at === 'town') {
      if (world.time < carrier.dwellUntil) continue;
      const nextStop = (carrier.stop + 1) % carrier.schedule.length;
      const to = carrier.schedule[nextStop];
      const route = routeBetween(world, loc.town, to);
      if (!route) throw new Error(`${carrier.id}: no route from ${loc.town} to ${to}`);
      load(world, carrier, loc.town);
      carrier.stop = nextStop;
      carrier.location = { at: 'route', routeId: route.id, from: loc.town, to, distance: 0 };
    } else {
      loc.distance += carrier.speed * dt;
      if (loc.distance >= world.routes[loc.routeId].length) {
        carrier.location = { at: 'town', town: loc.to };
        carrier.dwellUntil = world.time + DWELL_HOURS;
        unload(world, carrier, loc.to);
      }
    }
  }
}
