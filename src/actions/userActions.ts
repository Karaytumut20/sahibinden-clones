'use server';

import db from '@/lib/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function toggleFavorite(listingId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, message: 'Giriş yapmalısınız.' };
  }

  // Session'daki email ile user ID'yi bul (Güvenlik için DB'den çekiyoruz)
  const user = await db.user.findUnique({ where: { email: session.user.email } });
  if (!user) return { success: false, message: 'Kullanıcı bulunamadı.' };

  try {
    const existingFav = await db.favorite.findUnique({
      where: {
        userId_listingId: {
          userId: user.id,
          listingId: listingId
        }
      }
    });

    if (existingFav) {
      await db.favorite.delete({ where: { id: existingFav.id } });
      revalidatePath('/');
      return { success: true, isFavorited: false, message: 'Favorilerden çıkarıldı.' };
    } else {
      await db.favorite.create({
        data: {
          userId: user.id,
          listingId: listingId
        }
      });
      revalidatePath('/');
      return { success: true, isFavorited: true, message: 'Favorilere eklendi.' };
    }
  } catch (error) {
    return { success: false, message: 'İşlem başarısız.' };
  }
}

export async function deleteListing(listingId: string) {
  const session = await auth();
  if (!session?.user?.email) return { success: false };

  const user = await db.user.findUnique({ where: { email: session.user.email } });
  if (!user) return { success: false };

  // Sadece ilanın sahibi silebilir
  const listing = await db.listing.findUnique({ where: { id: listingId } });
  if (!listing || listing.userId !== user.id) {
      return { success: false, message: 'Yetkisiz işlem.' };
  }

  await db.listing.delete({ where: { id: listingId } });
  revalidatePath('/profile/my-listings');
  return { success: true, message: 'İlan silindi.' };
}