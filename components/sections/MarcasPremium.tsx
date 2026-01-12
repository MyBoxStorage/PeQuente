'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllBrands } from '@/lib/api';

export default function MarcasPremium() {
  // Ordenar marcas alfabeticamente por nome
  const brands = getAllBrands().sort((a, b) => 
    a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer para fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (headerRef.current) observer.observe(headerRef.current);
    if (footerRef.current) observer.observe(footerRef.current);

    return () => {
      if (headerRef.current) observer.unobserve(headerRef.current);
      if (footerRef.current) observer.unobserve(footerRef.current);
    };
  }, []);

  const checkScrollability = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < maxScroll - 10);
    
    // Calcular índice atual baseado no scroll
    const cardWidth = 192 + 32; // w-48 (192px) + gap-8 (32px)
    const newIndex = Math.round(scrollLeft / cardWidth);
    setCurrentIndex(Math.min(newIndex, brands.length - 1));
  }, [brands.length]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScrollability();
    container.addEventListener('scroll', checkScrollability);
    window.addEventListener('resize', checkScrollability);

    return () => {
      container.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [checkScrollability]);

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const cardWidth = 192 + 32; // w-48 + gap-8
    const scrollAmount = cardWidth * 2; // Scroll 2 cards por vez
    
    const currentScroll = container.scrollLeft;
    const targetScroll = direction === 'left' 
      ? Math.max(0, currentScroll - scrollAmount)
      : Math.min(container.scrollWidth - container.clientWidth, currentScroll + scrollAmount);
    
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const cardWidth = 192 + 32;
    const targetScroll = index * cardWidth;
    
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  }, []);

  return (
    <section className="py-16 bg-[#0a0a0a] relative overflow-hidden">
      {/* Efeito de gradiente nas bordas */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10" />
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <div
          ref={headerRef}
          className={`text-center mb-12 transition-opacity duration-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Marcas Premium
          </h2>
          <p className="text-gray-300 text-lg">
            As melhores marcas do mercado em um só lugar
          </p>
        </div>

        <div
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Botão Anterior */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-black text-white p-3 rounded-full transition-all duration-300 backdrop-blur-md shadow-lg border border-white/10 hover:scale-110 active:scale-95 ${
                isHovered ? 'opacity-100 translate-x-0' : 'opacity-70 -translate-x-5'
              }`}
              aria-label="Marcas anteriores"
            >
              <ChevronLeft size={24} className="stroke-[2.5]" />
            </button>
          )}

          {/* Container do carrossel */}
          <div
            ref={scrollContainerRef}
            className="flex gap-8 overflow-x-auto scroll-smooth pb-4 px-2 [&::-webkit-scrollbar]:hidden"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            onScroll={checkScrollability}
          >
            {brands.map((brand, index) => {
              const isRed = index % 2 === 0;
              const bgColor = isRed ? 'bg-[#FF0000]' : 'bg-[#00008B]';
              const hoverBgColor = isRed ? 'hover:bg-[#CC0000]' : 'hover:bg-[#000066]';
              const borderColor = isRed ? 'border-[#FF0000]' : 'border-[#00008B]';
              const hoverBorderColor = 'hover:border-white';
              // Se for vermelho, sombra azul; se for azul, sombra vermelha
              const hoverShadow = isRed ? 'hover:shadow-[0_20px_40px_rgba(0,0,139,0.65)]' : 'hover:shadow-[0_20px_40px_rgba(255,0,0,0.4)]';
              
              return (
                <div
                  key={brand.id}
                  className="flex-shrink-0 opacity-0 animate-fade-in-scale"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'forwards',
                  }}
                >
                  <Link
                    href={`/produtos?marca=${brand.name.toLowerCase()}`}
                    className="group block"
                    prefetch
                    aria-label={`Ver produtos da marca ${brand.name}`}
                  >
                    <div
                      className={`${bgColor} ${hoverBgColor} rounded-xl p-8 ${borderColor} ${hoverBorderColor} transition-all duration-300 w-48 h-48 flex items-center justify-center shadow-lg ${hoverShadow} hover:scale-105 hover:-translate-y-1 active:scale-100`}
                    >
                      <div className="transition-transform duration-300 group-hover:scale-110 w-32 h-32 flex items-center justify-center">
                        <Image
                          src={`/images/brands/${brand.slug}.png`}
                          alt={`Logo da marca ${brand.name}`}
                          width={128}
                          height={128}
                          className="object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300 brightness-0 invert drop-shadow-lg w-full h-full"
                          quality={90}
                          loading="lazy"
                          sizes="(max-width: 768px) 128px, 128px"
                        />
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Botão Próximo */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-black text-white p-3 rounded-full transition-all duration-300 backdrop-blur-md shadow-lg border border-white/10 hover:scale-110 active:scale-95 ${
                isHovered ? 'opacity-100 translate-x-0' : 'opacity-70 translate-x-5'
              }`}
              aria-label="Próximas marcas"
            >
              <ChevronRight size={24} className="stroke-[2.5]" />
            </button>
          )}
        </div>

        {/* Indicadores de posição (dots) */}
        {brands.length > 6 && (
          <div
            className={`flex justify-center gap-3 mt-8 transition-opacity duration-400 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
          >
            {Array.from({ length: Math.min(Math.ceil(brands.length / 6), 5) }).map((_, index) => {
              const isActive = Math.floor(currentIndex / 6) === index;
              return (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index * 6)}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 active:scale-95 p-3"
                  aria-label={`Ir para página ${index + 1}`}
                >
                  <span className={`h-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-[#FF0000] w-8 opacity-100'
                      : 'bg-gray-600 w-2 opacity-60 hover:opacity-80'
                  }`} />
                </button>
              );
            })}
          </div>
        )}

        <div
          ref={footerRef}
          className={`text-center mt-8 transition-opacity duration-500 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          <Link
            href="/produtos"
            className="inline-block text-[#FF0000] hover:text-[#FF0000]/80 transition-all duration-300 flex items-center gap-2 mx-auto group"
            prefetch
          >
            <span>Ver todas as marcas</span>
            <span className="inline-block animate-bounce-x" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>

    </section>
  );
}