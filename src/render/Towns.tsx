import { Html, useCursor } from '@react-three/drei';
import { useState } from 'react';
import { useGame } from '../game/store';
import { reputationColor } from './colors';

function TownMarker({ id }: { id: string }) {
  const position = useGame((s) => s.world.towns[id].position);
  const town = useGame((s) => s.snapshot.towns.find((t) => t.id === id));
  const option = useGame((s) => s.snapshot.travelOptions.find((o) => o.to === id));
  const dispatch = useGame((s) => s.dispatch);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered && !!option);

  if (!town) return null;
  return (
    <group position={[position[0], 0, position[1]]}>
      <mesh
        position={[0, 0.75, 0]}
        onClick={option ? () => dispatch({ type: 'travel', routeId: option.routeId }) : undefined}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[2.5, 1.5, 2.5]} />
        <meshStandardMaterial color={reputationColor(town.reputation)} emissive={hovered && option ? '#333' : '#000'} />
      </mesh>
      <Html position={[0, 2.8, 0]} center className="map-label" pointerEvents="none">
        <strong>{town.name}</strong>
        <span>{town.label}</span>
      </Html>
    </group>
  );
}

/** Towns are coloured by what they think of you. Click a neighbouring town to travel there. */
export function Towns() {
  const ids = useGame((s) => Object.keys(s.world.towns).join());
  return ids.split(',').map((id) => <TownMarker key={id} id={id} />);
}
