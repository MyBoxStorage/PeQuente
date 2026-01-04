import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { formatPrice, formatInstallment } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/produtos/${product.slug}`}
      className="group bg-[#1a1a1a] rounded-lg overflow-hidden hover:bg-[#252525] transition-all duration-300 hover:shadow-xl hover:shadow-[#FF0000]/20 hover:-translate-y-1"
    >
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
        
        {/* Badge de promoção */}
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <div className="absolute top-2 right-2 bg-[#DC143C] text-white text-xs font-bold px-2 py-1 rounded">
            {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
          </div>
        )}

        {/* Badge de novo/se destacado */}
        {product.featured && (
          <div className="absolute top-2 left-2 bg-[#FFD700] text-[#0a0a0a] text-xs font-bold px-2 py-1 rounded">
            Novo
          </div>
        )}
      </div>

      {/* Informações do produto */}
      <div className="p-4">
        <p className="text-gray-400 text-sm mb-1">{product.brand}</p>
        <h3 className="text-white font-medium mb-2 line-clamp-2 group-hover:text-[#FFD700] transition min-h-[3rem]">
          {product.name}
        </h3>
        <div className="flex items-baseline space-x-2">
          <span className="text-[#FFD700] font-bold text-lg">
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
  );
}
