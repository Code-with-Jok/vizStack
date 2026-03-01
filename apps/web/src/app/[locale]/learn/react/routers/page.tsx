"use client";

import dynamic from "next/dynamic";
import { LessonStepPage } from "@/modules/learn/LessonStepPage";

const RoutersViz = dynamic(
  () => import("@viz/module-react").then((m) => ({ default: m.RoutersViz })),
  { ssr: false }
);

const STEPS = [
  "intro",
  "url",
  "router",
  "routeConfig",
  "pageRender",
  "navigation",
  "fullCycle",
] as const;

export default function RoutersPage() {
  return (
    <LessonStepPage
      steps={STEPS}
      renderViz={(currentStep) => <RoutersViz currentStep={currentStep} />}
      i18nBaseKey="courses.react.lessons.routers.steps"
    />
  );
}
