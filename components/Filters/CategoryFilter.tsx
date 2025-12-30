'use client';

import { Category } from '@/types';

interface CategoryFilterProps {
  categories: Category[];
  selected: string;
  onSelect: (slug: string) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div>
      <h3 className="text-white font-medium mb-3">Categorias</h3>
      <div className="space-y-2">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="category"
            checked={selected === ''}
            onChange={() => onSelect('')}
            className="w-4 h-4 text-[#FFD700] bg-[#252525] border-[#252525] focus:ring-[#FFD700]"
          />
          <span className="text-gray-300">Todas</span>
        </label>
        {categories.map((category) => (
          <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={selected === category.slug}
              onChange={() => onSelect(category.slug)}
              className="w-4 h-4 text-[#FFD700] bg-[#252525] border-[#252525] focus:ring-[#FFD700]"
            />
            <span className="text-gray-300">{category.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
