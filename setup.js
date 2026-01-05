const fs = require("fs");
const path = require("path");

// 1. Dosya: src/actions/settingsActions.ts
const settingsActionsContent = `'use server';
import db from '@/lib/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

// prevState parametresi eklendi
export async function updateProfile(prevState: any, formData: FormData) {
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
`;

// 2. Dosya: src/components/profile/ProfileSettingsForm.tsx
const profileSettingsFormContent = `'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateProfile } from '@/actions/settingsActions';

export default function ProfileSettingsForm({ user }: { user: any }) {
  // useActionState ile form durumunu ve action sonucunu yönetiyoruz
  const [state, action] = useActionState(updateProfile, null);

  return (
    <form action={action} className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
                <Label>Ad</Label>
                <Input name="name" defaultValue={user?.name || ''} />
            </div>
            <div className='space-y-2'>
                <Label>Soyad</Label>
                <Input name="surname" defaultValue={user?.surname || ''} />
            </div>
        </div>
        <div className='space-y-2'>
            <Label>E-posta (Değiştirilemez)</Label>
            <Input value={user?.email || ''} disabled className='bg-gray-50' />
        </div>
        <div className='space-y-2'>
            <Label>Telefon</Label>
            <Input name="phone" defaultValue={user?.phone || ''} placeholder="05XX..." />
        </div>

        {/* Başarı veya Hata Mesajı Gösterimi */}
        {state?.message && (
            <div className={\`p-3 rounded text-sm \${state.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}\`}>
                {state.message}
            </div>
        )}

        <Button type="submit" className='bg-[#3b5062] hover:bg-[#2c3e4e]'>Kaydet</Button>
    </form>
  );
}
`;

// 3. Dosya: src/app/profile/settings/page.tsx
const settingsPageContent = `import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import db from '@/lib/db';
import { auth } from '@/auth';
import ProfileSettingsForm from '@/components/profile/ProfileSettingsForm';

export default async function SettingsPage() {
  const session = await auth();
  const user = await db.user.findUnique({ where: { email: session?.user?.email || '' } });

  return (
    <div className='max-w-2xl'>
      <h1 className='text-2xl font-bold text-[#3b5062] mb-6'>Hesap Ayarları</h1>

      <Card>
        <CardHeader>
            <CardTitle className='text-lg'>Kişisel Bilgiler</CardTitle>
        </CardHeader>
        <CardContent>
            {/* Form mantığı client component'e taşındı */}
            <ProfileSettingsForm user={user} />
        </CardContent>
      </Card>
    </div>
  );
}
`;

// 4. Dosya: src/app/profile/messages/page.tsx (Tip hatası düzeltmesi)
const messagesPageContent = `import { getConversations, getMessagesWithUser } from "@/actions/messageActions";
import ChatWindow from "@/components/profile/messages/ChatWindow";
import ChatList from "@/components/profile/messages/ChatList";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { auth } from "@/auth";
import db from "@/lib/db";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const session = await auth();
  const user = await db.user.findUnique({ where: { email: session?.user?.email || "" } });

  if (!user) return <div>Lütfen giriş yapın.</div>;

  const params = await searchParams;
  const activeUserId = params.uid;

  const conversations = await getConversations();

  // DÜZELTME: Değişkeni tek seferde tanımlayıp tip karmaşasını önlüyoruz
  const activeMessages = activeUserId ? await getMessagesWithUser(activeUserId) : [];

  let activeReceiverName = "";

  if (activeUserId) {
    const receiver = await db.user.findUnique({ where: { id: activeUserId }, select: { name: true, surname: true } });
    activeReceiverName = \`\${receiver?.name || ""} \${receiver?.surname || ""}\`.trim() || "Kullanıcı";
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <h1 className="text-2xl font-bold text-[#3b5062] mb-4">Mesaj Kutusu</h1>

      <Card className="flex-1 flex overflow-hidden border shadow-sm h-full">
        <div className={\`w-full md:w-80 border-r bg-white flex-shrink-0 \${activeUserId ? "hidden md:flex" : "flex"}\`}>
            <ChatList conversations={conversations} />
        </div>

        <div className={\`flex-1 flex flex-col bg-gray-50 \${!activeUserId ? "hidden md:flex" : "flex"}\`}>
            {activeUserId ? (
                <ChatWindow
                    messages={activeMessages}
                    currentUserId={user.id}
                    receiverId={activeUserId}
                    receiverName={activeReceiverName}
                />
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                     <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <MessageSquare size={48} className="text-gray-300" />
                     </div>
                     <p className="text-lg font-medium">Sohbet Başlatın</p>
                     <p className="text-sm">Mesajlaşmaya başlamak için soldan bir kişi seçin.</p>
                </div>
            )}
        </div>
      </Card>
    </div>
  );
}
`;

function writeFile(filePath, content) {
  const absolutePath = path.join(process.cwd(), filePath);
  const dir = path.dirname(absolutePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Klasör oluşturuldu: ${dir}`);
  }

  fs.writeFileSync(absolutePath, content, "utf8");
  console.log(`✅ Dosya güncellendi/oluşturuldu: ${filePath}`);
}

console.log("🔄 Düzeltmeler uygulanıyor...");

// Dosyaları yaz
writeFile("src/actions/settingsActions.ts", settingsActionsContent);
writeFile(
  "src/components/profile/ProfileSettingsForm.tsx",
  profileSettingsFormContent
);
writeFile("src/app/profile/settings/page.tsx", settingsPageContent);
writeFile("src/app/profile/messages/page.tsx", messagesPageContent);

console.log(
  "🎉 Tüm düzeltmeler başarıyla uygulandı! Şimdi projeyi tekrar build edebilirsiniz."
);
