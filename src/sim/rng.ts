/**
 * Seeded PRNG (mulberry32). The state lives in the World, so the same seed and the
 * same commands always replay the same game.
 */
export function nextRandom(rng: { seed: number }): number {
  let t = (rng.seed = (rng.seed + 0x6d2b79f5) | 0);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
