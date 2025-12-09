export interface IListing {
  id: string;
  title: string;
  price: number;
  currency: string;
  location: {
    city: string;
    district: string;
  };
  category: string;
  date: string;
  images: string[];
  attributes: {
    label: string;
    value: string;
  }[];
  description: string;
  seller: {
    name: string;
    phone: string;
    avatar?: string;
  };
}