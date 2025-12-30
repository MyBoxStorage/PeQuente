export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  categoryId: string;
  brand: string;
  images: string[];
  featured: boolean;
  active: boolean;
  stock: number;
  sizes?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}

export interface StoreInfo {
  name: string;
  address: string;
  phone: string;
  email?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
}
