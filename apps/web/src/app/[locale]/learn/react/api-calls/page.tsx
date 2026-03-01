"use client";

import dynamic from "next/dynamic";
import { LessonStepPage } from "@/modules/learn/LessonStepPage";

const ApiCallsViz = dynamic(
  () => import("@viz/module-react").then((m) => ({ default: m.ApiCallsViz })),
  { ssr: false }
);

const STEPS = [
  "intro",
  "component",
  "fetch",
  "axios",
  "reactQuery",
  "apollo",
  "api",
] as const;

export default function ApiCallsPage() {
  return (
    <LessonStepPage
      steps={STEPS}
      renderViz={(currentStep) => <ApiCallsViz currentStep={currentStep} />}
      i18nBaseKey="courses.react.lessons.apiCalls.steps"
    />
  );
}
