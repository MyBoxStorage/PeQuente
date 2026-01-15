import { Metadata } from 'next';
import Link from 'next/link';
import { getProductsWith3DModels } from '@/lib/api';
import ProductCard from '@/components/Products/ProductCard';
import { Box } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Provador Virtual - Pé Quente Calçados',
  description: 'Experimente nossos produtos em realidade aumentada. Veja como ficam antes de comprar!',
  openGraph: {
    type: "website",
    url: "https://www.pequentecalcados.com.br/provador-virtual",
    siteName: "Pé Quente Calçados",
    title: "Provador Virtual - Pé Quente Calçados",
    description: "Experimente nossos produtos em realidade aumentada. Veja como ficam antes de comprar!",
    images: [
      {
        url: "https://www.pequentecalcados.com.br/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Provador Virtual - Pé Quente Calçados",
      },
    ],
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Provador Virtual - Pé Quente Calçados",
    description: "Experimente nossos produtos em realidade aumentada. Veja como ficam antes de comprar!",
    images: ["https://www.pequentecalcados.com.br/images/logo.png"],
  },
};

export default function ProvadorVirtualPage() {
  const productsWith3D = getProductsWith3DModels();

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12">
      <div className="container mx-auto px-4">
        {/* Header da página */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Box className="text-[#FF0000] w-8 h-8" />
            <h1 className="text-4xl font-bold text-white">Provador Virtual</h1>
          </div>
          <p className="text-gray-400 text-lg max-w-3xl">
            Experimente nossos produtos em realidade aumentada! Visualize como ficam antes de comprar. 
            Use a câmera do seu dispositivo para ver os produtos em 3D.
          </p>
        </div>

        {/* Lista de produtos com modelos 3D */}
        {productsWith3D.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-gray-300">
                <span className="font-semibold text-white">{productsWith3D.length}</span> produto{productsWith3D.length > 1 ? 's' : ''} disponível{productsWith3D.length > 1 ? 'eis' : ''} para provar virtualmente
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productsWith3D.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-[#1a1a1a] border border-[#252525] rounded-lg p-12 text-center">
            <Box className="text-gray-500 w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Nenhum produto disponível no momento
            </h2>
            <p className="text-gray-400 mb-6">
              Estamos trabalhando para adicionar mais produtos ao provador virtual. 
              Em breve você poderá experimentar nossos produtos em realidade aumentada!
            </p>
            <Link
              href="/produtos"
              className="inline-block bg-[#FF0000] hover:bg-[#E00000] text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Ver Todos os Produtos
            </Link>
          </div>
        )}

        {/* Informações sobre o provador virtual */}
        <div className="mt-12 bg-gradient-to-r from-[#00008B] to-[#252525] rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Como usar o Provador Virtual</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl font-bold text-white mb-2">1</div>
              <h3 className="text-lg font-semibold text-white mb-2">Escolha um produto</h3>
              <p className="text-gray-300 text-sm">
                Selecione um dos produtos disponíveis para o provador virtual
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl font-bold text-white mb-2">2</div>
              <h3 className="text-lg font-semibold text-white mb-2">Acesse o provador</h3>
              <p className="text-gray-300 text-sm">
                Clique no botão "Provar AR" na página do produto
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl font-bold text-white mb-2">3</div>
              <h3 className="text-lg font-semibold text-white mb-2">Visualize em 3D</h3>
              <p className="text-gray-300 text-sm">
                Permita acesso à câmera e visualize o produto em realidade aumentada
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
