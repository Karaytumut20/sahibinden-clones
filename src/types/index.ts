
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
