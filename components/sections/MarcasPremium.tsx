'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllBrands } from '@/lib/api';

export default function MarcasPremium() {
  const brands = getAllBrands();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Marcas Premium
          </h2>
          <p className="text-gray-300 text-lg">
            As melhores marcas do mercado em um só lugar
          </p>
        </motion.div>

        <div
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Botão Anterior */}
          <AnimatePresence>
            {canScrollLeft && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isHovered ? 1 : 0.7, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scroll('left')}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-black text-white p-3 rounded-full transition-all duration-300 backdrop-blur-md shadow-lg border border-white/10"
                aria-label="Marcas anteriores"
              >
                <ChevronLeft size={24} className="stroke-[2.5]" />
              </motion.button>
            )}
          </AnimatePresence>

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
              
              return (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex-shrink-0"
                >
                  <Link
                    href={`/produtos?marca=${brand.name.toLowerCase()}`}
                    className="group block"
                    prefetch
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      className={`${bgColor} ${hoverBgColor} rounded-xl p-8 ${borderColor} ${hoverBorderColor} transition-all duration-300 w-48 h-48 flex items-center justify-center shadow-lg hover:shadow-2xl`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Image
                          src={`/images/brands/${brand.slug}.png`}
                          alt={brand.name}
                          width={128}
                          height={128}
                          className="object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300 max-w-[128px] max-h-[128px] brightness-0 invert drop-shadow-lg"
                          quality={90}
                          loading="lazy"
                        />
                      </motion.div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Botão Próximo */}
          <AnimatePresence>
            {canScrollRight && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: isHovered ? 1 : 0.7, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scroll('right')}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-black text-white p-3 rounded-full transition-all duration-300 backdrop-blur-md shadow-lg border border-white/10"
                aria-label="Próximas marcas"
              >
                <ChevronRight size={24} className="stroke-[2.5]" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Indicadores de posição (dots) */}
        {brands.length > 6 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex justify-center gap-2 mt-8"
          >
            {Array.from({ length: Math.min(Math.ceil(brands.length / 6), 5) }).map((_, index) => {
              const isActive = Math.floor(currentIndex / 6) === index;
              return (
                <motion.button
                  key={index}
                  onClick={() => scrollToIndex(index * 6)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-[#FF0000] w-8'
                      : 'bg-gray-600 w-2 hover:bg-gray-500'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Ir para página ${index + 1}`}
                  animate={{
                    width: isActive ? 32 : 8,
                    opacity: isActive ? 1 : 0.6,
                  }}
                />
              );
            })}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <Link
            href="/produtos"
            className="inline-block text-[#FF0000] hover:text-[#FF0000]/80 transition-all duration-300 flex items-center gap-2 mx-auto group"
            prefetch
          >
            <span>Ver todas as marcas</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              aria-hidden="true"
            >
              →
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
