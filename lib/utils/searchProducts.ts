import { Product } from '@/types';

export function searchProducts(products: Product[], query: string): Product[] {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const searchTerm = query.toLowerCase().trim();

  return products.filter((product) => {
    if (!product.active) return false;

    const matchesName = product.name.toLowerCase().includes(searchTerm);
    const matchesBrand = product.brand.toLowerCase().includes(searchTerm);
    const matchesDescription = product.description.toLowerCase().includes(searchTerm);
    const matchesTags = product.tags?.some(tag => tag.toLowerCase().includes(searchTerm));

    return matchesName || matchesBrand || matchesDescription || matchesTags;
  });
}
