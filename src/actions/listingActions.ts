"use server";

import connectToDB from "@/lib/db";
import Listing from "@/models/Listing";
import { revalidatePath } from "next/cache";

// Bu fonksiyon sunucuda çalışır, form verisini alır ve veritabanına yazar
export async function createListing(formData: any) {
  try {
    // 1. Veritabanı bağlantısını kontrol et / bağlan
    await connectToDB();

    console.log("Veritabanına bağlanıldı, kayıt başlıyor...");

    // 2. Yeni ilanı oluştur
    const newListing = await Listing.create({
      title: formData.title,
      description: formData.description,
      price: Number(formData.price), // Fiyatı sayıya çeviriyoruz
      category: formData.category,
      currency: formData.currency || "TL",
      images: [], // Şimdilik resim yok, boş kutu gönderiyoruz
    });

    console.log("İlan kaydedildi:", newListing._id);

    // 3. Anasayfayı yenile ki yeni ilan hemen görünsün
    revalidatePath("/");

    // İşlem başarılı mesajı dön
    return { success: true, message: "İlan başarıyla oluşturuldu!" };

  } catch (error) {
    console.error("Hata oluştu:", error);
    return { success: false, message: "Bir hata oluştu, kayıt yapılamadı." };
  }
}