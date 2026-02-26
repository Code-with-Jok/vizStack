"use client";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import dynamic from "next/dynamic";
import { LessonLayout, StepController } from "@viz/ui";

const FrameworksViz = dynamic(
  () => import("@viz/module-react").then((m) => ({ default: m.FrameworksViz })),
  { ssr: false }
);
const STEPS = [
  "intro",
  "react",
  "compare",
  "nextjs",
  "astro",
  "reactRouter",
  "fullstack",
] as const;

export default function FrameworksPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [s, setS] = useState(0);
  return (
    <LessonLayout
      visualization={<FrameworksViz currentStep={s} />}
      controls={
        <StepController
          currentStep={s}
          totalSteps={STEPS.length}
          onNext={() => s < STEPS.length - 1 && setS(s + 1)}
          onPrev={() => s > 0 && setS(s - 1)}
          stepTitle={t(
            `courses.react.lessons.frameworks.steps.${STEPS[s]}.title`
          )}
          stepContent={t(
            `courses.react.lessons.frameworks.steps.${STEPS[s]}.content`
          )}
          nextLabel={t("common.next")}
          prevLabel={t("common.prev")}
          stepLabel={t("common.step")}
        />
      }
    />
  );
}
