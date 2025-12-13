import { z } from "zod";

export const createListingSchema = z.object({
  category: z.string().min(1),
  title: z.string().min(5, "Başlık en az 5 karakter olmalı."),
  price: z.string().min(1),
  currency: z.string().default("TL"),
  description: z.string().optional().default(""),
  images: z.array(z.string().url()).min(1, "En az 1 fotoğraf gerekli.").max(10),
  city: z.string().min(1).default("İstanbul"),
  district: z.string().min(1).default("Kadıköy"),
});