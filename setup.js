const fs = require("fs");
const path = require("path");

function writeFile(filePath, content) {
  const absolutePath = path.join(process.cwd(), filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(absolutePath, content, "utf8");
  console.log(`✅ Dosya güncellendi: ${filePath}`);
}

console.log("🔄 10x Analiz Sonrası SQLite Dönüşümü Başlıyor...");

// ---------------------------------------------------------
// 1. .ENV GÜNCELLEMESİ (SQLite Bağlantısı)
// ---------------------------------------------------------
const envContent = `DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="demo"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="demo"
AUTH_SECRET="secret_key_generate_edilmeli"
`;
writeFile(".env", envContent);

// ---------------------------------------------------------
// 2. PRISMA SCHEMA (SQLite Uyumlu - Enum ve Array Temizlendi)
// ---------------------------------------------------------
const schemaContent = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// SQLite Enum desteklemez, String ve Default değerler kullanıyoruz
model User {
  id            String    @id @default(cuid())
  name          String?
  surname       String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  phone         String?
  role          String    @default("INDIVIDUAL") // INDIVIDUAL, CORPORATE, ADMIN

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]
  listings      Listing[]
  favorites     Favorite[]
  store         Store?
  sentMessages     Message[] @relation("SentMessages")
  receivedMessages Message[] @relation("ReceivedMessages")
  moderatedListings Listing[] @relation("ModeratedBy")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Store {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  logo        String?
  phone       String?
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])
  listings    Listing[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Category {
  id        String     @id @default(cuid())
  name      String
  slug      String     @unique
  parentId  String?
  parent    Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children  Category[] @relation("CategoryHierarchy")
  listings  Listing[]
}

model Listing {
  id          String        @id @default(cuid())
  title       String
  description String
  price       Decimal
  currency    String        @default("TL")
  city        String
  district    String

  // SQLite array desteklemez, ilişki tablosuna geçildi
  images      ListingImage[]

  status      String        @default("PENDING")

  userId      String
  user        User          @relation(fields: [userId], references: [id])
  storeId     String?
  store       Store?        @relation(fields: [storeId], references: [id])
  categoryId  String
  category    Category      @relation(fields: [categoryId], references: [id])
  favorites   Favorite[]
  messages    Message[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  moderatedAt     DateTime?
  moderationNote  String?
  moderatedById   String?
  moderatedBy     User? @relation("ModeratedBy", fields: [moderatedById], references: [id])
  publishedAt     DateTime?

  @@index([status])
  @@index([categoryId])
  @@index([userId])
}

// Yeni Resim Tablosu
model ListingImage {
  id        String  @id @default(cuid())
  url       String
  listingId String
  listing   Listing @relation(fields: [listingId], references: [id], onDelete: Cascade)
}

model Favorite {
  id        String   @id @default(cuid())
  userId    String
  listingId String
  createdAt DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  listing Listing @relation(fields: [listingId], references: [id], onDelete: Cascade)

  @@unique([userId, listingId])
  @@index([userId])
  @@index([listingId])
}

model Message {
  id         String   @id @default(cuid())
  content    String
  senderId   String
  sender     User     @relation("SentMessages", fields: [senderId], references: [id])
  receiverId String
  receiver   User     @relation("ReceivedMessages", fields: [receiverId], references: [id])
  listingId  String?
  listing    Listing? @relation(fields: [listingId], references: [id])
  isRead     Boolean  @default(false)
  createdAt  DateTime @default(now())

  @@index([senderId])
  @@index([receiverId])
  @@index([listingId])
}
`;
writeFile("prisma/schema.prisma", schemaContent);

// ---------------------------------------------------------
// 3. BACKEND LOGIC GÜNCELLEMELERİ
// ---------------------------------------------------------

// Listing Actions - Resim yükleme mantığı değişti
const listingActionsContent = `"use server";

import db from "@/lib/db";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { createListingSchema } from "@/lib/validators/listing";

export async function createListing(input: any) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "İlan verebilmek için giriş yapmalısınız." };
  }

  const parsed = createListingSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues.map(i => i.message).join(" | ") };
  }

  const data = parsed.data;

  const category = await db.category.findUnique({ where: { slug: data.category } });
  if (!category) {
    return { success: false, message: "Kategori bulunamadı." };
  }

  try {
    const listing = await db.listing.create({
      data: {
        title: data.title,
        description: data.description ?? "",
        price: new Prisma.Decimal(data.price),
        currency: data.currency ?? "TL",
        city: data.city,
        district: data.district,
        // SQLite: Resimler artık relation olarak ekleniyor
        images: {
            create: data.images.map((url: string) => ({ url }))
        },
        status: "PENDING",
        user: { connect: { id: session.user.id } },
        category: { connect: { id: category.id } },
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/listings");
    return { success: true, message: "İlan kaydedildi. Admin onayından sonra yayına alınacak.", listingId: listing.id };
  } catch (e: any) {
    return { success: false, message: "Veritabanı hatası: " + e.message };
  }
}

export async function getMyListings() {
  const session = await auth();
  if (!session?.user?.id) return [];
  return db.listing.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { category: true, images: true },
  });
}
`;
writeFile("src/actions/listingActions.ts", listingActionsContent);

// Data Fetching - Resimleri include et
const dataLibContent = `import db from '@/lib/db';
import { Prisma } from '@prisma/client';

export interface ListingFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  query?: string;
  city?: string;
  sort?: 'price_asc' | 'price_desc' | 'date_desc';
  page?: number;
}

const ITEMS_PER_PAGE = 12;

export async function getListings(filters: ListingFilter) {
  const { category, minPrice, maxPrice, query, city, sort, page = 1 } = filters;

  const where: Prisma.ListingWhereInput = {
    status: 'ACTIVE',
    ...(query && {
      OR: [
        { title: { contains: query } }, // SQLite insensitive default desteklemeyebilir, basit contains
        { description: { contains: query } },
      ],
    }),
    ...(category && {
      category: {
        slug: category
      }
    }),
    ...(city && { city: { contains: city } }),
    price: {
      gte: minPrice || 0,
      lte: maxPrice || 999999999,
    },
  };

  let orderBy: Prisma.ListingOrderByWithRelationInput = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  if (sort === 'price_desc') orderBy = { price: 'desc' };

  try {
    const [listings, count] = await Promise.all([
      db.listing.findMany({
        where,
        orderBy,
        take: ITEMS_PER_PAGE,
        skip: (page - 1) * ITEMS_PER_PAGE,
        include: {
          user: { select: { name: true, surname: true } },
          category: true,
          images: true // İlişkisel resimler
        },
      }),
      db.listing.count({ where }),
    ]);

    return { listings, totalPages: Math.ceil(count / ITEMS_PER_PAGE), totalCount: count };
  } catch (error) {
    console.error('Veri çekme hatası:', error);
    return { listings: [], totalPages: 0, totalCount: 0 };
  }
}

export async function getListingById(id: string) {
  try {
    const listing = await db.listing.findUnique({
      where: { id },
      include: {
        user: true,
        category: true,
        store: true,
        images: true
      }
    });
    return listing;
  } catch (error) {
    return null;
  }
}

export async function getCategories() {
  return await db.category.findMany({
    where: { parentId: null },
    include: { children: true },
  });
}
`;
writeFile("src/lib/data.ts", dataLibContent);

// ---------------------------------------------------------
// 4. FRONTEND GÜNCELLEMELERİ (array[0] -> array[0].url)
// ---------------------------------------------------------

// Ana Sayfa
const homePageContent = `import CategorySidebar from '@/components/home/CategorySidebar';
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
                      price={\` \${Number(item.price).toLocaleString('tr-TR')} \${item.currency} \`}
                      location={\` \${item.city} / \${item.district} \`}
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
`;
writeFile("src/app/page.tsx", homePageContent);

// Arama Sayfası
const searchPageContent = `import ListingCard from '@/components/listings/ListingCard';
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
  const query = params.q || '';
  const category = params.category || '';
  const minPrice = params.min ? parseInt(params.min) : undefined;
  const maxPrice = params.max ? parseInt(params.max) : undefined;
  const sort = params.sort as any;

  const { listings, totalCount } = await getListings({
    query,
    category,
    minPrice,
    maxPrice,
    sort
  });

  return (
    <div className='flex flex-col md:flex-row gap-6 container mx-auto px-4 py-6'>
      <div className='hidden md:block w-64 flex-shrink-0'>
         <FilterSidebar categorySlug={category || 'default'} />
      </div>

      <div className='flex-1'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b pb-4'>
            <div>
            <h1 className='text-2xl font-bold text-[#3b5062]'>
                {query ? \` '\${query}' Arama Sonuçları \` : 'Tüm İlanlar'}
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

        {listings.length > 0 ? (
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {listings.map((item: any) => (
                <ListingCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    price={\` \${Number(item.price).toLocaleString('tr-TR')} \${item.currency} \`}
                    location={\` \${item.city} / \${item.district} \`}
                    image={item.images && item.images.length > 0 ? item.images[0].url : null}
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
`;
writeFile("src/app/search/page.tsx", searchPageContent);

// İlan Detay Sayfası
const listingDetailPageContent = `import ListingGallery from '@/components/listing-detail/ListingGallery';
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
`;
writeFile("src/app/ilan/[slug]/page.tsx", listingDetailPageContent);

// İlanlarım Sayfası
const myListingsPageContent = `import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
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
    orderBy: { createdAt: 'desc' },
    include: { images: true }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#3b5062]">İlanlarım ({listings.length})</h1>
        <Link href="/new-listing">
            <Button className="bg-blue-600 hover:bg-blue-700">Yeni İlan Ekle</Button>
        </Link>
      </div>

      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        {listings.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
                Henüz hiç ilanınız yok. Hemen satışa başlayın!
            </div>
        ) : (
            listings.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row items-center gap-4 p-4 border-b last:border-0 hover:bg-gray-50 transition-colors">
                    <div className="relative w-full md:w-24 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                        <Image
                            src={item.images[0]?.url || 'https://placehold.co/100x75?text=No+Image'}
                            alt={item.title}
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="flex-1 text-center md:text-left w-full">
                        <h3 className="font-semibold text-[#3b5062] line-clamp-1">{item.title}</h3>
                        <div className="text-red-600 font-bold text-sm">
                            {Number(item.price).toLocaleString('tr-TR')} {item.currency}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">İlan No: {item.id.substring(0,8)}</div>
                    </div>

                    <div className="w-full md:w-auto text-center">
                        <Badge variant="outline" className={
                            item.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600'
                        }>
                            {item.status === 'ACTIVE' ? 'Yayında' : item.status}
                        </Badge>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto justify-center">
                        <form action={async () => {
                            "use server";
                            await deleteListing(item.id);
                        }}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 bg-red-50 hover:bg-red-100">
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
`;
writeFile("src/app/profile/my-listings/page.tsx", myListingsPageContent);

// Favoriler Sayfası
const favoritesPageContent = `import ListingCard from '@/components/listings/ListingCard';
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
                price={\`\${Number(fav.listing.price).toLocaleString('tr-TR')} \${fav.listing.currency}\`}
                location={\`\${fav.listing.city} / \${fav.listing.district}\`}
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
`;
writeFile("src/app/favorites/page.tsx", favoritesPageContent);

// ---------------------------------------------------------
// 5. PACKAGE.JSON (Build Script Fix)
// ---------------------------------------------------------
const packageJsonPath = path.join(process.cwd(), "package.json");
if (fs.existsSync(packageJsonPath)) {
  try {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    if (pkg.scripts) {
      // Build scriptine prisma generate ekle
      if (!pkg.scripts.build.includes("prisma generate")) {
        pkg.scripts.build = `prisma generate && ${pkg.scripts.build}`;
      }
      // Postinstall ekle
      pkg.scripts.postinstall = "prisma generate";

      fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 4), "utf8");
      console.log("✅ package.json scriptleri düzeltildi.");
    }
  } catch (e) {
    console.error("❌ package.json güncellenemedi:", e);
  }
}

// ---------------------------------------------------------
// 6. TEMİZLİK (Eski Migration Silme)
// ---------------------------------------------------------
const migrationsDir = path.join(process.cwd(), "prisma/migrations");
if (fs.existsSync(migrationsDir)) {
  fs.rmSync(migrationsDir, { recursive: true, force: true });
  console.log("🗑️ Eski PostgreSQL migrationları temizlendi.");
}

console.log(`
🎉 DÖNÜŞÜM TAMAMLANDI!

Yapmanız gerekenler:
1. Veritabanını oluşturun:
   npx prisma migrate dev --name init

2. Seed datalarını yükleyin (Opsiyonel ama önerilir):
   npx prisma db seed

3. Projeyi başlatın:
   npm run dev
`);
