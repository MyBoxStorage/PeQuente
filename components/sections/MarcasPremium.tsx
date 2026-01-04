import Link from 'next/link';
import Image from 'next/image';
import { getAllBrands } from '@/lib/api';

export default function MarcasPremium() {
  const brands = getAllBrands();

  return (
    <section className="py-16 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Marcas Premium
          </h2>
          <p className="text-gray-300 text-lg">
            As melhores marcas do mercado em um só lugar
          </p>
        </div>

        <div className="relative">
          {/* Scroll horizontal container */}
          <div
            className="flex gap-8 overflow-x-auto scroll-smooth pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {brands.map((brand, index) => {
              const isRed = index % 2 === 0;
              const bgColor = isRed ? 'bg-[#FF0000]' : 'bg-[#00008B]';
              const hoverBgColor = isRed ? 'hover:bg-[#CC0000]' : 'hover:bg-[#000066]';
              const borderColor = isRed ? 'border-[#FF0000]' : 'border-[#00008B]';
              const hoverBorderColor = 'hover:border-white';
              
              return (
                <Link
                  key={brand.id}
                  href={`/produtos?marca=${brand.name.toLowerCase()}`}
                  className="flex-shrink-0 group"
                  prefetch
                >
                  <div className={`${bgColor} ${hoverBgColor} rounded-lg p-8 ${borderColor} ${hoverBorderColor} transition-all duration-300 w-48 h-48 flex items-center justify-center`}>
                    <Image
                      src={`/images/brands/${brand.slug}.png`}
                      alt={brand.name}
                      width={128}
                      height={128}
                      className="object-contain opacity-90 group-hover:opacity-100 transition max-w-[128px] max-h-[128px] brightness-0 invert"
                      quality={75}
                      loading="lazy"
                    />
                  </div>
                </Link>
              );
            })}
          </div>

        </div>

        <div className="text-center mt-8">
          <Link
            href="/produtos"
            className="inline-block text-[#FF0000] hover:text-[#FF0000]/80 transition flex items-center gap-2 mx-auto"
            prefetch
          >
            Ver todas as marcas
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
