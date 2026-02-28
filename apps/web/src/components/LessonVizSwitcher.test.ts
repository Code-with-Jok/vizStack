import { describe, it, expect } from "vitest";
import { build2dFrom3d } from "./LessonVizSwitcher";
import type { VizConfig } from "@/components/GenericVizRenderer";

describe("build2dFrom3d", () => {
  it("should correctly convert 3D viz config to 2D schema", () => {
    const mock3dViz: VizConfig = {
      nodes: [
        {
          id: "node1",
          label: "Node 1",
          x: 0,
          y: 0,
          z: 0,
          color: "#f00",
          type: "sphere",
        },
        {
          id: "node2",
          label: "Node 2",
          x: 10,
          y: 10,
          z: 0,
          color: "#0f0",
          type: "box",
        },
      ],
      connections: [{ fromIndex: 0, toIndex: 1 }],
    };

    const expected2dSchema = {
      nodes: [
        {
          id: "node1",
          label: "Node 1",
          x: 0,
          y: 0,
          color: "#f00",
          width: undefined,
          height: undefined,
        },
        {
          id: "node2",
          label: "Node 2",
          x: 10,
          y: 10,
          color: "#0f0",
          width: undefined,
          height: undefined,
        },
      ],
      edges: [{ fromId: "node1", toId: "node2" }],
    };

    const result = build2dFrom3d(mock3dViz);
    expect(result).toEqual(expected2dSchema);
  });

  it("should handle invalid connections gracefully", () => {
    const mock3dViz: VizConfig = {
      nodes: [
        {
          id: "node1",
          label: "Node 1",
          x: 0,
          y: 0,
          z: 0,
          color: "#f00",
          type: "sphere",
        },
      ],
      connections: [
        { fromIndex: 0, toIndex: 99 }, // Invalid toIndex
      ],
    };

    const expected2dSchema = {
      nodes: [
        {
          id: "node1",
          label: "Node 1",
          x: 0,
          y: 0,
          color: "#f00",
          width: undefined,
          height: undefined,
        },
      ],
      edges: [], // Should filter out invalid connection
    };

    const result = build2dFrom3d(mock3dViz);
    expect(result).toEqual(expected2dSchema);
  });
});
