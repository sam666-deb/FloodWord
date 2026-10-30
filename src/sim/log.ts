import type { World } from './types';

/** Keeps memory bounded on long sessions. */
const MAX_LOG = 200;

export function logEvent(world: World, text: string, witnessed: boolean): void {
  world.log.push({ time: world.time, text, witnessed });
  if (world.log.length > MAX_LOG) world.log.splice(0, world.log.length - MAX_LOG);
}
