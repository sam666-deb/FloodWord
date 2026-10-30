import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group } from 'three';
import { useGame } from '../game/store';
import { locationPoint } from '../sim';
import { palette } from './colors';

export function PlayerMarker() {
  const group = useRef<Group>(null);

  useFrame(() => {
    const { world } = useGame.getState();
    if (!group.current) return;
    const [x, z] = locationPoint(world, world.player.location);
    group.current.position.set(x, world.player.location.at === 'town' ? 1.5 : 0, z);
  });

  return (
    <group ref={group}>
      <mesh position={[0, 0.6, 0]} rotation-x={Math.PI}>
        <coneGeometry args={[0.45, 1.2, 12]} />
        <meshStandardMaterial color={palette.player} />
      </mesh>
    </group>
  );
}
