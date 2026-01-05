'use client';

import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { getStoreInfo } from '@/lib/api';

export default function CarrinhoPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotal = useCartStore((state) => state.getTotal);
  const storeInfo = getStoreInfo();

  const total = getTotal();
  const pixDiscount = total * 0.05;
  const totalWithPixDiscount = total - pixDiscount;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <ShoppingBag size={64} className="text-gray-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-4">Seu carrinho está vazio</h1>
            <p className="text-gray-400 mb-8">
              Adicione produtos ao carrinho para continuar comprando.
            </p>
            <Link
              href="/produtos"
              className="inline-block bg-[#FF0000] hover:bg-[#FF0000]/90 text-white font-bold px-8 py-3 rounded-lg transition"
            >
              Ver Produtos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Carrinho de Compras</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Lista de Itens */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#1a1a1a] rounded-lg p-6 border border-[#252525] flex gap-4"
                >
                  <div className="relative w-24 h-24 flex-shrink-0 bg-[#252525] rounded">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-white font-medium">{item.name}</h3>
                        <p className="text-gray-400 text-sm">{item.brand}</p>
                        {item.size && (
                          <p className="text-gray-500 text-sm">Tamanho: {item.size}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.size)}
                        className="text-gray-400 hover:text-[#FF0000] transition"
                        aria-label="Remover item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.size)}
                          className="w-8 h-8 flex items-center justify-center bg-[#252525] text-white rounded hover:bg-[#FF0000] transition"
                          aria-label="Diminuir quantidade"
                        >
                          -
                        </button>
                        <span className="text-white font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.size)}
                          className="w-8 h-8 flex items-center justify-center bg-[#252525] text-white rounded hover:bg-[#FF0000] transition"
                          aria-label="Aumentar quantidade"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-red-price font-bold text-lg">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="text-gray-400 hover:text-[#FF0000] transition text-sm"
              >
                Limpar carrinho
              </button>
            </div>

            {/* Resumo do Pedido */}
            <div className="lg:col-span-1">
              <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#252525] sticky top-24">
                <h2 className="text-xl font-bold text-white mb-6">Resumo do Pedido</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-green-400">
                    <span>Desconto PIX (5%):</span>
                    <span>-{formatPrice(pixDiscount)}</span>
                  </div>
                  <div className="border-t border-[#252525] pt-4 flex justify-between">
                    <span className="text-white font-bold text-lg">Total:</span>
                    <span className="text-red-price font-bold text-xl">
                      {formatPrice(totalWithPixDiscount)}
                    </span>
                  </div>
                </div>

                <div className="bg-[#00008B]/20 border border-[#00008B] rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-300">
                    <strong className="text-white">Produtos disponíveis para retirada na loja</strong>
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    {storeInfo.address}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {storeInfo.hours.weekdays} | {storeInfo.hours.saturday}
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    className="w-full bg-[#FF0000] hover:bg-[#FF0000]/90 text-white font-bold py-3 px-6 rounded-lg transition"
                  >
                    Finalizar Compra
                  </button>
                  <Link
                    href="/produtos"
                    className="block w-full text-center bg-[#252525] hover:bg-[#2a2a2a] text-white font-medium py-3 px-6 rounded-lg transition"
                  >
                    Continuar Comprando
                  </Link>
                </div>

                <div className="mt-6 pt-6 border-t border-[#252525]">
                  <h3 className="text-white font-medium mb-3">Formas de Pagamento</h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex justify-between">
                      <span>PIX:</span>
                      <span className="text-green-400">5% OFF</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cartão:</span>
                      <span>Até 10x sem juros</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Boleto:</span>
                      <span>À vista</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
