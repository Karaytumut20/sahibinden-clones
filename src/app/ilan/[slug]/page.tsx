import ListingGallery from '@/components/listing-detail/ListingGallery';
import SellerSidebar from '@/components/listing-detail/SellerSidebar';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, Share2, MapPin, CheckCircle } from 'lucide-react';
import { getListingById } from '@/lib/data';
import { notFound } from 'next/navigation';
import FavoriteButton from '@/components/listings/FavoriteButton';

export default async function ListingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = await getListingById(slug);

  if (!listing) return notFound();

  const dateStr = new Date(listing.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

  // ListingImage objelerini string array'e çeviriyoruz
  const imageUrls = listing.images.length > 0
    ? listing.images.map((img: any) => img.url)
    : ['https://placehold.co/800x600/png?text=Resim+Yok'];

  return (
    <div className='pb-10 container mx-auto px-4 py-6'>
      <div className='border-b pb-4 mb-6'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-end gap-4'>
            <div>
                <h1 className='text-xl md:text-2xl font-bold text-[#3b5062] dark:text-white leading-tight'>{listing.title}</h1>
                <div className='flex items-center gap-2 mt-2 flex-wrap'>
                    <Badge variant='outline' className='text-blue-600 border-blue-200 bg-blue-50 dark:bg-slate-800 dark:text-blue-400'>
                        {listing.category?.name || 'Genel'}
                    </Badge>
                    <span className='text-sm text-gray-500 flex items-center gap-1'>
                        / {listing.city} / {listing.district} / İlan No: {listing.id.substring(0,8)}
                    </span>
                </div>
            </div>

            <div className='flex flex-col items-end gap-1 w-full md:w-auto'>
                <div className='text-3xl font-bold text-red-600'>
                    {Number(listing.price).toLocaleString('tr-TR')} {listing.currency}
                </div>
                <div className='text-sm text-gray-500 flex items-center gap-1'>
                    <MapPin size={14} /> {listing.city} / {listing.district}
                </div>
            </div>
        </div>

        <div className='flex justify-between md:justify-end gap-4 mt-4 text-xs text-gray-500 pt-2 border-t md:border-t-0'>
            <div className='flex gap-4 items-center'>
                <div className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
                    <FavoriteButton listingId={listing.id} className="shadow-none bg-transparent hover:bg-transparent p-0" />
                    <span>Favorile</span>
                </div>
                <button className='flex items-center gap-1 hover:text-blue-600 transition-colors'><Share2 size={14} /> Paylaş</button>
            </div>
            <span className='flex items-center gap-1 text-gray-400 md:ml-2'><Eye size={14} /> 125 Görüntüleme</span>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
        <div className='lg:col-span-9 space-y-8'>
            <ListingGallery images={imageUrls} />

            <div className='lg:hidden'>
               <SellerSidebar
                  sellerName={listing.user?.name || 'Kullanıcı'}
                  sellerId={listing.userId}
                  listingId={listing.id}
                  listingTitle={listing.title}
               />
            </div>

            <div className='bg-white border rounded-lg overflow-hidden'>
                <div className='bg-gray-50 px-4 py-2 border-b font-bold text-[#3b5062]'>İlan Detayları</div>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 p-4 text-sm'>
                    <div><span className='font-semibold block text-gray-700'>İlan Tarihi</span> {dateStr}</div>
                    <div><span className='font-semibold block text-gray-700'>Kategori</span> {listing.category?.name}</div>
                    <div><span className='font-semibold block text-gray-700'>Durumu</span> İkinci El</div>
                    <div><span className='font-semibold block text-gray-700'>Kimden</span> Sahibinden</div>
                </div>
            </div>

            <div className='bg-white p-6 border rounded-lg shadow-sm'>
                <h3 className='font-bold text-lg text-[#3b5062] mb-4 border-b pb-2'>Açıklama</h3>
                <div className='text-gray-700 text-sm leading-relaxed whitespace-pre-line min-h-[100px]'>
                    {listing.description || 'Bu ilan için açıklama girilmemiş.'}
                </div>
            </div>
        </div>

        <div className='hidden lg:block lg:col-span-3'>
            <div className='sticky top-24 space-y-6'>
                <SellerSidebar
                    sellerName={listing.user?.name || 'Kullanıcı'}
                    sellerId={listing.userId}
                    listingId={listing.id}
                    listingTitle={listing.title}
                />
                <div className='bg-yellow-50 border border-yellow-200 p-4 rounded text-xs text-yellow-800 flex gap-2'>
                    <CheckCircle size={32} className='text-yellow-600 flex-shrink-0' />
                    <div>
                        <strong>Güvenlik İpucu:</strong> Kapora veya benzeri bir ödeme yapmadan önce ürünü görmenizi öneririz.
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
