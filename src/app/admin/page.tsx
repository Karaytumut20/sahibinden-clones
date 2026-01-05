
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, ShoppingBag, DollarSign } from 'lucide-react';
import { db } from '@/lib/mock-db';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function AdminDashboard() {
  const session = await auth();
  if (!session) redirect('/login');

  const [userCount, listingCount, storeCount] = await Promise.all([
    db.user.count(),
    db.listing.count(),
    db.store.count()
  ]);

  const stats = [
    { title: 'Toplam Üye', value: userCount, icon: <Users className='h-4 w-4 text-muted-foreground' /> },
    { title: 'Aktif İlanlar', value: listingCount, icon: <FileText className='h-4 w-4 text-muted-foreground' /> },
    { title: 'Mağazalar', value: storeCount, icon: <ShoppingBag className='h-4 w-4 text-muted-foreground' /> },
    { title: 'Toplam Gelir', value: '₺0.00', icon: <DollarSign className='h-4 w-4 text-muted-foreground' /> },
  ];

  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold tracking-tight text-[#3b5062]'>Admin Paneli (Mock Data)</h1>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
        Bu panel şu anda statik/mock veri ile çalışmaktadır.
      </div>
    </div>
  );
}
