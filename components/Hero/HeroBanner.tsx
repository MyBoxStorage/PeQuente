'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const banners = [
  {
    id: 1,
    title: 'Nova Coleção 2025',
    subtitle: 'Os melhores tênis das principais marcas',
    cta: 'Ver Coleção',
    link: '/produtos',
    gradient: 'from-[#1E3A8A] to-[#252525]',
  },
  {
    id: 2,
    title: 'Frete Grátis',
    subtitle: 'Para toda Paraíba do Sul',
    cta: 'Comprar Agora',
    link: '/produtos',
    gradient: 'from-[#DC143C] to-[#252525]',
  },
  {
    id: 3,
    title: '5% OFF no PIX',
    subtitle: 'Ganhe desconto pagando com PIX',
    cta: 'Ver Produtos',
    link: '/produtos',
    gradient: 'from-[#FFD700] to-[#1E3A8A]',
  },
];

export default function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden bg-[#0a0a0a]">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className={`h-full bg-gradient-to-r ${banner.gradient} flex items-center justify-center`}>
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {banner.title}
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8">
                {banner.subtitle}
              </p>
              <Link
                href={banner.link}
                className="inline-block bg-[#FFD700] text-[#0a0a0a] font-bold px-8 py-4 rounded-lg hover:bg-[#FFD700]/90 transition text-lg"
              >
                {banner.cta}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Botões de navegação */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition z-10"
        aria-label="Slide anterior"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition z-10"
        aria-label="Próximo slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition ${
              index === currentIndex ? 'bg-[#FFD700]' : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
