'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, formatInstallment } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group bg-[#2d2d2d] rounded-lg overflow-hidden transition-all duration-250 hover:bg-[#252525] hover:shadow-xl hover:shadow-[#FF0000]/30 hover:-translate-y-1 border border-transparent hover:border-[#FF0000]/30 product-card-mobile touch-friendly"
      style={{ willChange: 'transform' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
    >
      <Link href={`/produtos/${product.slug}`} className="block">
        {/* Imagem do produto */}
        <div className="relative aspect-square bg-[#252525] overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              style={{ willChange: 'transform' }}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 346px"
              quality={85}
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+PC9zdmc+"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Sem imagem
            </div>
          )}
          
          {/* Badge de promoção */}
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <div className="absolute top-2 right-2 bg-[#DC143C] text-white text-xs font-bold px-2 py-1 rounded z-10">
              {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
            </div>
          )}

          {/* Badge de novo/se destacado - CSS puro (otimizado) */}
          {product.featured && (
            <div className="absolute top-2 left-2 bg-[#FFD700] text-[#0a0a0a] text-xs font-bold px-2 py-1 rounded z-10 animate-pulse">
              Novo
            </div>
          )}

          {/* Botão Adicionar - CSS puro (otimizado) */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={(e) => {
              e.preventDefault();
              // Adicionar ao carrinho será implementado posteriormente
            }}
          >
            <button
              className="w-full bg-[#FF0000] hover:bg-[#ff3333] text-white font-bold py-2 px-4 rounded-lg transition-colors duration-250 flex items-center justify-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <ShoppingBag size={18} />
              Adicionar
            </button>
          </div>
        </div>

        {/* Informações do produto */}
        <div className="p-4 relative">
          <p className="text-gray-300 text-sm mb-1">{product.brand}</p>
          <h3 className="text-white font-medium mb-2 line-clamp-2 group-hover:text-[#FF0000] transition-colors duration-250 min-h-[3rem]">
            {product.name}
          </h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-red-price font-bold text-lg">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-gray-400 text-sm line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          <p className="text-gray-300 text-xs mt-1">
            {formatInstallment(product.price)}
          </p>
        </div>
      </Link>
    </div>
  );
}
