import { Line } from '@react-three/drei';
import { useGame } from '../game/store';
import { palette } from './colors';

export function Routes() {
  const world = useGame((s) => s.world);
  return Object.values(world.routes).map((route) => {
    const [ax, az] = world.towns[route.a].position;
    const [bx, bz] = world.towns[route.b].position;
    const river = route.kind === 'river';
    return (
      <Line
        key={route.id}
        points={[[ax, 0.02, az], [bx, 0.02, bz]]}
        color={river ? palette.water : palette.road}
        lineWidth={river ? 8 : 4}
      />
    );
  });
}
