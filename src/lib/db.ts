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
        const newUser = { ...data, id: `user-${Date.now()}`, createdAt: new Date() };
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
            id: `lst-${Date.now()}`,
            title: data.title,
            description: data.description,
            price: data.price,
            currency: data.currency,
            city: data.city,
            district: data.district,
            status: data.status,
            userId: data.user.connect.id,
            categoryId: data.category.connect.id,
            images: data.images.create.map((img: any) => ({ id: `img-${Date.now()}`, url: img.url, listingId: `lst-${Date.now()}` })),
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
        const fav = { id: `fav-${Date.now()}`, userId: data.userId, listingId: data.listingId, createdAt: new Date() };
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
        const msg = { id: `msg-${Date.now()}`, ...data, createdAt: new Date(), isRead: false };
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