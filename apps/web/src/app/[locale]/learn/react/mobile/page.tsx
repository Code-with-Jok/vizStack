"use client";

import dynamic from "next/dynamic";
import { LessonStepPage } from "@/modules/learn/LessonStepPage";

const MobileViz = dynamic(
  () => import("@viz/module-react").then((m) => ({ default: m.MobileViz })),
  { ssr: false }
);

const STEPS = [
  "intro",
  "react",
  "rn",
  "bridge",
  "platforms",
  "expo",
  "app",
] as const;

export default function MobilePage() {
  return (
    <LessonStepPage
      steps={STEPS}
      renderViz={(currentStep) => <MobileViz currentStep={currentStep} />}
      i18nBaseKey="courses.react.lessons.mobile.steps"
    />
  );
}
