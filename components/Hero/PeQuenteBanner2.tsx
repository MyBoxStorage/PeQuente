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
  // Separar "MESMA ATITUDE" em duas palavras
  const secondaryWords = secondaryTitle.split(' ');
  const firstWord = secondaryWords[0] || 'MESMA';
  const secondWord = secondaryWords[1] || 'ATITUDE';

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
      <div className="absolute inset-0 flex items-center justify-end pr-12 md:pr-24 lg:pr-32 pointer-events-none z-10">
        <div className="flex flex-col items-center text-center max-w-[50%]">

          {/* PROMOTIONAL TEXT BLOCK */}
          <div className="w-full space-y-2 py-8">

            {/* Top horizontal line */}
            <div className="w-full border-t-2 border-[#cccccc]"></div>

            {/* ANO NOVO - Principal com efeito Forest */}
            <div className="forest-title-container group relative z-10">
              <div className="forest-title flex">
                {mainTitle.split('').map((letter, i) => (
                  <span key={i} className="forest-letter forest-letter-medium forest-letter-red inline-block">
                    {letter === ' ' ? '\u00A0' : letter}
                  </span>
                ))}
              </div>
            </div>

            {/* MESMA ATITUDE - Secundário com efeito Forest (separado em duas linhas) */}
            <div className="forest-title-container group relative z-10 flex flex-col items-center">
              {/* MESMA - Primeira linha */}
              <div className="forest-title flex">
                {firstWord.split('').map((letter, i) => (
                  <span key={i} className="forest-letter forest-letter-medium forest-letter-blue inline-block">
                    {letter === ' ' ? '\u00A0' : letter}
                  </span>
                ))}
              </div>
              {/* ATITUDE - Segunda linha */}
              <div className="forest-title flex">
                {secondWord.split('').map((letter, i) => (
                  <span key={i} className="forest-letter forest-letter-medium forest-letter-blue inline-block">
                    {letter === ' ' ? '\u00A0' : letter}
                  </span>
                ))}
              </div>
            </div>

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
            className="bg-[#4a4a4a] text-white px-12 py-4 rounded-lg text-base font-semibold shadow-xl hover:bg-[#5a5a5a] transition-all duration-250 inline-flex items-center justify-center pointer-events-auto"
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </div>
  );
}
