'use client';

import { Brand } from '@/types';

interface BrandFilterProps {
  brands: Brand[];
  selected: string;
  onSelect: (slug: string) => void;
}

export default function BrandFilter({ brands, selected, onSelect }: BrandFilterProps) {
  return (
    <div>
      <h3 className="text-white font-medium mb-3">Marcas</h3>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="brand"
            checked={selected === ''}
            onChange={() => onSelect('')}
            className="w-4 h-4 text-[#FFD700] bg-[#252525] border-[#252525] focus:ring-[#FFD700]"
          />
          <span className="text-gray-300">Todas</span>
        </label>
        {brands.map((brand) => (
          <label key={brand.id} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="brand"
              checked={selected === brand.slug}
              onChange={() => onSelect(brand.slug)}
              className="w-4 h-4 text-[#FFD700] bg-[#252525] border-[#252525] focus:ring-[#FFD700]"
            />
            <span className="text-gray-300">{brand.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
