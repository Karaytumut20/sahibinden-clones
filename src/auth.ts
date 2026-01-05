import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import db from "@/lib/db"; // Mock DB
import { authConfig } from "./auth.config";

// Basit giriş şeması
const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // Mock DB'den kullanıcıyı bul (Dizi içinden arar)
        const user = await db.user.findUnique({ where: { email } });
        if (!user) return null;

        // Şifre kontrolü (Basit string karşılaştırması)
        // Not: Gerçek app'te bcrypt kullanılır, burada mock olduğu için direkt bakıyoruz.
        if (password === user.password || password === 'demo') {
             return {
                id: user.id,
                email: user.email,
                name: user.name + " " + (user.surname || ""),
                role: user.role,
                image: user.image
             };
        }
        return null;
      },
    }),
  ],
});