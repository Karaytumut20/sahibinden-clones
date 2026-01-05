import db from '@/lib/db';

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

  const where: any = { status: 'ACTIVE' };

  if (query) where.OR = [{ title: { contains: query } }];
  if (city) where.city = { contains: city };

  // Kategori filtreleme Mock DB içinde manuel yapılacak (ListingActions'da basitleştirildi)
  // Burada filter parametrelerini direkt DB'ye geçiyoruz, mock db bunları işleyecek

  const allListings = await db.listing.findMany({
      where: { ...where, ...(category ? { category: { slug: category } } : {}) }, // Mock DB'de bu yapı desteklenmeyebilir, basitleştirelim
      include: { user: true, category: true }
  });

  // Mock In-Memory Filtering (DB yetenekleri sınırlı olduğu için)
  let filtered = allListings.filter((l: any) => {
      if(minPrice && l.price < minPrice) return false;
      if(maxPrice && l.price > maxPrice) return false;
      if(category && l.category?.slug !== category) return false; // Mock data relation check
      return true;
  });

  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const listings = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return { listings, totalPages, totalCount };
}

export async function getListingById(id: string) {
  return await db.listing.findUnique({
    where: { id },
    include: { user: true, category: true, store: true }
  });
}

export async function getCategories() {
  const cats = await db.category.findMany();
  // Hierarchy builder
  const parents = cats.filter((c: any) => !c.parentId);
  return parents.map((p: any) => ({
      ...p,
      children: cats.filter((c: any) => c.parentId === p.id)
  }));
}