import { describe, expect, it } from 'vitest';
import { greybox } from '../data/greybox'; // eslint-disable-line no-restricted-imports -- tests may use real scenario data
import { apply, createWorld, interceptTargets, reputation, step, type World } from './index';
import { hear } from './rumours';
import { nextRandom } from './rng';

const DT = 0.05;

function runUntil(world: World, hours: number) {
  while (world.time < hours - 1e-9) step(world, DT);
}

/** A 3-town world with an extra rumour, for testing belief rules in isolation. */
function beliefWorld(): World {
  const world = createWorld(greybox, 1);
  world.rumours.lie = { id: 'lie', eventType: 'x', text: 'x', subject: 'player', origin: 'gatehold', createdAt: 0, heat: 0, truth: 0.1 };
  world.rumours.denial = { ...world.rumours.lie, id: 'denial', truth: 0.9, contradicts: 'lie' };
  return world;
}

describe('rng', () => {
  it('is reproducible from a seed', () => {
    const a = { seed: 42 };
    const b = { seed: 42 };
    expect([nextRandom(a), nextRandom(a), nextRandom(a)]).toEqual([nextRandom(b), nextRandom(b), nextRandom(b)]);
  });
});

describe('world', () => {
  it('replays identically from the same seed and commands', () => {
    const play = () => {
      const world = createWorld(greybox, 7);
      apply(world, { type: 'travel', routeId: 'crossing-saltmouth' });
      runUntil(world, 36);
      return JSON.stringify(world);
    };
    expect(play()).toEqual(play());
  });

  it('only moves rumours when a carrier moves them', () => {
    const world = createWorld(greybox, 1);
    expect(world.townState.gatehold.claims.caravan).toBeUndefined();
    runUntil(world, 6); // Pell leaves at 0.5h and needs 6h to reach Gatehold
    expect(world.townState.gatehold.claims.caravan).toBeUndefined();
    runUntil(world, 7);
    expect(world.townState.gatehold.claims.caravan).toBeDefined();
    expect(reputation(world, 'gatehold')).toBeLessThan(0);
  });
});

describe('beliefs', () => {
  const source = { name: 'test', trust: 0.8 };

  it('gives the first story an advantage over a later contradiction', () => {
    const denialFirst = beliefWorld();
    hear(denialFirst, 'gatehold', { rumourId: 'denial', truth: 0.9, stance: 0.5, hops: 0 }, source);
    hear(denialFirst, 'gatehold', { rumourId: 'lie', truth: 0.1, stance: -0.7, hops: 0 }, source);

    const lieFirst = beliefWorld();
    hear(lieFirst, 'gatehold', { rumourId: 'lie', truth: 0.1, stance: -0.7, hops: 0 }, source);
    hear(lieFirst, 'gatehold', { rumourId: 'denial', truth: 0.9, stance: 0.5, hops: 0 }, source);

    expect(reputation(denialFirst, 'gatehold')).toBeGreaterThan(reputation(lieFirst, 'gatehold'));
  });

  it('still lets a late truth erode an earlier lie', () => {
    const world = beliefWorld();
    hear(world, 'gatehold', { rumourId: 'lie', truth: 0.1, stance: -0.7, hops: 0 }, source);
    const before = world.townState.gatehold.claims.lie.confidence;
    hear(world, 'gatehold', { rumourId: 'denial', truth: 0.9, stance: 0.5, hops: 0 }, source);
    expect(world.townState.gatehold.claims.lie.confidence).toBeLessThan(before);
  });
});

describe('commands', () => {
  it('racing a rumour: speaking first keeps a town on your side', () => {
    const raced = createWorld(greybox, 3);
    apply(raced, { type: 'travel', routeId: 'crossing-gatehold' });
    runUntil(raced, 4.5); // you arrive at 4h, Pell at 6.5h
    expect(apply(raced, { type: 'speak', rumourId: 'caravan' })).toEqual({ ok: true });
    runUntil(raced, 8);

    const idle = createWorld(greybox, 3);
    runUntil(idle, 8);

    expect(reputation(raced, 'gatehold')).toBeGreaterThan(reputation(idle, 'gatehold'));
  });

  it('intercepting a carrier stops the rumour reaching the next town', () => {
    const world = createWorld(greybox, 3);
    runUntil(world, 1); // let Pell get ahead, then chase him
    apply(world, { type: 'travel', routeId: 'crossing-gatehold' });
    while (interceptTargets(world).length === 0) step(world, DT);
    expect(apply(world, { type: 'intercept', carrierId: 'pell' })).toEqual({ ok: true });
    expect(world.player.money).toBe(20);
    runUntil(world, 8);
    expect(world.townState.gatehold.claims.caravan).toBeUndefined();
  });

  it('rejects actions that do not fit where you are', () => {
    const world = createWorld(greybox, 3);
    expect(apply(world, { type: 'intercept', carrierId: 'pell' }).ok).toBe(false);
    apply(world, { type: 'travel', routeId: 'crossing-gatehold' });
    expect(apply(world, { type: 'speak', rumourId: 'caravan' }).ok).toBe(false);
    expect(apply(world, { type: 'travel', routeId: 'crossing-saltmouth' }).ok).toBe(false);
  });
});
