import ListingCard from '@/components/listings/ListingCard';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { getListings } from '@/lib/data';
import FilterSidebar from '@/components/category/FilterSidebar';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  
  // URL Parametrelerini Çözümle
  const query = params.q || '';
  const category = params.category || '';
  const minPrice = params.min ? parseInt(params.min) : undefined;
  const maxPrice = params.max ? parseInt(params.max) : undefined;
  const sort = params.sort as any;

  // Veritabanından Veri Çek
  const { listings, totalCount } = await getListings({
    query,
    category,
    minPrice,
    maxPrice,
    sort
  });

  return (
    <div className='flex flex-col md:flex-row gap-6 container mx-auto px-4 py-6'>
      
      {/* Filtreleme Sidebar */}
      <div className='hidden md:block w-64 flex-shrink-0'>
         <FilterSidebar categorySlug={category || 'default'} />
      </div>

      <div className='flex-1'>
        {/* Üst Başlık ve Mobil Filtre */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b pb-4'>
            <div>
            <h1 className='text-2xl font-bold text-[#3b5062]'>
                {query ? ` '${query}' Arama Sonuçları ` : 'Tüm İlanlar'}
            </h1>
            <p className='text-gray-500 text-sm mt-1'>
                Toplam <span className='font-bold text-black'>{totalCount}</span> sonuç bulundu.
            </p>
            </div>
            
            <Button variant='outline' className='md:hidden w-full gap-2 border-gray-300 text-gray-700'>
                <SlidersHorizontal size={16} />
                Sonuçları Filtrele
            </Button>
        </div>

        {/* Sonuç Listesi */}
        {listings.length > 0 ? (
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {listings.map((item: any) => (
                <ListingCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    price={` ${item.price.toLocaleString('tr-TR')} ${item.currency} `}
                    location={` ${item.city} / ${item.district} `}
                    image={item.images && item.images.length > 0 ? item.images[0] : null}
                />
            ))}
            </div>
        ) : (
            <div className='text-center py-20 bg-gray-50 rounded-lg border border-dashed'>
            <h3 className='text-lg font-semibold text-gray-600'>Sonuç Bulunamadı</h3>
            <p className='text-gray-400'>Arama kriterlerinizi değiştirerek tekrar deneyiniz.</p>
            </div>
        )}
      </div>
    </div>
  );
}