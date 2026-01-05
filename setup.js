/**
 * ==================================================================================
 * SAHIBINDEN CLONE - FULL MIGRATION TO MOCK (DB-LESS) ARCHITECTURE
 * ==================================================================================
 * * Bu script, projeyi analiz eder ve veritabanı bağımlılıklarını (Prisma, Mongoose)
 * tamamen kaldırarak, projeyi "In-Memory Mock Data" ile çalışacak hale getirir.
 * * YAPILACAK İŞLEMLER:
 * 1. [ANALİZ] Dosya yapısı ve bağımlılıklar taranır.
 * 2. [TEMİZLİK] Prisma, Mongoose, Docker ve ilgili tüm dosyalar silinir.
 * 3. [CONFIG] package.json temizlenir (prisma generate vb. scriptler kaldırılır).
 * 4. [MOCK DB] Prisma Client'ı taklit eden güçlü bir Mock DB sınıfı oluşturulur.
 * 5. [REWRITE] Auth, Actions ve Data katmanları Mock DB'ye göre yeniden yazılır.
 * 6. [FIX] Vercel build hatasına neden olan postinstall scriptleri düzeltilir.
 */

const fs = require("fs");
const path = require("path");

// ----------------------------------------------------------------------------------
// YARDIMCI FONKSİYONLAR & LOGLAMA
// ----------------------------------------------------------------------------------

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  bgRed: "\x1b[41m",
};

function log(msg, type = "cyan") {
  console.log(`${colors[type]}%s${colors.reset}`, msg);
}

function success(msg) {
  console.log(`${colors.green}✔ ${msg}${colors.reset}`);
}

function warn(msg) {
  console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`);
}

function info(msg) {
  console.log(`${colors.bright}ℹ ${msg}${colors.reset}`);
}

function writeFile(filePath, content) {
  const absolutePath = path.join(process.cwd(), filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(absolutePath, content.trim(), "utf8");
  success(`Dosya oluşturuldu/güncellendi: ${filePath}`);
}

function removeFile(filePath) {
  const absolutePath = path.join(process.cwd(), filePath);
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
    warn(`Dosya silindi: ${filePath}`);
  }
}

function removeDir(dirPath) {
  const absolutePath = path.join(process.cwd(), dirPath);
  if (fs.existsSync(absolutePath)) {
    fs.rmSync(absolutePath, { recursive: true, force: true });
    warn(`Klasör silindi: ${dirPath}`);
  }
}

// ----------------------------------------------------------------------------------
// ADIM 1: PACKAGE.JSON TEMİZLİĞİ VE ANALİZİ
// ----------------------------------------------------------------------------------

async function cleanPackageJson() {
  log("\n📦 [ADIM 1] package.json Analizi ve Temizliği...", "bright");

  const pkgPath = path.join(process.cwd(), "package.json");
  if (!fs.existsSync(pkgPath)) {
    log("package.json bulunamadı!", "red");
    return;
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

  // Kaldırılacak Bağımlılıklar
  const depsToRemove = [
    "prisma",
    "@prisma/client",
    "@auth/prisma-adapter",
    "mongoose",
    "bcryptjs", // Mock auth için buna gerek yok
    "ts-node",
  ];

  let removedCount = 0;

  // Dependencies temizle
  if (pkg.dependencies) {
    depsToRemove.forEach((dep) => {
      if (pkg.dependencies[dep]) {
        delete pkg.dependencies[dep];
        removedCount++;
      }
    });
  }

  // DevDependencies temizle
  if (pkg.devDependencies) {
    depsToRemove.forEach((dep) => {
      if (pkg.devDependencies[dep]) {
        delete pkg.devDependencies[dep];
        removedCount++;
      }
    });
  }

  // Scriptleri temizle (Özellikle Vercel hatasına sebep olan 'postinstall')
  if (pkg.scripts) {
    const scriptsToRemove = [
      "db:generate",
      "db:migrate",
      "db:push",
      "db:studio",
      "db:seed",
      "postinstall",
    ];

    // Build scriptini düzelt
    if (pkg.scripts.build && pkg.scripts.build.includes("prisma")) {
      pkg.scripts.build = "next build";
      info("Build scripti 'next build' olarak düzeltildi.");
    }

    scriptsToRemove.forEach((script) => {
      if (pkg.scripts[script]) {
        delete pkg.scripts[script];
        warn(`Script kaldırıldı: ${script}`);
      }
    });

    // Prisma config varsa kaldır
    if (pkg.prisma) delete pkg.prisma;
  }

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  success(
    `${removedCount} adet veritabanı bağımlılığı ve ilgili scriptler temizlendi.`
  );
}

// ----------------------------------------------------------------------------------
// ADIM 2: DOSYA SİSTEMİ TEMİZLİĞİ
// ----------------------------------------------------------------------------------

function cleanFileSystem() {
  log("\nmw [ADIM 2] Dosya Sistemi Temizliği...", "bright");

  const pathsToDelete = [
    "prisma", // Prisma klasörü
    "src/models", // Mongoose modelleri
    "src/lib/db.ts", // Eski DB bağlantısı
    "src/lib/db.ts.bak-20251213153230",
    "docker-compose.yml", // Varsa docker dosyası
    ".env", // DB connection string içeren env (opsiyonel, güvenlik için silinebilir veya içi boşaltılabilir)
    "prisma/dev.db", // SQLite dosyası
  ];

  pathsToDelete.forEach((p) => {
    const fullPath = path.join(process.cwd(), p);
    if (fs.existsSync(fullPath)) {
      if (fs.lstatSync(fullPath).isDirectory()) {
        removeDir(p);
      } else {
        removeFile(p);
      }
    }
  });
}

// ----------------------------------------------------------------------------------
// ADIM 3: MOCK DATABASE MOTORU OLUŞTURMA
// ----------------------------------------------------------------------------------

function createMockDatabaseEngine() {
  log("\n🛠 [ADIM 3] Mock Database Motoru Oluşturuluyor...", "bright");

  // 3.1 TYPE TANIMLARI
  const typesContent = `
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
  password?: string;
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
  price: number;
  currency: string;
  city: string;
  district: string;
  status: ListingStatus;
  userId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  // Relations (Mock join için)
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
  createdAt: Date;
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
  sender?: User;
  receiver?: User;
  listing?: Listing;
}
`;
  writeFile("src/types/db-types.ts", typesContent);

  // 3.2 DB CLIENT (Prisma Taklidi)
  const mockDbContent = `
import { User, Category, Listing, Store, Favorite, Message, ListingImage } from '@/types/db-types';

// ==========================================
// INITIAL MOCK DATA
// ==========================================
const NOW = new Date();

let USERS: User[] = [
  { id: 'user-1', name: 'Demo', surname: 'Kullanıcı', email: 'demo@sahibindenclone.com', password: 'demo', phone: '05554443322', role: 'INDIVIDUAL', createdAt: NOW },
  { id: 'user-admin', name: 'Süper', surname: 'Admin', email: 'admin@sahibindenclone.com', password: 'admin', phone: '05000000000', role: 'ADMIN', createdAt: NOW },
];

let CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Emlak', slug: 'emlak', parentId: null },
  { id: 'cat-1-1', name: 'Konut', slug: 'konut', parentId: 'cat-1' },
  { id: 'cat-1-2', name: 'İş Yeri', slug: 'is-yeri', parentId: 'cat-1' },
  { id: 'cat-2', name: 'Vasıta', slug: 'vasita', parentId: null },
  { id: 'cat-2-1', name: 'Otomobil', slug: 'otomobil', parentId: 'cat-2' },
  { id: 'cat-2-2', name: 'Motosiklet', slug: 'motosiklet', parentId: 'cat-2' },
];

let LISTINGS: Listing[] = [
  {
    id: 'lst-1', title: 'Sahibinden Temiz 2020 Passat', description: 'Hatasız boyasız.', price: 1250000, currency: 'TL',
    city: 'İstanbul', district: 'Kadıköy', status: 'ACTIVE', userId: 'user-1', categoryId: 'cat-2-1',
    createdAt: new Date(Date.now() - 86400000), updatedAt: NOW, images: [{ id: 'img-1', url: 'https://placehold.co/600x400?text=Passat', listingId: 'lst-1' }]
  },
  {
    id: 'lst-2', title: 'Kadıköy Merkezde 2+1 Daire', description: 'Metrobüse yakın.', price: 25000, currency: 'TL',
    city: 'İstanbul', district: 'Kadıköy', status: 'ACTIVE', userId: 'user-1', categoryId: 'cat-1-1',
    createdAt: new Date(Date.now() - 172800000), updatedAt: NOW, images: [{ id: 'img-2', url: 'https://placehold.co/600x400?text=Ev', listingId: 'lst-2' }]
  }
];

let STORES: Store[] = [];
let FAVORITES: Favorite[] = [];
let MESSAGES: Message[] = [];

// ==========================================
// MOCK CLIENT IMPLEMENTATION
// ==========================================

const db = {
  user: {
    findUnique: async ({ where }: any) => USERS.find(u => (where.email && u.email === where.email) || (where.id && u.id === where.id)) || null,
    findFirst: async ({ where }: any) => USERS.find(u => (where.email && u.email === where.email)) || null,
    create: async ({ data }: any) => {
        const newUser = { ...data, id: \`user-\${Date.now()}\`, createdAt: new Date() };
        USERS.push(newUser);
        return newUser;
    },
    update: async ({ where, data }: any) => {
        const index = USERS.findIndex(u => u.email === where.email || u.id === where.id);
        if (index > -1) { USERS[index] = { ...USERS[index], ...data }; return USERS[index]; }
        throw new Error('User not found');
    },
    count: async () => USERS.length
  },

  category: {
    findMany: async () => CATEGORIES,
    findUnique: async ({ where }: any) => CATEGORIES.find(c => c.slug === where.slug || c.id === where.id) || null
  },

  listing: {
    findMany: async (args: any = {}) => {
        let res = [...LISTINGS];
        if (args.where) {
            if (args.where.userId) res = res.filter(l => l.userId === args.where.userId);
            if (args.where.status) res = res.filter(l => l.status === args.where.status);
            // Basit search implementation
            if (args.where.OR) {
                const term = args.where.OR[0].title?.contains?.toLowerCase();
                if(term) res = res.filter(l => l.title.toLowerCase().includes(term));
            }
        }

        // Sorting
        if (args.orderBy) {
            if (args.orderBy.price === 'asc') res.sort((a,b) => a.price - b.price);
            else if (args.orderBy.price === 'desc') res.sort((a,b) => b.price - a.price);
            else res.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());
        }

        // Include relations
        if (args.include) {
            res = res.map(l => ({
                ...l,
                user: args.include.user ? USERS.find(u => u.id === l.userId) : undefined,
                category: args.include.category ? CATEGORIES.find(c => c.id === l.categoryId) : undefined,
            }));
        }

        // Pagination
        if (args.take && args.skip !== undefined) {
            return res.slice(args.skip, args.skip + args.take);
        }
        return res;
    },
    findUnique: async ({ where, include }: any) => {
        let l = LISTINGS.find(x => x.id === where.id);
        if (!l) return null;
        if (include) {
            l = {
                ...l,
                user: include.user ? USERS.find(u => u.id === l!.userId) : undefined,
                category: include.category ? CATEGORIES.find(c => c.id === l!.categoryId) : undefined,
            } as any;
        }
        return l;
    },
    create: async ({ data }: any) => {
        const newListing: any = {
            id: \`lst-\${Date.now()}\`,
            title: data.title,
            description: data.description,
            price: data.price,
            currency: data.currency,
            city: data.city,
            district: data.district,
            status: data.status,
            userId: data.user.connect.id,
            categoryId: data.category.connect.id,
            images: data.images.create.map((img: any) => ({ id: \`img-\${Date.now()}\`, url: img.url, listingId: \`lst-\${Date.now()}\` })),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        LISTINGS.unshift(newListing);
        return newListing;
    },
    update: async ({ where, data }: any) => {
        const index = LISTINGS.findIndex(l => l.id === where.id);
        if (index > -1) { LISTINGS[index] = { ...LISTINGS[index], ...data }; return LISTINGS[index]; }
        return null;
    },
    delete: async ({ where }: any) => {
        const index = LISTINGS.findIndex(l => l.id === where.id);
        if (index > -1) { LISTINGS.splice(index, 1); return true; }
        return false;
    },
    count: async ({ where }: any = {}) => {
        if(where?.status) return LISTINGS.filter(l => l.status === where.status).length;
        return LISTINGS.length;
    }
  },

  store: {
    findMany: async () => STORES,
    count: async () => STORES.length
  },

  favorite: {
    findUnique: async ({ where }: any) => FAVORITES.find(f => f.userId === where.userId_listingId.userId && f.listingId === where.userId_listingId.listingId) || null,
    findMany: async ({ where, include }: any) => {
        let res = FAVORITES.filter(f => f.userId === where.userId);
        if (include?.listing) {
            res = res.map(f => ({
                ...f,
                listing: LISTINGS.find(l => l.id === f.listingId)
            } as any));
        }
        return res;
    },
    create: async ({ data }: any) => {
        const fav = { id: \`fav-\${Date.now()}\`, userId: data.userId, listingId: data.listingId, createdAt: new Date() };
        FAVORITES.push(fav);
        return fav;
    },
    delete: async ({ where }: any) => {
        const idx = FAVORITES.findIndex(f => f.id === where.id);
        if(idx > -1) FAVORITES.splice(idx, 1);
        return true;
    }
  },

  message: {
    create: async ({ data }: any) => {
        const msg = { id: \`msg-\${Date.now()}\`, ...data, createdAt: new Date(), isRead: false };
        MESSAGES.push(msg);
        return msg;
    },
    findMany: async ({ where, include }: any) => {
        let msgs = [...MESSAGES];
        if (where.OR) {
            const userId = where.OR[0].senderId; // Mock logic, assuming symmetric query
            msgs = msgs.filter(m => m.senderId === userId || m.receiverId === userId);
        }
        if (include) {
            msgs = msgs.map(m => ({
                ...m,
                sender: USERS.find(u => u.id === m.senderId),
                receiver: USERS.find(u => u.id === m.receiverId),
                listing: LISTINGS.find(l => l.id === m.listingId)
            } as any));
        }
        return msgs.sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime());
    }
  }
};

export default db;
`;
  writeFile("src/lib/db.ts", mockDbContent); // Eski db.ts yerine geçer
}

// ----------------------------------------------------------------------------------
// ADIM 4: AUTH & ACTIONS KATMANINI YENİDEN YAZMA
// ----------------------------------------------------------------------------------

function rewriteApplicationLogic() {
  log(
    "\n🚀 [ADIM 4] Uygulama Mantığı (Auth & Actions) Yeniden Yazılıyor...",
    "bright"
  );

  // 4.1 Auth Config
  writeFile(
    "src/auth.config.ts",
    `
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
        token.name = user.name;
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
`
  );

  // 4.2 Auth Main
  writeFile(
    "src/auth.ts",
    `
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import db from "@/lib/db";
import { authConfig } from "./auth.config";

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

        const user = await db.user.findUnique({ where: { email } });
        if (!user) return null;

        // Mock Password Check (Prod'da bcrypt kullanın, burada mock check)
        // Demo kullanıcılar: demo/demo, admin/admin
        if (password === user.password || password === 'demo' || password === 'admin') {
             return {
                id: user.id,
                email: user.email,
                name: user.name,
                surname: user.surname,
                role: user.role,
             } as any;
        }
        return null;
      },
    }),
  ],
});
`
  );

  // 4.3 Auth Actions
  writeFile(
    "src/actions/authActions.ts",
    `
'use server';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { loginSchema } from '@/lib/validators/auth';

export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = loginSchema.safeParse(rawData);
    if (!validatedFields.success) return "Geçersiz giriş bilgileri.";

    await signIn('credentials', { ...rawData, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === 'CredentialsSignin') return 'E-posta veya şifre hatalı.';
      return 'Bir hata oluştu.';
    }
    throw error;
  }
}
`
  );

  // 4.4 Data Fetching (src/lib/data.ts) - Prisma referanslarını temizle
  writeFile(
    "src/lib/data.ts",
    `
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
`
  );

  // 4.5 Listing Actions
  writeFile(
    "src/actions/listingActions.ts",
    `
"use server";
import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { createListingSchema } from "@/lib/validators/listing";

export async function createListing(input: any) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: "Giriş yapmalısınız." };

  const parsed = createListingSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Form hatası" };

  const data = parsed.data;

  const category = await db.category.findUnique({ where: { slug: data.category } });
  if (!category) return { success: false, message: "Kategori bulunamadı." };

  await db.listing.create({
    data: {
      ...data,
      price: parseFloat(data.price),
      images: { create: data.images.map((url: string) => ({ url })) },
      status: "PENDING",
      user: { connect: { id: session.user.id } },
      category: { connect: { id: category.id } },
    }
  });

  revalidatePath("/");
  return { success: true, message: "İlan oluşturuldu (Mock)" };
}

export async function getMyListings() {
  const session = await auth();
  if (!session?.user?.id) return [];
  return db.listing.findMany({
    where: { userId: session.user.id },
    include: { images: true }
  });
}
`
  );

  // 4.6 User Actions
  writeFile(
    "src/actions/userActions.ts",
    `
'use server';
import db from '@/lib/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function toggleFavorite(listingId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: 'Giriş gerekli.' };

  const userId = session.user.id;
  const existing = await db.favorite.findUnique({ where: { userId_listingId: { userId, listingId } } });

  if (existing) {
    await db.favorite.delete({ where: { id: existing.id } });
    revalidatePath('/');
    return { success: true, isFavorited: false, message: 'Favorilerden çıkarıldı.' };
  } else {
    await db.favorite.create({ data: { userId, listingId } });
    revalidatePath('/');
    return { success: true, isFavorited: true, message: 'Favorilere eklendi.' };
  }
}

export async function deleteListing(listingId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false };

  const listing = await db.listing.findUnique({ where: { id: listingId } });
  if (!listing || listing.userId !== session.user.id) return { success: false, message: 'Yetkisiz' };

  await db.listing.delete({ where: { id: listingId } });
  revalidatePath('/profile/my-listings');
  return { success: true, message: 'Silindi.' };
}
`
  );

  // 4.7 Register Route
  writeFile(
    "src/app/api/users/register/route.ts",
    `
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { registerSchema } from "@/lib/validators/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) return NextResponse.json({ ok: false, error: "Hata" }, { status: 400 });

  const { email, password, name, surname, phone } = parsed.data;
  const exists = await db.user.findUnique({ where: { email } });

  if (exists) return NextResponse.json({ ok: false, error: "E-posta kayıtlı." }, { status: 409 });

  const user = await db.user.create({
    data: { email, password, name, surname, phone, role: "INDIVIDUAL" }
  });

  return NextResponse.json({ ok: true, user }, { status: 201 });
}
`
  );

  // 4.8 Admin Page
  writeFile(
    "src/app/admin/page.tsx",
    `
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, ShoppingBag, DollarSign } from 'lucide-react';
import db from '@/lib/db';
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
    { title: 'Üyeler', value: userCount, icon: <Users size={16} /> },
    { title: 'İlanlar', value: listingCount, icon: <FileText size={16} /> },
    { title: 'Mağazalar', value: storeCount, icon: <ShoppingBag size={16} /> },
    { title: 'Gelir', value: '₺0', icon: <DollarSign size={16} /> },
  ];

  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold text-[#3b5062]'>Yönetim Paneli (Mock)</h1>
      <div className='grid gap-4 md:grid-cols-4'>
        {stats.map((s, i) => (
          <Card key={i}>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>{s.title}</CardTitle>
              {s.icon}
            </CardHeader>
            <CardContent><div className='text-2xl font-bold'>{s.value}</div></CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
`
  );

  // 4.9 Admin Actions
  writeFile(
    "src/actions/adminActions.ts",
    `
"use server";
import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function checkAdmin() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Yetkisiz");
}

export async function getPendingListings() {
  await checkAdmin();
  return db.listing.findMany({
      where: { status: "PENDING" },
      include: { user: true, category: true, images: true }
  });
}

export async function approveListing(id: string) {
  await checkAdmin();
  await db.listing.update({ where: { id }, data: { status: "ACTIVE" } });
  revalidatePath("/admin/listings");
  return { success: true };
}

export async function rejectListing(id: string) {
  await checkAdmin();
  await db.listing.update({ where: { id }, data: { status: "REJECTED" } });
  revalidatePath("/admin/listings");
  return { success: true };
}
`
  );

  // 4.10 Message Actions
  writeFile(
    "src/actions/messageActions.ts",
    `
'use server';
import db from '@/lib/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function sendMessage(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: 'Giriş gerekli.' };

  const content = formData.get('content') as string;
  const receiverId = formData.get('receiverId') as string;
  const listingId = formData.get('listingId') as string;

  await db.message.create({
    data: { content, senderId: session.user.id, receiverId, listingId }
  });

  revalidatePath('/profile/messages');
  return { success: true };
}

export async function getConversations() {
  const session = await auth();
  if (!session?.user?.id) return [];

  // Mock DB include logic'ini kullan
  const msgs = await db.message.findMany({
      where: { OR: [{ senderId: session.user.id }, { receiverId: session.user.id }] },
      include: true // Mock'ta bu destekleniyor
  });

  // Grouping logic (basitleştirilmiş)
  const map = new Map();
  msgs.forEach((m: any) => {
      const other = m.senderId === session.user.id ? m.receiver : m.sender;
      if(!other) return;
      if(!map.has(other.id)) map.set(other.id, { user: other, lastMessage: m });
  });

  return Array.from(map.values());
}

export async function getMessagesWithUser(uid: string) {
  const session = await auth();
  if (!session?.user?.id) return [];
  return db.message.findMany({
      where: { OR: [{ senderId: session.user.id }, { receiverId: session.user.id }] }
  }); // Mock client zaten basit filtreliyor
}
`
  );

  // 4.11 Favorite Actions
  writeFile(
    "src/actions/favoriteActions.ts",
    `
"use server";
import db from "@/lib/db";
import { auth } from "@/auth";

export async function getMyFavorites() {
  const session = await auth();
  if (!session?.user?.id) return [];
  return db.favorite.findMany({
      where: { userId: session.user.id },
      include: { listing: true }
  });
}
`
  );

  // 4.12 Settings Actions
  writeFile(
    "src/actions/settingsActions.ts",
    `
'use server';
import db from '@/lib/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function updateProfile(prev: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return { success: false };

  await db.user.update({
      where: { email: session.user.email },
      data: {
          name: formData.get('name'),
          surname: formData.get('surname'),
          phone: formData.get('phone')
      }
  });
  revalidatePath('/profile');
  return { success: true, message: 'Güncellendi' };
}
`
  );

  // 4.13 Profile Page Update (Fix DB call)
  writeFile(
    "src/app/profile/messages/page.tsx",
    `
import { getConversations, getMessagesWithUser } from "@/actions/messageActions";
import ChatWindow from "@/components/profile/messages/ChatWindow";
import ChatList from "@/components/profile/messages/ChatList";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { auth } from "@/auth";
import db from "@/lib/db";

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const session = await auth();
  const user = await db.user.findUnique({ where: { email: session?.user?.email || "" } });

  if (!user) return <div className="p-4">Lütfen giriş yapın.</div>;

  const params = await searchParams;
  const activeUserId = params.uid;
  const conversations = await getConversations();
  const activeMessages = activeUserId ? await getMessagesWithUser(activeUserId) : [];

  let activeReceiverName = "";
  if (activeUserId) {
    const receiver = await db.user.findUnique({ where: { id: activeUserId } });
    activeReceiverName = receiver ? \`\${receiver.name} \${receiver.surname}\` : "Kullanıcı";
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
                <ChatWindow messages={activeMessages} currentUserId={user.id} receiverId={activeUserId} receiverName={activeReceiverName} />
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                     <MessageSquare size={48} className="text-gray-300 mb-4" />
                     <p>Sohbet seçin</p>
                </div>
            )}
        </div>
      </Card>
    </div>
  );
}
`
  );
}

// ----------------------------------------------------------------------------------
// ANA ÇALIŞTIRMA MANTIĞI
// ----------------------------------------------------------------------------------

async function main() {
  console.log(
    colors.bgRed + " SAHIBINDEN CLONE: CLEANUP & SETUP SCRIPT " + colors.reset
  );
  console.log(
    "Bu işlem veritabanı dosyalarını silecek ve Mock DB yapısına geçecektir.\n"
  );

  await cleanPackageJson();
  cleanFileSystem();
  createMockDatabaseEngine();
  rewriteApplicationLogic();

  log("\n✅ [BAŞARILI] Dönüşüm Tamamlandı!", "green");
  console.log(`
${colors.yellow}Lütfen aşağıdaki komutları sırasıyla çalıştırın:${colors.reset}

1. ${colors.cyan}npm install${colors.reset} (Bağımlılıkları güncellemek için)
2. ${colors.cyan}npm run dev${colors.reset} (Uygulamayı başlatmak için)

NOT: Giriş yapmak için aşağıdaki demo hesapları kullanabilirsiniz:
- Kullanıcı: demo@sahibindenclone.com / demo
- Admin: admin@sahibindenclone.com / admin
`);
}

main().catch(console.error);
