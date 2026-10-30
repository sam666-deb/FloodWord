import { nextRandom } from './rng';
import type { Claim, RumourCopy, RumourId, TownId, TownState, World } from './types';

/** Who is telling a town something, and how much the town trusts them. */
export interface Source {
  name: string;
  trust: number;
}

/** How strongly an earlier, contrary belief discounts a newcomer. First impressions are why racing matters. */
export const FIRST_IMPRESSION = 0.6;
/** How much evidence can erode a belief, scaled by how false that belief is. */
export const DISPROOF = 0.5;
/** Chance per retelling, multiplied by heat, that the details change. */
export const DISTORTION_CHANCE = 0.5;
/** Confidence gained when a town hears something it already believes. */
export const REINFORCEMENT = 0.1;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Retelling a rumour may lower its truth and exaggerate it ("the amount stolen grows"). */
export function retell(world: World, copy: RumourCopy): RumourCopy {
  const next = { ...copy, hops: copy.hops + 1 };
  if (nextRandom(world.rng) < world.rumours[copy.rumourId].heat * DISTORTION_CHANCE) {
    next.truth = Math.max(0, copy.truth - 0.1 - 0.2 * nextRandom(world.rng));
    next.stance = clamp(copy.stance * 1.25, -1, 1);
  }
  return next;
}

function isContradiction(world: World, a: RumourId, b: RumourId): boolean {
  return world.rumours[a].contradicts === b || world.rumours[b].contradicts === a;
}

function rivals(world: World, state: TownState, id: RumourId): Claim[] {
  return Object.values(state.claims).filter((c) => isContradiction(world, c.rumourId, id));
}

/**
 * A town hears a rumour. Returns true if it was news to the town.
 *
 * Contradicting claims fight: whoever arrived first discounts the newcomer, and each side
 * is eroded in proportion to how false it is.
 */
export function hear(world: World, town: TownId, copy: RumourCopy, source: Source): boolean {
  const state = world.townState[town];
  const existing = state.claims[copy.rumourId];
  if (existing) {
    existing.confidence = Math.min(1, existing.confidence + source.trust * REINFORCEMENT);
    return false;
  }

  let confidence = source.trust;
  for (const rival of rivals(world, state, copy.rumourId)) {
    confidence *= 1 - FIRST_IMPRESSION * rival.confidence;
    confidence *= 1 - DISPROOF * rival.confidence * (1 - copy.truth);
    rival.confidence *= 1 - DISPROOF * source.trust * (1 - rival.truth);
  }
  state.claims[copy.rumourId] = { ...copy, confidence, heardAt: world.time, via: source.name };
  return true;
}

/** -1..1: what a town thinks of a subject, from everything it believes about them. */
export function reputation(world: World, town: TownId, subject = 'player'): number {
  let total = 0;
  for (const claim of Object.values(world.townState[town].claims)) {
    if (world.rumours[claim.rumourId].subject === subject) total += claim.stance * claim.confidence;
  }
  return clamp(total, -1, 1);
}

export function reputationLabel(value: number): string {
  if (value >= 0.35) return 'Trusted';
  if (value >= 0.1) return 'Well regarded';
  if (value > -0.1) return 'Unknown';
  if (value > -0.35) return 'Doubted';
  return 'Distrusted';
}

export function denialId(rumourId: RumourId): RumourId {
  return `deny:${rumourId}`;
}
