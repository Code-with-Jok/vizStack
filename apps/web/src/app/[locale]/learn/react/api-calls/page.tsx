"use client";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import dynamic from "next/dynamic";
import { LessonLayout, StepController } from "@viz/ui";

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
  const t = useTranslations();
  const locale = useLocale();
  const [s, setS] = useState(0);
  return (
    <LessonLayout
      visualization={<ApiCallsViz currentStep={s} />}
      controls={
        <StepController
          currentStep={s}
          totalSteps={STEPS.length}
          onNext={() => s < STEPS.length - 1 && setS(s + 1)}
          onPrev={() => s > 0 && setS(s - 1)}
          stepTitle={t(
            `courses.react.lessons.apiCalls.steps.${STEPS[s]}.title`
          )}
          stepContent={t(
            `courses.react.lessons.apiCalls.steps.${STEPS[s]}.content`
          )}
          nextLabel={t("common.next")}
          prevLabel={t("common.prev")}
          stepLabel={t("common.step")}
        />
      }
    />
  );
}
