'use server';
import db from '@/lib/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function updateProfile(prev: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return { success: false };

  await db.user.update({
      where: { email: session.user.email },
      data: {
          name: formData.get('name'),
          surname: formData.get('surname'),
          phone: formData.get('phone')
      }
  });
  revalidatePath('/profile');
  return { success: true, message: 'Güncellendi' };
}