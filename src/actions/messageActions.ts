
'use server';

import { db } from '@/lib/mock-db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function sendMessage(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return { success: false, message: 'Giriş yapmalısınız.' };

  const sender = await db.user.findUnique({ where: { email: session.user.email } });
  if (!sender) return { success: false, message: 'Kullanıcı bulunamadı.' };

  const receiverId = formData.get('receiverId') as string;
  const listingId = formData.get('listingId') as string;
  const content = formData.get('content') as string;

  if (!content || !receiverId) return { success: false, message: 'Eksik bilgi.' };

  try {
    await db.message.create({
      data: {
        content,
        senderId: sender.id,
        receiverId,
        listingId: listingId || null
      }
    });

    revalidatePath('/profile/messages');
    return { success: true, message: 'Mesaj gönderildi.' };
  } catch (error) {
    return { success: false, message: 'Mesaj gönderilemedi.' };
  }
}

export async function getConversations() {
  const session = await auth();
  if (!session?.user?.email) return [];

  const user = await db.user.findUnique({ where: { email: session.user.email } });
  if (!user) return [];

  const messages = await db.message.findMany({
    where: {
      OR: [{ senderId: user.id }, { receiverId: user.id }]
    },
    include: true // Mock DB'de include logic var
  });

  const conversations = new Map();

  for (const msg of messages) {
    const otherUser = msg.senderId === user.id ? msg.receiver : msg.sender;
    if(!otherUser) continue;

    const key = otherUser.id;

    if (!conversations.has(key)) {
      conversations.set(key, {
        user: otherUser,
        lastMessage: msg,
        listing: msg.listing
      });
    }
  }

  return Array.from(conversations.values());
}

export async function getMessagesWithUser(otherUserId: string) {
  const session = await auth();
  if (!session?.user?.email) return [];

  const user = await db.user.findUnique({ where: { email: session.user.email } });
  if (!user) return [];

  return await db.message.findMany({
    where: {
      OR: [
        { senderId: user.id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: user.id }
      ]
    }
  });
}
