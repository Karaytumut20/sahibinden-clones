'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

// Giriş işlemini yapan Server Action
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', Object.fromEntries(formData));
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'E-posta veya şifre hatalı.';
        default:
          return 'Bir sorun oluştu, lütfen tekrar deneyin.';
      }
    }
    // NextAuth redirect hatasını fırlatmalı ki yönlendirme çalışsın
    throw error;
  }
}