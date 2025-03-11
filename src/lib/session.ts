"use server";

import { auth } from "@/auth";

export interface SessionUser {
  id: string;
  name: string;
}

/**
 * Get the current user session
 * @returns The current user session
 */
export async function getCurrentUser(): Promise<SessionUser> {
  const session = await auth();

  if (!session) {
    throw new Error("No session found");
  }

  if (!session.user?.id && !session.user?.email) {
    throw new Error("No user id or email found in session");
  }

  return {
    id: session.user.id || session.user.email || "Unknown",
    name: session.user?.name || "Unknown",
  };
}
