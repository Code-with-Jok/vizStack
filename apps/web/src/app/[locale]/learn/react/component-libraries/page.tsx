"use client";

import dynamic from "next/dynamic";
import { LessonStepPage } from "@/modules/learn/LessonStepPage";

const ComponentLibsViz = dynamic(
  () =>
    import("@viz/module-react").then((m) => ({ default: m.ComponentLibsViz })),
  { ssr: false }
);

const STEPS = [
  "intro",
  "app",
  "compare",
  "mui",
  "shadcn",
  "chakra",
  "headless",
] as const;

export default function ComponentLibrariesPage() {
  return (
    <LessonStepPage
      steps={STEPS}
      renderViz={(currentStep) => (
        <ComponentLibsViz currentStep={currentStep} />
      )}
      i18nBaseKey="courses.react.lessons.componentLibraries.steps"
    />
  );
}
