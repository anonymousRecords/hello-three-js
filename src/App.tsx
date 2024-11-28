import { useLayoutEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useMask,
  useGLTF,
  Float,
  Environment,
  RandomizedLight,
  AccumulativeShadows,
  MeshTransmissionMaterial,
  CameraControls,
} from "@react-three/drei";
import { Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { Group, Mesh } from "three";
import { GLTF } from "three/examples/jsm/Addons.js";
// import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

type GuppyFishProps = {
  position?: [number, number, number];
  scale?: number;
  speed?: number;
};

interface GLTFResult extends GLTF {
  nodes: {
    Cube: THREE.Mesh;
  };
}

type AquariumProps = {
  children: React.ReactNode;
  position?: [number, number, number];
} & JSX.IntrinsicElements["group"];

function GuppyFish({
  position = [0, 0, 0],
  scale = 0.5,
  speed = 2,
}: GuppyFishProps) {
  const gltf = useGLTF("/fish.glb");
  const ref = useRef<Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime / 2) / 4;
      ref.current.position.x =
        position[0] + Math.sin(state.clock.elapsedTime / 3) * 0.5;
      ref.current.position.y =
        position[1] + Math.cos(state.clock.elapsedTime / 2) * 0.2;
    }
  });

  return (
    <Float rotationIntensity={2} floatIntensity={3} speed={speed}>
      <primitive
        ref={ref}
        object={gltf.scene}
        scale={scale}
        position={position}
      />
    </Float>
  );
}

function Aquarium({ children, ...props }: AquariumProps) {
  const ref = useRef<Group>(null);
  const gltf = useGLTF("/shapes-transformed.glb") as unknown as GLTFResult;
  const stencil = useMask(1, false);

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.traverse((child) => {
        if (child instanceof Mesh && child.material) {
          Object.assign(child.material, { ...stencil });
        }
      });
    }
  }, [stencil]);

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        scale={[0.61 * 6, 0.8 * 6, 1 * 6]}
        geometry={gltf.nodes.Cube.geometry}
      >
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={3}
          chromaticAberration={0.025}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.1}
          temporalDistortion={0.2}
          iridescence={1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
        />
      </mesh>
      <group ref={ref}>{children}</group>
    </group>
  );
}

export default function App() {
  const guppyPositions: [number, number, number][] = [
    [0, 0, 0],
    [-1, 0.5, -0.5],
    [1, -0.3, 0.5],
    [-0.5, -0.7, -0.3],
    [0.7, 0.8, 0.2],
  ];

  return (
    <div className="h-screen w-screen">
      <Canvas
        shadows
        camera={{ position: [30, 0, -3], fov: 45, near: 1, far: 50 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <color attach="background" args={["#c6e5db"]} />

        <Aquarium position={[0, 0.25, 0]}>
          {guppyPositions.map((position, index) => (
            <GuppyFish
              key={index}
              position={position}
              scale={0.4}
              speed={1.5 + Math.random()}
            />
          ))}
        </Aquarium>

        <AccumulativeShadows
          temporal
          frames={100}
          color="lightblue"
          colorBlend={2}
          opacity={0.7}
          scale={60}
          position={[0, -5, 0]}
        >
          <RandomizedLight
            amount={8}
            radius={15}
            ambient={0.5}
            intensity={1}
            position={[-5, 10, -5]}
            size={20}
          />
        </AccumulativeShadows>

        <Environment resolution={1024}>
          <group rotation={[-Math.PI / 3, 0, 0]}>
            <Lightformer
              intensity={4}
              rotation-x={Math.PI / 2}
              position={[0, 5, -9]}
              scale={[10, 10, 1]}
            />
            {[2, 0, 2, 0, 2, 0, 2, 0].map((x, i) => (
              <Lightformer
                key={i}
                form="circle"
                intensity={4}
                rotation={[Math.PI / 2, 0, 0]}
                position={[x, 4, i * 4]}
                scale={[4, 1, 1]}
              />
            ))}
            <Lightformer
              intensity={2}
              rotation-y={Math.PI / 2}
              position={[-5, 1, -1]}
              scale={[50, 2, 1]}
            />
            <Lightformer
              intensity={2}
              rotation-y={-Math.PI / 2}
              position={[10, 1, 0]}
              scale={[50, 2, 1]}
            />
          </group>
        </Environment>

        <CameraControls
          truckSpeed={0.5}
          dollySpeed={0.5}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/fish.glb");
useGLTF.preload("/shapes-transformed.glb");
