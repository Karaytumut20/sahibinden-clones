import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import db from '@/lib/db';
import { auth } from '@/auth';
import { updateProfile } from '@/actions/settingsActions';

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
            <form action={updateProfile} className='space-y-4'>
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
                
                <Button type="submit" className='bg-[#3b5062]'>Kaydet</Button>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}