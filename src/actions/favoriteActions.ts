
"use server";

import { db } from "@/lib/mock-db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function toggleFavorite(listingId: string) {
  // UserActions'daki ile aynı mantık, burası duplicated kalmış orijinal projede
  // Basitlik için userActions'dakini kullanması sağlanabilir ama burada da mockluyoruz
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: "Giriş gerekli." };

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
    include: { listing: true },
  });
}
