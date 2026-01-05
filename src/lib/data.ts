import db from '@/lib/db';
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
