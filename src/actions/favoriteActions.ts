"use server";

import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function toggleFavorite(listingId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Favori için giriş yapmalısınız." };
  }

  const existing = await db.favorite.findUnique({
    where: { userId_listingId: { userId: session.user.id, listingId } },
  });

  if (existing) {
    await db.favorite.delete({ where: { id: existing.id } });
    revalidatePath("/profile");
    return { success: true, favorited: false };
  }

  await db.favorite.create({ data: { userId: session.user.id, listingId } });
  revalidatePath("/profile");
  return { success: true, favorited: true };
}

export async function getMyFavorites() {
  const session = await auth();
  if (!session?.user?.id) return [];
  return db.favorite.findMany({
    where: { userId: session.user.id },
    include: { listing: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
  });
}