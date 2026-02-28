"use client";

import dynamic from "next/dynamic";
import { LessonStepPage } from "@/modules/learn/LessonStepPage";

const FrameworksViz = dynamic(
  () => import("@viz/module-react").then((m) => ({ default: m.FrameworksViz })),
  { ssr: false }
);

const STEPS = [
  "intro",
  "react",
  "compare",
  "nextjs",
  "astro",
  "reactRouter",
  "fullstack",
] as const;

export default function FrameworksPage() {
  return (
    <LessonStepPage
      steps={STEPS}
      renderViz={(currentStep) => <FrameworksViz currentStep={currentStep} />}
      i18nBaseKey="courses.react.lessons.frameworks.steps"
    />
  );
}
