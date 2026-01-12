'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import AdizeroBanner from './AdizeroBanner';
import PeQuenteBanner from './PeQuenteBanner';
import PeQuenteBanner2 from './PeQuenteBanner2';

// Types para os diferentes layouts de banner usando discriminated unions
type BannerBase = {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  backgroundImage: string;
};

type AdizeroLayoutBanner = BannerBase & {
  type: 'adizero-layout';
  adizeroTitle: string;
  adizeroSubtitle: string;
  adizeroCta: string;
};

type PeQuenteLayoutBanner = BannerBase & {
  type: 'pequente-layout';
  slogan: string;
  pequenteCta: string;
};

type PeQuenteLayout2Banner = BannerBase & {
  type: 'pequente-layout-2';
  mainTitle: string;
  secondaryTitle: string;
  pequenteSubtitle: string;
  pequenteCta: string;
};

type FullBanner = BannerBase & {
  type: 'full-banner';
};

type ImageBanner = BannerBase & {
  type: 'image';
  overlay?: string;
  productImage?: string;
  productImageFallback?: string;
};

type GradientBanner = BannerBase & {
  type: 'gradient';
  gradient: string;
};

type Banner = 
  | AdizeroLayoutBanner 
  | PeQuenteLayoutBanner 
  | PeQuenteLayout2Banner 
  | FullBanner 
  | ImageBanner 
  | GradientBanner;

const banners: Banner[] = [
  {
    id: 1,
    title: 'Adizero',
    subtitle: 'Performance e velocidade',
    cta: 'Ver Produtos',
    link: '/produtos',
    type: 'adizero-layout', // Layout completo com tipografia profissional
    backgroundImage: '/images/banners/adizero-banner.jpg', // Imagem de fundo gerada pela IA
    adizeroTitle: 'ADIZERO\nPRO EVO',
    adizeroSubtitle: 'Leveza revolucionária para quebrar recordes',
    adizeroCta: 'VER AGORA',
  },
  {
    id: 2,
    title: 'Ano Novo',
    subtitle: 'Mesma Atitude',
    cta: 'Veja Mais',
    link: '/produtos',
    type: 'pequente-layout-2', // Layout completo Ano Novo
    backgroundImage: '/images/banners/pe-quente-banner-2.png.png', // Imagem de fundo gerada pela IA
    mainTitle: 'ANO NOVO',
    secondaryTitle: 'MESMA ATITUDE',
    pequenteSubtitle: 'Novidades para começar o ano no estilo',
    pequenteCta: 'VEJA MAIS',
  },
  {
    id: 3,
    title: 'Pé Quente',
    subtitle: 'Sempre um passo à frente',
    cta: 'Veja Mais',
    link: '/produtos',
    type: 'pequente-layout', // Layout completo com logo Pé Quente (Mizuno)
    backgroundImage: '/images/banners/pe-quente-banner.png.png', // Imagem de fundo gerada pela IA (Mizuno)
    slogan: 'Sempre um passo à frente',
    pequenteCta: 'VEJA MAIS!',
  },
];

export default function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Função para iniciar/reiniciar o intervalo automático
  const startAutoPlay = () => {
    // Limpar intervalo anterior se existir
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Criar novo intervalo
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
  };

  useEffect(() => {
    startAutoPlay();
    
    // Limpar intervalo ao desmontar
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    startAutoPlay(); // Reiniciar contagem quando mudar manualmente
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    startAutoPlay(); // Reiniciar contagem quando mudar manualmente
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
    startAutoPlay(); // Reiniciar contagem quando mudar manualmente
  };

  // Calcular índices visíveis: atual + próximo (para preload suave)
  const visibleIndices = [
    currentIndex,
    (currentIndex + 1) % banners.length
  ];

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden bg-[#0a0a0a]" style={{ zIndex: 1 }}>
      {banners.map((banner, index) => {
        // Renderizar apenas banner ativo + próximo (otimização LCP crítica)
        const isVisible = visibleIndices.includes(index);
        if (!isVisible) return null;

        return (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {banner.type === 'adizero-layout' ? (
              // Layout completo Adizero com tipografia profissional (Banner 2)
              <AdizeroBanner
                backgroundImage={banner.backgroundImage}
                title={banner.adizeroTitle}
                subtitle={banner.adizeroSubtitle}
                ctaText={banner.adizeroCta}
                ctaLink={banner.link}
              />
            ) : banner.type === 'pequente-layout' ? (
              // Layout completo Pé Quente com logo estilizado
              <PeQuenteBanner
                backgroundImage={banner.backgroundImage}
                slogan={banner.slogan}
                ctaText={banner.pequenteCta}
                ctaLink={banner.link}
              />
            ) : banner.type === 'pequente-layout-2' ? (
              // Layout completo Pé Quente Ano Novo (Banner 3)
              <PeQuenteBanner2
                backgroundImage={banner.backgroundImage}
                mainTitle={banner.mainTitle}
                secondaryTitle={banner.secondaryTitle}
                subtitle={banner.pequenteSubtitle}
                ctaText={banner.pequenteCta}
                ctaLink={banner.link}
              />
            ) : banner.type === 'full-banner' ? (
            // Banner completo pronto (Banner 1)
            <div className="relative h-full w-full bg-[#0a0a0a] flex items-center justify-center">
              <Image
                src={banner.backgroundImage}
                alt={banner.title}
                fill
                className="object-contain"
                priority={index === 0}
                fetchPriority={index === 0 ? "high" : "auto"}
                quality={90}
                sizes="100vw"
              />
            </div>
          ) : banner.type === 'image' ? (
            // Banner com imagens em camadas (se necessário no futuro)
            <div className="relative h-full w-full">
              {/* Imagem de fundo - pista de corrida */}
              <div className="absolute inset-0">
                <Image
                  src={banner.backgroundImage}
                  alt="Pista de corrida"
                  fill
                  className="object-cover"
                  priority={index === 0}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  quality={90}
                  sizes="100vw"
                />
              </div>

              {/* Overlay escuro para legibilidade */}
              {banner.type === 'image' && banner.overlay && (
                <div className={`absolute inset-0 ${banner.overlay}`} />
              )}

              {/* Conteúdo do banner */}
              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-4 w-full max-w-7xl">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
                    {/* Texto à esquerda */}
                    <div className="text-center lg:text-left z-10 lg:pr-8">
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                        {banner.title}
                      </h1>
                      {/* Linha vermelha abaixo do título */}
                      <div className="w-24 h-0.5 bg-[#FF0000] mb-4 lg:w-32" />
                      <p className="text-xl md:text-2xl lg:text-3xl text-white mb-8 font-medium drop-shadow-lg">
                        {banner.subtitle}
                      </p>
                      <Link
                        href={banner.link}
                        className="inline-block bg-[#FFD700] text-[#0a0a0a] font-semibold px-8 py-4 rounded-lg text-lg shadow-xl hover:bg-[#FFC700] hover:shadow-2xl transition-all duration-250"
                      >
                        {banner.cta}
                      </Link>
                    </div>

                    {/* Imagem do tênis à direita - Integrada harmoniosamente */}
                    <div className="relative h-[280px] md:h-[380px] lg:h-[480px] flex items-center justify-center lg:justify-end">
                      <div className="relative w-full max-w-[90%] lg:max-w-[550px] h-full flex items-center justify-center">
                        {/* Container principal com perspectiva */}
                        <div className="relative w-full h-full flex items-center justify-center">
                          {/* Efeito de luz ambiente para integração com o fundo */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div 
                              className="absolute w-[70%] h-[70%] rounded-full blur-3xl opacity-50"
                              style={{
                                background: 'radial-gradient(circle, rgba(255, 215, 0, 0.1), transparent 70%)',
                              }}
                            />
                          </div>
                          
                          {/* Tênis com tamanho e posicionamento harmonioso */}
                          <div className="relative w-full h-full flex items-center justify-center z-10">
                            <div className="relative w-[75%] md:w-[70%] lg:w-[65%] h-full flex items-end justify-center">
                              {banner.type === 'image' && banner.productImage && (
                                <div className="relative w-full h-full">
                                  <Image
                                    src={banner.productImage}
                                    alt="Tênis Adidas Adizero Drive RC Masculino"
                                    fill
                                    className="object-contain"
                                    style={{
                                      filter: 'drop-shadow(0 30px 60px rgba(0, 0, 0, 0.1)) drop-shadow(0 10px 20px rgba(255, 215, 0, 0.1))',
                                      objectPosition: 'center bottom',
                                    }}
                                    priority={index === 0}
                                    fetchPriority={index === 0 ? "high" : "auto"}
                                    quality={90}
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Sombra realista no "chão" da pista para profundidade */}
                          <div 
                            className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[55%] h-12 bg-black/40 rounded-full blur-2xl -translate-y-2"
                            style={{
                              transform: 'translateX(-50%) translateY(-8px) scaleX(1.2)',
                            }}
                          />
                          
                          {/* Sombra secundária mais suave */}
                          <div 
                            className="absolute bottom-[12%] left-1/2 -translate-x-1/2 w-[45%] h-6 bg-black/20 rounded-full blur-xl"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : banner.type === 'gradient' ? (
            // Banner com gradiente
            <div className={`h-full bg-gradient-to-r ${banner.gradient} flex items-center justify-center`}>
              <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-[0.05em]">
                  {banner.title}
                </h1>
                {/* Linha vermelha abaixo do título */}
                <div className="w-24 h-0.5 bg-[#FF0000] mb-4 mx-auto" />
                <p className="text-xl md:text-2xl text-gray-200 mb-8">
                  {banner.subtitle}
                </p>
                <Link
                  href={banner.link}
                  className="inline-block bg-[#FFD700] text-[#0a0a0a] font-bold px-8 py-4 rounded-lg text-lg"
                >
                  {banner.cta}
                </Link>
              </div>
            </div>
          ) : (
            // Fallback seguro para tipos não reconhecidos
            <div className="relative h-full w-full bg-[#0a0a0a] flex items-center justify-center">
              <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  Pé Quente Calçados
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 mb-8">
                  Sempre um passo à frente
                </p>
                <Link
                  href="/produtos"
                  className="inline-block bg-[#FFD700] text-[#0a0a0a] font-bold px-8 py-4 rounded-lg text-lg"
                >
                  Ver Produtos
                </Link>
              </div>
            </div>
          )}
          </div>
        );
      })}

      {/* Botões de navegação */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-20"
        aria-label="Slide anterior"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-20"
        aria-label="Próximo slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full p-3"
            aria-label={`Ir para slide ${index + 1}`}
          >
            <span className={`w-3 h-3 rounded-full ${
              index === currentIndex ? 'bg-[#FFD700]' : 'bg-white/50'
            }`} />
          </button>
        ))}
      </div>
    </div>
  );
}
