import { Metadata } from 'next';
import Link from 'next/link';
import { User, ShoppingBag, Heart, MapPin, Phone, Mail } from 'lucide-react';
import { getStoreInfo } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Minha Conta',
  description: 'Acesse sua conta na Pé Quente Calçados',
};

export default function MinhaContaPage() {
  const storeInfo = getStoreInfo();

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Minha Conta</h1>

          <div className="bg-[#1a1a1a] rounded-lg p-8 border border-[#252525] mb-8">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-[#252525] rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="text-[#FF0000]" size={48} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Área do Cliente</h2>
              <p className="text-gray-400">
                Gerencie suas informações e pedidos
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Login/Registro */}
              <div className="bg-[#252525] rounded-lg p-6 border border-[#353535]">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <User size={20} />
                  Entrar / Cadastrar
                </h3>
                <p className="text-gray-400 mb-4 text-sm">
                  Faça login ou crie uma conta para acompanhar seus pedidos e ter acesso a ofertas exclusivas.
                </p>
                <button className="w-full bg-[#FF0000] hover:bg-[#FF0000]/90 text-white font-bold py-3 px-6 rounded-lg transition">
                  Entrar / Cadastrar
                </button>
                <p className="text-gray-500 text-xs mt-4 text-center">
                  * Funcionalidade em desenvolvimento
                </p>
              </div>

              {/* Pedidos */}
              <div className="bg-[#252525] rounded-lg p-6 border border-[#353535]">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <ShoppingBag size={20} />
                  Meus Pedidos
                </h3>
                <p className="text-gray-400 mb-4 text-sm">
                  Acompanhe o status dos seus pedidos e histórico de compras.
                </p>
                <Link
                  href="/carrinho"
                  className="block w-full bg-[#252525] hover:bg-[#353535] border border-[#353535] text-white font-medium py-3 px-6 rounded-lg transition text-center"
                >
                  Ver Carrinho
                </Link>
              </div>

              {/* Favoritos */}
              <div className="bg-[#252525] rounded-lg p-6 border border-[#353535]">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Heart size={20} />
                  Favoritos
                </h3>
                <p className="text-gray-400 mb-4 text-sm">
                  Produtos que você salvou para comprar depois.
                </p>
                <button className="w-full bg-[#252525] hover:bg-[#353535] border border-[#353535] text-white font-medium py-3 px-6 rounded-lg transition">
                  Ver Favoritos
                </button>
                <p className="text-gray-500 text-xs mt-4 text-center">
                  * Funcionalidade em desenvolvimento
                </p>
              </div>

              {/* Endereços */}
              <div className="bg-[#252525] rounded-lg p-6 border border-[#353535]">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <MapPin size={20} />
                  Retirada na Loja
                </h3>
                <p className="text-gray-400 mb-4 text-sm">
                  {storeInfo.address}
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  {storeInfo.hours.weekdays}<br />
                  {storeInfo.hours.saturday}
                </p>
                <Link
                  href="/sobre"
                  className="block w-full bg-[#252525] hover:bg-[#353535] border border-[#353535] text-white font-medium py-3 px-6 rounded-lg transition text-center"
                >
                  Ver Informações da Loja
                </Link>
              </div>
            </div>
          </div>

          {/* Informações de Contato */}
          <div className="bg-[#1a1a1a] rounded-lg p-8 border border-[#252525]">
            <h2 className="text-2xl font-bold text-white mb-6">Precisa de Ajuda?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <Phone className="text-[#FF0000] mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="text-white font-medium mb-1">Telefone</h3>
                  <a href={`tel:${storeInfo.phone}`} className="text-gray-400 hover:text-[#FF0000] transition">
                    {storeInfo.phone}
                  </a>
                </div>
              </div>
              {storeInfo.email && (
                <div className="flex items-start gap-4">
                  <Mail className="text-[#FF0000] mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="text-white font-medium mb-1">E-mail</h3>
                    <a href={`mailto:${storeInfo.email}`} className="text-gray-400 hover:text-[#FF0000] transition">
                      {storeInfo.email}
                    </a>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6">
              <Link
                href="/contato"
                className="inline-block text-[#FF0000] hover:text-[#FF0000]/80 transition"
              >
                Fale conosco →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
