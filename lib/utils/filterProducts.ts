import { Product } from '@/types';
import { getAllCategories } from '@/lib/api';

export interface FilterOptions {
  marca?: string;
  categoria?: string;
  genero?: string;
  precoMin?: number;
  precoMax?: number;
  search?: string;
}

export function filterProducts(products: Product[], filters: FilterOptions): Product[] {
  const categories = getAllCategories();
  
  return products.filter((product) => {
    // Filtro por marca
    if (filters.marca && product.brand.toLowerCase() !== filters.marca.toLowerCase()) {
      return false;
    }

    // Filtro por categoria - verificar por slug
    if (filters.categoria) {
      const category = categories.find(cat => cat.slug === filters.categoria);
      if (category) {
        // Comparar por categoryId
        if (product.categoryId !== category.id) {
          return false;
        }
      } else {
        // Fallback: comparar diretamente
        const categoryMatch = product.categoryId === filters.categoria ||
          (product.category && product.category.includes(filters.categoria));
        if (!categoryMatch) {
          return false;
        }
      }
    }

    // Filtro por gênero (se disponível nos specs)
    if (filters.genero && product.specs?.gender) {
      if (product.specs.gender !== filters.genero) {
        return false;
      }
    }

    // Filtro por preço
    if (filters.precoMin !== undefined && product.price < filters.precoMin) {
      return false;
    }
    if (filters.precoMax !== undefined && product.price > filters.precoMax) {
      return false;
    }

    // Filtro por busca (search)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesName = product.name.toLowerCase().includes(searchTerm);
      const matchesBrand = product.brand.toLowerCase().includes(searchTerm);
      const matchesDescription = product.description.toLowerCase().includes(searchTerm);
      
      if (!matchesName && !matchesBrand && !matchesDescription) {
        return false;
      }
    }

    // Apenas produtos ativos
    if (!product.active) {
      return false;
    }

    return true;
  });
}
