export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  originalPrice?: number;
  discount?: number;
  categoryId: string;
  category?: string[];
  brand: 'Nike' | 'Adidas' | 'Mizuno' | 'Puma' | 'New Balance' | string;
  images: string[];
  featured: boolean;
  active: boolean;
  newArrival?: boolean;
  inStock?: boolean;
  stock: number;
  sizes?: string[];
  specs?: {
    sizes: string[];
    material: string;
    color: string[];
    gender: 'Masculino' | 'Feminino' | 'Unissex' | 'Infantil';
  };
  tags?: string[];
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

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  size?: string;
  image: string;
  brand: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  subtotal: number;
  discount: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  author?: string;
  publishedAt: string;
  category?: string;
}

export interface ArTryOnProps {
  isOpen: boolean;
  onClose: () => void;
  modelUrl?: string; // Opcional - para compatibilidade com modelo único
  modelUrlLeft?: string; // URL do modelo do pé esquerdo
  modelUrlRight?: string; // URL do modelo do pé direito
  productName: string;
  productId: string;
  productPrice: number;
  productSlug: string;
  productImage: string;
  productBrand: string;
  sizes?: string[];
  colors?: string[];
}