"use server";

import connectToDB from "@/lib/db";
import Listing from "@/models/Listing";
import { revalidatePath } from "next/cache";

export async function createListing(formData: any) {
  try {
    await connectToDB();

    const newListing = await Listing.create({
      title: formData.title,
      description: formData.description || "",
      price: Number(formData.price),
      category: formData.category,
      currency: "TL",
      images: [], // Şimdilik boş, resim upload entegrasyonu sonra yapılacak
      status: "active"
    });

    console.log("İlan başarıyla veritabanına eklendi ID:", newListing._id);

    // Anasayfayı ve kategori sayfalarını yenile
    revalidatePath("/");
    
    return { success: true, message: "İlan başarıyla oluşturuldu!" };
  } catch (error) {
    console.error("İlan oluşturma hatası:", error);
    return { success: false, message: "Veritabanı hatası oluştu." };
  }
}
