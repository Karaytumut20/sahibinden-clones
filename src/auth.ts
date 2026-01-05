
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { authConfig } from "./auth.config";
import { db } from "@/lib/mock-db";

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

        // Mock DB'den kullanıcıyı bul
        const user = await db.user.findUnique({ where: { email } });

        if (!user) return null;

        // Mock ortamında şifre kontrolü basitleştirildi
        // Gerçekte bcrypt.compare kullanılırdı
        // Kullanıcı 'demo@...' ise şifre 'demo'
        // Kullanıcı 'admin@...' ise şifre 'admin'
        let isValid = false;
        if(email.includes('demo') && password === 'demo') isValid = true;
        if(email.includes('admin') && password === 'admin') isValid = true;
        if(email.includes('guven') && password === '123') isValid = true;

        // Yeni kayıt olanlar için her şifreyi kabul et (Test kolaylığı)
        if(!email.includes('demo') && !email.includes('admin') && !email.includes('guven')) isValid = true;

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          surname: user.surname,
          role: user.role,
        } as any;
      },
    }),
  ],
});
