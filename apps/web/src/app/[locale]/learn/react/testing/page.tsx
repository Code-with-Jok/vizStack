"use client";

import dynamic from "next/dynamic";
import { LessonStepPage } from "@/modules/learn/LessonStepPage";

const TestingViz = dynamic(
  () => import("@viz/module-react").then((m) => ({ default: m.TestingViz })),
  { ssr: false }
);

const STEPS = [
  "intro",
  "code",
  "pyramid",
  "unit",
  "integration",
  "e2e",
  "ci",
] as const;

export default function TestingPage() {
  return (
    <LessonStepPage
      steps={STEPS}
      renderViz={(currentStep) => <TestingViz currentStep={currentStep} />}
      i18nBaseKey="courses.react.lessons.testing.steps"
    />
  );
}
