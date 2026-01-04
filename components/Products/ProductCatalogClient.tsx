'use client';

import { useMemo, useState } from 'react';
import { Product, Category, Brand } from '@/types';
import { filterProducts, FilterOptions } from '@/lib/utils/filterProducts';
import ProductCard from './ProductCard';
import { X, Filter } from 'lucide-react';

interface ProductCatalogClientProps {
  initialProducts: Product[];
  categories: Category[];
  brands: Brand[];
  searchParams: {
    categoria?: string;
    marca?: string;
    genero?: string;
    precoMin?: string;
    precoMax?: string;
    ordenar?: string;
    busca?: string;
  };
}

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest';

export default function ProductCatalogClient({
  initialProducts,
  categories,
  brands,
  searchParams,
}: ProductCatalogClientProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    marca: searchParams.marca,
    categoria: searchParams.categoria,
    genero: searchParams.genero,
    precoMin: searchParams.precoMin ? Number(searchParams.precoMin) : undefined,
    precoMax: searchParams.precoMax ? Number(searchParams.precoMax) : undefined,
    search: searchParams.busca,
  });
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.ordenar as SortOption) || 'relevance'
  );
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = filterProducts(initialProducts, filters);

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        result.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        break;
    }

    return result;
  }, [initialProducts, filters, sortBy]);

  const clearFilters = () => {
    setFilters({
      marca: undefined,
      categoria: undefined,
      genero: undefined,
      precoMin: undefined,
      precoMax: undefined,
      search: undefined,
    });
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== undefined && value !== '');

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#252525] sticky top-24">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <Filter size={20} />
              Filtros
            </h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-[#FF0000] hover:text-[#FF0000]/80 text-sm transition flex items-center gap-1"
              >
                <X size={16} />
                Limpar
              </button>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Categoria</label>
              <select
                value={filters.categoria || ''}
                onChange={(e) => setFilters({ ...filters, categoria: e.target.value || undefined })}
                className="w-full px-4 py-2 bg-[#252525] text-white rounded-lg border border-[#353535] focus:outline-none focus:ring-2 focus:ring-[#FF0000]"
              >
                <option value="">Todas</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Marca</label>
              <select
                value={filters.marca || ''}
                onChange={(e) => setFilters({ ...filters, marca: e.target.value || undefined })}
                className="w-full px-4 py-2 bg-[#252525] text-white rounded-lg border border-[#353535] focus:outline-none focus:ring-2 focus:ring-[#FF0000]"
              >
                <option value="">Todas</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.name.toLowerCase()}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Gênero</label>
              <select
                value={filters.genero || ''}
                onChange={(e) => setFilters({ ...filters, genero: e.target.value || undefined })}
                className="w-full px-4 py-2 bg-[#252525] text-white rounded-lg border border-[#353535] focus:outline-none focus:ring-2 focus:ring-[#FF0000]"
              >
                <option value="">Todos</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Unissex">Unissex</option>
                <option value="Infantil">Infantil</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Preço</label>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Mínimo"
                  value={filters.precoMin || ''}
                  onChange={(e) => 
                    setFilters({ 
                      ...filters, 
                      precoMin: e.target.value ? Number(e.target.value) : undefined 
                    })
                  }
                  className="w-full px-4 py-2 bg-[#252525] text-white rounded-lg border border-[#353535] focus:outline-none focus:ring-2 focus:ring-[#FF0000]"
                />
                <input
                  type="number"
                  placeholder="Máximo"
                  value={filters.precoMax || ''}
                  onChange={(e) => 
                    setFilters({ 
                      ...filters, 
                      precoMax: e.target.value ? Number(e.target.value) : undefined 
                    })
                  }
                  className="w-full px-4 py-2 bg-[#252525] text-white rounded-lg border border-[#353535] focus:outline-none focus:ring-2 focus:ring-[#FF0000]"
                />
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden bg-[#1a1a1a] text-white px-4 py-2 rounded-lg border border-[#252525] hover:bg-[#252525] transition flex items-center gap-2"
            >
              <Filter size={20} />
              Filtros
            </button>
            <p className="text-gray-400">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-gray-400 text-sm">
              Ordenar por:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg border border-[#252525] focus:outline-none focus:ring-2 focus:ring-[#FF0000]"
            >
              <option value="relevance">Relevância</option>
              <option value="price-asc">Preço: Menor para Maior</option>
              <option value="price-desc">Preço: Maior para Menor</option>
              <option value="name-asc">Nome: A-Z</option>
              <option value="name-desc">Nome: Z-A</option>
              <option value="newest">Mais Recentes</option>
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-[#1a1a1a] rounded-lg p-12 text-center border border-[#252525]">
            <p className="text-gray-400 text-lg mb-4">Nenhum produto encontrado</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-[#FF0000] hover:text-[#FF0000]/80 transition"
              >
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
