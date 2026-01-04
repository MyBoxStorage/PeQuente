import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import HeroBanner from "@/components/Hero/HeroBanner";

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

import { getFeaturedProducts, getNewLaunchProducts } from "@/lib/api";

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();
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

      {/* Seção de Categorias */}
      <section className="py-12 bg-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8">Categorias</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {[
              { name: "Tênis Masculino", slug: "tenis-masculino", image: "/images/categorias/tenis-masc.png" },
              { name: "Tênis Feminino", slug: "tenis-feminino", image: "/images/categorias/tenis-fem.png" },
              { name: "Chinelos", slug: "chinelos-e-sandalias", image: "/images/categorias/chinelos.png" },
              { name: "Acessórios", slug: "acessorios", image: "/images/categorias/acessorios.png" },
              { name: "Outlet", slug: "outlet", image: "/images/categorias/outlet.png" },
            ].map((category, index) => (
              <Link
                key={category.slug}
                href={`/produtos?categoria=${category.slug}`}
                className="group bg-[#252525] rounded-lg overflow-hidden hover:bg-[#2a2a2a] transition relative"
                prefetch
              >
                <div className="aspect-square relative">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    priority={index < 2}
                    fetchPriority={index === 0 ? "high" : index === 1 ? "high" : "auto"}
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                    <span className="text-white font-bold text-center w-full px-4 pb-4 group-hover:text-[#FF0000] transition">
                      {category.name}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
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
