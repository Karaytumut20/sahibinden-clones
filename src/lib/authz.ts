import { auth } from "@/auth";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session;
}

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  if (session.user.role !== "ADMIN") return null;
  return session;
}