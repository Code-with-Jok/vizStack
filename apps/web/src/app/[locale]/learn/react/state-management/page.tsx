"use client";

import { api } from "../../../../../../convex/_generated/api";
import { WalkthroughPage } from "@/modules/learn/WalkthroughPage";

export default function StateManagementPage() {
  return (
    <WalkthroughPage
      courseSlug="react"
      slug="state-management"
      seedAction={api.seedExtra.seedStateManagement}
      seedLabel="🌱 Seed State Management"
    />
  );
}
