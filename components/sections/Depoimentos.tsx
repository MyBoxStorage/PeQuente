'use client';

import { useState, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  text: string;
  product?: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Maria Silva',
    rating: 5,
    text: 'Excelente atendimento e produtos de qualidade! Comprei meus tênis favoritos e o processo foi muito simples. Recomendo!',
    product: 'Tênis Nike Air Max',
  },
  {
    id: '2',
    name: 'João Santos',
    rating: 5,
    text: 'A loja tem uma ótima variedade de marcas. O desconto no PIX é um diferencial! Muito satisfeito com a compra.',
    product: 'Tênis Adidas Ultraboost',
  },
  {
    id: '3',
    name: 'Ana Costa',
    rating: 5,
    text: 'Produtos originais e preços justos. A retirada na loja foi super rápida e o atendimento foi muito atencioso.',
    product: 'Tênis Mizuno Wave',
  },
  {
    id: '4',
    name: 'Pedro Oliveira',
    rating: 5,
    text: 'Melhor loja de calçados da região! Sempre encontro o que preciso e com ótimos preços. Parabéns pelo trabalho!',
    product: 'Tênis Puma RS-X',
  },
  {
    id: '5',
    name: 'Carla Ferreira',
    rating: 5,
    text: 'Adorei a experiência de compra! O site é fácil de usar e o produto chegou exatamente como descrito. Super recomendo!',
    product: 'Tênis New Balance 574',
  },
];

export default function Depoimentos() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    if (scrollContainerRef.current) {
      const scrollPosition = index * scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    }
  };

  const nextSlide = () => {
    const next = (currentIndex + 1) % testimonials.length;
    goToSlide(next);
  };

  const prevSlide = () => {
    const prev = (currentIndex - 1 + testimonials.length) % testimonials.length;
    goToSlide(prev);
  };

  return (
    <section className="py-16 bg-[#1a1a1a]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            O Que Nossos Clientes Dizem
          </h2>
          <p className="text-gray-400 text-lg">
            Depoimentos reais de clientes satisfeitos
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Carrossel container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            onScroll={(e) => {
              const container = e.currentTarget;
              const scrollLeft = container.scrollLeft;
              const itemWidth = container.clientWidth;
              const newIndex = Math.round(scrollLeft / itemWidth);
              if (newIndex !== currentIndex) {
                setCurrentIndex(newIndex);
              }
            }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex-shrink-0 w-full snap-start"
              >
                <div className="bg-[#252525] rounded-lg p-8 border border-[#353535] mx-auto max-w-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="fill-[#FFD700] text-[#FFD700]"
                        size={20}
                      />
                    ))}
                  </div>
                  <Quote className="text-[#FF0000] mb-4" size={32} />
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <p className="text-white font-bold text-lg">
                      {testimonial.name}
                    </p>
                    {testimonial.product && (
                      <p className="text-gray-400 text-sm">
                        Comprou: {testimonial.product}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-[#252525] hover:bg-[#FF0000] text-white p-3 rounded-full shadow-lg transition border border-[#353535]"
            aria-label="Depoimento anterior"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-[#252525] hover:bg-[#FF0000] text-white p-3 rounded-full shadow-lg transition border border-[#353535]"
            aria-label="Próximo depoimento"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition p-3"
                aria-label={`Ir para depoimento ${index + 1}`}
              >
                <span className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-[#FF0000] w-8'
                    : 'bg-[#353535] hover:bg-[#454545] w-2'
                }`} />
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
