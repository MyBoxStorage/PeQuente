'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Filter, X } from 'lucide-react';
import { FilterOptions } from '@/lib/utils/filterProducts';
import { getAllCategories, getAllBrands } from '@/lib/api';

interface ProductFiltersSheetProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export default function ProductFiltersSheet({
  filters,
  onFiltersChange,
  onClearFilters,
  hasActiveFilters,
}: ProductFiltersSheetProps) {
  const categories = getAllCategories();
  const brands = getAllBrands();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="lg:hidden bg-[#1a1a1a] text-white px-4 py-2 rounded-lg border border-[#252525] hover:bg-[#252525] transition flex items-center gap-2">
          <Filter size={20} />
          Filtros
          {hasActiveFilters && (
            <span className="bg-[#FF0000] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              !
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-[#1a1a1a] border-[#252525] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Filter size={20} />
              Filtros
            </span>
            {hasActiveFilters && (
              <button
                onClick={() => {
                  onClearFilters();
                  setOpen(false);
                }}
                className="text-[#FF0000] hover:text-[#FF0000]/80 text-sm transition flex items-center gap-1"
              >
                <X size={16} />
                Limpar
              </button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Filtro por Categoria */}
          <div>
            <label className="block text-white font-medium mb-2">Categoria</label>
            <select
              value={filters.categoria || ''}
              onChange={(e) => onFiltersChange({ ...filters, categoria: e.target.value || undefined })}
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
              onChange={(e) => onFiltersChange({ ...filters, marca: e.target.value || undefined })}
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
              onChange={(e) => onFiltersChange({ ...filters, genero: e.target.value || undefined })}
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
                  onFiltersChange({ 
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
                  onFiltersChange({ 
                    ...filters, 
                    precoMax: e.target.value ? Number(e.target.value) : undefined 
                  })
                }
                className="w-full px-4 py-2 bg-[#252525] text-white rounded-lg border border-[#353535] focus:outline-none focus:ring-2 focus:ring-[#FF0000]"
              />
            </div>
          </div>

          {/* Botão aplicar */}
          <button
            onClick={() => setOpen(false)}
            className="w-full bg-[#FF0000] text-white font-bold py-3 rounded-lg hover:bg-[#FF0000]/90 transition mt-4"
          >
            Aplicar Filtros
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
