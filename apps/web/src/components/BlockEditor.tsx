"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import {
  createReactBlockSpec,
  useCreateBlockNote,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  SideMenuController,
} from "@blocknote/react";
import {
  BlockNoteSchema,
  defaultBlockSpecs,
  defaultProps,
} from "@blocknote/core";
import { MdInfoOutline } from "react-icons/md";

// 1. Create the Custom Alert Block Spec
const AlertBlock = createReactBlockSpec(
  {
    type: "alert",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      variant: {
        default: "info",
        values: ["info", "warning", "error", "success"],
      },
    },
    content: "inline",
  },
  {
    render: (props) => {
      // Provide Notion-like callout styling
      const bgColors: Record<string, string> = {
        info: "var(--color-alert-info-bg)",
        warning: "var(--color-alert-warning-bg)",
        error: "var(--color-alert-error-bg)",
        success: "var(--color-alert-success-bg)",
      };
      const borderColors: Record<string, string> = {
        info: "var(--color-accent-cyan)",
        warning: "var(--color-accent-orange)",
        error: "var(--color-accent-red)",
        success: "var(--color-accent-green)",
      };

      const variant = props.block.props.variant as string;

      return (
        <div
          className="bn-alert-block"
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            padding: "16px",
            margin: "8px 0",
            borderRadius: "8px",
            background: bgColors[variant] || bgColors.info,
            borderLeft: `4px solid ${borderColors[variant] || borderColors.info}`,
          }}
        >
          <div
            style={{
              marginTop: "2px",
              fontSize: "1.2rem",
              color: borderColors[variant] || borderColors.info,
            }}
          >
            <MdInfoOutline />
          </div>
          <div
            className={"inline-content"}
            ref={props.contentRef}
            style={{ flex: 1, lineHeight: 1.6 }}
          />
        </div>
      );
    },
  }
);

const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    alert: AlertBlock(),
  },
});

interface BlockEditorProps {
  initialContent?: string;
  onChange: (content: string) => void;
  editable?: boolean;
}

export default function BlockEditor({
  initialContent,
  onChange,
  editable = true,
}: BlockEditorProps) {
  const [ready, setReady] = useState(false);
  // 3. Initialize Editor with the Schema
  const editor = useCreateBlockNote({ schema });

  // Move ready state setting to a separate effect to ensure editor is created
  useEffect(() => {
    if (editor) setReady(true);
  }, [editor]);

  const initializedRef = useRef(false);
  const latestOnChange = useRef(onChange);
  const debounceTimer = useRef<number | null>(null);

  // Always keep a ref to the latest onChange so debounce callback is up to date
  useEffect(() => {
    latestOnChange.current = onChange;
  }, [onChange]);

  useEffect(() => {
    async function initEditor() {
      if (initializedRef.current || !ready) return;
      initializedRef.current = true;

      // Ensure we have something to render
      if (!initialContent) return;

      try {
        const parsed = JSON.parse(initialContent);
        editor.replaceBlocks(editor.document, parsed);
      } catch (e) {
        // Fallback to markdown if JSON parsing fails
        const blocks = await editor.tryParseMarkdownToBlocks(initialContent);
        editor.replaceBlocks(editor.document, blocks);
        // Sync the initial conversion back to Convex via parent's onChange
        const snapshot = JSON.stringify(editor.document, null, 2);
        latestOnChange.current(snapshot);
      }
    }

    initEditor();
  }, [editor, ready, initialContent]); // Added initialContent to sync if it's the first load

  // 4. Create Slash Menu Item for the Alert Block
  const insertAlert = (editor: typeof schema.BlockNoteEditor) => {
    const currentBlock = editor.getTextCursorPosition().block;
    // Replace the slash command block with our new Alert block
    editor.replaceBlocks(
      [currentBlock],
      [{ type: "alert", props: { variant: "info" } }]
    );
  };

  const getCustomSlashMenuItems = useMemo(() => {
    return [
      ...getDefaultReactSlashMenuItems(editor),
      {
        title: "Alert Callout",
        onItemClick: () => insertAlert(editor),
        aliases: ["alert", "callout", "info", "note"],
        group: "Custom Blocks",
        icon: <MdInfoOutline size={18} />,
        subtext: "Insert a Notion-style informational callout.",
      },
    ];
  }, [editor]);

  if (!ready) {
    return (
      <div style={{ padding: "20px", color: "var(--color-text-muted)" }}>
        Loading Editor...
      </div>
    );
  }

  return (
    <BlockNoteView
      editor={editor}
      editable={editable}
      theme="light"
      slashMenu={false} // Disable default slash menu to use our custom one
      onChange={() => {
        if (!ready) return;
        // Debounce expensive JSON serialization so typing in the editor
        // (and in other inputs like the title fields) stays responsive.
        if (debounceTimer.current !== null) {
          window.clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = window.setTimeout(() => {
          const snapshot = JSON.stringify(editor.document, null, 2);
          latestOnChange.current(snapshot);
        }, 500); // Increased debounce slightly for stability during movements
      }}
    >
      <SideMenuController />
      <SuggestionMenuController
        triggerCharacter={"/"}
        getItems={async (query) => {
          return getCustomSlashMenuItems.filter(
            (item) =>
              item.title.toLowerCase().startsWith(query.toLowerCase()) ||
              item.aliases?.some((alias) =>
                alias.toLowerCase().startsWith(query.toLowerCase())
              )
          );
        }}
      />
    </BlockNoteView>
  );
}
