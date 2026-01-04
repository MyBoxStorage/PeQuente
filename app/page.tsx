import Link from 'next/link';
import Image from 'next/image';
import HeroBanner from "@/components/Hero/HeroBanner";
import ProductSlider from "@/components/Products/ProductSlider";
import MarcasPremium from "@/components/sections/MarcasPremium";
import Promocoes from "@/components/sections/Promocoes";
import Depoimentos from "@/components/sections/Depoimentos";
import PorQueComprar from "@/components/sections/PorQueComprar";
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
            >
              <span>Ver todos</span>
              <span>→</span>
            </Link>
          </div>
          <ProductSlider products={newLaunchProducts} />
        </div>
      </section>

      {/* Seção de Categorias */}
      <section className="py-12 bg-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8">Categorias</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { name: "Tênis Masculino", slug: "tenis-masculino", image: "/images/categorias/tenis-masc.png" },
              { name: "Tênis Feminino", slug: "tenis-feminino", image: "/images/categorias/tenis-fem.png" },
              { name: "Chinelos", slug: "chinelos-e-sandalias", image: "/images/categorias/chinelos.png" },
              { name: "Acessórios", slug: "acessorios", image: "/images/categorias/acessorios.png" },
              { name: "Outlet", slug: "outlet", image: "/images/categorias/outlet.png" },
            ].map((category) => (
              <Link
                key={category.slug}
                href={`/produtos?categoria=${category.slug}`}
                className="group bg-[#252525] rounded-lg overflow-hidden hover:bg-[#2a2a2a] transition relative"
              >
                <div className="aspect-square relative">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
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
            >
              Ver Produtos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
