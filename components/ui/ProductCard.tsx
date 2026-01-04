'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { formatPrice, formatInstallment } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

export default function ProductCard({ product, showAddToCart = false }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.images && product.images.length > 0) {
      addItem({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images[0],
        brand: product.brand,
      });
    }
  };

  return (
    <div className="group bg-[#1a1a1a] rounded-lg overflow-hidden hover:bg-[#252525] transition-all duration-300 hover:shadow-lg">
      <Link href={`/produtos/${product.slug}`}>
        {/* Imagem do produto */}
        <div className="relative aspect-square bg-[#252525] overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Sem imagem
            </div>
          )}
          
          {/* Badge de promoção - Vermelho para % OFF */}
          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-[#FF0000] text-white text-xs font-bold px-2 py-1 rounded">
              {discount}% OFF
            </div>
          )}

          {/* Badge de novo - Amarelo apenas para "Novo" */}
          {product.featured && (
            <div className="absolute top-2 left-2 bg-[#FFD700] text-[#0a0a0a] text-xs font-bold px-2 py-1 rounded">
              Novo
            </div>
          )}
        </div>

        {/* Informações do produto */}
        <div className="p-4">
          <p className="text-gray-400 text-sm mb-1">{product.brand}</p>
          <h3 className="text-white font-medium mb-2 line-clamp-2 group-hover:text-[#FF0000] transition">
            {product.name}
          </h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-white font-bold text-lg">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-gray-500 text-sm line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          <p className="text-gray-400 text-xs mt-1">
            {formatInstallment(product.price)}
          </p>
        </div>
      </Link>

      {/* Botão adicionar ao carrinho */}
      {showAddToCart && (
        <div className="px-4 pb-4">
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#FF0000] hover:bg-[#FF0000]/90 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            <ShoppingBag size={18} />
            Adicionar ao Carrinho
          </button>
        </div>
      )}
    </div>
  );
}
