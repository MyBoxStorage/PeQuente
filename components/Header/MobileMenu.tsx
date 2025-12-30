'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { getAllCategories } from '@/lib/api';

interface MobileMenuProps {
  onClose: () => void;
}

export default function MobileMenu({ onClose }: MobileMenuProps) {
  const categories = getAllCategories();

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Menu */}
      <div className="fixed top-0 left-0 bottom-0 w-80 bg-[#1a1a1a] shadow-xl overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-[#252525]">
          <h2 className="text-white font-bold text-lg">Menu</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-[#FFD700] transition"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            href="/produtos"
            onClick={onClose}
            className="block py-3 text-white hover:text-[#FFD700] transition border-b border-[#252525]"
          >
            Todos os Produtos
          </Link>

          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categorias/${category.slug}`}
              onClick={onClose}
              className="block py-3 text-white hover:text-[#FFD700] transition border-b border-[#252525]"
            >
              {category.name}
            </Link>
          ))}

          <Link
            href="/sobre"
            onClick={onClose}
            className="block py-3 text-white hover:text-[#FFD700] transition border-b border-[#252525]"
          >
            Sobre
          </Link>

          <Link
            href="/contato"
            onClick={onClose}
            className="block py-3 text-white hover:text-[#FFD700] transition border-b border-[#252525]"
          >
            Contato
          </Link>
        </nav>
      </div>
    </div>
  );
}
