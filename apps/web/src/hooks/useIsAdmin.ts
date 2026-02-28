"use client";

import { useUser } from "@clerk/nextjs";

export function useIsAdmin() {
  const { user } = useUser();
  const adminIdentity = process.env.NEXT_PUBLIC_IS_ADMIN;

  if (!user || !adminIdentity) {
    return false;
  }

  return (
    user.id === adminIdentity ||
    user.primaryEmailAddress?.emailAddress === adminIdentity ||
    user.username === adminIdentity
  );
}
