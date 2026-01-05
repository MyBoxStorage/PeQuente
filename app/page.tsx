import { Metadata } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import HeroBanner from "@/components/Hero/HeroBanner";
import CategoryCard from "@/components/sections/CategoryCard";
import { getStoreInfo } from "@/lib/api";

export const metadata: Metadata = {
  title: 'Pé Quente Calçados - Sua Loja de Tênis, Roupas e Acessórios em Paraíba do Sul, RJ',
  description: 'Pé Quente Calçados - Sua loja de tênis, roupas e acessórios em Paraíba do Sul, RJ. Os melhores produtos das principais marcas: Nike, Adidas, Mizuno, Puma, Fila, Olympikus, Asics e mais. Retirada na loja com 5% de desconto no PIX.',
  keywords: ['tênis', 'calçados', 'Nike', 'Adidas', 'Mizuno', 'Puma', 'Fila', 'Olympikus', 'Asics', 'Paraíba do Sul', 'RJ', 'loja de tênis', 'calçados esportivos'],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.pequentecalcados.com.br",
    siteName: "Pé Quente Calçados",
    title: "Pé Quente Calçados - Sua Loja de Tênis, Roupas e Acessórios em Paraíba do Sul, RJ",
    description: "Os melhores produtos das principais marcas em Paraíba do Sul, RJ. Retirada na loja com 5% de desconto no PIX.",
    images: [
      {
        url: "https://www.pequentecalcados.com.br/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Pé Quente Calçados - Loja de Tênis e Acessórios em Paraíba do Sul, RJ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pé Quente Calçados - Sua Loja de Tênis em Paraíba do Sul, RJ",
    description: "Os melhores produtos das principais marcas. Retirada na loja com 5% de desconto no PIX.",
    images: ["https://www.pequentecalcados.com.br/images/logo.png"],
  },
  alternates: {
    canonical: "https://www.pequentecalcados.com.br",
  },
};

// Lazy load do ProductSlider (componente acima do fold mas pode ser otimizado)
const ProductSlider = dynamic(() => import("@/components/Products/ProductSlider"), {
  loading: () => <div className="py-12 bg-[#0a0a0a]" />,
});

// Lazy load de componentes abaixo do fold para melhorar LCP
const MarcasPremium = dynamic(() => import("@/components/sections/MarcasPremium"), {
  loading: () => <div className="py-16 bg-[#0a0a0a]" />,
});

const Promocoes = dynamic(() => import("@/components/sections/Promocoes"), {
  loading: () => <div className="py-16 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]" />,
});

const Depoimentos = dynamic(() => import("@/components/sections/Depoimentos"), {
  loading: () => <div className="py-16 bg-[#1a1a1a]" />,
});

const PorQueComprar = dynamic(() => import("@/components/sections/PorQueComprar"), {
  loading: () => <div className="py-16 bg-[#1a1a1a]" />,
});

const VisiteNossaLoja = dynamic(() => import("@/components/sections/VisiteNossaLoja"), {
  loading: () => <div className="py-16 bg-[#0a0a0a]" />,
});

import { getNewLaunchProducts, getAllCategories } from "@/lib/api";

export default function HomePage() {
  const newLaunchProducts = getNewLaunchProducts();
  const categories = getAllCategories();

  // Mapear categorias com imagens
  const categoryImages: Record<string, string> = {
    'tenis-masculino': '/images/categorias/tenis-masc.png',
    'tenis-feminino': '/images/categorias/tenis-fem.png',
    'chinelos-e-sandalias': '/images/categorias/chinelos.png',
    'acessorios': '/images/categorias/acessorios.png',
    'outlet': '/images/categorias/outlet.png',
  };

  // Categorias populares (filtrar apenas as que têm imagem)
  const popularCategories = categories.filter(cat => categoryImages[cat.slug]);

  return (
    <div>
      {/* Hero Banner */}
      <HeroBanner />

      {/* Seção de Categorias Populares */}
      <section className="py-16 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Categorias Populares
            </h2>
            <p className="text-gray-400 text-lg">
              Explore nossas principais categorias
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 justify-items-center">
            {popularCategories.map((category, index) => (
              <CategoryCard
                key={category.id}
                name={category.name}
                slug={category.slug}
                image={categoryImages[category.slug]}
                priority={index < 2}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Produtos em Destaque - Lançamentos */}
      <section className="py-12 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Lançamentos</h2>
            <Link
              href="/produtos"
              className="text-[#FF0000] hover:text-[#FF0000]/80 transition flex items-center space-x-2"
              prefetch
              aria-label="Ver todos os lançamentos"
            >
              <span>Ver todos</span>
              <span aria-hidden="true">→</span>
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
                  className="inline-block bg-[#FF0000] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#FF0000]/90 transition"
                  prefetch
                >
                  Ver Produtos
                </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
