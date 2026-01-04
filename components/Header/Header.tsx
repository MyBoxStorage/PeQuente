'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, User, Heart, ShoppingBag } from 'lucide-react';
import MobileMenu from './MobileMenu';
import SearchBar from './SearchBar';
import CartModal from '@/components/cart/CartModal';
import { useCartStore } from '@/store/cartStore';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a] border-b border-[#252525]">
      {/* Banner promocional no topo - removido mensagem de frete */}
      <div className="bg-[#00008B] text-white text-center py-2 text-sm">
        <p>Sempre um passo à frente</p>
      </div>

      {/* Header principal */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Menu hamburguer mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-2"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo - usando logo original PNG e logo escrita */}
          <Link href="/" className="flex items-center group">
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Logo quadrada (P e Q) */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 flex-shrink-0 flex items-center justify-center">
                <Image
                  src="/images/logo.png"
                  alt="Pé Quente Calçados"
                  width={72}
                  height={72}
                  className="object-contain w-full h-full"
                  style={{ imageRendering: 'crisp-edges' }}
                  priority
                  quality={100}
                />
              </div>
              {/* Logo escrita "Pé Quente" */}
              <div className="relative h-7 sm:h-8 md:h-9 flex items-center">
                <Image
                  src="/images/logo-escrita.png"
                  alt="Pé Quente"
                  width={180}
                  height={36}
                  className="object-contain h-full w-auto opacity-100"
                  style={{ imageRendering: 'crisp-edges' }}
                  priority
                  quality={100}
                />
              </div>
            </div>
          </Link>

          {/* Navegação desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/produtos" className="text-white hover:text-[#FF0000] transition">
              Produtos
            </Link>
            <Link href="/produtos?categoria=tenis" className="text-white hover:text-[#FF0000] transition">
              Lançamentos
            </Link>
            <Link href="/sobre" className="text-white hover:text-[#FF0000] transition">
              Sobre
            </Link>
            <Link href="/faq" className="text-white hover:text-[#FF0000] transition">
              FAQ
            </Link>
            <Link href="/blog" className="text-white hover:text-[#FF0000] transition">
              Blog
            </Link>
          </nav>

          {/* Ações do usuário */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-white hover:text-[#FF0000] transition p-2"
              aria-label="Buscar"
            >
              <Search size={22} />
            </button>
            <Link
              href="/minha-conta"
              className="text-white hover:text-[#FF0000] transition p-2 hidden sm:block"
              aria-label="Conta"
            >
              <User size={22} />
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              className="text-white hover:text-[#FF0000] transition p-2 relative"
              aria-label="Carrinho"
            >
              <ShoppingBag size={22} />
              {/* Badge do carrinho com contagem real */}
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF0000] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Barra de busca expandida */}
      {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}

      {/* Menu mobile */}
      {mobileMenuOpen && <MobileMenu onClose={() => setMobileMenuOpen(false)} />}

      {/* Cart Modal */}
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
