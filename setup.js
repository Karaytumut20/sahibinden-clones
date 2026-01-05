const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const colors = {
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
};

console.log(
  `${colors.blue}🚀 Sahibinden-Clone Mock DB Onarım Aracı Başlatılıyor...${colors.reset}\n`
);

// ---------------------------------------------------------
// 1. ADIM: src/lib/db.ts DOSYASINI DÜZELT (TypeScript Hataları İçin)
// ---------------------------------------------------------
console.log(
  `${colors.yellow}🛠️  src/lib/db.ts dosyası esnek parametrelerle yeniden oluşturuluyor...${colors.reset}`
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

// SAHTE VERİTABANI İSTEMCİSİ
// Not: Fonksiyon parametreleri (args) artık opsiyonel ve 'any' tipinde
// Bu sayede { where } gönderip { include } göndermediğinizde hata almazsınız.

const db = {
  user: {
    findUnique: async (args = {}) => {
        const { where } = args;
        return USERS.find(u => (where?.email && u.email === where.email) || (where?.id && u.id === where.id)) || null;
    },
    findFirst: async (args = {}) => {
        const { where } = args;
        return USERS.find(u => (where?.email && u.email === where.email)) || null;
    },
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
    findUnique: async (args = {}) => {
        const { where } = args;
        return CATEGORIES.find(c => c.slug === where?.slug || c.id === where?.id) || null;
    },
    upsert: async () => null
  },

  listing: {
    findMany: async (args = {}) => {
        const { where, include, orderBy } = args;
        let res = [...LISTINGS];

        if (where) {
            if (where.userId) res = res.filter(l => l.userId === where.userId);
            if (where.status) res = res.filter(l => l.status === where.status);
            if (where.OR) {
                const term = where.OR[0]?.title?.contains?.toLowerCase();
                if(term) res = res.filter(l => l.title.toLowerCase().includes(term));
            }
        }

        if (orderBy) {
            if (orderBy.price === 'asc') res.sort((a,b) => a.price - b.price);
            else if (orderBy.price === 'desc') res.sort((a,b) => b.price - a.price);
        }

        if (include) {
            res = res.map(l => ({
                ...l,
                user: include.user ? USERS.find(u => u.id === l.userId) : undefined,
                category: include.category ? CATEGORIES.find(c => c.id === l.categoryId) : undefined,
            }));
        }
        return res;
    },
    findUnique: async (args = {}) => {
        const { where, include } = args;
        let l = LISTINGS.find(x => x.id === where?.id);
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
    findUnique: async (args = {}) => {
        const { where } = args;
        return FAVORITES.find(f => f.userId === where?.userId_listingId?.userId && f.listingId === where?.userId_listingId?.listingId) || null;
    },
    findMany: async (args = {}) => {
        const { where, include } = args;
        let res = FAVORITES.filter(f => f.userId === where?.userId);
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
    findMany: async (args = {}) => {
        const { where, include } = args;
        let msgs = [...MESSAGES];

        if (where?.OR) {
            // Basit OR mantığı: Sender veya Receiver bu ID ise getir
            const filterId = where.OR[0]?.senderId || where.OR[1]?.receiverId;
            if (filterId) {
                 msgs = msgs.filter(m => m.senderId === filterId || m.receiverId === filterId);
            }
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
  `${colors.green}✔ src/lib/db.ts dosyası düzeltildi.${colors.reset}\n`
);

console.log(`${colors.blue}✅ İŞLEM TAMAMLANDI!${colors.reset}`);
console.log(`Şimdi şu komutları sırasıyla çalıştırın:\n`);
console.log(`1. node setup.js`);
console.log(`2. git add src/lib/db.ts`);
console.log(`3. git commit -m "Fix db params"`);
console.log(`4. git push origin master`);
