"use client";

import { useEffect, useState, useMemo } from "react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import { 
  createReactBlockSpec, 
  useCreateBlockNote,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController
} from "@blocknote/react";
import { BlockNoteSchema, defaultBlockSpecs, defaultProps } from "@blocknote/core";
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
        info: "rgba(86, 217, 209, 0.15)",
        warning: "rgba(245, 158, 11, 0.15)",
        error: "rgba(239, 68, 68, 0.15)",
        success: "rgba(16, 185, 129, 0.15)",
      };
      const borderColors: Record<string, string> = {
        info: "var(--color-accent-cyan)",
        warning: "var(--color-accent-orange)",
        error: "#ef4444",
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
          <div style={{ marginTop: "2px", fontSize: "1.2rem", color: borderColors[variant] || borderColors.info }}>
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

  useEffect(() => {
    async function initEditor() {
      if (!initialContent) {
        setReady(true);
        return;
      }

      try {
        const parsed = JSON.parse(initialContent);
        editor.replaceBlocks(editor.document, parsed);
        setReady(true);
      } catch (e) {
        const blocks = await editor.tryParseMarkdownToBlocks(initialContent);
        editor.replaceBlocks(editor.document, blocks);
        setReady(true);
        onChange(JSON.stringify(editor.document, null, 2));
      }
    }

    initEditor();
  }, [editor]); 

  // 4. Create Slash Menu Item for the Alert Block
  const insertAlert = (editor: typeof schema.BlockNoteEditor) => {
    const currentBlock = editor.getTextCursorPosition().block;
    // Replace the slash command block with our new Alert block
    editor.replaceBlocks([currentBlock], [{ type: "alert", props: { variant: "info" } }]);
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
        onChange(JSON.stringify(editor.document, null, 2));
      }}
    >
      <SuggestionMenuController
        triggerCharacter={"/"}
        getItems={async (query) => {
          return getCustomSlashMenuItems.filter((item) =>
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
