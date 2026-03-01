"use client";

import dynamic from "next/dynamic";
import { LessonStepPage } from "@/modules/learn/LessonStepPage";

const AnimationViz = dynamic(
  () => import("@viz/module-react").then((m) => ({ default: m.AnimationViz })),
  { ssr: false }
);

const STEPS = [
  "intro",
  "trigger",
  "compare",
  "framer",
  "spring",
  "gsap",
  "smooth",
] as const;

export default function AnimationPage() {
  return (
    <LessonStepPage
      steps={STEPS}
      renderViz={(currentStep) => <AnimationViz currentStep={currentStep} />}
      i18nBaseKey="courses.react.lessons.animation.steps"
    />
  );
}
