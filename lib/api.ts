import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';
import brandsData from '@/data/brands.json';
import storeInfoData from '@/data/store-info.json';
import storiesData from '@/data/stories.json';
import { Product, Category, Brand, StoreInfo, Story } from '@/types';

export function getAllProducts(): Product[] {
  return productsData as Product[];
}

export function getProductBySlug(slug: string): Product | undefined {
  return (productsData as Product[]).find(product => product.slug === slug);
}

export function getNewLaunchProducts(): Product[] {
  // Retorna os 8 primeiros produtos novos (IDs 31-59), priorizando os featured
  const newProducts = (productsData as Product[]).filter(
    product => {
      const productId = parseInt(product.id);
      return productId >= 31 && productId <= 59 && product.active;
    }
  );
  
  // Ordena: featured primeiro, depois por data de criação (mais recentes primeiro)
  const sorted = newProducts.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    const dateA = new Date(a.createdAt || '').getTime();
    const dateB = new Date(b.createdAt || '').getTime();
    return dateB - dateA;
  });
  
  return sorted.slice(0, 8);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  const category = (categoriesData as Category[]).find(cat => cat.slug === categorySlug);
  if (!category) return [];
  
  return (productsData as Product[]).filter(
    product => product.categoryId === category.id && product.active
  );
}

export function getProductsByBrand(brandSlug: string): Product[] {
  return (productsData as Product[]).filter(
    product => product.brand.toLowerCase() === brandSlug && product.active
  );
}

export function searchProducts(query: string): Product[] {
  const searchTerm = query.toLowerCase();
  return (productsData as Product[]).filter(
    product =>
      product.active &&
      (product.name.toLowerCase().includes(searchTerm) ||
       product.description.toLowerCase().includes(searchTerm) ||
       product.brand.toLowerCase().includes(searchTerm))
  );
}

export function getAllCategories(): Category[] {
  return categoriesData as Category[];
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return (categoriesData as Category[]).find(category => category.slug === slug);
}

export function getAllBrands(): Brand[] {
  return brandsData as Brand[];
}

export function getBrandBySlug(slug: string): Brand | undefined {
  return (brandsData as Brand[]).find(brand => brand.slug === slug);
}

export function getStoreInfo(): StoreInfo {
  return storeInfoData as StoreInfo;
}

/**
 * Lista de produtos que têm modelos 3D disponíveis para o provador virtual
 * Baseado nos arquivos .glb disponíveis em /public/models/
 */
const PRODUCTS_WITH_3D_MODELS: string[] = [
  'tenis-adidas-adizero-drive-rc-masculino',
  // Adicione mais slugs de produtos que têm modelos 3D aqui
];

/**
 * Retorna produtos que têm modelos 3D disponíveis para o provador virtual
 */
export function getProductsWith3DModels(): Product[] {
  return (productsData as Product[]).filter(
    product => product.active && PRODUCTS_WITH_3D_MODELS.includes(product.slug)
  );
}

/**
 * Retorna todos os stories destacados
 */
export function getAllStories(): Story[] {
  return storiesData.stories as Story[];
}

/**
 * Retorna um story pelo ID
 */
export function getStoryById(id: string): Story | undefined {
  return (storiesData.stories as Story[]).find(story => story.id === id);
}
