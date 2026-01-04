'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { formatPrice, formatInstallment } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingBag, Heart, MapPin } from 'lucide-react';
import Link from 'next/link';
import RetireHoje from './RetireHoje';

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();

  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!product.images || product.images.length === 0) return;

    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images[0],
        brand: product.brand,
        size: selectedSize,
      });
    }

    // Toast notification
    toast({
      title: 'Adicionado ao carrinho!',
      description: `Venha retirar na loja • ${quantity} ${quantity > 1 ? 'itens' : 'item'}`,
      variant: 'success',
    });
  };

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-8 border border-[#252525]">
      {/* Badges */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {product.stock > 0 && (
          <span className="bg-green-600 text-white text-sm font-bold px-3 py-1 rounded flex items-center gap-1">
            <MapPin size={14} />
            Disponível para Retirada Imediata
          </span>
        )}
        {discount > 0 && (
          <span className="bg-[#FF0000] text-white text-sm font-bold px-3 py-1 rounded">
            {discount}% OFF
          </span>
        )}
        {product.featured && (
          <span className="bg-[#FFD700] text-[#0a0a0a] text-sm font-bold px-3 py-1 rounded">
            Novo
          </span>
        )}
      </div>

      {/* Marca */}
      <p className="text-[#FF0000] font-medium mb-2">{product.brand}</p>

      {/* Nome */}
      <h1 className="text-3xl font-bold text-white mb-4">{product.name}</h1>

      {/* Preço */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-3xl font-bold text-white">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-lg text-gray-500 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
        <p className="text-gray-400">
          {formatInstallment(product.price)} ou {formatPrice(product.price * 0.95)} no PIX (5% OFF)
        </p>
      </div>

      {/* Descrição */}
      {product.description && (
        <div className="mb-6">
          <p className="text-gray-300 leading-relaxed">{product.description}</p>
        </div>
      )}

      {/* Seleção de Tamanho */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="mb-6">
          <label className="block text-white font-medium mb-3">
            Tamanho: <span className="text-gray-400">{selectedSize}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-lg border-2 transition ${
                  selectedSize === size
                    ? 'border-[#FF0000] bg-[#FF0000]/10 text-white'
                    : 'border-[#252525] text-gray-300 hover:border-[#353535]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantidade */}
      <div className="mb-6">
        <label className="block text-white font-medium mb-3">Quantidade</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center bg-[#252525] text-white rounded hover:bg-[#FF0000] transition"
            aria-label="Diminuir quantidade"
          >
            -
          </button>
          <span className="text-white font-medium text-lg w-12 text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 flex items-center justify-center bg-[#252525] text-white rounded hover:bg-[#FF0000] transition"
            aria-label="Aumentar quantidade"
          >
            +
          </button>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="space-y-3 mb-6">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full bg-[#FF0000] hover:bg-[#FF0000]/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-center gap-2"
        >
          <ShoppingBag size={20} />
          {product.stock > 0 ? 'Adicionar ao Carrinho' : 'Indisponível'}
        </button>
        <Link
          href="/carrinho"
          className="block w-full text-center bg-[#252525] hover:bg-[#2a2a2a] text-white font-medium py-4 px-6 rounded-lg transition"
        >
          Ver Carrinho
        </Link>
      </div>

      {/* Informações adicionais */}
      <div className="border-t border-[#252525] pt-6 space-y-3 text-sm text-gray-400">
        <div className="flex justify-between">
          <span>Estoque:</span>
          <span className={product.stock > 0 ? 'text-green-400' : 'text-red-400'}>
            {product.stock > 0 ? `${product.stock} disponíveis` : 'Indisponível'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Retirada na loja:</span>
          <span className="text-white">Disponível</span>
        </div>
        <div className="flex justify-between">
          <span>Pagamento:</span>
          <span className="text-white">PIX (5% OFF), Cartão, Boleto</span>
        </div>
      </div>

      {/* Seção Retire Hoje */}
      {product.stock > 0 && <RetireHoje />}
    </div>
  );
}
