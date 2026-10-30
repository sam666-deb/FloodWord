import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { SimulationDriver } from '../game/SimulationDriver';
import { Carriers } from './Carriers';
import { palette } from './colors';
import { PlayerMarker } from './PlayerMarker';
import { Routes } from './Routes';
import { Towns } from './Towns';

const MAP_CENTRE: [number, number, number] = [11, 0, 1];

export function Scene() {
  return (
    <Canvas camera={{ position: [11, 38, 42], fov: 40 }}>
      <color attach="background" args={[palette.background]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[20, 30, 10]} intensity={1.4} />

      <mesh rotation-x={-Math.PI / 2} position={MAP_CENTRE}>
        <planeGeometry args={[70, 60]} />
        <meshStandardMaterial color={palette.ground} />
      </mesh>

      <Routes />
      <Towns />
      <Carriers />
      <PlayerMarker />
      <SimulationDriver />

      <OrbitControls target={MAP_CENTRE} maxPolarAngle={1.2} minDistance={15} maxDistance={90} />
    </Canvas>
  );
}
