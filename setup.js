/**
 * SAHIBINDEN CLONE - DATABASE CLEANUP & MOCK SETUP SCRIPT
 * * Bu script projeyi analiz eder ve aşağıdakileri gerçekleştirir:
 * 1. Prisma, Mongoose ve DB ile ilgili tüm paketleri kaldırır.
 * 2. Prisma klasörünü ve şemalarını siler.
 * 3. Veritabanı bağlantı dosyalarını siler.
 * 4. Prisma tiplerinin yerine geçecek manuel TypeScript interface'lerini oluşturur.
 * 5. Veritabanı yerine geçecek 'Mock Data' (Sahte Veri) katmanını kurar.
 * 6. Auth, Actions ve Data Fetching katmanlarını DB'siz çalışacak şekilde yeniden yazar.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Renkli konsol çıktıları için yardımcılar
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, type = "blue") {
  console.log(`${colors[type]}%s${colors.reset}`, message);
}

function writeFile(filePath, content) {
  const absolutePath = path.join(process.cwd(), filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(absolutePath, content, "utf8");
  log(`✅ Dosya oluşturuldu/güncellendi: ${filePath}`, "green");
}

function removeFile(filePath) {
  const absolutePath = path.join(process.cwd(), filePath);
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
    log(`wm Dosya silindi: ${filePath}`, "red");
  }
}

function removeDir(dirPath) {
  const absolutePath = path.join(process.cwd(), dirPath);
  if (fs.existsSync(absolutePath)) {
    fs.rmSync(absolutePath, { recursive: true, force: true });
    log(`wm Klasör silindi: ${dirPath}`, "red");
  }
}

// -------------------------------------------------------------------------
// 1. ANALİZ VE TEMİZLİK (DOSYA SİLME)
// -------------------------------------------------------------------------
log(
  "\n🚀 [ADIM 1/7] Veritabanı dosyaları ve klasörleri temizleniyor...",
  "magenta"
);

// Prisma ve DB ile ilgili dosyalar
removeDir("prisma");
removeDir("src/models"); // Mongoose modelleri
removeFile("src/lib/db.ts"); // Prisma client connection
removeFile("src/lib/db.ts.bak-20251213153230");
removeFile("docker-compose.yml"); // Varsa

// -------------------------------------------------------------------------
// 2. PACKAGE.JSON TEMİZLİĞİ
// -------------------------------------------------------------------------
log("\n📦 [ADIM 2/7] package.json bağımlılıkları temizleniyor...", "magenta");

const packageJsonPath = path.join(process.cwd(), "package.json");
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  const dependenciesToRemove = [
    "@prisma/client",
    "@auth/prisma-adapter",
    "prisma",
    "mongoose",
    "bcryptjs",
    "ts-node",
  ];

  dependenciesToRemove.forEach((dep) => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      delete packageJson.dependencies[dep];
      log(`- Bağımlılık kaldırıldı: ${dep}`, "yellow");
    }
    if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
      delete packageJson.devDependencies[dep];
      log(`- Geliştirici bağımlılığı kaldırıldı: ${dep}`, "yellow");
    }
  });

  // Scriptleri temizle
  if (packageJson.scripts) {
    delete packageJson.scripts["db:generate"];
    delete packageJson.scripts["db:migrate"];
    delete packageJson.scripts["db:push"];
    delete packageJson.scripts["db:studio"];
    delete packageJson.scripts["db:seed"];
    delete packageJson.prisma; // Prisma config section
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  log(
    '✅ package.json güncellendi. Lütfen daha sonra "npm install" çalıştırın.',
    "green"
  );
}

// -------------------------------------------------------------------------
// 3. YENİ TİP TANIMLARI (Prisma yerine)
// -------------------------------------------------------------------------
log(
  "\nwu [ADIM 3/7] Prisma tipleri yerine manuel TypeScript interface'leri oluşturuluyor...",
  "magenta"
);

const mockTypesContent = `
export type Role = 'INDIVIDUAL' | 'CORPORATE' | 'ADMIN';
export type ListingStatus = 'ACTIVE' | 'PENDING' | 'PASSIVE' | 'REJECTED' | 'SOLD';

export interface User {
  id: string;
  name: string | null;
  surname: string | null;
  email: string;
  phone: string | null;
  role: Role;
  image?: string | null;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  children?: Category[];
}

export interface ListingImage {
  id: string;
  url: string;
  listingId: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number; // Decimal yerine number kullanıyoruz mock için
  currency: string;
  city: string;
  district: string;
  status: ListingStatus;
  userId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  user?: User;
  category?: Category;
  images: ListingImage[];
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  phone: string | null;
  userId: string;
  listingCount?: number;
}

export interface Favorite {
  id: string;
  userId: string;
  listingId: string;
  createdAt: Date;
  listing?: Listing;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  listingId: string | null;
  isRead: boolean;
  createdAt: Date;

  // Relations
  sender?: User;
  receiver?: User;
  listing?: Listing;
}
`;

writeFile("src/types/index.ts", mockTypesContent);

// -------------------------------------------------------------------------
// 4. MOCK VERİ KATMANI
// -------------------------------------------------------------------------
log(
  "\nfw [ADIM 4/7] Mock Veri Katmanı (In-Memory Database) oluşturuluyor...",
  "magenta"
);

const mockDataContent = `
import { User, Category, Listing, Store, Favorite, Message } from '@/types';

// Yardımcılar
const now = new Date();

// 1. KULLANICILAR
export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Ahmet',
    surname: 'Yılmaz',
    email: 'demo@sahibindenclone.com', // Şifre: demo
    phone: '0555 444 33 22',
    role: 'INDIVIDUAL',
    createdAt: now,
    image: null
  },
  {
    id: 'user-admin',
    name: 'Süper',
    surname: 'Admin',
    email: 'admin@sahibindenclone.com', // Şifre: admin
    phone: '0500 000 00 00',
    role: 'ADMIN',
    createdAt: now,
    image: null
  },
  {
    id: 'user-store-1',
    name: 'Mehmet',
    surname: 'Emlakçı',
    email: 'mehmet@guvenemlak.com',
    phone: '0212 222 33 44',
    role: 'CORPORATE',
    createdAt: now,
    image: null
  }
];

// 2. KATEGORİLER
export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Emlak', slug: 'emlak', parentId: null },
  { id: 'cat-1-1', name: 'Konut', slug: 'konut', parentId: 'cat-1' },
  { id: 'cat-1-2', name: 'İş Yeri', slug: 'is-yeri', parentId: 'cat-1' },
  { id: 'cat-2', name: 'Vasıta', slug: 'vasita', parentId: null },
  { id: 'cat-2-1', name: 'Otomobil', slug: 'otomobil', parentId: 'cat-2' },
  { id: 'cat-2-2', name: 'Motosiklet', slug: 'motosiklet', parentId: 'cat-2' },
];

// 3. MAĞAZALAR
export const MOCK_STORES: Store[] = [
  {
    id: 'store-1',
    name: 'Güven Emlak',
    slug: 'guven-emlak',
    description: 'Yılların güveni.',
    logo: 'https://placehold.co/150x100?text=Guven',
    phone: '0212 222 33 44',
    userId: 'user-store-1'
  }
];

// 4. İLANLAR
export const MOCK_LISTINGS: Listing[] = [
  {
    id: 'listing-1',
    title: 'Sahibinden Temiz 2020 Model Passat',
    description: 'Aracımız hatasız boyasızdır. Tüm bakımları yetkili serviste yapılmıştır.',
    price: 1250000,
    currency: 'TL',
    city: 'İstanbul',
    district: 'Kadıköy',
    status: 'ACTIVE',
    userId: 'user-1',
    categoryId: 'cat-2-1',
    createdAt: new Date(now.getTime() - 1000000),
    updatedAt: now,
    images: [
      { id: 'img-1', url: 'https://placehold.co/800x600?text=Passat+1', listingId: 'listing-1' },
      { id: 'img-2', url: 'https://placehold.co/800x600?text=Passat+2', listingId: 'listing-1' }
    ]
  },
  {
    id: 'listing-2',
    title: 'Deniz Manzaralı 3+1 Kiralık Daire',
    description: 'Metroya yürüme mesafesinde, ferah daire.',
    price: 25000,
    currency: 'TL',
    city: 'İzmir',
    district: 'Karşıyaka',
    status: 'ACTIVE',
    userId: 'user-store-1',
    categoryId: 'cat-1-1',
    createdAt: new Date(now.getTime() - 5000000),
    updatedAt: now,
    images: [
      { id: 'img-3', url: 'https://placehold.co/800x600?text=Ev+1', listingId: 'listing-2' }
    ]
  },
  {
    id: 'listing-3',
    title: 'Onay Bekleyen İlan Örneği',
    description: 'Admin onayı bekleniyor.',
    price: 5000,
    currency: 'TL',
    city: 'Ankara',
    district: 'Çankaya',
    status: 'PENDING',
    userId: 'user-1',
    categoryId: 'cat-2-2',
    createdAt: now,
    updatedAt: now,
    images: []
  }
];

// 5. FAVORİLER & MESAJLAR (Boş başlatıyoruz)
export let MOCK_FAVORITES: Favorite[] = [];
export let MOCK_MESSAGES: Message[] = [];

// Helper Functions to simulate DB Operations
export const db = {
  user: {
    findUnique: async ({ where }: any) => {
      if (where.email) return MOCK_USERS.find(u => u.email === where.email) || null;
      if (where.id) return MOCK_USERS.find(u => u.id === where.id) || null;
      return null;
    },
    create: async ({ data }: any) => {
      const newUser = { ...data, id: 'user-' + Date.now(), createdAt: new Date() } as User;
      MOCK_USERS.push(newUser);
      return newUser;
    },
    update: async ({ where, data }: any) => {
        const idx = MOCK_USERS.findIndex(u => u.email === where.email);
        if(idx !== -1) {
            MOCK_USERS[idx] = { ...MOCK_USERS[idx], ...data };
            return MOCK_USERS[idx];
        }
        throw new Error("User not found");
    },
    count: async () => MOCK_USERS.length
  },
  listing: {
    findMany: async (args?: any) => {
      let results = [...MOCK_LISTINGS];
      // Basit filtreleme simülasyonu
      if (args?.where?.userId) {
        results = results.filter(l => l.userId === args.where.userId);
      }
      if (args?.where?.status) {
        results = results.filter(l => l.status === args.where.status);
      }
      if (args?.where?.category?.slug) {
         // Recursive kategori mantığı zor, basitçe slug kontrolü
         // Mock veri basit olduğu için direkt kategori ID eşleşmesi varsayıyoruz veya mock'u zenginleştiriyoruz.
         // Burada basitleştirme adına tüm aktif ilanları dönüyoruz.
      }

      // Include User
      if (args?.include?.user) {
         results = results.map(r => ({...r, user: MOCK_USERS.find(u => u.id === r.userId)}));
      }
      // Include Category
      if (args?.include?.category) {
         results = results.map(r => ({...r, category: MOCK_CATEGORIES.find(c => c.id === r.categoryId)}));
      }

      return results;
    },
    findUnique: async ({ where, include }: any) => {
      let listing = MOCK_LISTINGS.find(l => l.id === where.id);
      if (!listing) return null;

      if(include?.user) listing = {...listing, user: MOCK_USERS.find(u => u.id === listing?.userId)};
      if(include?.category) listing = {...listing, category: MOCK_CATEGORIES.find(c => c.id === listing?.categoryId)};

      return listing;
    },
    create: async ({ data }: any) => {
        const newListing = {
            id: 'listing-' + Date.now(),
            ...data,
            images: data.images?.create?.map((img: any) => ({ id: 'img-'+Date.now(), url: img.url })) || [],
            createdAt: new Date(),
            updatedAt: new Date(),
            user: undefined,
            category: undefined
        } as unknown as Listing; // Type assertion for simulation

        // Connect mantığını simüle et
        if(data.user?.connect?.id) newListing.userId = data.user.connect.id;
        if(data.category?.connect?.id) newListing.categoryId = data.category.connect.id;

        MOCK_LISTINGS.push(newListing);
        return newListing;
    },
    update: async ({ where, data }: any) => {
        const idx = MOCK_LISTINGS.findIndex(l => l.id === where.id);
        if(idx !== -1) {
            MOCK_LISTINGS[idx] = { ...MOCK_LISTINGS[idx], ...data };
            return MOCK_LISTINGS[idx];
        }
        return null;
    },
    delete: async ({ where }: any) => {
        const idx = MOCK_LISTINGS.findIndex(l => l.id === where.id);
        if(idx !== -1) MOCK_LISTINGS.splice(idx, 1);
        return { success: true };
    },
    count: async () => MOCK_LISTINGS.length
  },
  category: {
    findMany: async () => MOCK_CATEGORIES,
    findUnique: async ({ where }: any) => MOCK_CATEGORIES.find(c => c.slug === where.slug) || null
  },
  store: {
    findMany: async () => MOCK_STORES,
    count: async () => MOCK_STORES.length
  },
  favorite: {
    findMany: async ({ where, include }: any) => {
        let favs = MOCK_FAVORITES.filter(f => f.userId === where.userId);
        if(include?.listing) {
            favs = favs.map(f => ({
                ...f,
                listing: {
                    ...MOCK_LISTINGS.find(l => l.id === f.listingId)!,
                    images: MOCK_LISTINGS.find(l => l.id === f.listingId)!.images
                }
            }));
        }
        return favs;
    },
    findUnique: async ({ where }: any) => {
        return MOCK_FAVORITES.find(f => f.userId === where.userId_listingId.userId && f.listingId === where.userId_listingId.listingId) || null;
    },
    create: async ({ data }: any) => {
        const newFav = { id: 'fav-'+Date.now(), userId: data.userId, listingId: data.listingId, createdAt: new Date() };
        MOCK_FAVORITES.push(newFav);
        return newFav;
    },
    delete: async ({ where }: any) => {
        const idx = MOCK_FAVORITES.findIndex(f => f.id === where.id);
        if(idx !== -1) MOCK_FAVORITES.splice(idx, 1);
        return { success: true };
    }
  },
  message: {
    create: async ({ data }: any) => {
        const newMsg = {
            id: 'msg-'+Date.now(),
            ...data,
            createdAt: new Date(),
            isRead: false
        };
        MOCK_MESSAGES.push(newMsg);
        return newMsg;
    },
    findMany: async ({ where, include }: any) => {
        let msgs = [...MOCK_MESSAGES];
        // Basit OR filtresi simülasyonu
        if(where.OR) {
            msgs = msgs.filter(m =>
                (m.senderId === where.OR[0].senderId) || (m.receiverId === where.OR[1].receiverId)
            );
        }

        // Include
        if(include) {
            msgs = msgs.map(m => ({
                ...m,
                sender: MOCK_USERS.find(u => u.id === m.senderId),
                receiver: MOCK_USERS.find(u => u.id === m.receiverId),
                listing: MOCK_LISTINGS.find(l => l.id === m.listingId)
            }));
        }

        return msgs.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
  }
};
`;

writeFile("src/lib/mock-db.ts", mockDataContent);

// -------------------------------------------------------------------------
// 5. DATA FETCHING (src/lib/data.ts)
// -------------------------------------------------------------------------
log(
  "\nµ [ADIM 5/7] Veri çekme fonksiyonları (data.ts) güncelleniyor...",
  "magenta"
);

const dataTsContent = `
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
`;

writeFile("src/lib/data.ts", dataTsContent);

// -------------------------------------------------------------------------
// 6. AUTHENTICATION (Prisma Adapter olmadan)
// -------------------------------------------------------------------------
log(
  "\n¹ [ADIM 6/7] Authentication katmanı Mock Auth ile değiştiriliyor...",
  "magenta"
);

const authConfigContent = `
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: { signIn: "/login" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProfile = nextUrl.pathname.startsWith("/profile");
      const isOnNewListing = nextUrl.pathname.startsWith("/new-listing");
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");

      if (isOnProfile || isOnNewListing) {
        return isLoggedIn;
      }

      if (isOnAdmin) {
        return isLoggedIn && (auth?.user as any)?.role === "ADMIN";
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = (token.role as any) ?? "INDIVIDUAL";
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
`;

writeFile("src/auth.config.ts", authConfigContent);

const authTsContent = `
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { authConfig } from "./auth.config";
import { db } from "@/lib/mock-db";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // Mock DB'den kullanıcıyı bul
        const user = await db.user.findUnique({ where: { email } });

        if (!user) return null;

        // Mock ortamında şifre kontrolü basitleştirildi
        // Gerçekte bcrypt.compare kullanılırdı
        // Kullanıcı 'demo@...' ise şifre 'demo'
        // Kullanıcı 'admin@...' ise şifre 'admin'
        let isValid = false;
        if(email.includes('demo') && password === 'demo') isValid = true;
        if(email.includes('admin') && password === 'admin') isValid = true;
        if(email.includes('guven') && password === '123') isValid = true;

        // Yeni kayıt olanlar için her şifreyi kabul et (Test kolaylığı)
        if(!email.includes('demo') && !email.includes('admin') && !email.includes('guven')) isValid = true;

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          surname: user.surname,
          role: user.role,
        } as any;
      },
    }),
  ],
});
`;

writeFile("src/auth.ts", authTsContent);

// -------------------------------------------------------------------------
// 7. SERVER ACTIONS (Mock Data Kullanan Versiyonlar)
// -------------------------------------------------------------------------
log(
  "\n€ [ADIM 7/7] Server Actions Mock Data kullanacak şekilde güncelleniyor...",
  "magenta"
);

// 7.1 Listing Actions
writeFile(
  "src/actions/listingActions.ts",
  `
"use server";

import { db } from "@/lib/mock-db";
import { auth } from "@/auth";
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

  // Mock DB işlemleri
  try {
    const category = await db.category.findUnique({ where: { slug: data.category } });
    if (!category) return { success: false, message: "Kategori bulunamadı." };

    const listing = await db.listing.create({
      data: {
        title: data.title,
        description: data.description ?? "",
        price: parseFloat(data.price),
        currency: data.currency ?? "TL",
        city: data.city,
        district: data.district,
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
    return { success: false, message: "Hata: " + e.message };
  }
}

export async function getMyListings() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return db.listing.findMany({
    where: { userId: session.user.id },
    include: { category: true, images: true },
  });
}
`
);

// 7.2 Auth Actions
writeFile(
  "src/actions/authActions.ts",
  `
'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { loginSchema } from '@/lib/validators/auth';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = loginSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return "Lütfen geçerli bir e-posta ve şifre giriniz.";
    }

    await signIn('credentials', {
        ...rawData,
        redirect: false,
    });

  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'E-posta veya şifre hatalı. (Demo hesap: demo@sahibindenclone.com / demo)';
        default:
          return 'Bir sorun oluştu. Lütfen tekrar deneyin.';
      }
    }
    throw error;
  }
}
`
);

// 7.3 User Actions
writeFile(
  "src/actions/userActions.ts",
  `
'use server';

import { db } from '@/lib/mock-db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function toggleFavorite(listingId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, message: 'Giriş yapmalısınız.' };
  }

  const user = await db.user.findUnique({ where: { email: session.user.email } });
  if (!user) return { success: false, message: 'Kullanıcı bulunamadı.' };

  try {
    const existingFav = await db.favorite.findUnique({
      where: { userId_listingId: { userId: user.id, listingId } }
    });

    if (existingFav) {
      await db.favorite.delete({ where: { id: existingFav.id } });
      revalidatePath('/');
      return { success: true, isFavorited: false, message: 'Favorilerden çıkarıldı.' };
    } else {
      await db.favorite.create({
        data: { userId: user.id, listingId: listingId }
      });
      revalidatePath('/');
      return { success: true, isFavorited: true, message: 'Favorilere eklendi.' };
    }
  } catch (error) {
    return { success: false, message: 'İşlem başarısız.' };
  }
}

export async function deleteListing(listingId: string) {
  const session = await auth();
  if (!session?.user?.email) return { success: false };

  const user = await db.user.findUnique({ where: { email: session.user.email } });
  if (!user) return { success: false };

  const listing = await db.listing.findUnique({ where: { id: listingId } });
  // Mock check
  if (!listing || listing.userId !== user.id) {
      return { success: false, message: 'Yetkisiz işlem.' };
  }

  await db.listing.delete({ where: { id: listingId } });
  revalidatePath('/profile/my-listings');
  return { success: true, message: 'İlan silindi.' };
}
`
);

// 7.4 Admin Actions
writeFile(
  "src/actions/adminActions.ts",
  `
"use server";

import { db } from "@/lib/mock-db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function requireAdminOrThrow() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Giriş yapmalısınız.");
  if ((session.user as any).role !== "ADMIN") throw new Error("Yetkisiz işlem.");
  return session;
}

export async function getPendingListings() {
  await requireAdminOrThrow();
  return db.listing.findMany({
    where: { status: "PENDING" },
    include: {
      user: true,
      category: true,
      images: true,
    },
  });
}

export async function approveListing(listingId: string) {
  await requireAdminOrThrow();

  await db.listing.update({
    where: { id: listingId },
    data: {
      status: "ACTIVE",
      moderatedAt: new Date(),
      publishedAt: new Date(),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/listings");
  return { success: true };
}

export async function rejectListing(listingId: string, note?: string) {
  await requireAdminOrThrow();

  await db.listing.update({
    where: { id: listingId },
    data: {
      status: "REJECTED",
      moderationNote: note ?? "İlan reddedildi.",
    },
  });

  revalidatePath("/admin/listings");
  return { success: true };
}
`
);

// 7.5 Message Actions
writeFile(
  "src/actions/messageActions.ts",
  `
'use server';

import { db } from '@/lib/mock-db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function sendMessage(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return { success: false, message: 'Giriş yapmalısınız.' };

  const sender = await db.user.findUnique({ where: { email: session.user.email } });
  if (!sender) return { success: false, message: 'Kullanıcı bulunamadı.' };

  const receiverId = formData.get('receiverId') as string;
  const listingId = formData.get('listingId') as string;
  const content = formData.get('content') as string;

  if (!content || !receiverId) return { success: false, message: 'Eksik bilgi.' };

  try {
    await db.message.create({
      data: {
        content,
        senderId: sender.id,
        receiverId,
        listingId: listingId || null
      }
    });

    revalidatePath('/profile/messages');
    return { success: true, message: 'Mesaj gönderildi.' };
  } catch (error) {
    return { success: false, message: 'Mesaj gönderilemedi.' };
  }
}

export async function getConversations() {
  const session = await auth();
  if (!session?.user?.email) return [];

  const user = await db.user.findUnique({ where: { email: session.user.email } });
  if (!user) return [];

  const messages = await db.message.findMany({
    where: {
      OR: [{ senderId: user.id }, { receiverId: user.id }]
    },
    include: true // Mock DB'de include logic var
  });

  const conversations = new Map();

  for (const msg of messages) {
    const otherUser = msg.senderId === user.id ? msg.receiver : msg.sender;
    if(!otherUser) continue;

    const key = otherUser.id;

    if (!conversations.has(key)) {
      conversations.set(key, {
        user: otherUser,
        lastMessage: msg,
        listing: msg.listing
      });
    }
  }

  return Array.from(conversations.values());
}

export async function getMessagesWithUser(otherUserId: string) {
  const session = await auth();
  if (!session?.user?.email) return [];

  const user = await db.user.findUnique({ where: { email: session.user.email } });
  if (!user) return [];

  return await db.message.findMany({
    where: {
      OR: [
        { senderId: user.id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: user.id }
      ]
    }
  });
}
`
);

// 7.6 Favorite Actions
writeFile(
  "src/actions/favoriteActions.ts",
  `
"use server";

import { db } from "@/lib/mock-db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function toggleFavorite(listingId: string) {
  // UserActions'daki ile aynı mantık, burası duplicated kalmış orijinal projede
  // Basitlik için userActions'dakini kullanması sağlanabilir ama burada da mockluyoruz
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: "Giriş gerekli." };

  const existing = await db.favorite.findUnique({
    where: { userId_listingId: { userId: session.user.id, listingId } },
  });

  if (existing) {
    await db.favorite.delete({ where: { id: existing.id } });
    revalidatePath("/profile");
    return { success: true, favorited: false };
  }

  await db.favorite.create({ data: { userId: session.user.id, listingId } });
  revalidatePath("/profile");
  return { success: true, favorited: true };
}

export async function getMyFavorites() {
  const session = await auth();
  if (!session?.user?.id) return [];
  return db.favorite.findMany({
    where: { userId: session.user.id },
    include: { listing: true },
  });
}
`
);

// 7.7 Settings Actions
writeFile(
  "src/actions/settingsActions.ts",
  `
'use server';
import { db } from '@/lib/mock-db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function updateProfile(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) return { success: false, message: 'Oturum açın.' };

    const name = formData.get('name') as string;
    const surname = formData.get('surname') as string;
    const phone = formData.get('phone') as string;

    try {
        await db.user.update({
            where: { email: session.user.email },
            data: { name, surname, phone }
        });
        revalidatePath('/profile/settings');
        return { success: true, message: 'Profil güncellendi. (Mock)' };
    } catch (e) {
        return { success: false, message: 'Hata oluştu.' };
    }
}
`
);

// 7.8 API Route (Register)
writeFile(
  "src/app/api/users/register/route.ts",
  `
import { NextResponse } from "next/server";
import { db } from "@/lib/mock-db";
import { registerSchema } from "@/lib/validators/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues.map(i => i.message).join(" | ") },
      { status: 400 }
    );
  }

  const { email, password, name, surname, phone } = parsed.data;

  // Mock kontrol
  const exists = await db.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ ok: false, error: "Bu e-posta zaten kayıtlı." }, { status: 409 });
  }

  // Şifre hashleme yok, mock ortamı
  const user = await db.user.create({
    data: {
      email,
      password, // Düz metin sakla (Mock)
      name,
      surname,
      phone: phone || null,
      role: "INDIVIDUAL",
    }
  });

  return NextResponse.json({ ok: true, user }, { status: 201 });
}
`
);

// 7.9 Profile Page (DB'den bağımsız hale getirme)
// Profile/messages/page.tsx içinde db.user.findUnique çağrısı vardı, onu mock'a çevirelim.
// Ayrıca mock-db.ts import'unu düzeltmemiz gerekiyor.
// Otomatik olarak data.ts ve actions güncellendiği için çoğu sayfa çalışacak.
// Ancak direkt db kullanan server component'ler varsa (örn: profile/page.tsx gibi) onları mock-db'ye yönlendirelim.

// Admin Page Fix
writeFile(
  "src/app/admin/page.tsx",
  `
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, ShoppingBag, DollarSign } from 'lucide-react';
import { db } from '@/lib/mock-db';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function AdminDashboard() {
  const session = await auth();
  if (!session) redirect('/login');

  const [userCount, listingCount, storeCount] = await Promise.all([
    db.user.count(),
    db.listing.count(),
    db.store.count()
  ]);

  const stats = [
    { title: 'Toplam Üye', value: userCount, icon: <Users className='h-4 w-4 text-muted-foreground' /> },
    { title: 'Aktif İlanlar', value: listingCount, icon: <FileText className='h-4 w-4 text-muted-foreground' /> },
    { title: 'Mağazalar', value: storeCount, icon: <ShoppingBag className='h-4 w-4 text-muted-foreground' /> },
    { title: 'Toplam Gelir', value: '₺0.00', icon: <DollarSign className='h-4 w-4 text-muted-foreground' /> },
  ];

  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold tracking-tight text-[#3b5062]'>Admin Paneli (Mock Data)</h1>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
        Bu panel şu anda statik/mock veri ile çalışmaktadır.
      </div>
    </div>
  );
}
`
);

// Messages Page Fix
writeFile(
  "src/app/profile/messages/page.tsx",
  `
import { getConversations, getMessagesWithUser } from "@/actions/messageActions";
import ChatWindow from "@/components/profile/messages/ChatWindow";
import ChatList from "@/components/profile/messages/ChatList";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/mock-db";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const session = await auth();
  const user = await db.user.findUnique({ where: { email: session?.user?.email || "" } });

  if (!user) return <div>Lütfen giriş yapın.</div>;

  const params = await searchParams;
  const activeUserId = params.uid;

  const conversations = await getConversations();
  const activeMessages = activeUserId ? await getMessagesWithUser(activeUserId) : [];

  let activeReceiverName = "";

  if (activeUserId) {
    const receiver = await db.user.findUnique({ where: { id: activeUserId } });
    activeReceiverName = \`\${receiver?.name || ""} \${receiver?.surname || ""}\`.trim() || "Kullanıcı";
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <h1 className="text-2xl font-bold text-[#3b5062] mb-4">Mesaj Kutusu</h1>

      <Card className="flex-1 flex overflow-hidden border shadow-sm h-full">
        <div className={\`w-full md:w-80 border-r bg-white flex-shrink-0 \${activeUserId ? "hidden md:flex" : "flex"}\`}>
            <ChatList conversations={conversations} />
        </div>

        <div className={\`flex-1 flex flex-col bg-gray-50 \${!activeUserId ? "hidden md:flex" : "flex"}\`}>
            {activeUserId ? (
                <ChatWindow
                    messages={activeMessages}
                    currentUserId={user.id}
                    receiverId={activeUserId}
                    receiverName={activeReceiverName}
                />
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                     <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <MessageSquare size={48} className="text-gray-300" />
                     </div>
                     <p className="text-lg font-medium">Sohbet Başlatın</p>
                     <p className="text-sm">Mesajlaşmaya başlamak için soldan bir kişi seçin.</p>
                </div>
            )}
        </div>
      </Card>
    </div>
  );
}
`
);

// Favorites Page Fix
writeFile(
  "src/app/favorites/page.tsx",
  `
import ListingCard from '@/components/listings/ListingCard';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/mock-db';
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
        listing: true
    }
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
          {favorites.map((fav: any) => (
            fav.listing ? (
            <ListingCard
                key={fav.id}
                id={fav.listing.id}
                title={fav.listing.title}
                price={\`\${Number(fav.listing.price).toLocaleString('tr-TR')} \${fav.listing.currency}\`}
                location={\`\${fav.listing.city} / \${fav.listing.district}\`}
                image={fav.listing.images && fav.listing.images.length > 0 ? fav.listing.images[0].url : null}
            />
            ) : null
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
`
);

// Settings Page Fix
writeFile(
  "src/app/profile/settings/page.tsx",
  `
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/mock-db';
import { auth } from '@/auth';
import ProfileSettingsForm from '@/components/profile/ProfileSettingsForm';

export default async function SettingsPage() {
  const session = await auth();
  const user = await db.user.findUnique({ where: { email: session?.user?.email || '' } });

  return (
    <div className='max-w-2xl'>
      <h1 className='text-2xl font-bold text-[#3b5062] mb-6'>Hesap Ayarları</h1>
      <Card>
        <CardHeader>
            <CardTitle className='text-lg'>Kişisel Bilgiler</CardTitle>
        </CardHeader>
        <CardContent>
            <ProfileSettingsForm user={user} />
        </CardContent>
      </Card>
    </div>
  );
}
`
);

// My Listings Page Fix
writeFile(
  "src/app/profile/my-listings/page.tsx",
  `
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/mock-db';
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
            listings.map((item: any) => (
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
`
);

// -------------------------------------------------------------------------
// SONUÇ
// -------------------------------------------------------------------------
log("\n🎉 [TAMAMLANDI] Proje başarıyla DB-bağımsız hale getirildi!", "green");
log(
  "⚠️  Lütfen şimdi terminalde şu komutu çalıştırarak bağımlılıkları güncelleyin:",
  "yellow"
);
log("   npm install", "cyan");
log(
  'ℹ️  Artık "npm run dev" komutu ile projeyi veritabanı olmadan çalıştırabilirsiniz.',
  "blue"
);
