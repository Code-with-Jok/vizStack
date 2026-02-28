"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

/**
 * Shared hook to load a walkthrough and its chapters from Convex.
 * Keeps the existing semantics:
 * - `walkthrough === undefined` or `chapters === undefined` => loading
 * - `walkthrough === null` => no data / needs seeding
 */
export function useWalkthrough(courseSlug: string, slug: string) {
  const walkthrough = useQuery(api.walkthroughs.getBySlug, {
    courseSlug,
    slug,
  });

  const chapters = useQuery(
    api.chapters.listByWalkthrough,
    walkthrough ? { walkthroughId: walkthrough._id } : "skip"
  );

  const isLoading = walkthrough === undefined || chapters === undefined;

  const sortedChapters =
    chapters && !isLoading
      ? [...chapters].sort((a, b) => a.order - b.order)
      : chapters ?? undefined;

  return {
    walkthrough,
    chapters: sortedChapters,
    isLoading,
    hasWalkthrough: !!walkthrough,
  };
}

