import { VizConfig } from "@/components/GenericVizRenderer";
import { themeColors } from "@/theme/colors";

export const DEFAULT_VIZ: VizConfig = {
  nodes: [
    {
      id: "root",
      label: "Component",
      x: 0,
      y: 5,
      color: themeColors.accentViolet,
      glowColor: themeColors.accentViolet,
    },
    {
      id: "logic",
      label: "Logic",
      x: -3,
      y: 2,
      color: themeColors.accentBlue,
      glowColor: themeColors.accentBlue,
    },
    {
      id: "ui",
      label: "UI (JSX)",
      x: 3,
      y: 2,
      color: themeColors.accentGreen,
      glowColor: themeColors.accentGreen,
    },
    {
      id: "props",
      label: "Props",
      x: -4.5,
      y: -1,
      color: themeColors.accentOrange,
      glowColor: themeColors.accentOrange,
    },
    {
      id: "state",
      label: "State",
      x: -1.5,
      y: -1,
      color: themeColors.accentOrange,
      glowColor: themeColors.accentOrange,
    },
  ],
  connections: [
    { fromIndex: 0, toIndex: 1 },
    { fromIndex: 0, toIndex: 2 },
    { fromIndex: 1, toIndex: 3 },
    { fromIndex: 1, toIndex: 4 },
  ],
  cameraPosition: [0, 1, 16],
};
