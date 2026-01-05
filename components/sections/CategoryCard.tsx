'use client';

import Link from 'next/link';
import Image from 'next/image';

interface CategoryCardProps {
  name: string;
  slug: string;
  image: string;
  priority?: boolean;
}

// Blur placeholder para categorias (gradiente roxo)
const CATEGORY_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM4MDAwODAiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNBMjBGMDAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+';

export default function CategoryCard({ name, slug, image, priority = false }: CategoryCardProps) {
  return (
    <Link
      href={`/produtos?categoria=${slug}`}
      className="group flex flex-col items-center gap-4"
      prefetch
      aria-label={`Ver produtos da categoria ${name}`}
    >
      <div className="category-circle">
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
      <span className="text-white font-semibold text-center text-lg group-hover:text-[#800080] transition-colors duration-300">
        {name}
      </span>
    </Link>
  );
}
