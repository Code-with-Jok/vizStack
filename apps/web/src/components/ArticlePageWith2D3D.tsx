"use client";

import { ReactNode, useState } from "react";
import { ArticlePage, type ArticleSection } from "./ArticlePage";
import { VizModeToggle, VisualizationRenderer } from "./VizModeToggle";

interface ArticlePageWith2D3DProps {
  title: string;
  description: string;
  sections: ArticleSection[];
  visualization3d?: ReactNode;
  visualization2d?: ReactNode;
  vizUrl?: string;
  vizLabel?: string;
  tocLabel?: string;
  activeSectionIndex?: number;
  onSectionSelect?: (index: number) => void;
  onTitleChange?: (val: string) => void;
  onDescriptionChange?: (val: string) => void;
  defaultVizMode?: "2d" | "3d" | "hybrid";
}

/**
 * ArticlePageWith2D3D - Extends ArticlePage with 2D/3D switching capability
 * Manages separate visualizations for 2D (knowledge graph) and 3D (interactive scene)
 */
export function ArticlePageWith2D3D({
  title,
  description,
  sections,
  visualization3d,
  visualization2d,
  vizUrl,
  vizLabel,
  tocLabel,
  activeSectionIndex,
  onSectionSelect,
  onTitleChange,
  onDescriptionChange,
  defaultVizMode = "3d",
}: ArticlePageWith2D3DProps) {
  const [vizMode, setVizMode] = useState<"2d" | "3d" | "hybrid">(
    defaultVizMode
  );

  // Determine which visualization to show
  const activeVisualization =
    visualization2d || visualization3d ? (
      <div className="flex flex-col gap-4 h-full">
        <VizModeToggle
          mode={vizMode}
          onMode2D={() => setVizMode("2d")}
          onMode3D={() => setVizMode("3d")}
          onModeHybrid={() => setVizMode("hybrid")}
          showLabels={true}
          is2dDisabled={!visualization2d}
          is3dDisabled={!visualization3d}
        />
        <div className="flex-1 overflow-auto">
          <VisualizationRenderer
            mode={vizMode}
            viz2d={
              visualization2d || (
                <div className="text-neutral-500">
                  2D visualization not available
                </div>
              )
            }
            viz3d={
              visualization3d || (
                <div className="text-neutral-500">
                  3D visualization not available
                </div>
              )
            }
            className="h-full"
          />
        </div>
      </div>
    ) : undefined;

  return (
    <ArticlePage
      title={title}
      description={description}
      sections={sections}
      visualization={activeVisualization}
      vizUrl={vizUrl}
      vizLabel={vizLabel}
      tocLabel={tocLabel}
      activeSectionIndex={activeSectionIndex}
      onSectionSelect={onSectionSelect}
      onTitleChange={onTitleChange}
      onDescriptionChange={onDescriptionChange}
    />
  );
}
