'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotal = useCartStore((state) => state.getTotal);
  const clearCart = useCartStore((state) => state.clearCart);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRemoveItem = (item: typeof items[0]) => {
    removeItem(item.productId, item.size);
    toast({
      title: 'Removido do carrinho',
      description: `${item.name} foi removido do carrinho`,
      variant: 'default',
    });
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const total = getTotal();

  const cartContent = (
    <>
      {/* Overlay com backdrop blur */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] transition-opacity duration-250"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Cart Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md sm:max-w-md bg-[#0a0a0a] z-[999999] shadow-2xl flex flex-col animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#252525]">
          <h2 className="text-white font-bold text-xl flex items-center gap-2">
            <ShoppingBag size={24} />
            Carrinho
          </h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white transition p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Fechar carrinho"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="bg-[#2d2d2d] rounded-full p-8 mb-6 border border-[#353535]">
                <ShoppingBag size={64} className="text-gray-400" />
              </div>
              <h3 className="text-white font-bold text-xl mb-2">Seu carrinho está vazio</h3>
              <p className="text-gray-400 mb-6">Adicione produtos para começar sua compra</p>
              <Link
                href="/produtos"
                onClick={onClose}
                className="inline-block bg-[#FF0000] hover:bg-[#ff3333] text-white font-bold px-6 py-3 rounded-lg transition-colors duration-250"
              >
                Ver Produtos
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-[#2d2d2d] rounded-lg border border-[#353535] hover:border-[#252525] transition-all duration-250"
                >
                  <div className="relative w-20 h-20 flex-shrink-0 bg-[#252525] rounded">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-sm line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-gray-300 text-xs">{item.brand}</p>
                    {item.size && (
                      <p className="text-gray-400 text-xs">Tamanho: {item.size}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-red-price font-bold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.size)}
                          className="w-10 h-10 min-w-[44px] min-h-[44px] flex items-center justify-center bg-[#252525] text-white rounded hover:bg-[#FF0000] transition"
                          aria-label="Diminuir quantidade"
                        >
                          -
                        </button>
                        <span className="text-white text-sm w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.size)}
                          className="w-10 h-10 min-w-[44px] min-h-[44px] flex items-center justify-center bg-[#252525] text-white rounded hover:bg-[#FF0000] transition"
                          aria-label="Aumentar quantidade"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item)}
                    className="text-gray-300 hover:text-[#FF0000] transition-colors duration-250 self-start p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Remover item"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#252525] p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total:</span>
              <span className="text-white font-bold text-xl">
                {formatPrice(total)}
              </span>
            </div>
            <Link
              href="/carrinho"
              onClick={onClose}
              className="block w-full bg-[#FF0000] hover:bg-[#FF0000]/90 text-white font-bold py-3 px-4 rounded-lg transition text-center"
            >
              Ir para Carrinho
            </Link>
          </div>
        )}
      </div>
    </>
  );

  return createPortal(cartContent, document.body);
}
