"use client";

interface EmptyWalkthroughStateProps {
  message?: string;
  canSeed?: boolean;
  onSeed?: () => void;
  seedLabel?: string;
}

export function EmptyWalkthroughState({
  message = "No walkthrough data found.",
  canSeed = false,
  onSeed,
  seedLabel = "🌱 Seed content",
}: EmptyWalkthroughStateProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100vh - 48px)",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <p style={{ color: "var(--color-text-secondary)" }}>{message}</p>
      {canSeed && onSeed && (
        <button className="btn-primary" onClick={onSeed}>
          {seedLabel}
        </button>
      )}
    </div>
  );
}
