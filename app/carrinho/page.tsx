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

  // Função para gerar mensagem do WhatsApp
  const generateWhatsAppMessage = () => {
    const phoneNumber = storeInfo.phone?.replace(/\D/g, '') || '';
    const message = `Olá! Gostaria de finalizar meu pedido:\n\n${items.map(item => `• ${item.name}${item.size ? ` (Tamanho: ${item.size})` : ''} - ${item.quantity}x - ${formatPrice(item.price * item.quantity)}`).join('\n')}\n\nSubtotal: ${formatPrice(total)}\nDesconto PIX (5%): -${formatPrice(pixDiscount)}\nTotal: ${formatPrice(totalWithPixDiscount)}\n\nForma de pagamento: PIX (com desconto)\nRetirada na loja: ${storeInfo.address}`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  const handleCheckout = () => {
    window.open(generateWhatsAppMessage(), '_blank');
  };

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
                    onClick={handleCheckout}
                    className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    Finalizar via WhatsApp
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
