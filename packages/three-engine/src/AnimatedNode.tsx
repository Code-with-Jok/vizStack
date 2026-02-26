"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";
import * as THREE from "three";

interface AnimatedNodeProps {
  position: [number, number, number];
  label: string;
  color?: string;
  glowColor?: string;
  size?: [number, number, number];
  active?: boolean;
  highlighted?: boolean;
  onClick?: () => void;
  delay?: number;
}

export function AnimatedNode({
  position,
  label,
  color = "#FF9B62", // Peach default
  glowColor = "#56D9D1", // Teal default
  size = [2.8, 1, 0.3],
  active = false,
  highlighted = false,
  onClick,
  delay = 0,
}: AnimatedNodeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(delay === 0);
  const startTime = useRef<number | null>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Delay-based entry animation
    if (!visible) {
      if (startTime.current === null)
        startTime.current = state.clock.elapsedTime;
      if (state.clock.elapsedTime - startTime.current > delay) {
        setVisible(true);
      }
      groupRef.current.scale.set(0.01, 0.01, 0.01);
      return;
    }

    // Scale animation
    const targetScale = hovered ? 1.08 : 1;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );

    // Floating animation when active
    if (active || highlighted) {
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2 + delay) * 0.05;
    }
  });

  const isGlowing = active || highlighted || hovered;
  const emissiveIntensity = isGlowing ? 0.4 : 0;
  const currentColor = highlighted ? glowColor : color;

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Main box */}
      <mesh>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={currentColor}
          emissive={glowColor}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={visible ? (isGlowing ? 1 : 0.85) : 0}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Label - Fixed to rotate with the parent group */}
      {visible && (
        <Text
          position={[0, 0, size[2] / 2 + 0.01]}
          fontSize={Math.min(
            0.28,
            (size[0] * 0.5) / Math.max(label.length * 0.6, 1)
          )}
          color={isGlowing ? "#ffffff" : "#2d2d2d"}
          anchorX="center"
          anchorY="middle"
          maxWidth={size[0] * 0.85} // Reduced to prevent edge clipping
          textAlign="center"
          outlineWidth={0.015}
          outlineColor="#000000"
          font={undefined}
        >
          {label}
        </Text>
      )}

      {/* Glow plane behind when active */}
      {isGlowing && visible && (
        <mesh position={[0, 0, -size[2] / 2 - 0.01]}>
          <planeGeometry args={[size[0] + 0.3, size[1] + 0.3]} />
          <meshBasicMaterial color={glowColor} transparent opacity={0.1} />
        </mesh>
      )}
    </group>
  );
}
