'use client';

import Link from 'next/link';
import Image from 'next/image';

interface CategoryCardProps {
  name: string;
  slug: string;
  image: string;
  priority?: boolean;
  index?: number;
}

// Blur placeholder para categorias (gradiente roxo)
const CATEGORY_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM4MDAwODAiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNBMjBGMDAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+';

export default function CategoryCard({ name, slug, image, priority = false, index = 0 }: CategoryCardProps) {
  // Alternar cores: azul (índice par), vermelho (índice ímpar)
  const isBlue = index % 2 === 0;
  const bgColor = isBlue ? 'bg-[#00008B]' : 'bg-[#FF0000]';
  const hoverBgColor = isBlue ? 'hover:bg-[#000066]' : 'hover:bg-[#CC0000]';
  // Se for azul, sombra vermelha; se for vermelho, sombra azul
  const shadowClass = isBlue ? 'category-circle-shadow-red' : 'category-circle-shadow-blue';
  // Se for azul, nome vermelho; se for vermelho, nome azul
  const textHoverColor = isBlue ? 'group-hover:text-[#FF0000]' : 'group-hover:text-[#00008B]';

  return (
    <Link
      href={`/produtos?categoria=${slug}`}
      className="group flex flex-col items-center gap-4"
      prefetch
      aria-label={`Ver produtos da categoria ${name}`}
    >
      <div className={`category-circle ${bgColor} ${hoverBgColor} ${shadowClass}`}>
        <div className="category-circle-image-wrapper">
          <Image
            src={image}
            alt={name}
            width={220}
            height={220}
            className="category-circle-image"
            sizes="(max-width: 640px) 150px, (max-width: 1024px) 180px, 220px"
            priority={priority}
            quality={80}
            placeholder="blur"
            blurDataURL={CATEGORY_PLACEHOLDER}
            loading={priority ? 'eager' : 'lazy'}
          />
        </div>
      </div>
      <span className={`text-white font-semibold text-center text-lg ${textHoverColor} transition-colors duration-300`}>
        {name}
      </span>
    </Link>
  );
}
