"use client";

import { ReactNode } from "react";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ToggleMenuTOC } from "./ToggleMenuTOC";
import { LearningToc, type TocItem } from "./LearningToc";

interface LearningSplitLayoutProps {
  tocLabel: string;
  items: TocItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
  content: ReactNode;
  visualization?: ReactNode | null;
  desktopSizes?: [number, number];
  sidebarWidth?: number;
  mobileVizHeight?: number;
  rootClassName?: string;
  contentWrapperClassName?: string;
  vizPaneClassName?: string;
  showVisualization?: boolean;
}

const DEFAULT_SIZES: [number, number] = [640, 520];

export function LearningSplitLayout({
  tocLabel,
  items,
  activeIndex,
  onSelect,
  content,
  visualization,
  desktopSizes = DEFAULT_SIZES,
  sidebarWidth = 280,
  mobileVizHeight = 320,
  rootClassName,
  contentWrapperClassName,
  vizPaneClassName,
  showVisualization,
}: LearningSplitLayoutProps) {
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const shouldShowViz = showVisualization ?? Boolean(visualization);
  const desktopPaneSizes = shouldShowViz
    ? [sidebarWidth, ...desktopSizes]
    : [sidebarWidth, desktopSizes[0]];

  return (
    <div className={cn("walkthrough-root", rootClassName)}>
      <ToggleMenuTOC
        items={items.map((item) => ({ id: item.id, title: item.title }))}
        activeIndex={activeIndex}
        onItemClick={onSelect}
        label={tocLabel}
      />

      <div className="walkthrough-main">
        <div className="flex-1 overflow-hidden h-full">
          {isMobile ? (
            <div className="flex flex-col h-full bg-white overflow-y-auto">
              <div className={cn("p-4 sm:p-6", contentWrapperClassName)}>
                {content}
              </div>
              {shouldShowViz && (
                <div
                  className={cn(
                    "mt-4 border-t border-gray-100 pt-4",
                    vizPaneClassName
                  )}
                  style={{ minHeight: mobileVizHeight }}
                >
                  {visualization}
                </div>
              )}
            </div>
          ) : (
            <Allotment className="m-0!">
              <Allotment.Pane minSize={200} maxSize={300} className="bg-white">
                <LearningToc
                  items={items}
                  activeIndex={activeIndex}
                  onSelect={onSelect}
                  label={tocLabel}
                />
              </Allotment.Pane>
              <Allotment.Pane minSize={200} className="bg-white">
                <div
                  className={cn(
                    "h-full overflow-y-auto bg-white p-8 lg:p-12",
                    contentWrapperClassName
                  )}
                >
                  <div className="mx-auto">{content}</div>
                </div>
              </Allotment.Pane>
              {shouldShowViz && (
                <Allotment.Pane minSize={400}>
                  <div
                    className={cn(
                      "walkthrough-viz-pane h-full",
                      vizPaneClassName
                    )}
                  >
                    {visualization}
                  </div>
                </Allotment.Pane>
              )}
            </Allotment>
          )}
        </div>
      </div>
    </div>
  );
}
