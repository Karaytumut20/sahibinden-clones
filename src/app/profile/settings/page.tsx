
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/mock-db';
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
            <ProfileSettingsForm user={user} />
        </CardContent>
      </Card>
    </div>
  );
}
