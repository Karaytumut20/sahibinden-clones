import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Ad en az 2 karakter olmalı."),
  surname: z.string().min(2, "Soyad en az 2 karakter olmalı."),
  email: z.string().email("Geçerli bir e-posta girin."),
  phone: z.string().min(10).max(20).optional().or(z.literal("").transform(() => undefined)),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı."),
});

// Yeni eklenen Login şeması
export const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz."),
  password: z.string().min(1, "Şifre alanı boş bırakılamaz."),
});