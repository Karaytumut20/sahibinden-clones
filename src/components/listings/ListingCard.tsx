import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import FavoriteButton from './FavoriteButton';

interface ListingCardProps {
  id?: string;
  title?: string;
  price?: string;
  location?: string;
  image?: string | null;
  isVitrin?: boolean;
}

export default function ListingCard({ 
  id,
  title = 'Başlıksız İlan', 
  price = '0 TL', 
  location = 'İstanbul',
  image,
  isVitrin = false
}: ListingCardProps) {
  const displayImage = image || 'https://placehold.co/300x200/png?text=Resim+Yok';

  return (
    <div className='relative h-full group'>
        <Link href={`/ilan/${id}`} className='block h-full'>
        <Card className='overflow-hidden border transition-all hover:shadow-md hover:border-blue-400 h-full flex flex-col'>
            <div className='relative h-32 sm:h-40 w-full bg-gray-200'>
            <Image src={displayImage} alt={title} fill className='object-cover' />
            
            {isVitrin && (
                <Badge className='absolute left-2 top-2 bg-yellow-400 text-black hover:bg-yellow-500 text-[10px] px-1.5 py-0 border-none shadow-sm'>
                Vitrin
                </Badge>
            )}
            </div>

            <CardContent className='p-3 space-y-1 flex-1'>
            <h3 className='line-clamp-2 text-xs sm:text-sm font-semibold text-blue-900 group-hover:underline min-h-[36px]'>
                {title}
            </h3>
            <p className='text-sm sm:text-base font-bold text-red-600'>
                {price}
            </p>
            </CardContent>

            <CardFooter className='p-3 pt-0 text-[10px] sm:text-xs text-gray-500 flex items-center justify-between mt-auto'>
            <div className='flex items-center gap-1'>
                <MapPin size={12} />
                <span className='truncate max-w-[120px]'>{location}</span>
            </div>
            </CardFooter>
        </Card>
        </Link>
        
        {/* Favori Butonu - Linkin dışında sağ üstte */}
        {id && (
            <div className='absolute top-2 right-2 z-10'>
                <FavoriteButton listingId={id} />
            </div>
        )}
    </div>
  );
}