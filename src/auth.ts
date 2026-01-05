import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";

import db from "@/lib/db";
import { authConfig } from "./auth.config";

// Validasyon şeması
const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db) as any,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log("🔐 Giriş denemesi başlatıldı:", credentials?.email);

        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
            console.log("❌ Validasyon hatası:", parsed.error.errors);
            return null;
        }

        const { email, password } = parsed.data;

        const user = await db.user.findUnique({ where: { email } });
        
        if (!user) {
            console.log("❌ Kullanıcı bulunamadı.");
            return null;
        }
        
        if (!user.password) {
             console.log("❌ Kullanıcının şifresi yok (Google/OAuth ile kayıtlı olabilir).");
             return null;
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
            console.log("❌ Şifre hatalı.");
            return null;
        }

        console.log("✅ Giriş başarılı:", user.email);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          surname: user.surname, // Eğer tip hatası alırsanız burayı kaldırın veya types dosyasını güncelleyin
          role: user.role,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        // İsterseniz ad soyad da ekleyebilirsiniz
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = (token.role as any) ?? "INDIVIDUAL";
      }
      return session;
    },
  },
});