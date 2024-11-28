import { Canvas } from "@react-three/fiber";
import {
  Float,
  useGLTF,
  Environment,
  OrbitControls,
  PivotControls,
} from "@react-three/drei";
import { useControls } from "leva";

function Fish() {
  const { scene } = useGLTF("/fish.glb");
  const config = useControls({
    scale: { value: 0.5, min: 0.1, max: 2, step: 0.1 },
    floatIntensity: { value: 3, min: 0, max: 10, step: 0.1 },
    rotationIntensity: { value: 2, min: 0, max: 10, step: 0.1 },
    speed: { value: 2, min: 0, max: 10, step: 0.1 },
  });

  return (
    <PivotControls scale={2} anchor={[0, 0, 0]} activeAxes={[true, true, true]}>
      <Float
        floatIntensity={config.floatIntensity}
        rotationIntensity={config.rotationIntensity}
        speed={config.speed}
      >
        <primitive object={scene} scale={config.scale} />
      </Float>
    </PivotControls>
  );
}

export default function App() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 45 }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <color attach="background" args={["#fef4ef"]} />
      <ambientLight intensity={0.5} />
      <directionalLight intensity={0.6} position={[0, 0, 10]} />

      <Fish />

      <OrbitControls makeDefault />
      <Environment preset="sunset" />
    </Canvas>
  );
}

useGLTF.preload("/fish.glb");
