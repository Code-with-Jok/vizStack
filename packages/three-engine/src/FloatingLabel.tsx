"use client";

import { Text, Billboard } from "@react-three/drei";

interface FloatingLabelProps {
  position: [number, number, number];
  text: string;
  color?: string;
  fontSize?: number;
  visible?: boolean;
}

export function FloatingLabel({
  position,
  text,
  color = "#94a3b8",
  fontSize = 0.18,
  visible = true,
}: FloatingLabelProps) {
  if (!visible) return null;

  return (
    <Billboard position={position}>
      <Text
        fontSize={fontSize}
        color={color}
        anchorX="center"
        anchorY="middle"
        maxWidth={3}
        textAlign="center"
      >
        {text}
      </Text>
    </Billboard>
  );
}
