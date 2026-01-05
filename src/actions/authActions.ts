
'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { loginSchema } from '@/lib/validators/auth';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = loginSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return "Lütfen geçerli bir e-posta ve şifre giriniz.";
    }

    await signIn('credentials', {
        ...rawData,
        redirect: false,
    });

  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'E-posta veya şifre hatalı. (Demo hesap: demo@sahibindenclone.com / demo)';
        default:
          return 'Bir sorun oluştu. Lütfen tekrar deneyin.';
      }
    }
    throw error;
  }
}
