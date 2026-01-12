import type { Metadata } from 'next';
import HeroBanner from '@/components/Hero/HeroBanner';
import MarcasPremium from '@/components/sections/MarcasPremium';
import Promocoes from '@/components/sections/Promocoes';
import PorQueComprar from '@/components/sections/PorQueComprar';
import VisiteNossaLoja from '@/components/sections/VisiteNossaLoja';
import Depoimentos from '@/components/sections/Depoimentos';
import ProductSlider from '@/components/Products/ProductSlider';
import { getNewLaunchProducts } from '@/lib/api';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pé Quente Calçados | Tênis, Roupas e Acessórios em Paraíba do Sul',
  description: 'Loja de tênis, roupas e acessórios das melhores marcas. Retirada na loja em Paraíba do Sul, RJ. Parcelamento em até 12x sem juros. 5% OFF no PIX.',
  keywords: ['tênis', 'calçados', 'roupas', 'acessórios', 'Paraíba do Sul', 'Nike', 'Adidas', 'Mizuno', 'Asics'],
  openGraph: {
    title: 'Pé Quente Calçados | Tênis, Roupas e Acessórios',
    description: 'Loja de tênis, roupas e acessórios das melhores marcas. Retirada na loja em Paraíba do Sul, RJ.',
    url: 'https://www.pequentecalcados.com.br',
    siteName: 'Pé Quente Calçados',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pé Quente Calçados | Tênis, Roupas e Acessórios',
    description: 'Loja de tênis, roupas e acessórios das melhores marcas. Retirada na loja em Paraíba do Sul, RJ.',
  },
  alternates: {
    canonical: 'https://www.pequentecalcados.com.br',
  },
};

export default function HomePage() {
  const newLaunchProducts = getNewLaunchProducts();

  return (
    <div>
      {/* Hero Banner */}
      <HeroBanner />

      {/* Produtos em Destaque - Lançamentos */}
      <section className="py-12 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Lançamentos</h2>
            <Link
              href="/produtos"
              className="text-[#FF0000] hover:text-[#FF0000]/80 transition flex items-center space-x-2 font-medium"
              prefetch
              aria-label="Ver todos os lançamentos"
            >
              <span>Ver todos</span>
              <span aria-hidden="true" className="text-xl">→</span>
            </Link>
          </div>
          <ProductSlider products={newLaunchProducts} />
        </div>
      </section>


      {/* Marcas Premium */}
      <MarcasPremium />

      {/* Promoções */}
      <Promocoes />

      {/* Por Que Comprar Aqui */}
      <PorQueComprar />

      {/* Visite Nossa Loja */}
      <VisiteNossaLoja />

      {/* Depoimentos */}
      <Depoimentos />

      {/* Banner promocional - removido mensagem de frete */}
      <section className="py-12 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-[#00008B] to-[#252525] rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Retirada na Loja - Paraíba do Sul
            </h3>
            <p className="text-gray-300 mb-6">
              Compre no site e retire na loja • Ganhe 5% de desconto no PIX
            </p>
                <Link
                  href="/produtos"
                  className="inline-block bg-[#FF0000] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[#FF0000]/90 transition"
                  prefetch
                  aria-label="Ver todos os produtos"
                >
                  Ver Produtos
                </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
