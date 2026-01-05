"use server";
import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function checkAdmin() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Yetkisiz");
}

export async function getPendingListings() {
  await checkAdmin();
  return db.listing.findMany({
      where: { status: "PENDING" },
      include: { user: true, category: true, images: true }
  });
}

export async function approveListing(id: string) {
  await checkAdmin();
  await db.listing.update({ where: { id }, data: { status: "ACTIVE" } });
  revalidatePath("/admin/listings");
  return { success: true };
}

export async function rejectListing(id: string) {
  await checkAdmin();
  await db.listing.update({ where: { id }, data: { status: "REJECTED" } });
  revalidatePath("/admin/listings");
  return { success: true };
}