
"use server";

import { db } from "@/lib/mock-db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function requireAdminOrThrow() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Giriş yapmalısınız.");
  if ((session.user as any).role !== "ADMIN") throw new Error("Yetkisiz işlem.");
  return session;
}

export async function getPendingListings() {
  await requireAdminOrThrow();
  return db.listing.findMany({
    where: { status: "PENDING" },
    include: {
      user: true,
      category: true,
      images: true,
    },
  });
}

export async function approveListing(listingId: string) {
  await requireAdminOrThrow();

  await db.listing.update({
    where: { id: listingId },
    data: {
      status: "ACTIVE",
      moderatedAt: new Date(),
      publishedAt: new Date(),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/listings");
  return { success: true };
}

export async function rejectListing(listingId: string, note?: string) {
  await requireAdminOrThrow();

  await db.listing.update({
    where: { id: listingId },
    data: {
      status: "REJECTED",
      moderationNote: note ?? "İlan reddedildi.",
    },
  });

  revalidatePath("/admin/listings");
  return { success: true };
}
