"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Suspense, ReactNode } from "react";
import * as THREE from "three";

interface SceneProps {
  children: ReactNode;
  cameraPosition?: [number, number, number];
  enableOrbit?: boolean;
  background?: string;
  onPointerMissed?: () => void;
}

export function Scene({
  children,
  cameraPosition = [0, 0, 12],
  enableOrbit = true,
  background = "#fef9f6",
  onPointerMissed,
}: SceneProps) {
  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true }}
      onPointerMissed={onPointerMissed}
    >
      <primitive object={new THREE.Color(background)} attach="background" />
      <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />

      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#7c3aed" />
      <pointLight position={[10, -5, 5]} intensity={0.3} color="#00d4ff" />

      <Suspense fallback={null}>{children}</Suspense>

      {enableOrbit && (
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={30}
          minDistance={5}
          autoRotate={false}
        />
      )}
    </Canvas>
  );
}
