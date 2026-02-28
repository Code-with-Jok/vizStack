"use client";

interface FullPageLoaderProps {
  label?: string;
}

export function FullPageLoader({ label = "Loading..." }: FullPageLoaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100vh - 48px)",
        color: "var(--color-text-muted)",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            border: "3px solid var(--color-border)",
            borderTop: "3px solid var(--color-accent-cyan)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 12px",
          }}
        />
        {label}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

