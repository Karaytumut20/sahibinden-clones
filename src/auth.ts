import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import db from "@/lib/db";
import { authConfig } from "./auth.config";

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

        // Mock DB'den kullanıcı bul
        const user = await db.user.findUnique({ where: { email } });
        if (!user) return null;

        // Basit şifre kontrolü (Mock veriler için)
        if (password === user.password || password === 'demo' || password === 'admin') {
             // as any ekleyerek TypeScript hatasını çözüyoruz
             return {
                id: user.id,
                email: user.email,
                name: user.name,
                surname: user.surname,
                role: user.role,
             } as any;
        }
        return null;
      },
    }),
  ],
});