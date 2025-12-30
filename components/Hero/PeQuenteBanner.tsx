'use client';

import Image from 'next/image';
import Link from 'next/link';

interface PeQuenteBannerProps {
  backgroundImage: string; // URL da imagem gerada pela IA
  slogan?: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function PeQuenteBanner({
  backgroundImage,
  slogan = "Sempre um passo à frente",
  ctaText = "VEJA MAIS!",
  ctaLink = "/produtos"
}: PeQuenteBannerProps) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Imagem de fundo */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="Pé Quente Banner"
          fill
          className="object-cover"
          priority
          quality={95}
          sizes="100vw"
        />
      </div>

      {/* Gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10 pointer-events-none" />

      {/* Overlay profissional - alinhado à direita */}
      <div className="absolute inset-0 flex items-center justify-end pr-8 md:pr-16 lg:pr-24 pointer-events-none z-10">
        <div className="flex flex-col items-center text-center animate-[fadeIn_0.8s_ease-out_forwards]">
          
          {/* LOGO GROUP - P/Q mesmo tamanho */}
          <div className="flex items-center scale-75 md:scale-90 lg:scale-110 origin-right mb-4">
            <div className="flex flex-col items-start justify-center">
              <div className="flex items-baseline relative">
                {/* P vermelho */}
                <span className="text-[#e31e24] text-8xl md:text-9xl font-black italic leading-none tracking-tighter">
                  P
                </span>
                
                {/* é azul */}
                <span className="text-[#2e3192] text-6xl md:text-7xl font-black italic leading-none tracking-tighter relative left-[-3px]">
                  é
                </span>
                
                {/* Q vermelho + uente azul - Q com mesmo tamanho do P */}
                <div className="flex items-baseline relative ml-2">
                  <span className="text-[#e31e24] text-8xl md:text-9xl font-black italic leading-none tracking-tighter relative top-1">
                    Q
                  </span>
                  <span className="text-[#2e3192] text-7xl md:text-8xl font-black italic leading-none tracking-tighter relative left-[-20px] md:left-[-25px]">
                    uente
                  </span>
                </div>
              </div>
              
              {/* CALÇADOS muito mais próximo do nome */}
              <div className="w-full text-right mt-[-8px] pr-1">
                <span className="text-[#2e3192] text-2xl md:text-4xl font-black tracking-widest uppercase">
                  CALÇADOS
                </span>
              </div>
            </div>
          </div>

          {/* SLOGAN - Negrito forte */}
          <div className="mb-8">
            <p className="text-[#2e3192] text-lg md:text-2xl font-black tracking-tight select-none">
              {slogan}
            </p>
          </div>

          {/* CTA BUTTON - Vermelho */}
          <Link
            href={ctaLink}
            className="bg-[#e31e24] text-white px-16 py-4 rounded-xl text-base font-black tracking-widest uppercase hover:bg-[#c71c20] transition-all pointer-events-auto shadow-xl hover:-translate-y-1 active:translate-y-0 border border-white/20"
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </div>
  );
}
