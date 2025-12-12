import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // Aşağıdaki yollar haricindeki her şeyde middleware çalışsın
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};