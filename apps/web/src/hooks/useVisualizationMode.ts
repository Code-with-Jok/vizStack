"use client";

import { useState, useCallback } from "react";

type VizMode = "2d" | "3d" | "hybrid";

/**
 * Hook để quản lý trạng thái 2D/3D visualization
 */
export function useVisualizationMode(initialMode: VizMode = "3d") {
  const [vizMode, setVizMode] = useState<VizMode>(initialMode);

  const toggle2D = useCallback(() => {
    setVizMode((prev) => (prev === "2d" ? "3d" : "2d"));
  }, []);

  const setTo2D = useCallback(() => {
    setVizMode("2d");
  }, []);

  const setTo3D = useCallback(() => {
    setVizMode("3d");
  }, []);

  const setToHybrid = useCallback(() => {
    setVizMode("hybrid");
  }, []);

  const is2D = vizMode === "2d";
  const is3D = vizMode === "3d";
  const isHybrid = vizMode === "hybrid";

  return {
    vizMode,
    is2D,
    is3D,
    isHybrid,
    setVizMode,
    toggle2D,
    setTo2D,
    setTo3D,
    setToHybrid,
  };
}

/**
 * Hook để persist vizMode vào localStorage
 */
const VIZ_MODES: VizMode[] = ["2d", "3d", "hybrid"];
const isValidVizMode = (value: any): value is VizMode =>
  VIZ_MODES.includes(value);

export function usePersistedVisualizationMode(
  storageKey: string = "lesson-viz-mode"
) {
  const [vizMode, setVizMode] = useState<VizMode>(() => {
    if (typeof window === "undefined") return "3d";
    const stored = localStorage.getItem(storageKey);
    return isValidVizMode(stored) ? stored : "3d";
  });

  const updateVizMode = useCallback(
    (newMode: VizMode) => {
      setVizMode(newMode);
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, newMode);
      }
    },
    [storageKey]
  );

  const is2D = vizMode === "2d";
  const is3D = vizMode === "3d";
  const isHybrid = vizMode === "hybrid";

  return {
    vizMode,
    is2D,
    is3D,
    isHybrid,
    setVizMode: updateVizMode,
  };
}
