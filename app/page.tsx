'use client';

import { useState, useEffect } from 'react';
import HeroBanner from "@/components/Hero/HeroBanner";
import ProductSlider from "@/components/Products/ProductSlider";
import CEPSearch from "@/components/CEP/CEPSearch";
import { getFeaturedProducts } from "@/lib/api";

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();
  const [showCEP, setShowCEP] = useState(false);

  useEffect(() => {
    // Mostra o modal de CEP apenas uma vez por sessão
    const hasSeenCEP = sessionStorage.getItem('hasSeenCEP');
    if (!hasSeenCEP) {
      setTimeout(() => setShowCEP(true), 2000);
    }
  }, []);

  return (
    <div>
      {/* Hero Banner */}
      <HeroBanner />

      {/* Produtos em Destaque */}
      <section className="py-12 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Lançamentos</h2>
            <a
              href="/produtos"
              className="text-[#FFD700] hover:text-[#FFD700]/80 transition flex items-center space-x-2"
            >
              <span>Ver todos</span>
              <span>→</span>
            </a>
          </div>
          <ProductSlider products={featuredProducts} />
        </div>
      </section>

      {/* Seção de Categorias */}
      <section className="py-12 bg-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8">Categorias</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { name: "Tênis Masculino", slug: "tenis-masculino", image: "/images/categorias/tenis-masc.jpg" },
              { name: "Tênis Feminino", slug: "tenis-feminino", image: "/images/categorias/tenis-fem.jpg" },
              { name: "Chinelos", slug: "chinelos-e-sandalias", image: "/images/categorias/chinelos.jpg" },
              { name: "Acessórios", slug: "acessorios", image: "/images/categorias/acessorios.jpg" },
              { name: "Outlet", slug: "outlet", image: "/images/categorias/outlet.jpg" },
            ].map((category) => (
              <a
                key={category.slug}
                href={`/categorias/${category.slug}`}
                className="group bg-[#252525] rounded-lg overflow-hidden hover:bg-[#2a2a2a] transition"
              >
                <div className="aspect-square bg-gradient-to-br from-[#252525] to-[#1a1a1a] flex items-center justify-center">
                  <span className="text-white font-bold text-center px-4 group-hover:text-[#FFD700] transition">
                    {category.name}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Banner promocional */}
      <section className="py-12 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-[#1E3A8A] to-[#252525] rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Frete Grátis para Paraíba do Sul
            </h3>
            <p className="text-gray-300 mb-6">
              Compre no site e retire na loja • Ganhe 5% de desconto no PIX
            </p>
            <a
              href="/produtos"
              className="inline-block bg-[#FFD700] text-[#0a0a0a] font-bold px-8 py-3 rounded-lg hover:bg-[#FFD700]/90 transition"
            >
              Ver Produtos
            </a>
          </div>
        </div>
      </section>

      {/* Modal de busca por CEP */}
      {showCEP && (
        <CEPSearch
          onClose={() => {
            setShowCEP(false);
            sessionStorage.setItem('hasSeenCEP', 'true');
          }}
        />
      )}
    </div>
  );
}
