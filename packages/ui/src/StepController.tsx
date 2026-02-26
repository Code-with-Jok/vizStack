"use client";

import { ReactNode } from "react";

interface StepControllerProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  stepTitle: string;
  stepContent: string;
  nextLabel?: string;
  prevLabel?: string;
  stepLabel?: string;
  children?: ReactNode;
}

export function StepController({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  stepTitle,
  stepContent,
  nextLabel = "Next",
  prevLabel = "Previous",
  stepLabel = "Step",
}: StepControllerProps) {
  const safeTotalSteps = Math.max(totalSteps, 1);
  const safeStep = Math.min(Math.max(currentStep, 0), safeTotalSteps - 1);
  const progress = ((safeStep + 1) / safeTotalSteps) * 100;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--color-bg-secondary)",
        borderLeft: "1px solid var(--color-border)",
      }}
    >
      {/* Progress bar */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {stepLabel} {safeStep + 1} / {safeTotalSteps}
          </span>
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--color-accent-cyan)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {Math.round(progress)}%
          </span>
        </div>
        <div
          style={{
            width: "100%",
            height: "3px",
            background: "var(--color-bg-card)",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background:
                "linear-gradient(90deg, var(--color-accent-cyan), var(--color-accent-orange-warm))",
              borderRadius: "2px",
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          padding: "24px 20px",
          overflowY: "auto",
        }}
      >
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            marginBottom: "12px",
            background:
              "linear-gradient(135deg, var(--color-accent-cyan), var(--color-accent-orange-warm))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {stepTitle}
        </h3>
        <p
          style={{
            fontSize: "0.95rem",
            lineHeight: 1.7,
            color: "var(--color-text-secondary)",
          }}
        >
          {stepContent}
        </p>
      </div>

      {/* Navigation */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          padding: "16px 20px",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <button
          onClick={onPrev}
          disabled={safeStep === 0}
          style={{
            flex: 1,
            padding: "10px 16px",
            background:
              safeStep === 0 ? "var(--color-bg-card)" : "transparent",
            color:
              safeStep === 0
                ? "var(--color-text-muted)"
                : "var(--color-text-primary)",
            border: `1px solid ${
              safeStep === 0 ? "transparent" : "var(--color-border)"
            }`,
            borderRadius: "8px",
            cursor: safeStep === 0 ? "not-allowed" : "pointer",
            fontSize: "0.875rem",
            fontWeight: 500,
            transition: "all 0.2s ease",
          }}
        >
          ← {prevLabel}
        </button>
        <button
          onClick={onNext}
          disabled={safeStep === safeTotalSteps - 1}
          style={{
            flex: 1,
            padding: "10px 16px",
            background:
              safeStep === safeTotalSteps - 1
                ? "var(--color-bg-card)"
                : "linear-gradient(135deg, var(--color-accent-cyan), var(--color-accent-orange-warm))",
            color:
              safeStep === safeTotalSteps - 1
                ? "var(--color-text-muted)"
                : "white",
            border: "none",
            borderRadius: "8px",
            cursor: safeStep === safeTotalSteps - 1 ? "not-allowed" : "pointer",
            fontSize: "0.875rem",
            fontWeight: 600,
            transition: "all 0.2s ease",
          }}
        >
          {nextLabel} →
        </button>
      </div>
    </div>
  );
}
