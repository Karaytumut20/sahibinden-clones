"use server";
import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { createListingSchema } from "@/lib/validators/listing";

export async function createListing(input: any) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: "Giriş yapmalısınız." };

  const parsed = createListingSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Form hatası" };

  const data = parsed.data;

  const category = await db.category.findUnique({ where: { slug: data.category } });
  if (!category) return { success: false, message: "Kategori bulunamadı." };

  await db.listing.create({
    data: {
      ...data,
      price: parseFloat(data.price),
      images: { create: data.images.map((url: string) => ({ url })) },
      status: "PENDING",
      user: { connect: { id: session.user.id } },
      category: { connect: { id: category.id } },
    }
  });

  revalidatePath("/");
  return { success: true, message: "İlan oluşturuldu (Mock)" };
}

export async function getMyListings() {
  const session = await auth();
  if (!session?.user?.id) return [];
  return db.listing.findMany({
    where: { userId: session.user.id },
    include: { images: true }
  });
}