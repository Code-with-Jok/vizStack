"use client";

import dynamic from "next/dynamic";
import { LessonStepPage } from "@/modules/learn/LessonStepPage";

const WritingCssViz = dynamic(
  () => import("@viz/module-react").then((m) => ({ default: m.WritingCssViz })),
  { ssr: false }
);

const STEPS = [
  "intro",
  "component",
  "approaches",
  "cssModules",
  "tailwind",
  "pandaCss",
  "bundle",
] as const;

export default function WritingCssPage() {
  return (
    <LessonStepPage
      steps={STEPS}
      renderViz={(currentStep) => <WritingCssViz currentStep={currentStep} />}
      i18nBaseKey="courses.react.lessons.writingCss.steps"
    />
  );
}
