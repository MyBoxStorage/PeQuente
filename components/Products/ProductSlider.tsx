'use client';

import { Product } from '@/types';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

interface ProductSliderProps {
  products: Product[];
}

export default function ProductSlider({ products }: ProductSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 300;
    const container = scrollContainerRef.current;
    
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        Nenhum produto disponível
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Botão esquerdo */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#1a1a1a] hover:bg-[#252525] text-white p-3 rounded-full shadow-lg transition border border-[#252525]"
        aria-label="Produtos anteriores"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Container com scroll horizontal */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-full sm:w-64 lg:w-72"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Botão direito */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#1a1a1a] hover:bg-[#252525] text-white p-3 rounded-full shadow-lg transition border border-[#252525]"
        aria-label="Próximos produtos"
      >
        <ChevronRight size={24} />
      </button>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
