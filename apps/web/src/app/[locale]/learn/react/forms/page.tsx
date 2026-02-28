"use client";

import dynamic from "next/dynamic";
import { LessonStepPage } from "@/modules/learn/LessonStepPage";

const FormsViz = dynamic(
  () => import("@viz/module-react").then((m) => ({ default: m.FormsViz })),
  { ssr: false }
);

const STEPS = [
  "intro",
  "form",
  "compare",
  "rhf",
  "formik",
  "validation",
  "submit",
] as const;

export default function FormsPage() {
  return (
    <LessonStepPage
      steps={STEPS}
      renderViz={(currentStep) => <FormsViz currentStep={currentStep} />}
      i18nBaseKey="courses.react.lessons.forms.steps"
    />
  );
}
