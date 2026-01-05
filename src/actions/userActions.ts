'use server';
import db from '@/lib/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function toggleFavorite(listingId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: 'Giriş gerekli.' };

  const userId = session.user.id;
  const existing = await db.favorite.findUnique({ where: { userId_listingId: { userId, listingId } } });

  if (existing) {
    await db.favorite.delete({ where: { id: existing.id } });
    revalidatePath('/');
    return { success: true, isFavorited: false, message: 'Favorilerden çıkarıldı.' };
  } else {
    await db.favorite.create({ data: { userId, listingId } });
    revalidatePath('/');
    return { success: true, isFavorited: true, message: 'Favorilere eklendi.' };
  }
}

export async function deleteListing(listingId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false };

  const listing = await db.listing.findUnique({ where: { id: listingId } });
  if (!listing || listing.userId !== session.user.id) return { success: false, message: 'Yetkisiz' };

  await db.listing.delete({ where: { id: listingId } });
  revalidatePath('/profile/my-listings');
  return { success: true, message: 'Silindi.' };
}