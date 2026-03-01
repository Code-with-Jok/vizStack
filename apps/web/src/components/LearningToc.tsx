"use client";

import { cn } from "@/lib/cn";

export interface TocItem {
  id: string;
  title: string;
  href?: string;
}

interface LearningTocProps {
  items: TocItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
  label: string;
  width?: number;
}

export function LearningToc({
  items,
  activeIndex,
  onSelect,
  label,
  width,
}: LearningTocProps) {
  const style = width ? { width } : undefined;
  return (
    <aside className="walkthrough-toc hidden lg:flex lg:flex-col" style={style}>
      <h4 className="walkthrough-toc-title">{label}</h4>
      <nav className="walkthrough-toc-list">
        {items.map((item, i) => {
          const commonProps = {
            className: cn(
              "walkthrough-toc-item",
              i === activeIndex
                ? "walkthrough-toc-item-active"
                : "walkthrough-toc-item-inactive"
            ),
          };

          if (item.href) {
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => onSelect(i)}
                {...commonProps}
              >
                <span className="walkthrough-toc-num">
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                <span className="walkthrough-toc-label">{item.title}</span>
              </a>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(i)}
              {...commonProps}
            >
              <span className="walkthrough-toc-num">
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <span className="walkthrough-toc-label">{item.title}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
