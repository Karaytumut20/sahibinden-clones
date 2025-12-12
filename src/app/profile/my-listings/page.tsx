import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import db from '@/lib/db';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { deleteListing } from '@/actions/userActions';

export default async function MyListingsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect('/login');

  const user = await db.user.findUnique({ where: { email: session.user.email } });
  if (!user) redirect('/login');

  const listings = await db.listing.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-[#3b5062]'>İlanlarım ({listings.length})</h1>
        <Link href='/new-listing'>
            <Button className='bg-blue-600 hover:bg-blue-700'>Yeni İlan Ekle</Button>
        </Link>
      </div>

      <div className='bg-white border rounded-lg shadow-sm overflow-hidden'>
        {listings.length === 0 ? (
            <div className='p-12 text-center text-gray-500'>
                Henüz hiç ilanınız yok. Hemen satışa başlayın!
            </div>
        ) : (
            listings.map((item) => (
                <div key={item.id} className='flex flex-col md:flex-row items-center gap-4 p-4 border-b last:border-0 hover:bg-gray-50 transition-colors'>
                    <div className='relative w-full md:w-24 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-100'>
                        <Image 
                            src={item.images[0] || 'https://placehold.co/100x75?text=No+Image'} 
                            alt={item.title} 
                            fill 
                            className='object-cover' 
                        />
                    </div>

                    <div className='flex-1 text-center md:text-left w-full'>
                        <h3 className='font-semibold text-[#3b5062] line-clamp-1'>{item.title}</h3>
                        <div className='text-red-600 font-bold text-sm'>
                            {Number(item.price).toLocaleString('tr-TR')} {item.currency}
                        </div>
                        <div className='text-xs text-gray-400 mt-1'>İlan No: {item.id.substring(0,8)}</div>
                    </div>

                    <div className='w-full md:w-auto text-center'>
                        <Badge variant='outline' className={
                            item.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600'
                        }>
                            {item.status === 'ACTIVE' ? 'Yayında' : item.status}
                        </Badge>
                    </div>

                    <div className='flex gap-2 w-full md:w-auto justify-center'>
                        <form action={async () => {
                            'use server';
                            await deleteListing(item.id);
                        }}>
                            <Button variant='ghost' size='icon' className='h-8 w-8 text-red-600 bg-red-50 hover:bg-red-100'>
                                <Trash2 size={14} />
                            </Button>
                        </form>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
}