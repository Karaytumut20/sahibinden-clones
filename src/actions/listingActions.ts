
"use server";

import { db } from "@/lib/mock-db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { createListingSchema } from "@/lib/validators/listing";

export async function createListing(input: any) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "İlan verebilmek için giriş yapmalısınız." };
  }

  const parsed = createListingSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues.map(i => i.message).join(" | ") };
  }

  const data = parsed.data;

  // Mock DB işlemleri
  try {
    const category = await db.category.findUnique({ where: { slug: data.category } });
    if (!category) return { success: false, message: "Kategori bulunamadı." };

    const listing = await db.listing.create({
      data: {
        title: data.title,
        description: data.description ?? "",
        price: parseFloat(data.price),
        currency: data.currency ?? "TL",
        city: data.city,
        district: data.district,
        images: {
            create: data.images.map((url: string) => ({ url }))
        },
        status: "PENDING",
        user: { connect: { id: session.user.id } },
        category: { connect: { id: category.id } },
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/listings");
    return { success: true, message: "İlan kaydedildi. Admin onayından sonra yayına alınacak.", listingId: listing.id };
  } catch (e: any) {
    return { success: false, message: "Hata: " + e.message };
  }
}

export async function getMyListings() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return db.listing.findMany({
    where: { userId: session.user.id },
    include: { category: true, images: true },
  });
}
