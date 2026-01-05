
import { db } from '@/lib/mock-db';
import { Listing } from '@/types';

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

  // Mock DB'den çek
  let allListings = await db.listing.findMany({
      where: { status: 'ACTIVE' },
      include: { user: true, category: true }
  }) as Listing[];

  // Filtreleme (In-Memory)
  if (category) {
    // Basit slug eşleşmesi (gerçekte recursive kategori gerekir)
    const cat = await db.category.findUnique({ where: { slug: category } });
    if(cat) {
        allListings = allListings.filter(l => l.categoryId === cat.id);
    }
  }

  if (minPrice) allListings = allListings.filter(l => l.price >= minPrice);
  if (maxPrice) allListings = allListings.filter(l => l.price <= maxPrice);
  if (city) allListings = allListings.filter(l => l.city.toLowerCase().includes(city.toLowerCase()));
  if (query) {
    const q = query.toLowerCase();
    allListings = allListings.filter(l => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q));
  }

  // Sıralama
  if (sort === 'price_asc') allListings.sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') allListings.sort((a, b) => b.price - a.price);
  else allListings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Sayfalama
  const totalCount = allListings.length;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const listings = allListings.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return { listings, totalPages, totalCount };
}

export async function getListingById(id: string) {
  return db.listing.findUnique({
    where: { id },
    include: {
      user: true,
      category: true,
      store: true
    }
  });
}

export async function getCategories() {
  const all = await db.category.findMany();
  // Sadece ana kategorileri döndür ve çocuklarını ekle (Mock yapısı gereği manuel map)
  const parents = all.filter((c: any) => c.parentId === null);
  return parents.map((p: any) => ({
      ...p,
      children: all.filter((c: any) => c.parentId === p.id)
  }));
}
