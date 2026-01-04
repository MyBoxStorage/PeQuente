'use client';

import { X } from 'lucide-react';
import { FilterOptions } from '@/lib/utils/filterProducts';
import { getAllCategories, getAllBrands } from '@/lib/api';

interface FilterChipsProps {
  filters: FilterOptions;
  onRemoveFilter: (key: keyof FilterOptions) => void;
  onClearAll: () => void;
}

export default function FilterChips({
  filters,
  onRemoveFilter,
  onClearAll,
}: FilterChipsProps) {
  const categories = getAllCategories();
  const brands = getAllBrands();

  const activeFilters: Array<{ key: keyof FilterOptions; label: string }> = [];

  // Categoria
  if (filters.categoria) {
    const category = categories.find((cat) => cat.slug === filters.categoria);
    if (category) {
      activeFilters.push({
        key: 'categoria',
        label: category.name,
      });
    }
  }

  // Marca
  if (filters.marca) {
    const brand = brands.find((b) => b.slug === filters.marca);
    if (brand) {
      activeFilters.push({
        key: 'marca',
        label: brand.name,
      });
    }
  }

  // Gênero
  if (filters.genero) {
    const genderLabels: Record<string, string> = {
      masculino: 'Masculino',
      feminino: 'Feminino',
      unissex: 'Unissex',
    };
    activeFilters.push({
      key: 'genero',
      label: genderLabels[filters.genero] || filters.genero,
    });
  }

  // Preço mínimo
  if (filters.precoMin) {
    activeFilters.push({
      key: 'precoMin',
      label: `A partir de R$ ${filters.precoMin.toFixed(0)}`,
    });
  }

  // Preço máximo
  if (filters.precoMax) {
    activeFilters.push({
      key: 'precoMax',
      label: `Até R$ ${filters.precoMax.toFixed(0)}`,
    });
  }

  // Busca
  if (filters.search) {
    activeFilters.push({
      key: 'search',
      label: `"${filters.search}"`,
    });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-gray-400 text-sm mr-2">Filtros ativos:</span>
      {activeFilters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onRemoveFilter(filter.key)}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#2d2d2d] border border-[#353535] text-white text-sm rounded-lg hover:bg-[#252525] hover:border-[#FF0000] transition-all duration-250 group"
        >
          <span>{filter.label}</span>
          <X
            size={14}
            className="text-gray-400 group-hover:text-[#FF0000] transition-colors duration-250"
          />
        </button>
      ))}
      {activeFilters.length > 1 && (
        <button
          onClick={onClearAll}
          className="inline-flex items-center px-3 py-1.5 bg-transparent border border-[#353535] text-gray-400 text-sm rounded-lg hover:bg-[#252525] hover:text-[#FF0000] hover:border-[#FF0000] transition-all duration-250"
        >
          Limpar todos
        </button>
      )}
    </div>
  );
}
