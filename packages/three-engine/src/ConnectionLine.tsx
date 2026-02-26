"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ConnectionLineProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  active?: boolean;
  animated?: boolean;
  lineWidth?: number;
}

export function ConnectionLine({
  start,
  end,
  color = "#00d4ff",
  active = false,
  animated = true,
}: ConnectionLineProps) {
  const particleRef = useRef<THREE.Mesh>(null);
  const progress = useRef(0);

  const curve = useMemo(() => {
    const midY = (start[1] + end[1]) / 2;
    const midX = (start[0] + end[0]) / 2;
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(midX, midY, Math.max(start[2], end[2]) + 0.5),
      new THREE.Vector3(...end)
    );
  }, [start, end]);

  const points = useMemo(() => curve.getPoints(50), [curve]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  useFrame((_, delta) => {
    if (!active || !animated || !particleRef.current) return;

    progress.current += delta * 0.5;
    if (progress.current > 1) progress.current = 0;

    const point = curve.getPoint(progress.current);
    particleRef.current.position.copy(point);
  });

  return (
    <group>
      <primitive object={new THREE.Line(geometry)}>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={active ? 0.6 : 0.15}
        />
      </primitive>

      {/* Animated data particle */}
      {active && animated && (
        <mesh ref={particleRef}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.9} />
        </mesh>
      )}
    </group>
  );
}
