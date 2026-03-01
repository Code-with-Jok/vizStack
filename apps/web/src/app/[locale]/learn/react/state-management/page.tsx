"use client";

import { useTranslations } from "next-intl";
import { api } from "../../../../../../convex/_generated/api";
import { WalkthroughPage } from "@/modules/learn/WalkthroughPage";

export default function StateManagementPage() {
  const t = useTranslations("react");
  return (
    <WalkthroughPage
      courseSlug="react"
      slug="state-management"
      seedAction={api.seedExtra.seedStateManagement}
      seedLabel={t("seed.stateManagement")}
    />
  );
}
