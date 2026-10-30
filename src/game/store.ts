import { create } from 'zustand';
import { greybox } from '../data/greybox';
import { apply, createWorld, type Command, type CommandResult, type World } from '../sim';
import { makeSnapshot, type Snapshot } from './snapshot';

/** Game hours per real second at each speed setting. */
export const SPEEDS = [
  { label: '❚❚', hoursPerSecond: 0 },
  { label: '1×', hoursPerSecond: 0.5 },
  { label: '2×', hoursPerSecond: 1 },
  { label: '4×', hoursPerSecond: 2 },
] as const;

interface GameState {
  /** Mutable simulation state. Read it in useFrame or event handlers, never subscribe to it. */
  world: World;
  /** What React renders. Replaced on every publish(). */
  snapshot: Snapshot;
  hoursPerSecond: number;
  /** Debug: show rumours the player hasn't seen. */
  revealAll: boolean;
  lastError?: string;
  setSpeed: (hoursPerSecond: number) => void;
  toggleRevealAll: () => void;
  dispatch: (command: Command) => CommandResult;
  publish: () => void;
  restart: () => void;
}

function newWorld(): World {
  return createWorld(greybox, (Math.random() * 2 ** 32) >>> 0);
}

const initialWorld = newWorld();

export const useGame = create<GameState>((set, get) => ({
  world: initialWorld,
  snapshot: makeSnapshot(initialWorld),
  hoursPerSecond: SPEEDS[1].hoursPerSecond,
  revealAll: false,

  setSpeed: (hoursPerSecond) => set({ hoursPerSecond }),
  toggleRevealAll: () => set((s) => ({ revealAll: !s.revealAll })),

  dispatch: (command) => {
    const result = apply(get().world, command);
    set({ lastError: result.ok ? undefined : result.reason });
    get().publish();
    return result;
  },

  publish: () => set({ snapshot: makeSnapshot(get().world) }),

  restart: () => {
    const world = newWorld();
    set({ world, snapshot: makeSnapshot(world), hoursPerSecond: SPEEDS[1].hoursPerSecond, lastError: undefined });
  },
}));
