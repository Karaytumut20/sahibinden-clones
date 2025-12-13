'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { loginSchema } from '@/lib/validators/auth'; // Önceki cevabımdaki şemayı kullandığınızı varsayıyorum

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

    // redirect: false kullanmıyoruz çünkü NextAuth v5 server actionlarında redirect hatası fırlatarak yönlendirme yapar.
    // Ancak form başarılı olursa otomatik yönlendirme için try-catch bloğu dışına çıkmasını bekleriz.
    await signIn('credentials', {
        ...rawData,
        redirect: false, // Manuel kontrol etmek istersek false yapabiliriz ama genelde true bırakıp redirect hatasını yakalamak daha iyidir.
    });
    
    // Eğer buraya kadar hata fırlatılmadıysa her şey yolundadır ama
    // signIn redirect:false ile çağrılırsa hata fırlatmaz, sadece promise döner.
    // NextAuth v5'te redirect genellikle bir hatadır (NEXT_REDIRECT).
    
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'E-posta veya şifre hatalı.';
        case 'CallbackRouteError':
             return 'Giriş sırasında bir bağlantı hatası oluştu.';
        default:
          return 'Bir sorun oluştu. Lütfen tekrar deneyin.';
      }
    }
    // Eğer bu bir redirect hatasıysa (Next.js yönlendirmesi), onu tekrar fırlatmalıyız.
    throw error; 
  }
}