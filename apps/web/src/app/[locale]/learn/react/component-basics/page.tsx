"use client";

import { useTranslations } from "next-intl";
import { api } from "../../../../../../convex/_generated/api";
import { WalkthroughPage } from "@/modules/learn/WalkthroughPage";

export default function ComponentBasicsPage() {
  const t = useTranslations("react");
  return (
    <WalkthroughPage
      courseSlug="react"
      slug="component-basics"
      seedAction={api.seed.seedComponentBasics}
      seedLabel={t("seed.componentBasics")}
    />
  );
}
