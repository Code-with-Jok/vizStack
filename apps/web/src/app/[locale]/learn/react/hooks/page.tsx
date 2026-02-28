"use client";

import { api } from "../../../../../../convex/_generated/api";
import { WalkthroughPage } from "@/modules/learn/WalkthroughPage";

export default function HooksPage() {
  return (
    <WalkthroughPage
      courseSlug="react"
      slug="hooks"
      seedAction={api.seedExtra.seedHooks}
      seedLabel="🌱 Seed React Hooks"
    />
  );
}
