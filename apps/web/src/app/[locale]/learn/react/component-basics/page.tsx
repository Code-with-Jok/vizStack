"use client";

import { api } from "../../../../../../convex/_generated/api";
import { WalkthroughPage } from "@/modules/learn/WalkthroughPage";

export default function ComponentBasicsPage() {
  return (
    <WalkthroughPage
      courseSlug="react"
      slug="component-basics"
      seedAction={api.seed.seedComponentBasics}
      seedLabel="🌱 Seed Component Basics"
    />
  );
}
