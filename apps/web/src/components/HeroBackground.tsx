"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Points,
  PointMaterial,
  Html,
  Billboard,
} from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import StackIcon from "tech-stack-icons";
import { themeColors } from "@/theme/colors";

// Data for tech logos
const LOGOS = [
  { name: "reactjs", pos: [4, 2, -2] },
  { name: "js", pos: [-5, -2, -4] },
  { name: "typescript", pos: [2, -4, -1] },
  { name: "nextjs", pos: [-6, 3, -6] },
  { name: "threejs", pos: [6, -2, -5] },
  { name: "tailwindcss", pos: [-2, -5, -3] },
  { name: "nodejs", pos: [0, 5, -8] },
];

function InteractiveLogo({
  name,
  position,
}: {
  name: string;
  position: [number, number, number];
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.scale, {
        x: hovered ? 1.4 : 1,
        y: hovered ? 1.4 : 1,
        z: hovered ? 1.4 : 1,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, [hovered]);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Billboard position={position} follow={true}>
        <group
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <Html transform occlude={false} distanceFactor={8}>
            <div
              style={{
                width: "60px",
                height: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: hovered
                  ? "color-mix(in srgb, var(--color-white) 20%, transparent)"
                  : "transparent",
                borderRadius: "14px",
                padding: "12px",
                transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
                cursor: "pointer",
                boxShadow: hovered
                  ? "0 0 30px var(--color-glow-cyan-strong)"
                  : "none",
                border: hovered
                  ? "1px solid var(--color-glow-cyan)"
                  : "1px solid transparent",
              }}
            >
              <StackIcon name={name as any} />
            </div>
          </Html>
        </group>
      </Billboard>
    </Float>
  );
}

function DataCloud() {
  const pointsRef = useRef<THREE.Points>(null);
  const { mouse, viewport } = useThree();

  const [positions, colors] = useMemo(() => {
    const p = new Float32Array(5000 * 3);
    const c = new Float32Array(5000 * 3);
    const colorA = new THREE.Color(themeColors.accentCyanBright);
    const colorB = new THREE.Color(themeColors.accentOrangeWarm);

    for (let i = 0; i < 5000; i++) {
      p[i * 3] = (Math.random() - 0.5) * 60;
      p[i * 3 + 1] = (Math.random() - 0.5) * 60;
      p[i * 3 + 2] = (Math.random() - 0.5) * 60;

      const mixedColor = Math.random() > 0.5 ? colorA : colorB;
      c[i * 3] = mixedColor.r;
      c[i * 3 + 1] = mixedColor.g;
      c[i * 3 + 2] = mixedColor.b;
    }
    return [p, c];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;

      const targetX = mouse.x * (viewport.width / 15);
      const targetY = mouse.y * (viewport.height / 15);
      pointsRef.current.position.x +=
        (targetX - pointsRef.current.position.x) * 0.05;
      pointsRef.current.position.y +=
        (targetY - pointsRef.current.position.y) * 0.05;
    }
  });

  return (
    <Points
      ref={pointsRef}
      positions={positions}
      colors={colors}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        vertexColors
        size={0.24}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.5}
      />
    </Points>
  );
}

function Connections() {
  const linePoints = useMemo(() => {
    const lines = [];
    for (let i = 0; i < LOGOS.length; i++) {
      for (let j = i + 1; j < LOGOS.length; j++) {
        if (Math.random() > 0.6) {
          lines.push(
            new THREE.Vector3(...(LOGOS[i].pos as [number, number, number]))
          );
          lines.push(
            new THREE.Vector3(...(LOGOS[j].pos as [number, number, number]))
          );
        }
      }
    }
    return lines;
  }, []);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(linePoints);
  }, [linePoints]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        color={themeColors.accentCyan}
        transparent
        opacity={0.1}
      />
    </lineSegments>
  );
}

export function HeroBackground() {
  return (
    <div
      className="hero-3d-bg"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "auto",
      }}
    >
      <Canvas camera={{ position: [0, 0, 15], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <pointLight
          position={[10, 10, 10]}
          intensity={1.5}
          color={themeColors.accentCyanBright}
        />
        <pointLight
          position={[-10, -10, -10]}
          intensity={1.5}
          color={themeColors.accentOrangeWarm}
        />

        <DataCloud />
        <Connections />

        {LOGOS.map((logo) => (
          <InteractiveLogo
            key={logo.name}
            name={logo.name}
            position={logo.pos as [number, number, number]}
          />
        ))}
      </Canvas>
    </div>
  );
}
