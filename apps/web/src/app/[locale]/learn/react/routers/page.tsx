"use client";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import dynamic from "next/dynamic";
import { LessonLayout, StepController } from "@viz/ui";

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
  const t = useTranslations();
  const locale = useLocale();
  const [s, setS] = useState(0);
  return (
    <LessonLayout
      visualization={<RoutersViz currentStep={s} />}
      controls={
        <StepController
          currentStep={s}
          totalSteps={STEPS.length}
          onNext={() => s < STEPS.length - 1 && setS(s + 1)}
          onPrev={() => s > 0 && setS(s - 1)}
          stepTitle={t(`courses.react.lessons.routers.steps.${STEPS[s]}.title`)}
          stepContent={t(
            `courses.react.lessons.routers.steps.${STEPS[s]}.content`
          )}
          nextLabel={t("common.next")}
          prevLabel={t("common.prev")}
          stepLabel={t("common.step")}
        />
      }
    />
  );
}
