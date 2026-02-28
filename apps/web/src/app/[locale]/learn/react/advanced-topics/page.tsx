"use client";

import dynamic from "next/dynamic";
import { LessonStepPage } from "@/modules/learn/LessonStepPage";

const AdvancedTopicsViz = dynamic(
  () =>
    import("@viz/module-react").then((m) => ({ default: m.AdvancedTopicsViz })),
  { ssr: false }
);

const STEPS = [
  "intro",
  "react",
  "overview",
  "suspense",
  "errorBoundary",
  "portals",
  "serverApis",
] as const;

export default function AdvancedTopicsPage() {
  return (
    <LessonStepPage
      steps={STEPS}
      renderViz={(currentStep) => (
        <AdvancedTopicsViz currentStep={currentStep} />
      )}
      i18nBaseKey="courses.react.lessons.advancedTopics.steps"
    />
  );
}
