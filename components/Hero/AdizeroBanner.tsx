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
        <div className="max-w-lg text-right flex flex-col items-end">
          {/* Título com efeito Forest */}
          <div className="forest-title-container group relative z-10 mb-4">
            <div className="forest-title flex flex-col items-end">
              {title.split('\n').map((line, lineIndex) => (
                <div key={lineIndex} className="flex">
                  {line.split('').map((letter, i) => (
                    <span key={i} className="forest-letter forest-letter-large inline-block">
                      {letter === ' ' ? '\u00A0' : letter}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          {/* Linha vermelha abaixo do título */}
          <div className="w-full max-w-[280px] h-0.5 bg-[#FF0000] mb-4" />
          
          {/* Subtítulo */}
          <p className="text-xs sm:text-sm md:text-lg font-normal text-[#333333] tracking-tight mb-8">
            {subtitle}
          </p>
          
          {/* Botão CTA */}
          <Link
            href={ctaLink}
            className="bg-[#333333] text-white px-10 py-3.5 text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase shadow-xl rounded-none inline-flex items-center justify-center pointer-events-auto"
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </div>
  );
}
