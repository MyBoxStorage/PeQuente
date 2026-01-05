'use client';

import Link from 'next/link';
import Image from 'next/image';

interface CategoryCardProps {
  name: string;
  slug: string;
  image: string;
  priority?: boolean;
}

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
          width={200}
          height={200}
          className="category-circle-image"
          sizes="(max-width: 640px) 150px, (max-width: 1024px) 200px, 220px"
          priority={priority}
          quality={85}
        />
      </div>
      <span className="text-white font-semibold text-center text-lg group-hover:text-[#800080] transition-colors duration-300">
        {name}
      </span>
    </Link>
  );
}
