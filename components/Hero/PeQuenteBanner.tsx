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
          fetchPriority="high"
          quality={90}
          sizes="100vw"
        />
      </div>

      {/* Overlay gradiente sutil para legibilidade */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

      {/* Overlay profissional - alinhado à direita */}
      <div className="absolute inset-0 flex items-center justify-end pr-8 md:pr-16 lg:pr-24 pointer-events-none z-10">
        <div className="flex flex-col items-center text-center">
          
          {/* LOGO SVG */}
          <div className="mb-6 flex items-center justify-center">
            <img 
              src="/logo-pe-quente.svg" 
              alt="Pé Quente Calçados" 
              className="h-32 md:h-44 lg:h-52 w-auto object-contain drop-shadow-2xl bg-transparent" 
              style={{ background: 'transparent' }}
            />
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
            className="bg-[#e31e24] text-white px-16 py-4 rounded-xl text-base font-black tracking-widest uppercase shadow-xl border border-white/20 inline-flex items-center justify-center pointer-events-auto"
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </div>
  );
}
