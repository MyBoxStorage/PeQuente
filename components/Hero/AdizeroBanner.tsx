'use client';

import Image from 'next/image';
import Link from 'next/link';

interface AdizeroBannerProps {
  backgroundImage: string; // URL da imagem gerada pela IA
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function AdizeroBanner({
  backgroundImage,
  title = "ADIZERO\nPRO EVO",
  subtitle = "Leveza revolucionária para quebrar recordes",
  ctaText = "VER AGORA",
  ctaLink = "/produtos"
}: AdizeroBannerProps) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Imagem de fundo */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="Adizero Banner"
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

      {/* Overlay de tipografia profissional - alinhado à direita */}
      <div className="absolute inset-0 flex items-center justify-end pr-8 md:pr-16 lg:pr-24 pointer-events-none z-10">
        <div className="max-w-lg text-right flex flex-col items-end justify-center h-full py-12">
          {/* Título com efeito Canyon */}
          <div className="canyon-title-container relative z-10 mb-10 pointer-events-auto -mt-32 md:-mt-40">
            {title.split('\n').map((line, lineIndex) => {
              const letters = line.split('');
              return (
                <div key={lineIndex} className="canyon-word flex items-center justify-end">
                  {letters.map((letter, letterIndex) => (
                    <div key={letterIndex} className="canyon-hover flex-1 relative">
                      <div className="canyon-hover-area"></div>
                      <div className="canyon-hover-area"></div>
                      <h1 className="canyon-letter canyon-letter-large">
                        {letter === ' ' ? '\u00A0' : letter}
                      </h1>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
          
          {/* Linha vermelha abaixo do título */}
          <div className="w-full max-w-[280px] h-0.5 bg-[#FF0000] mb-6" />
          
          {/* Subtítulo */}
          <p className="text-xs sm:text-sm md:text-lg font-normal text-[#333333] tracking-tight mb-10">
            {subtitle}
          </p>
          
          {/* Botão CTA */}
          <Link
            href={ctaLink}
            className="bg-[#333333] text-white px-10 py-3.5 text-sm md:text-base font-semibold shadow-xl rounded-md hover:bg-[#404040] transition-all duration-250 inline-flex items-center justify-center pointer-events-auto"
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </div>
  );
}
