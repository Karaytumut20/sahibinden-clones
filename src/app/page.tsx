import CategorySidebar from '@/components/home/CategorySidebar';
import VitrinSlider from '@/components/home/VitrinSlider';
import ListingCard from '@/components/listings/ListingCard';
import { getListings } from '@/lib/data';
import Link from 'next/link';

export default async function HomePage() {
  const { listings } = await getListings({ sort: 'date_desc' });

  return (
    <div className='flex flex-col md:flex-row gap-6'>
      <CategorySidebar />
      <section className='flex-1 overflow-hidden min-w-0'>
        <div className='mb-8'>
            <div className='flex items-center justify-between mb-4 bg-white p-3 rounded shadow-sm border border-l-4 border-l-[#ffd008]'>
                <h1 className='text-sm font-bold text-gray-700'>Günün Vitrini</h1>
                <Link href='/search' className='text-xs text-blue-600 hover:underline'>Tümünü Göster</Link>
            </div>
            <VitrinSlider />
        </div>

        <div>
            <div className='flex items-center justify-between mb-4 bg-white p-3 rounded shadow-sm border'>
                <h2 className='text-sm font-bold text-gray-700'>Son Eklenen İlanlar</h2>
            </div>

            {listings.length > 0 ? (
              <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
                {listings.map((item: any) => (
                  <ListingCard
                      key={item.id}
                      id={item.id}
                      title={item.title}
                      price={` ${Number(item.price).toLocaleString('tr-TR')} ${item.currency} `}
                      location={` ${item.city} / ${item.district} `}
                      // Resim url erişimi güncellendi
                      image={item.images && item.images.length > 0 ? item.images[0].url : null}
                  />
                ))}
              </div>
            ) : (
              <div className='text-center py-20 bg-white border rounded text-gray-500'>
                <p>Henüz sistemde aktif ilan bulunmuyor.</p>
                <Link href='/new-listing' className='text-blue-600 font-bold hover:underline'>İlk ilanı sen ver!</Link>
              </div>
            )}
        </div>
      </section>
    </div>
  );
}
