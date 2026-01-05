'use server';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { loginSchema } from '@/lib/validators/auth';

export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = loginSchema.safeParse(rawData);
    if (!validatedFields.success) return "Geçersiz giriş bilgileri.";

    await signIn('credentials', { ...rawData, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === 'CredentialsSignin') return 'E-posta veya şifre hatalı.';
      return 'Bir hata oluştu.';
    }
    throw error;
  }
}