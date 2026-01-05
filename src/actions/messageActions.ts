'use server';
import db from '@/lib/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function sendMessage(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: 'Giriş gerekli.' };

  const content = formData.get('content') as string;
  const receiverId = formData.get('receiverId') as string;
  const listingId = formData.get('listingId') as string;

  await db.message.create({
    data: { content, senderId: session.user.id, receiverId, listingId }
  });

  revalidatePath('/profile/messages');
  return { success: true };
}

export async function getConversations() {
  const session = await auth();
  if (!session?.user?.id) return [];

  // Mock DB include logic'ini kullan
  const msgs = await db.message.findMany({
      where: { OR: [{ senderId: session.user.id }, { receiverId: session.user.id }] },
      include: true // Mock'ta bu destekleniyor
  });

  // Grouping logic (basitleştirilmiş)
  const map = new Map();
  msgs.forEach((m: any) => {
      const other = m.senderId === session.user.id ? m.receiver : m.sender;
      if(!other) return;
      if(!map.has(other.id)) map.set(other.id, { user: other, lastMessage: m });
  });

  return Array.from(map.values());
}

export async function getMessagesWithUser(uid: string) {
  const session = await auth();
  if (!session?.user?.id) return [];
  return db.message.findMany({
      where: { OR: [{ senderId: session.user.id }, { receiverId: session.user.id }] }
  }); // Mock client zaten basit filtreliyor
}