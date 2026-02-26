"use client";

import { useLocale } from "next-intl";
import dynamic from "next/dynamic";
import { CodeBlock, Callout } from "./ArticlePage";

const MarkdownPreview = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default.Markdown),
  { ssr: false }
);

interface ContentBlock {
  type: string;
  text_en?: string;
  text_vi?: string;
  code?: string;
  language?: string;
  filename?: string;
  calloutType?: string;
  headers?: string[];
  rows?: string[][];
  imageUrl?: string;
  caption_en?: string;
  caption_vi?: string;
}

export function BlockRenderer({ block }: { block: ContentBlock }) {
  const locale = useLocale();
  const vi = locale === "vi";

  switch (block.type) {
    case "text":
      return (
        <div
          data-color-mode="dark"
          className="wmde-markdown-var"
          style={{ marginBottom: "16px" }}
        >
          <MarkdownPreview
            source={vi ? block.text_vi || "" : block.text_en || ""}
            style={{
              background: "transparent",
              color: "var(--color-text-secondary)",
              fontSize: "0.9rem",
              lineHeight: 1.8,
            }}
          />
        </div>
      );

    case "code":
      return (
        <CodeBlock
          code={block.code || ""}
          language={block.language || "tsx"}
          filename={block.filename}
        />
      );

    case "callout":
      return (
        <Callout type={block.calloutType || "info"}>
          {vi ? block.text_vi : block.text_en}
        </Callout>
      );

    case "table":
      return (
        <div style={{ margin: "20px 0", overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.9rem",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
                {(block.headers || []).map((h, i) => (
                  <th
                    key={i}
                    style={{
                      padding: "10px 12px",
                      textAlign: "left",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(block.rows || []).map((row, i) => (
                <tr
                  key={i}
                  style={{ borderBottom: "1px solid var(--color-border)" }}
                >
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      style={{
                        padding: "10px 12px",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "image":
      if (!block.imageUrl) return null;
      return (
        <figure style={{ margin: "24px 0", textAlign: "center" }}>
          <img
            src={block.imageUrl}
            alt={vi ? block.caption_vi : block.caption_en}
            style={{
              maxWidth: "100%",
              borderRadius: "12px",
              border: "1px solid var(--color-border)",
            }}
          />
          {(vi ? block.caption_vi : block.caption_en) && (
            <figcaption
              style={{
                marginTop: "8px",
                fontSize: "0.8rem",
                color: "var(--color-text-muted)",
              }}
            >
              {vi ? block.caption_vi : block.caption_en}
            </figcaption>
          )}
        </figure>
      );

    default:
      return null;
  }
}
