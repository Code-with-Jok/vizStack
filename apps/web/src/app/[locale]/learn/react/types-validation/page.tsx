"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { LessonLayout, StepController } from "@viz/ui";

const TypesValidationViz = dynamic(
  () =>
    import("@viz/module-react").then((m) => ({
      default: m.TypesValidationViz,
    })),
  { ssr: false }
);
const STEPS = ["intro", "js", "ts", "types", "zod", "checks", "safe"] as const;

export default function TypesPage() {
  const t = useTranslations();
  const [s, setS] = useState(0);
  return (
    <LessonLayout
      visualization={<TypesValidationViz currentStep={s} />}
      controls={
        <StepController
          currentStep={s}
          totalSteps={STEPS.length}
          onNext={() => s < STEPS.length - 1 && setS(s + 1)}
          onPrev={() => s > 0 && setS(s - 1)}
          stepTitle={t(
            `courses.react.lessons.typesValidation.steps.${STEPS[s]}.title`
          )}
          stepContent={t(
            `courses.react.lessons.typesValidation.steps.${STEPS[s]}.content`
          )}
          nextLabel={t("common.next")}
          prevLabel={t("common.prev")}
          stepLabel={t("common.step")}
        />
      }
    />
  );
}
