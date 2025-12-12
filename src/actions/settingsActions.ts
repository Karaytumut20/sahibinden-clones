'use server';
import db from '@/lib/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) return { success: false, message: 'Oturum açın.' };

    const name = formData.get('name') as string;
    const surname = formData.get('surname') as string;
    const phone = formData.get('phone') as string;

    try {
        await db.user.update({
            where: { email: session.user.email },
            data: { name, surname, phone }
        });
        revalidatePath('/profile/settings');
        return { success: true, message: 'Profil güncellendi.' };
    } catch (e) {
        return { success: false, message: 'Hata oluştu.' };
    }
}