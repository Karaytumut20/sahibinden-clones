
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
