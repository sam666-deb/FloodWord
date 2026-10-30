import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group, Mesh, MeshStandardMaterial } from 'three';
import { useGame } from '../game/store';
import { locationPoint } from '../sim';
import { palette } from './colors';

/** Spread carriers waiting in the same town so they don't overlap the town block. */
const TOWN_OFFSET = 2.2;

function CarrierMarker({ id, index }: { id: string; index: number }) {
  const group = useRef<Group>(null);
  const glyph = useRef<Mesh>(null);
  const kind = useGame((s) => s.world.carriers[id]?.kind);
  const name = useGame((s) => s.world.carriers[id]?.name);

  // Positions change every frame, so read the world directly instead of re-rendering React.
  useFrame((state) => {
    const { world, revealAll } = useGame.getState();
    const carrier = world.carriers[id];
    if (!carrier || !group.current || !glyph.current) return;

    let [x, z] = locationPoint(world, carrier.location);
    if (carrier.location.at === 'town') {
      const angle = index * 2.1 + 0.6;
      x += Math.cos(angle) * TOWN_OFFSET;
      z += Math.sin(angle) * TOWN_OFFSET;
    }
    group.current.position.set(x, 0, z);

    // The glyph shows only rumours the player knows about: information about information.
    const visible = Object.values(carrier.cargo).filter((c) => revealAll || world.player.known[c.rumourId]);
    glyph.current.visible = visible.length > 0;
    if (visible.length > 0) {
      const harmful = visible.some((c) => c.stance < 0);
      (glyph.current.material as MeshStandardMaterial).color.set(harmful ? palette.rumourBad : palette.rumourGood);
      glyph.current.position.y = 1.8 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
      glyph.current.rotation.y = state.clock.elapsedTime;
    }
  });

  return (
    <group ref={group}>
      <mesh position={[0, 0.4, 0]}>
        {kind === 'boat' ? <boxGeometry args={[1.4, 0.5, 0.7]} /> : <capsuleGeometry args={[0.3, 0.6, 4, 8]} />}
        <meshStandardMaterial color={kind === 'boat' ? palette.boat : palette.walker} />
      </mesh>
      <mesh ref={glyph}>
        <octahedronGeometry args={[0.35]} />
        <meshStandardMaterial emissive="#300" />
      </mesh>
      <Html position={[0, -0.6, 0]} center className="map-label small" pointerEvents="none">
        {name}
      </Html>
    </group>
  );
}

export function Carriers() {
  const ids = useGame((s) => Object.keys(s.world.carriers).join());
  return ids.split(',').map((id, i) => <CarrierMarker key={id} id={id} index={i} />);
}
