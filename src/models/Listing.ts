import mongoose, { Schema, Document, Model } from "mongoose";

// TypeScript için veri tipini tanımlıyoruz (Kod yazarken bize yardımcı olacak)
export interface IListing extends Document {
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  status: "active" | "pending" | "passive";
  images: string[];
  createdAt: Date;
}

// MongoDB için şablonumuzu oluşturuyoruz
const ListingSchema = new Schema<IListing>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: "TL" },
    category: { type: String, required: true },
    status: { type: String, default: "pending" }, // İlan ilk eklendiğinde "Onay Bekliyor" olsun
    images: { type: [String], default: [] }, // Resim linklerini tutacağız
  },
  { timestamps: true } // Bu özellik sayesinde "oluşturulma tarihi" otomatik eklenir
);

// Eğer model daha önce tanımlandıysa onu kullan, yoksa yenisini oluştur (Next.js hatasını önler)
const Listing: Model<IListing> = mongoose.models.Listing || mongoose.model<IListing>("Listing", ListingSchema);

export default Listing;