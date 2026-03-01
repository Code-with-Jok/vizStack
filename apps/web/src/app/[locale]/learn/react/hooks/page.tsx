"use client";

import { useTranslations } from "next-intl";
import { api } from "../../../../../../convex/_generated/api";
import { WalkthroughPage } from "@/modules/learn/WalkthroughPage";

export default function HooksPage() {
  const t = useTranslations("react");
  return (
    <WalkthroughPage
      courseSlug="react"
      slug="hooks"
      seedAction={api.seedExtra.seedHooks}
      seedLabel={t("seed.hooks")}
    />
  );
}
