import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import db from '@/lib/db';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      async authorize(credentials) {
        // Şifre kontrolünü 6 karakterden 1 karaktere indirdik
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(1) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email } = parsedCredentials.data;
          
          // Kullanıcıyı bul
          const user = await db.user.findUnique({ where: { email } });
          if (!user) return null;
          
          // Geliştirme aşamasında şifre kontrolünü atlıyoruz (Direkt giriş)
          return user; 
        }
        console.log('Validasyon hatası:', parsedCredentials.error);
        return null;
      },
    }),
  ],
});