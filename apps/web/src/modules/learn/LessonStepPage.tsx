"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { LessonLayout, StepController } from "@viz/ui";

interface LessonStepPageProps {
  steps: readonly string[];
  renderViz: (step: number) => ReactNode;
  i18nBaseKey: string;
}

export function LessonStepPage({
  steps,
  renderViz,
  i18nBaseKey,
}: LessonStepPageProps) {
  const t = useTranslations();
  const [currentStep, setCurrentStep] = useState(0);
  const stepKey = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <LessonLayout
      visualization={renderViz(currentStep)}
      controls={
        <StepController
          currentStep={currentStep}
          totalSteps={steps.length}
          onNext={handleNext}
          onPrev={handlePrev}
          stepTitle={t(`${i18nBaseKey}.${stepKey}.title`)}
          stepContent={t(`${i18nBaseKey}.${stepKey}.content`)}
          nextLabel={t("common.next")}
          prevLabel={t("common.prev")}
          stepLabel={t("common.step")}
        />
      }
    />
  );
}
