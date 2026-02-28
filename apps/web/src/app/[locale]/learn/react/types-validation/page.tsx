"use client";

import dynamic from "next/dynamic";
import { LessonStepPage } from "@/modules/learn/LessonStepPage";

const TypesValidationViz = dynamic(
  () =>
    import("@viz/module-react").then((m) => ({ default: m.TypesValidationViz })),
  { ssr: false }
);

const STEPS = [
  "intro",
  "js",
  "ts",
  "types",
  "zod",
  "checks",
  "safe",
] as const;

export default function TypesValidationPage() {
  return (
    <LessonStepPage
      steps={STEPS}
      renderViz={(currentStep) => (
        <TypesValidationViz currentStep={currentStep} />
      )}
      i18nBaseKey="courses.react.lessons.typesValidation.steps"
    />
  );
}
