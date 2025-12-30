'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductSliderProps {
  products: Product[];
}

export default function ProductSlider({ products }: ProductSliderProps) {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerView = 4; // Desktop
  const maxIndex = Math.max(0, products.length - itemsPerView);

  const goToPrevious = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setStartIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        Nenhum produto encontrado.
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Container do slider */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${startIndex * (100 / itemsPerView)}%)`,
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 px-2"
              style={{ width: `${100 / itemsPerView}%` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Botões de navegação */}
      {products.length > itemsPerView && (
        <>
          <button
            onClick={goToPrevious}
            disabled={startIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-[#1a1a1a] hover:bg-[#252525] text-white p-2 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed z-10 hidden lg:block"
            aria-label="Produtos anteriores"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            disabled={startIndex >= maxIndex}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-[#1a1a1a] hover:bg-[#252525] text-white p-2 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed z-10 hidden lg:block"
            aria-label="Próximos produtos"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Versão mobile/tablet - grid simples */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:hidden gap-4 mt-4">
        {products.slice(0, 6).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
