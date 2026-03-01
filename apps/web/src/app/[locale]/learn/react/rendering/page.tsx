"use client";

import dynamic from "next/dynamic";
import { LessonStepPage } from "@/modules/learn/LessonStepPage";

const RenderingViz = dynamic(
  () =>
    import("@viz/module-react").then((mod) => ({ default: mod.RenderingViz })),
  { ssr: false }
);

const STEPS = [
  "intro",
  "jsx",
  "createElement",
  "vdom",
  "twoTrees",
  "diffing",
  "patches",
  "domUpdate",
] as const;

export default function RenderingPage() {
  return (
    <LessonStepPage
      steps={STEPS}
      renderViz={(currentStep) => <RenderingViz currentStep={currentStep} />}
      i18nBaseKey="courses.react.lessons.rendering.steps"
    />
  );
}
