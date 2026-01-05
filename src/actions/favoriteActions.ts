"use server";
import db from "@/lib/db";
import { auth } from "@/auth";

export async function getMyFavorites() {
  const session = await auth();
  if (!session?.user?.id) return [];
  return db.favorite.findMany({
      where: { userId: session.user.id },
      include: { listing: true }
  });
}