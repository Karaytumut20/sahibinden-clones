"use server";

import db from "@/lib/db";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";
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

  const category = await db.category.findUnique({ where: { slug: data.category } });
  if (!category) {
    return { success: false, message: "Kategori bulunamadı." };
  }

  try {
    const listing = await db.listing.create({
      data: {
        title: data.title,
        description: data.description ?? "",
        price: new Prisma.Decimal(data.price),
        currency: data.currency ?? "TL",
        city: data.city,
        district: data.district,
        // SQLite: Resimler artık relation olarak ekleniyor
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
    return { success: false, message: "Veritabanı hatası: " + e.message };
  }
}

export async function getMyListings() {
  const session = await auth();
  if (!session?.user?.id) return [];
  return db.listing.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { category: true, images: true },
  });
}
