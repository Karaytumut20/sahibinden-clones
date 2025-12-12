'use server';

import db from '@/lib/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function createListing(formData: any) {
  const session = await auth();
  
  let userId = session?.user?.id;
  
  if (!userId) {
     const demoUser = await db.user.findFirst();
     if (demoUser) {
        userId = demoUser.id;
     } else {
        // Kullanıcı yoksa oluştur
        try {
            const newUser = await db.user.create({
                data: {
                    email: 'demo@sahibindenclone.com',
                    password: 'demo', 
                    name: 'Demo Kullanıcı',
                    role: 'INDIVIDUAL'
                }
            });
            userId = newUser.id;
        } catch (e) {
            return { success: false, message: 'Kullanıcı oluşturulamadı.' };
        }
     }
  }

  try {
    const { title, price, description, category, images, currency } = formData;

    const newListing = await db.listing.create({
      data: {
        title,
        description: description || '',
        price: parseFloat(price),
        currency: currency || 'TL',
        category: {
            connectOrCreate: {
                where: { slug: category },
                create: { name: category.charAt(0).toUpperCase() + category.slice(1), slug: category }
            }
        },
        city: 'İstanbul',
        district: 'Kadıköy',
        status: 'ACTIVE',
        images: images || [],
        user: {
            connect: { id: userId }
        }
      },
    });

    console.log('✅ İlan veritabanına eklendi:', newListing.id);
    revalidatePath('/');
    return { success: true, message: 'İlan başarıyla oluşturuldu!', listingId: newListing.id };
    
  } catch (error: any) {
    console.error('❌ İlan oluşturma hatası:', error);
    return { success: false, message: 'Veritabanı hatası: ' + error.message };
  }
}