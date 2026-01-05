'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllCategories } from '@/lib/api';
import { ChevronDown } from 'lucide-react';

const categoryImages: Record<string, string> = {
  'tenis-masculino': '/images/categorias/tenis-masc.png',
  'tenis-feminino': '/images/categorias/tenis-fem.png',
  'chinelos-e-sandalias': '/images/categorias/chinelos.png',
  'acessorios': '/images/categorias/acessorios.png',
  'outlet': '/images/categorias/outlet.png',
};

export default function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const categories = getAllCategories();

  const handleMouseEnter = () => {
    // Limpar timeout se existir
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    // Adicionar delay antes de fechar (300ms)
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  // Limpar timeout ao desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href="/produtos"
        className="flex items-center space-x-1 text-white hover:text-[#FF0000] transition-colors duration-250 relative group"
      >
        <span>Produtos</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-250 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </Link>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[600px] bg-[#2d2d2d] border border-[#353535] rounded-lg shadow-xl z-50 overflow-visible animate-in fade-in-0 slide-in-from-top-2 duration-250">
          <div className="p-6">
            <h3 className="text-white font-semibold mb-4 text-lg">
              Categorias
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {categories.map((category) => {
                const imageUrl = categoryImages[category.slug] || null;
                return (
                  <Link
                    key={category.id}
                    href={`/produtos?categoria=${category.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="group flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-[#252525] transition-colors duration-250"
                  >
                    {/* Container com efeito 3D pop-out - circular */}
                    <div className="category-icon-3d relative w-24 h-24 rounded-full bg-gradient-to-br from-[#353535] to-[#252525] flex items-center justify-center">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={category.name}
                          fill
                          className="object-contain rounded-full p-2"
                          sizes="96px"
                          quality={90}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs text-center px-1 rounded-full">
                          {category.name}
                        </div>
                      )}
                    </div>
                    <span className="text-white text-sm text-center group-hover:text-[#FF0000] transition-colors duration-250 mt-1">
                      {category.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
