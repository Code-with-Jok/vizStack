"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import dynamic from "next/dynamic";
import { LessonLayout, StepController } from "@viz/ui";

const RenderingViz = dynamic(
  () =>
    import("@viz/module-react").then((mod) => ({ default: mod.RenderingViz })),
  { ssr: false }
);

const STEP_KEYS = [
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
  const t = useTranslations();
  const locale = useLocale();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < STEP_KEYS.length - 1) setCurrentStep(currentStep + 1);
  };
  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };
  const stepKey = STEP_KEYS[currentStep];

  return (
    <LessonLayout
      visualization={<RenderingViz currentStep={currentStep} />}
      controls={
        <StepController
          currentStep={currentStep}
          totalSteps={STEP_KEYS.length}
          onNext={handleNext}
          onPrev={handlePrev}
          stepTitle={t(
            `courses.react.lessons.rendering.steps.${stepKey}.title`
          )}
          stepContent={t(
            `courses.react.lessons.rendering.steps.${stepKey}.content`
          )}
          nextLabel={t("common.next")}
          prevLabel={t("common.prev")}
          stepLabel={t("common.step")}
        />
      }
    />
  );
}
