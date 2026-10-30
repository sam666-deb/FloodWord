import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { interceptTargets, isOver, step } from '../sim';
import { useGame } from './store';

/** Fixed simulation step in game hours. A fixed step keeps runs reproducible regardless of frame rate. */
const STEP_HOURS = 0.05;
/** Real seconds between UI snapshots. */
const PUBLISH_INTERVAL = 0.1;
/** Ignore long frames (tab in background) instead of fast-forwarding through them. */
const MAX_FRAME = 0.1;

/**
 * Advances the simulation from the render loop and pauses on moments that need a decision,
 * so a fast game speed can't skip past a chance to intercept.
 */
export function SimulationDriver() {
  const accumulator = useRef(0);
  const sincePublish = useRef(0);
  const inRange = useRef(new Set<string>());

  useFrame((_, delta) => {
    const { world, hoursPerSecond, setSpeed, publish } = useGame.getState();
    const frame = Math.min(delta, MAX_FRAME);
    accumulator.current += frame * hoursPerSecond;

    while (accumulator.current >= STEP_HOURS) {
      step(world, STEP_HOURS);
      accumulator.current -= STEP_HOURS;

      const ids = interceptTargets(world).map((c) => c.id);
      const encounter = ids.some((id) => !inRange.current.has(id));
      inRange.current = new Set(ids);
      if (encounter || isOver(world)) {
        setSpeed(0);
        accumulator.current = 0;
        break;
      }
    }

    sincePublish.current += frame;
    if (sincePublish.current >= PUBLISH_INTERVAL) {
      sincePublish.current = 0;
      publish();
    }
  });

  return null;
}
