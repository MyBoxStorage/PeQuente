import { Metadata } from 'next';
import Link from 'next/link';
import { getProductsWith3DModels } from '@/lib/api';
import ProductCard from '@/components/Products/ProductCard';
import { Box, Smartphone, RotateCcw, ZoomIn } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Estante 3D - Visualize Tênis em 3D | Pé Quente Calçados',
  description: 'Veja nossos tênis em 3D! Gire, amplie e posicione no seu ambiente com realidade aumentada, igual na Amazon. Visualização interativa antes de comprar.',
  openGraph: {
    type: "website",
    url: "https://www.pequentecalcados.com.br/estante",
    siteName: "Pé Quente Calçados",
    title: "Estante 3D - Visualize Tênis em 3D | Pé Quente Calçados",
    description: "Veja nossos tênis em 3D! Gire, amplie e posicione no seu ambiente com realidade aumentada.",
    images: [
      {
        url: "https://www.pequentecalcados.com.br/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Estante 3D - Pé Quente Calçados",
      },
    ],
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Estante 3D - Visualize Tênis em 3D | Pé Quente Calçados",
    description: "Veja nossos tênis em 3D! Gire, amplie e posicione no seu ambiente com realidade aumentada.",
    images: ["https://www.pequentecalcados.com.br/images/logo.png"],
  },
};

export default function EstantePage() {
  const productsWith3D = getProductsWith3DModels();

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12">
      <div className="container mx-auto px-4">
        {/* Header da página */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Box className="text-[#FF0000] w-8 h-8" />
            <h1 className="text-4xl font-bold text-white">Estante 3D</h1>
          </div>
          <p className="text-gray-400 text-lg max-w-3xl">
            Visualize nossos tênis em 3D como se estivessem na sua estante! 
            Gire, amplie e posicione no seu ambiente real usando AR.
          </p>
          
          {/* Features badges */}
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="bg-[#1a1a1a] border border-[#252525] rounded-lg px-4 py-3 flex items-center gap-2">
              <RotateCcw className="text-[#FF0000] w-5 h-5" />
              <span className="text-white text-sm">Rotação 360°</span>
            </div>
            <div className="bg-[#1a1a1a] border border-[#252525] rounded-lg px-4 py-3 flex items-center gap-2">
              <ZoomIn className="text-[#FF0000] w-5 h-5" />
              <span className="text-white text-sm">Zoom detalhado</span>
            </div>
            <div className="bg-[#1a1a1a] border border-[#252525] rounded-lg px-4 py-3 flex items-center gap-2">
              <Smartphone className="text-[#FF0000] w-5 h-5" />
              <span className="text-white text-sm">AR no celular</span>
            </div>
          </div>
        </div>

        {/* Lista de produtos com modelos 3D */}
        {productsWith3D.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-gray-300">
                <span className="font-semibold text-white">{productsWith3D.length}</span> produto{productsWith3D.length > 1 ? 's' : ''} disponível{productsWith3D.length > 1 ? 'eis' : ''} em 3D
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
              Estamos trabalhando para adicionar mais produtos em 3D. 
              Em breve você poderá visualizar nossos tênis na sua estante virtual!
            </p>
            <Link
              href="/produtos"
              className="inline-block bg-[#FF0000] hover:bg-[#E00000] text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Ver Todos os Produtos
            </Link>
          </div>
        )}

        {/* Como funciona */}
        <div className="mt-12 bg-gradient-to-r from-[#1a1a1a] to-[#252525] rounded-lg p-8 border border-[#303030]">
          <h2 className="text-2xl font-bold text-white mb-6">Como usar a Estante 3D</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FF0000] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Escolha um produto</h3>
              <p className="text-gray-400 text-sm">
                Selecione um produto acima e clique em &quot;Ver em 3D&quot;
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FF0000] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Explore o modelo</h3>
              <p className="text-gray-400 text-sm">
                Arraste para girar 360°, faça pinça para zoom
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FF0000] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Veja na sua estante</h3>
              <p className="text-gray-400 text-sm">
                No celular, clique em &quot;Ver na sua Estante&quot; para AR!
              </p>
            </div>
          </div>
          
          {/* Compatibilidade */}
          <div className="mt-8 pt-6 border-t border-[#303030]">
            <h3 className="text-lg font-semibold text-white mb-4">Compatibilidade</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Android 8+ (ARCore)
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                iPhone 6s+ (Quick Look)
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                Desktop: visualização 3D (sem AR)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
