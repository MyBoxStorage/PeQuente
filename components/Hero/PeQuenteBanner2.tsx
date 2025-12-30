'use client';

import Image from 'next/image';
import Link from 'next/link';

interface PeQuenteBanner2Props {
  backgroundImage: string; // URL da imagem gerada pela IA
  mainTitle?: string;
  secondaryTitle?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function PeQuenteBanner2({
  backgroundImage,
  mainTitle = "ANO NOVO",
  secondaryTitle = "MESMA ATITUDE",
  subtitle = "Novidades para começar o ano no estilo",
  ctaText = "VEJA MAIS",
  ctaLink = "/produtos"
}: PeQuenteBanner2Props) {
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
      <div className="absolute inset-0 flex items-center justify-end pr-12 md:pr-24 lg:pr-32 pointer-events-none z-10">
        <div className="flex flex-col items-center text-center max-w-[50%] animate-[fadeIn_0.8s_ease-out_forwards]">

          {/* PROMOTIONAL TEXT BLOCK */}
          <div className="w-full space-y-2 py-8">

            {/* Top horizontal line */}
            <div className="w-full border-t-2 border-[#cccccc]"></div>

            {/* ANO NOVO - Principal, bold, vermelho como o logo */}
            <h1 className="text-[#e31e24] text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-none">
              {mainTitle}
            </h1>

            {/* MESMA ATITUDE - Normal weight, azul como o logo */}
            <h2 className="text-[#2e3192] text-6xl md:text-7xl lg:text-8xl font-normal uppercase tracking-tighter leading-none">
              {secondaryTitle}
            </h2>

            {/* Bottom horizontal line */}
            <div className="w-full border-b-2 border-[#cccccc]"></div>
          </div>

          {/* SUBTITLE - Bold, mais próximo da linha inferior */}
          <p className="text-[#333333] text-base md:text-lg lg:text-xl font-bold tracking-tight mt-2 mb-8 select-none">
            {subtitle}
          </p>

          {/* CTA BUTTON - Cinza escuro */}
          <Link
            href={ctaLink}
            className="bg-[#4a4a4a] text-white px-16 py-4 rounded-md text-base font-black tracking-widest uppercase hover:bg-[#333333] transition-all pointer-events-auto shadow-2xl hover:-translate-y-1 active:translate-y-0 border-b-4 border-black/20"
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </div>
  );
}
