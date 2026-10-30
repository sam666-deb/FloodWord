import { otherEnd, routesFrom } from './geometry';
import { logEvent } from './log';
import { carriersInRange } from './player';
import { denialId, hear } from './rumours';
import type { Carrier, Route, Rumour, RouteId, RumourId, World } from './types';

// Everything the player does goes through apply(). A list of commands with their
// timestamps is enough to replay a game, which is what analytics and bug reports use.
export type Command =
  | { type: 'travel'; routeId: RouteId }
  | { type: 'speak'; rumourId: RumourId }
  | { type: 'intercept'; carrierId: string };

export type CommandResult = { ok: true } | { ok: false; reason: string };

export const BRIBE_COST = 10;
/** How much a town trusts the courier telling their side in person. */
export const PLAYER_TRUST = 0.8;

export function travelOptions(world: World): Route[] {
  const loc = world.player.location;
  return loc.at === 'town' ? routesFrom(world, loc.town) : [];
}

/** Harmful rumours the player knows about and hasn't yet denied in the current town. */
export function speakTargets(world: World): Rumour[] {
  const loc = world.player.location;
  if (loc.at !== 'town') return [];
  const claims = world.townState[loc.town].claims;
  return Object.keys(world.player.known)
    .map((id) => world.rumours[id])
    .filter((r) => r.subject === 'player' && !r.contradicts && !claims[denialId(r.id)]);
}

/** Carriers in range that carry something about the player. */
export function interceptTargets(world: World): Carrier[] {
  return carriersInRange(world).filter((c) =>
    Object.keys(c.cargo).some((id) => world.rumours[id].subject === 'player'),
  );
}

const fail = (reason: string): CommandResult => ({ ok: false, reason });

export function apply(world: World, command: Command): CommandResult {
  switch (command.type) {
    case 'travel': {
      const route = travelOptions(world).find((r) => r.id === command.routeId);
      if (!route || world.player.location.at !== 'town') return fail('You can only set off along a route from the town you are in.');
      const from = world.player.location.town;
      world.player.location = { at: 'route', routeId: route.id, from, to: otherEnd(route, from), distance: 0 };
      logEvent(world, `You set off for ${world.towns[otherEnd(route, from)].name}.`, true);
      return { ok: true };
    }

    case 'speak': {
      const target = speakTargets(world).find((r) => r.id === command.rumourId);
      if (!target || world.player.location.at !== 'town') return fail('There is nothing here to deny.');
      const town = world.player.location.town;
      const id = denialId(target.id);
      // One denial rumour per story, so carriers spread the same denial between towns.
      // Denying something true is a lie, and towns can find that out.
      world.rumours[id] ??= {
        id,
        eventType: 'denial',
        text: `The courier says it's a lie: "${target.text}"`,
        subject: 'player',
        origin: town,
        createdAt: world.time,
        heat: 0.3,
        truth: 1 - target.truth,
        contradicts: target.id,
      };
      hear(world, town, { rumourId: id, truth: world.rumours[id].truth, stance: 0.5, hops: 0 }, { name: 'you', trust: PLAYER_TRUST });
      world.player.known[id] = true;
      logEvent(world, `You tell ${world.towns[town].name} your side of the story.`, true);
      return { ok: true };
    }

    case 'intercept': {
      const carrier = interceptTargets(world).find((c) => c.id === command.carrierId);
      if (!carrier) return fail('That carrier is out of reach.');
      if (world.player.money < BRIBE_COST) return fail(`You need ${BRIBE_COST} coins to make it worth their while.`);
      world.player.money -= BRIBE_COST;
      for (const id of Object.keys(carrier.cargo)) {
        if (world.rumours[id].subject === 'player') delete carrier.cargo[id];
      }
      logEvent(world, `You pay ${carrier.name} ${BRIBE_COST} coins to forget what they heard about you.`, true);
      return { ok: true };
    }
  }
}
