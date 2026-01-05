'use client';

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
            <div className={`p-3 rounded text-sm ${state.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {state.message}
            </div>
        )}

        <Button type="submit" className='bg-[#3b5062] hover:bg-[#2c3e4e]'>Kaydet</Button>
    </form>
  );
}
