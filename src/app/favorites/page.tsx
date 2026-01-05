import ListingCard from '@/components/listings/ListingCard';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import db from '@/lib/db';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user?.email) redirect('/login');

  const user = await db.user.findUnique({ where: { email: session.user.email } });
  if (!user) redirect('/login');

  const favorites = await db.favorite.findMany({
    where: { userId: user.id },
    include: {
        listing: {
          include: { images: true }
        }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <div className="p-2 bg-red-100 rounded-full text-red-600">
            <Heart size={24} fill="currentColor" />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-[#3b5062]">Favori İlanlarım</h1>
            <p className="text-sm text-gray-500">Takip ettiğiniz ilanlar ({favorites.length})</p>
        </div>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((fav) => (
            <ListingCard
                key={fav.id}
                id={fav.listing.id}
                title={fav.listing.title}
                price={`${Number(fav.listing.price).toLocaleString('tr-TR')} ${fav.listing.currency}`}
                location={`${fav.listing.city} / ${fav.listing.district}`}
                image={fav.listing.images.length > 0 ? fav.listing.images[0].url : null}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed">
            <h3 className="text-lg font-semibold text-gray-600">Favori İlanınız Yok</h3>
            <p className="text-gray-400 mb-4">Henüz hiç bir ilanı favorilerinize eklemediniz.</p>
            <Link href="/">
                <Button>İlanlara Göz At</Button>
            </Link>
        </div>
      )}
    </div>
  );
}
