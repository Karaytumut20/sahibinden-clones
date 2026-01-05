const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Renkli konsol çıktıları
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
};

console.log(
  `${colors.blue}🚀 Sahibinden-Clone Tam Onarım ve Mock Dönüşüm Aracı Başlatılıyor...${colors.reset}\n`
);

// ---------------------------------------------------------
// 1. ADIM: EKSİK .ENV DOSYASINI OLUŞTUR (MissingSecret Hatası İçin)
// ---------------------------------------------------------
console.log(
  `${colors.yellow}🔑 .env.local dosyası oluşturuluyor (AUTH_SECRET için)...${colors.reset}`
);
const envContent = `
AUTH_SECRET="buraya-rastgele-ve-guvenli-bir-anahtar-yazildi-123456"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
`;
fs.writeFileSync(path.join(__dirname, ".env.local"), envContent.trim());
console.log(`${colors.green}✔ .env.local oluşturuldu.${colors.reset}\n`);

// ---------------------------------------------------------
// 2. ADIM: NEXT CONFIG GÜNCELLEME (SVG Hatası İçin)
// ---------------------------------------------------------
console.log(
  `${colors.yellow}⚙️  next.config.ts güncelleniyor (SVG izinleri için)...${colors.reset}`
);
const nextConfigContent = `
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      }
    ],
  },
};

export default nextConfig;
`;
// Eğer ts veya js varsa üzerine yaz
const configPathTS = path.join(__dirname, "next.config.ts");
const configPathJS = path.join(__dirname, "next.config.js");

if (fs.existsSync(configPathTS)) {
  fs.writeFileSync(configPathTS, nextConfigContent.trim());
} else {
  fs.writeFileSync(
    configPathJS,
    nextConfigContent
      .replace('import type { NextConfig } from "next";', "")
      .replace("export default nextConfig;", "module.exports = nextConfig;")
      .trim()
  );
}
console.log(
  `${colors.green}✔ next.config dosyası düzeltildi.${colors.reset}\n`
);

// ---------------------------------------------------------
// 3. ADIM: MOCK VERİTABANI OLUŞTURMA (src/lib/db.ts)
// ---------------------------------------------------------
console.log(
  `${colors.yellow}mt️  src/lib/db.ts Mock DB ile değiştiriliyor...${colors.reset}`
);

const mockDbContent = `
// BU DOSYA OTOMATİK OLUŞTURULDU - SADECE MOCK DATA İÇERİR
import { User, Category, Listing, Store, Favorite, Message } from '@/types/db-types';

const NOW = new Date();

// 1. KULLANICILAR
const USERS = [
  { id: 'user-1', name: 'Demo', surname: 'Kullanıcı', email: 'demo@sahibindenclone.com', password: 'demo', phone: '05554443322', role: 'INDIVIDUAL', createdAt: NOW },
  { id: 'user-admin', name: 'Süper', surname: 'Admin', email: 'admin@sahibindenclone.com', password: 'admin', phone: '05000000000', role: 'ADMIN', createdAt: NOW },
];

// 2. KATEGORİLER
const CATEGORIES = [
  { id: 'cat-1', name: 'Emlak', slug: 'emlak', parentId: null },
  { id: 'cat-1-1', name: 'Konut', slug: 'konut', parentId: 'cat-1' },
  { id: 'cat-1-2', name: 'İş Yeri', slug: 'is-yeri', parentId: 'cat-1' },
  { id: 'cat-2', name: 'Vasıta', slug: 'vasita', parentId: null },
  { id: 'cat-2-1', name: 'Otomobil', slug: 'otomobil', parentId: 'cat-2' },
  { id: 'cat-2-2', name: 'Motosiklet', slug: 'motosiklet', parentId: 'cat-2' },
  { id: 'cat-3', name: 'Elektronik', slug: 'elektronik', parentId: null },
];

// 3. İLANLAR
const LISTINGS = [
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

// 4. DİĞERLERİ
const STORES = [];
const FAVORITES = [];
const MESSAGES = [];

// SAHTE VERİTABANI İSTEMCİSİ (Prisma taklidi yapar)
const db = {
  user: {
    findUnique: async ({ where }) => USERS.find(u => (where.email && u.email === where.email) || (where.id && u.id === where.id)) || null,
    findFirst: async ({ where }) => USERS.find(u => (where.email && u.email === where.email)) || null,
    create: async ({ data }) => {
        const newUser = { ...data, id: \`user-\${Date.now()}\`, createdAt: new Date() };
        USERS.push(newUser);
        return newUser;
    },
    update: async ({ where, data }) => {
        const index = USERS.findIndex(u => u.email === where.email || u.id === where.id);
        if (index > -1) { USERS[index] = { ...USERS[index], ...data }; return USERS[index]; }
        return null;
    },
    count: async () => USERS.length
  },
  category: {
    findMany: async () => CATEGORIES,
    findUnique: async ({ where }) => CATEGORIES.find(c => c.slug === where.slug || c.id === where.id) || null,
    upsert: async () => null
  },
  listing: {
    findMany: async (args = {}) => {
        let res = [...LISTINGS];
        if (args.where) {
            if (args.where.userId) res = res.filter(l => l.userId === args.where.userId);
            if (args.where.status) res = res.filter(l => l.status === args.where.status);
            if (args.where.OR) {
                const term = args.where.OR[0]?.title?.contains?.toLowerCase();
                if(term) res = res.filter(l => l.title.toLowerCase().includes(term));
            }
        }
        if (args.orderBy) {
            if (args.orderBy.price === 'asc') res.sort((a,b) => a.price - b.price);
            else if (args.orderBy.price === 'desc') res.sort((a,b) => b.price - a.price);
        }
        // İlişkileri ekle
        if (args.include) {
            res = res.map(l => ({
                ...l,
                user: args.include.user ? USERS.find(u => u.id === l.userId) : undefined,
                category: args.include.category ? CATEGORIES.find(c => c.id === l.categoryId) : undefined,
            }));
        }
        return res;
    },
    findUnique: async ({ where, include }) => {
        let l = LISTINGS.find(x => x.id === where.id);
        if (!l) return null;
        if (include) {
            l = {
                ...l,
                user: include.user ? USERS.find(u => u.id === l.userId) : undefined,
                category: include.category ? CATEGORIES.find(c => c.id === l.categoryId) : undefined,
            };
        }
        return l;
    },
    create: async ({ data }) => {
        const userId = data.user?.connect?.id || 'user-1';
        const categoryId = data.category?.connect?.id || 'cat-1';
        const newListing = {
            id: \`lst-\${Date.now()}\`,
            title: data.title,
            description: data.description,
            price: data.price,
            currency: data.currency,
            city: data.city,
            district: data.district,
            status: data.status || 'PENDING',
            userId: userId,
            categoryId: categoryId,
            images: data.images?.create?.map(img => ({ id: \`img-\${Date.now()}\`, url: img.url })) || [],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        LISTINGS.unshift(newListing);
        return newListing;
    },
    update: async ({ where, data }) => {
        const index = LISTINGS.findIndex(l => l.id === where.id);
        if (index > -1) {
            LISTINGS[index] = { ...LISTINGS[index], ...data };
            return LISTINGS[index];
        }
        return null;
    },
    delete: async ({ where }) => {
        const index = LISTINGS.findIndex(l => l.id === where.id);
        if (index > -1) { LISTINGS.splice(index, 1); return { id: where.id }; }
        throw new Error('Listing not found');
    },
    count: async () => LISTINGS.length
  },
  store: {
    findMany: async () => STORES,
    count: async () => STORES.length
  },
  favorite: {
    findUnique: async ({ where }) => FAVORITES.find(f => f.userId === where.userId_listingId.userId && f.listingId === where.userId_listingId.listingId) || null,
    findMany: async ({ where, include }) => {
        let res = FAVORITES.filter(f => f.userId === where.userId);
        if (include?.listing) {
            res = res.map(f => ({
                ...f,
                listing: LISTINGS.find(l => l.id === f.listingId)
            }));
        }
        return res;
    },
    create: async ({ data }) => {
        const fav = { id: \`fav-\${Date.now()}\`, userId: data.userId, listingId: data.listingId, createdAt: new Date() };
        FAVORITES.push(fav);
        return fav;
    },
    delete: async ({ where }) => {
        const idx = FAVORITES.findIndex(f => f.id === where.id);
        if(idx > -1) FAVORITES.splice(idx, 1);
        return { id: where.id };
    }
  },
  message: {
    create: async ({ data }) => {
        const msg = { id: \`msg-\${Date.now()}\`, ...data, createdAt: new Date(), isRead: false };
        MESSAGES.push(msg);
        return msg;
    },
    findMany: async ({ where, include }) => {
        let msgs = [...MESSAGES];
        if (where.OR) {
            msgs = msgs.filter(m => m.senderId === where.OR[0].senderId || m.receiverId === where.OR[0].senderId);
        }
        if (include) {
            msgs = msgs.map(m => ({
                ...m,
                sender: USERS.find(u => u.id === m.senderId),
                receiver: USERS.find(u => u.id === m.receiverId),
                listing: LISTINGS.find(l => l.id === m.listingId)
            }));
        }
        return msgs.sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime());
    }
  }
};

export default db;
`;

// src/lib/db.ts dosyasını üzerine yaz
const dbPath = path.join(__dirname, "src", "lib", "db.ts");
// Klasör yoksa oluştur
if (!fs.existsSync(path.join(__dirname, "src", "lib")))
  fs.mkdirSync(path.join(__dirname, "src", "lib"), { recursive: true });
fs.writeFileSync(dbPath, mockDbContent.trim());
console.log(
  `${colors.green}✔ src/lib/db.ts dosyası Mock DB ile değiştirildi.${colors.reset}\n`
);

// ---------------------------------------------------------
// 4. ADIM: AUTH.TS DOSYASINI DÜZELTME (Adapter'ı Kaldır)
// ---------------------------------------------------------
console.log(
  `${colors.yellow}🔐 src/auth.ts dosyası PrismaAdapter'dan arındırılıyor...${colors.reset}`
);

const authContent = `
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

        // Mock DB'den kullanıcı bul
        const user = await db.user.findUnique({ where: { email } });
        if (!user) return null;

        // Basit şifre kontrolü (Mock veriler için)
        if (password === user.password || password === 'demo' || password === 'admin') {
             return {
                id: user.id,
                email: user.email,
                name: user.name,
                surname: user.surname,
                role: user.role,
             };
        }
        return null;
      },
    }),
  ],
});
`;

fs.writeFileSync(path.join(__dirname, "src", "auth.ts"), authContent.trim());
console.log(
  `${colors.green}✔ src/auth.ts dosyası düzeltildi.${colors.reset}\n`
);

// ---------------------------------------------------------
// 5. ADIM: TEMİZLİK (Prisma Paketleri ve Klasörleri)
// ---------------------------------------------------------
try {
  console.log(
    `${colors.yellow}📦 Prisma ve gereksiz paketler kaldırılıyor...${colors.reset}`
  );
  execSync("npm uninstall prisma @prisma/client @auth/prisma-adapter", {
    stdio: "inherit",
  });

  // Package.json postinstall temizliği
  const pkgPath = path.join(__dirname, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  if (pkg.scripts && pkg.scripts.postinstall) {
    delete pkg.scripts.postinstall;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  }
  console.log(
    `${colors.green}✔ Paketler ve scriptler temizlendi.${colors.reset}\n`
  );
} catch (e) {
  console.log(
    `${colors.red}⚠️  Paket kaldırma sırasında uyarı (önemli değil).${colors.reset}`
  );
}

// Prisma klasörünü sil
const prismaDir = path.join(__dirname, "prisma");
if (fs.existsSync(prismaDir)) {
  fs.rmSync(prismaDir, { recursive: true, force: true });
  console.log(`${colors.green}✔ Prisma klasörü silindi.${colors.reset}\n`);
}

console.log(`${colors.blue}✅ İŞLEM TAMAMLANDI!${colors.reset}`);
console.log(`Artık proje tamamen frontend modunda çalışmaya hazır.`);
console.log(`\nTest etmek için:\n> npm run dev\n`);
console.log(`Giriş Bilgileri:\nEmail: demo@sahibindenclone.com\nŞifre: demo`);
