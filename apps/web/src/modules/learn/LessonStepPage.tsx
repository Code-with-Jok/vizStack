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
  const stepKey = steps.length > 0 ? steps[currentStep] : undefined;

  const handleNext = () => {
    if (steps.length > 0 && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (steps.length > 0 && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (steps.length === 0) {
    return (
      <LessonLayout
        visualization={
          <div className="p-8 text-center text-muted-foreground">
            No content available for this lesson.
          </div>
        }
        controls={null}
      />
    );
  }

  return (
    <LessonLayout
      visualization={renderViz(currentStep)}
      controls={
        <StepController
          currentStep={currentStep}
          totalSteps={steps.length}
          onNext={handleNext}
          onPrev={handlePrev}
          stepTitle={stepKey ? t(`${i18nBaseKey}.${stepKey}.title`) : ""}
          stepContent={stepKey ? t(`${i18nBaseKey}.${stepKey}.content`) : ""}
          nextLabel={t("common.next")}
          prevLabel={t("common.prev")}
          stepLabel={t("common.step")}
        />
      }
    />
  );
}
