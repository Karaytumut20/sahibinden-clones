import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, ShoppingBag, DollarSign } from 'lucide-react';
import db from '@/lib/db';
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
    { title: 'Üyeler', value: userCount, icon: <Users size={16} /> },
    { title: 'İlanlar', value: listingCount, icon: <FileText size={16} /> },
    { title: 'Mağazalar', value: storeCount, icon: <ShoppingBag size={16} /> },
    { title: 'Gelir', value: '₺0', icon: <DollarSign size={16} /> },
  ];

  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold text-[#3b5062]'>Yönetim Paneli (Mock)</h1>
      <div className='grid gap-4 md:grid-cols-4'>
        {stats.map((s, i) => (
          <Card key={i}>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>{s.title}</CardTitle>
              {s.icon}
            </CardHeader>
            <CardContent><div className='text-2xl font-bold'>{s.value}</div></CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}