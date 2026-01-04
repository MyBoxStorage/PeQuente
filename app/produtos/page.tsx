'use client';

import { useMemo, useState, useEffect } from 'react';
import { Product, Category, Brand } from '@/types';
import { filterProducts, FilterOptions } from '@/lib/utils/filterProducts';
import ProductCard from '@/components/Products/ProductCard';
import { X, Filter } from 'lucide-react';
import { getAllProducts, getAllCategories, getAllBrands } from '@/lib/api';

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest';

export default function ProdutosPage() {
  const allProducts = getAllProducts();
  const categories = getAllCategories();
  const brands = getAllBrands();

  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Inicializar filtros a partir da URL apenas no client-side
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setFilters({
        marca: params.get('marca') || undefined,
        categoria: params.get('categoria') || undefined,
        genero: params.get('genero') || undefined,
        precoMin: params.get('precoMin') ? Number(params.get('precoMin')) : undefined,
        precoMax: params.get('precoMax') ? Number(params.get('precoMax')) : undefined,
        search: params.get('busca') || undefined,
      });
      const ordenar = params.get('ordenar');
      if (ordenar) {
        setSortBy(ordenar as SortOption);
      }
    }
  }, []);

  const filteredProducts = useMemo(() => {
    let result = filterProducts(allProducts, filters);

    // Aplicar ordenação
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
  }, [allProducts, filters, sortBy]);

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

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Produtos</h1>
            <p className="text-gray-400">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Produtos</h1>
          <p className="text-gray-400">
            Encontre os melhores calçados e acessórios para você
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de Filtros */}
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
                {/* Filtro por Categoria */}
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

                {/* Filtro por Marca */}
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

                {/* Filtro por Gênero */}
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

                {/* Filtro por Preço */}
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

          {/* Área principal */}
          <div className="flex-1">
            {/* Barra de ferramentas */}
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

            {/* Grid de produtos */}
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
      </div>
    </div>
  );
}
