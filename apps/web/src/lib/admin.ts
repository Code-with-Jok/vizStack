import { auth } from "@clerk/nextjs/server";

/**
 * Server-side version of isAdmin check for use in API routes,
 * middleware, and server components/actions.
 */
export async function isAdminServer() {
  const { userId, sessionClaims } = await auth();
  const adminIdentity = process.env.IS_ADMIN;

  if (!userId || !adminIdentity) {
    return false;
  }

  // Check against secure server-only env var
  // sessionClaims could also contain roles if configured in Clerk
  const email = (sessionClaims as any)?.email;
  const username = (sessionClaims as any)?.username;

  return (
    userId === adminIdentity ||
    email === adminIdentity ||
    username === adminIdentity
  );
}
